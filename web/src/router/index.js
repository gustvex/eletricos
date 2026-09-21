import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import { setPageMeta } from '../utils/seo.js'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Conserto de Bike, Patinete e Scooter Elétrica | Elétricos',
      description:
        'Oficina especializada em bicicleta elétrica, patinete elétrico e scooter elétrica. Diagnóstico gratuito, orçamento na hora pelo WhatsApp e garantia no serviço.',
    },
  },
  {
    path: '/orcamento',
    name: 'orcamento',
    // Carregado sob demanda: a home abre mais leve no 4G.
    component: () => import('../views/QuoteView.vue'),
    meta: {
      title: 'Orçamento rápido pelo WhatsApp | Elétricos',
      description:
        'Responda 4 perguntas e receba o orçamento do conserto da sua bike, patinete ou scooter elétrica direto no WhatsApp.',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'nao-encontrado',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: 'Página não encontrada | Elétricos' },
  },
]

/**
 * Hospedagem estatica sem reescrita de rota (GitHub Pages, um link de
 * preview, um bucket simples) devolve 404 ao abrir /orcamento direto.
 * Nesses casos o build roda com VITE_ROUTER_MODE=hash e a rota vira
 * /#/orcamento, que qualquer host serve. Em servidor proprio (Node, Vercel,
 * Netlify) fica a URL limpa.
 */
const history =
  import.meta.env.VITE_ROUTER_MODE === 'hash' ? createWebHashHistory() : createWebHistory()

export const router = createRouter({
  history,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 80 }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  setPageMeta(to.meta)
})

export default router
