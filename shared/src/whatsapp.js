/**
 * Geracao do link do WhatsApp com a mensagem ja pronta.
 *
 * A mesma funcao roda no navegador (para montar o href do botao) e no
 * servidor (para registrar o lead exatamente como o cliente enviou).
 */

import { business } from './business.js'
import { findLogistic, findProblem, findUrgency, findVehicle } from './catalog.js'

/** Limites defensivos: URL muito longa quebra em alguns navegadores/Android. */
const MAX_FIELD = 120
const MAX_DESCRIPTION = 600

const clean = (value, max = MAX_FIELD) =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : ''

/**
 * Monta a mensagem que o cliente envia para a oficina.
 * Linhas vazias sao descartadas, entao um orcamento com poucos campos
 * preenchidos continua legivel.
 *
 * @param {object} quote
 * @param {string} [quote.vehicle]      id do equipamento (ver catalog.vehicles)
 * @param {string} [quote.brandModel]   marca/modelo digitado pelo cliente
 * @param {string} [quote.problem]      id do problema (ver catalog.problems)
 * @param {string} [quote.description]  descricao livre
 * @param {string} [quote.urgency]      id da urgencia
 * @param {string} [quote.logistic]     id da forma de atendimento
 * @param {string} [quote.name]         nome do cliente
 * @param {string} [quote.neighborhood] bairro/cidade
 * @returns {string} mensagem em texto puro
 */
export function buildQuoteMessage(quote = {}) {
  const vehicle = findVehicle(quote.vehicle)
  const problem = findProblem(quote.problem)
  const urgency = findUrgency(quote.urgency)
  const logistic = findLogistic(quote.logistic)

  const name = clean(quote.name, 60)
  const brandModel = clean(quote.brandModel, 80)
  const description = clean(quote.description, MAX_DESCRIPTION)
  const neighborhood = clean(quote.neighborhood, 80)

  const greeting = `Olá, ${business.owner}! Vim pelo site e queria um orçamento. ⚡`

  const lines = [
    greeting,
    '',
    vehicle ? `${vehicle.emoji} Equipamento: ${vehicle.label}` : '',
    brandModel ? `🏷️ Marca/modelo: ${brandModel}` : '',
    problem ? `${problem.emoji} Problema: ${problem.label}` : '',
    description ? `📝 Detalhes: ${description}` : '',
    urgency ? `⏱️ Prazo: ${urgency.label}` : '',
    logistic ? `📍 Atendimento: ${logistic.label}` : '',
    neighborhood ? `🗺️ Bairro/cidade: ${neighborhood}` : '',
    name ? `👤 Meu nome: ${name}` : '',
    '',
    'Consegue me passar o orçamento?',
  ]

  return lines.filter((line, index) => line !== '' || lines[index - 1] !== '').join('\n').trim()
}

/** Mensagem curta usada nos botoes de contato direto (header, rodape, botao flutuante). */
export function buildDirectMessage(context = '') {
  const suffix = clean(context, 100)
  return [
    `Olá, ${business.owner}! Vim pelo site.`,
    suffix || 'Preciso de ajuda com meu equipamento elétrico.',
  ].join(' ')
}

/**
 * Monta a URL do WhatsApp. `wa.me` resolve sozinho entre app e WhatsApp Web,
 * entao funciona igual no celular e no desktop.
 */
export function buildWhatsappUrl(message, phone = business.whatsapp.phone) {
  const digits = String(phone).replace(/\D/g, '')
  const text = encodeURIComponent(message || '')
  return `https://wa.me/${digits}?text=${text}`
}

/** Atalho: recebe o orcamento e devolve a URL final. */
export function buildQuoteWhatsappUrl(quote, phone) {
  return buildWhatsappUrl(buildQuoteMessage(quote), phone)
}

export default { buildQuoteMessage, buildDirectMessage, buildWhatsappUrl, buildQuoteWhatsappUrl }
