import { Router } from 'express'

import { business } from '@eletricos/shared/business'
import { catalog } from '@eletricos/shared/catalog'
import { faq } from '@eletricos/shared/faq'

export const catalogRouter = Router()

/**
 * O front ja embute esses dados no bundle (para funcionar mesmo sem API),
 * mas busca aqui na inicializacao. Assim da para editar servicos e FAQ no
 * servidor sem precisar de um novo deploy do front.
 */
catalogRouter.get('/catalog', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300')
  res.json({
    business: {
      name: business.name,
      owner: business.owner,
      tagline: business.tagline,
      whatsapp: business.whatsapp,
      hours: business.hours,
      location: business.location,
      guarantees: business.guarantees,
      brands: business.brands,
      social: business.social,
    },
    ...catalog,
    faq,
  })
})

export default catalogRouter
