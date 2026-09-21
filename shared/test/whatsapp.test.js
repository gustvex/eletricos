import assert from 'node:assert/strict'
import test from 'node:test'

import { business } from '../src/business.js'
import { problemsForVehicle } from '../src/catalog.js'
import { buildQuoteMessage, buildQuoteWhatsappUrl, buildWhatsappUrl } from '../src/whatsapp.js'

const fullQuote = {
  vehicle: 'patinete',
  brandModel: 'Xiaomi M365 Pro',
  problem: 'bateria',
  description: 'Carrega só até a metade e desliga na subida.',
  urgency: 'urgente',
  logistic: 'buscar',
  name: 'Gustavo',
  neighborhood: 'Centro, Cuiabá',
}

test('mensagem completa traz todos os campos preenchidos', () => {
  const message = buildQuoteMessage(fullQuote)
  assert.match(message, new RegExp(`Olá, ${business.owner}!`))
  assert.match(message, /Equipamento: Patinete elétrico/)
  assert.match(message, /Marca\/modelo: Xiaomi M365 Pro/)
  assert.match(message, /Problema: Bateria não carrega ou dura pouco/)
  assert.match(message, /Detalhes: Carrega só até a metade/)
  assert.match(message, /Prazo: Urgente/)
  assert.match(message, /Atendimento: Prefiro busca e entrega/)
  assert.match(message, /Meu nome: Gustavo/)
  assert.match(message, /Consegue me passar o orçamento\?$/)
})

test('campos vazios nao deixam linhas soltas na mensagem', () => {
  const message = buildQuoteMessage({ vehicle: 'bicicleta', problem: 'freios' })
  assert.ok(!message.includes('Marca/modelo'))
  assert.ok(!message.includes('undefined'))
  assert.ok(!/\n{3,}/.test(message), 'nao deve haver tres quebras de linha seguidas')
})

test('ids desconhecidos sao ignorados em vez de quebrar', () => {
  const message = buildQuoteMessage({ vehicle: 'foguete', problem: 'sei-la' })
  assert.ok(!message.includes('foguete'))
  assert.ok(message.startsWith(`Olá, ${business.owner}!`))
})

test('descricao longa e truncada e espacos sao normalizados', () => {
  const message = buildQuoteMessage({ description: 'a'.repeat(900) })
  const detail = message.split('\n').find((line) => line.startsWith('📝'))
  assert.equal(detail.replace('📝 Detalhes: ', '').length, 600)

  const spaced = buildQuoteMessage({ name: '  Ana   Paula  ' })
  assert.match(spaced, /Meu nome: Ana Paula/)
})

test('url do whatsapp usa wa.me com o telefone so em digitos e texto encodado', () => {
  const url = buildQuoteWhatsappUrl(fullQuote)
  assert.ok(url.startsWith(`https://wa.me/${business.whatsapp.phone}?text=`))
  assert.ok(!url.includes(' '), 'a URL nao pode conter espaco cru')
  const text = decodeURIComponent(new URL(url).searchParams.get('text'))
  assert.equal(text, buildQuoteMessage(fullQuote))
})

test('telefone formatado e limpo antes de virar link', () => {
  assert.ok(buildWhatsappUrl('oi', '+55 (65) 99990-1389').startsWith('https://wa.me/5565999901389?text='))
})

test('problemas especificos so aparecem no equipamento certo', () => {
  const patinete = problemsForVehicle('patinete').map((p) => p.id)
  const bike = problemsForVehicle('bicicleta').map((p) => p.id)
  assert.ok(patinete.includes('dobradica'))
  assert.ok(!patinete.includes('transmissao'))
  assert.ok(bike.includes('transmissao'))
  assert.ok(!bike.includes('dobradica'))
  assert.ok(patinete.includes('bateria') && bike.includes('bateria'))
})
