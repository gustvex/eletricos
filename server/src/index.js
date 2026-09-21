import { createServer } from 'node:http'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

import compression from 'compression'
import cors from 'cors'
import express from 'express'

import { config } from './lib/config.js'
import { catalogRouter } from './routes/catalog.js'
import { leadsRouter } from './routes/leads.js'

const here = dirname(fileURLToPath(import.meta.url))

export function createApp() {
  const app = express()

  // Atras de proxy (Render, Railway, Fly, Nginx) para o rate limit ver o IP real.
  app.set('trust proxy', 1)
  app.disable('x-powered-by')

  app.use(compression())
  app.use(express.json({ limit: '32kb' }))
  /**
   * CORS.
   *
   * Em producao o proprio Node entrega o site, entao o navegador manda
   * `Origin: http://dominio` nas chamadas para /api do mesmo dominio — por
   * isso a checagem de same-origin vem antes da allowlist, senao o site
   * bloquearia a propria API.
   *
   * Origem nao autorizada nao vira erro 500: so nao recebe o cabecalho CORS,
   * e quem barra a resposta e o navegador. Um 500 aqui derrubaria ate a
   * entrega dos arquivos estaticos.
   */
  app.use(
    cors((req, callback) => {
      const origin = req.headers.origin

      // Sem Origin (navegacao direta, curl, app nativo): libera.
      if (!origin) return callback(null, { origin: true })

      let sameOrigin = false
      try {
        sameOrigin = new URL(origin).host === req.headers.host
      } catch {
        sameOrigin = false
      }

      const allowed = sameOrigin || config.corsOrigins.includes(origin)
      return callback(null, { origin: allowed })
    }),
  )

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), env: config.nodeEnv })
  })

  app.use('/api', catalogRouter)
  app.use('/api', leadsRouter)

  // Em producao o mesmo processo entrega o build do Vite.
  const distPath = resolve(here, '..', config.webDist)
  if (existsSync(distPath)) {
    app.use(
      express.static(distPath, {
        maxAge: '1y',
        setHeaders(res, filePath) {
          if (filePath.endsWith('index.html')) res.setHeader('Cache-Control', 'no-cache')
        },
      }),
    )
    // SPA fallback: qualquer rota que nao seja /api volta para o index.
    app.get(/^(?!\/api\/).*/, (req, res) => {
      res.sendFile(join(distPath, 'index.html'))
    })
  }

  app.use((req, res) => {
    res.status(404).json({ error: 'not_found' })
  })

  // eslint-disable-next-line no-unused-vars -- assinatura de 4 argumentos e o que marca o handler de erro no Express
  app.use((error, req, res, next) => {
    const status = error.status || 500
    if (status >= 500) console.error('[erro]', error)
    res.status(status).json({
      error: status >= 500 ? 'internal_error' : 'bad_request',
      message: status >= 500 ? 'Erro interno. Tente novamente.' : error.message,
    })
  })

  return app
}

// Só sobe o servidor quando executado diretamente (os testes importam createApp).
if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const server = createServer(createApp())
  server.listen(config.port, () => {
    console.log(`[eletricos] API em http://localhost:${config.port} (${config.nodeEnv})`)
  })
}

export default createApp
