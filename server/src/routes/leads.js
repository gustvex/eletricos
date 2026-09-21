import { Router } from 'express'

import { findLogistic, findProblem, findUrgency, findVehicle } from '@eletricos/shared/catalog'
import { buildQuoteMessage, buildQuoteWhatsappUrl } from '@eletricos/shared/whatsapp'

import { config } from '../lib/config.js'
import { rateLimit } from '../lib/rateLimit.js'
import { saveLead } from '../lib/leadStore.js'

export const leadsRouter = Router()

const text = (value, max) =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, max) : ''

/**
 * Valida o payload contra o catalogo compartilhado.
 * Campos de escolha precisam existir no catalogo; campos livres sao apenas
 * normalizados e cortados no tamanho maximo.
 */
function parseQuote(body = {}) {
  const errors = []

  const vehicle = findVehicle(body.vehicle)
  if (!vehicle) errors.push('Selecione o tipo de equipamento.')

  const problem = findProblem(body.problem)
  if (!problem) errors.push('Selecione o problema.')

  if (problem && problem.vehicles && vehicle && !problem.vehicles.includes(vehicle.id)) {
    errors.push('Esse problema não se aplica ao equipamento selecionado.')
  }

  const name = text(body.name, 60)
  if (name.length < 2) errors.push('Informe seu nome.')

  const quote = {
    vehicle: vehicle?.id || '',
    problem: problem?.id || '',
    urgency: findUrgency(body.urgency)?.id || 'normal',
    logistic: findLogistic(body.logistic)?.id || 'levar',
    brandModel: text(body.brandModel, 80),
    description: text(body.description, 600),
    neighborhood: text(body.neighborhood, 80),
    name,
  }

  return { quote, errors }
}

leadsRouter.post('/leads', rateLimit(config.rateLimit), async (req, res, next) => {
  try {
    // Campo invisivel no formulario: se veio preenchido, e bot.
    if (text(req.body?.website, 50)) {
      return res.status(202).json({ ok: true })
    }

    const { quote, errors } = parseQuote(req.body)
    if (errors.length) {
      return res.status(422).json({ error: 'validation_error', messages: errors })
    }

    const record = await saveLead({
      ...quote,
      message: buildQuoteMessage(quote),
      source: text(req.body?.source, 60) || 'site',
      userAgent: text(req.get('user-agent'), 200),
    })

    return res.status(201).json({
      ok: true,
      id: record.id,
      whatsappUrl: buildQuoteWhatsappUrl(quote),
    })
  } catch (error) {
    return next(error)
  }
})

export default leadsRouter
