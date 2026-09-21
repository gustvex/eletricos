import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createServer } from 'node:http'
import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const leadsDir = await mkdtemp(join(tmpdir(), 'eletricos-'))
process.env.LEADS_FILE = join(leadsDir, 'leads.jsonl')
process.env.RATE_LIMIT_MAX = '6'
process.env.RATE_LIMIT_WINDOW_MS = '60000'

const { createApp } = await import('../src/index.js')

let server
let baseUrl

const post = (path, body) =>
  fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

before(async () => {
  server = createServer(createApp())
  await new Promise((resolve) => server.listen(0, resolve))
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

after(() => server?.close())

test('GET /api/health responde ok', async () => {
  const res = await fetch(`${baseUrl}/api/health`)
  assert.equal(res.status, 200)
  assert.equal((await res.json()).status, 'ok')
})

test('GET /api/catalog entrega negocio, catalogo e faq', async () => {
  const res = await fetch(`${baseUrl}/api/catalog`)
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.equal(body.vehicles.length, 3)
  assert.ok(body.problems.length > 5)
  assert.ok(body.faq.length > 0)
  assert.match(body.business.whatsapp.phone, /^\d{12,13}$/)
})

test('POST /api/leads grava o lead e devolve a URL do WhatsApp', async () => {
  const res = await post('/api/leads', {
    vehicle: 'patinete',
    problem: 'bateria',
    name: 'Gustavo',
    brandModel: 'Xiaomi M365',
    description: 'Não segura carga.',
    urgency: 'urgente',
    logistic: 'buscar',
    neighborhood: 'Centro',
  })

  assert.equal(res.status, 201)
  const body = await res.json()
  assert.ok(body.whatsappUrl.startsWith('https://wa.me/'))

  const saved = (await readFile(process.env.LEADS_FILE, 'utf8')).trim().split('\n').map(JSON.parse)
  assert.equal(saved.at(-1).name, 'Gustavo')
  assert.match(saved.at(-1).message, /Patinete elétrico/)
})

test('POST /api/leads recusa payload invalido', async () => {
  const res = await post('/api/leads', { vehicle: 'foguete', problem: 'bateria', name: 'A' })
  assert.equal(res.status, 422)
  const body = await res.json()
  assert.equal(body.error, 'validation_error')
  assert.ok(body.messages.length >= 2)
})

test('POST /api/leads recusa problema que nao existe para o equipamento', async () => {
  const res = await post('/api/leads', { vehicle: 'bicicleta', problem: 'dobradica', name: 'Gustavo' })
  assert.equal(res.status, 422)
  assert.match((await res.json()).messages.join(' '), /não se aplica/)
})

test('honeypot preenchido e aceito em silencio, sem gravar lead', async () => {
  const before = (await readFile(process.env.LEADS_FILE, 'utf8')).trim().split('\n').length
  const res = await post('/api/leads', { website: 'http://spam.example', vehicle: 'patinete', problem: 'bateria', name: 'Bot' })
  assert.equal(res.status, 202)
  const after = (await readFile(process.env.LEADS_FILE, 'utf8')).trim().split('\n').length
  assert.equal(after, before)
})

test('rate limit bloqueia rajada de envios', async () => {
  const payload = { vehicle: 'patinete', problem: 'bateria', name: 'Gustavo' }
  const statuses = []
  for (let i = 0; i < 8; i += 1) {
    statuses.push((await post('/api/leads', payload)).status)
  }
  assert.ok(statuses.includes(429), `esperava um 429 na sequencia: ${statuses.join(',')}`)
})

test('rota desconhecida de api devolve 404 em json', async () => {
  const res = await fetch(`${baseUrl}/api/nao-existe`)
  assert.equal(res.status, 404)
  assert.equal((await res.json()).error, 'not_found')
})

test('site servido pelo proprio Node consegue chamar a propria API (same-origin)', async () => {
  const { host } = new URL(baseUrl)
  const res = await fetch(`${baseUrl}/api/catalog`, { headers: { origin: `http://${host}` } })
  assert.equal(res.status, 200)
  assert.equal(res.headers.get('access-control-allow-origin'), `http://${host}`)
})

test('origem estranha nao derruba a resposta, so nao ganha o cabecalho CORS', async () => {
  const res = await fetch(`${baseUrl}/api/catalog`, { headers: { origin: 'https://site-invasor.example' } })
  assert.equal(res.status, 200)
  assert.equal(res.headers.get('access-control-allow-origin'), null)
})
