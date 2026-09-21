import { computed } from 'vue'

import { buildDirectMessage, buildWhatsappUrl } from '@eletricos/shared/whatsapp'

import { useCatalogStore } from '../stores/catalog.js'
import { trackWhatsappClick } from '../utils/analytics.js'

/**
 * Link de WhatsApp para os botoes de contato direto.
 *
 * O href e montado antes do clique de proposito: o navegador abre o link
 * na hora, sem esperar promise nenhuma, e nao cai no bloqueio de pop-up
 * que acontece quando se chama window.open() depois de um await.
 */
export function useWhatsapp(context = '') {
  const catalog = useCatalogStore()

  const phone = computed(() => catalog.business.whatsapp.phone)
  const display = computed(() => catalog.business.whatsapp.display)
  const tel = computed(() => catalog.business.whatsapp.tel)

  const url = computed(() => buildWhatsappUrl(buildDirectMessage(context), phone.value))

  const open = (origin) => trackWhatsappClick(origin || context || 'geral')

  return { url, phone, display, tel, open }
}

export default useWhatsapp
