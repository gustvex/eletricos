import { business } from '@eletricos/shared/business'
import { faq } from '@eletricos/shared/faq'
import { serviceGroups } from '@eletricos/shared/catalog'

/** Atualiza title e description conforme a rota. */
export function setPageMeta({ title, description }) {
  if (title) document.title = title
  if (description) {
    const tag = document.querySelector('meta[name="description"]')
    if (tag) tag.setAttribute('content', description)
  }
}

/**
 * Injeta os dados estruturados (schema.org).
 * LocalBusiness e o que coloca o negocio nos resultados locais do Google;
 * FAQPage e o que faz as perguntas aparecerem expandidas na busca.
 */
export function applyStructuredData() {
  const { location, whatsapp, guarantees } = business

  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      additionalType: 'https://schema.org/AutoRepair',
      name: business.legalName,
      description: business.tagline,
      url: business.siteUrl,
      telephone: whatsapp.tel,
      image: `${business.siteUrl}/img/og-cover.jpg`,
      priceRange: '$$',
      areaServed: location.coverage.map((name) => ({ '@type': 'Place', name })),
      address: {
        '@type': 'PostalAddress',
        addressLocality: location.city,
        addressRegion: location.state,
        addressCountry: 'BR',
        ...(location.street ? { streetAddress: location.street } : {}),
        ...(location.zip ? { postalCode: location.zip } : {}),
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '18:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday'],
          opens: '08:00',
          closes: '12:00',
        },
      ],
      paymentAccepted: guarantees.payment.join(', '),
      makesOffer: serviceGroups.map((group) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: `Manutenção de ${group.title.toLowerCase()}`,
          serviceType: group.items.join('; '),
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ]

  const id = 'structured-data'
  document.getElementById(id)?.remove()
  const script = document.createElement('script')
  script.id = id
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}
