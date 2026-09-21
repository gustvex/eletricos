/**
 * Camada fina de eventos.
 *
 * Hoje so empurra para o dataLayer (Google Tag Manager) e para o gtag,
 * se existirem. Sem tag instalada, nao faz nada e nao quebra.
 * Os eventos que importam para esse negocio sao os cliques que levam ao
 * WhatsApp: e por ali que da para medir o custo por orcamento em anuncio.
 */
export function track(event, payload = {}) {
  const data = { event, ...payload }

  if (typeof window === 'undefined') return

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(data)
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', event, payload)
  }

  if (import.meta.env.DEV) {
    console.debug('[analytics]', data)
  }
}

export const trackWhatsappClick = (origin, extra = {}) =>
  track('whatsapp_click', { origin, ...extra })

export const trackQuoteStep = (step, extra = {}) => track('quote_step', { step, ...extra })

export const trackQuoteSubmit = (extra = {}) => track('quote_submit', extra)
