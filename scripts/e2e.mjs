/**
 * Teste de ponta a ponta do fluxo que paga a conta: home -> orcamento ->
 * link do WhatsApp com a mensagem certa.
 *
 * Como rodar:
 *   npm run build
 *   npm start &                 # sobe o site em http://localhost:3000
 *   npx playwright install chromium   # so na primeira vez
 *   node scripts/e2e.mjs
 *
 * Variaveis: BASE_URL (padrao http://localhost:3000)
 */

const BASE = process.env.BASE_URL || 'http://localhost:3000'

let chromium
try {
  ;({ chromium } = await import('playwright'))
} catch {
  console.error('Playwright nao encontrado. Rode: npm i -D playwright && npx playwright install chromium')
  process.exit(1)
}

const results = []
const check = (ok, label) => {
  results.push({ ok, label })
  console.log(`${ok ? '  ok ' : 'FALHA'} ${label}`)
  if (!ok) process.exitCode = 1
}

const browser = await chromium.launch()

/** Larguras que importam: iPhone SE, celular comum e desktop. */
for (const width of [320, 390, 1360]) {
  const context = await browser.newContext({
    viewport: { width, height: width < 700 ? 844 : 900 },
    isMobile: width < 700,
    hasTouch: width < 700,
  })
  const page = await context.newPage()

  await page.goto(BASE, { waitUntil: 'networkidle' })

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  check(overflow <= 0, `[${width}px] home sem scroll horizontal (sobra ${overflow}px)`)

  // Fluxo completo do orçamento.
  await page.goto(`${BASE}/orcamento`, { waitUntil: 'networkidle' })
  await page.getByText('Patinete elétrico', { exact: true }).first().click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.getByText('Bateria não carrega ou dura pouco').click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.fill('#marca-modelo', 'Xiaomi M365 Pro')
  await page.fill('#descricao', 'Carrega até 50% e desliga na subida.')
  await page.getByText('Urgente — uso para trabalhar').click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.fill('#nome', 'Gustavo')
  await page.fill('#bairro', 'Centro, Cuiabá')
  await page.getByText('Prefiro busca e entrega').click()
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.waitForTimeout(400)

  const quoteOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  check(quoteOverflow <= 0, `[${width}px] orçamento sem scroll horizontal (sobra ${quoteOverflow}px)`)

  const preview = (await page.locator('.preview__text').textContent()).trim()
  const href = await page.locator('.summary a.btn--whats').first().getAttribute('href')
  // searchParams já devolve o texto decodificado.
  const text = new URL(href).searchParams.get('text')

  check(href.startsWith('https://wa.me/'), `[${width}px] botão final aponta para wa.me`)
  check(text === preview, `[${width}px] mensagem do link é igual à mostrada na tela`)
  check(
    ['Patinete elétrico', 'Xiaomi M365 Pro', 'Bateria não carrega', '50%', 'Gustavo'].every((t) =>
      text.includes(t),
    ),
    `[${width}px] mensagem contém equipamento, modelo, problema, relato e nome`,
  )

  await context.close()
}

await browser.close()

const failed = results.filter((r) => !r.ok).length
console.log(`\n${results.length - failed}/${results.length} verificações passaram`)
