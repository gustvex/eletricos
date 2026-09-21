import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { business as localBusiness } from '@eletricos/shared/business'
import {
  logistics as localLogistics,
  problems as localProblems,
  problemsForVehicle,
  serviceGroups as localServiceGroups,
  urgencies as localUrgencies,
  vehicles as localVehicles,
} from '@eletricos/shared/catalog'
import { faq as localFaq } from '@eletricos/shared/faq'

/**
 * Catalogo do site.
 *
 * O conteudo ja vem embutido no bundle: o site abre completo mesmo se a API
 * estiver fora do ar ou se o deploy for estatico (Vercel/Netlify).
 * Quando a API responde, os dados sao atualizados por cima — assim da para
 * mexer em servicos e FAQ sem novo build do front.
 */
export const useCatalogStore = defineStore('catalog', () => {
  const business = ref(localBusiness)
  const vehicles = ref(localVehicles)
  const problems = ref(localProblems)
  const urgencies = ref(localUrgencies)
  const logistics = ref(localLogistics)
  const serviceGroups = ref(localServiceGroups)
  const faq = ref(localFaq)

  const status = ref('idle') // idle | loading | ready | offline

  /** Problemas validos para o equipamento escolhido. */
  const problemsFor = computed(() => (vehicleId) => {
    if (problems.value === localProblems) return problemsForVehicle(vehicleId)
    return problems.value.filter((p) => !p.vehicles || (vehicleId && p.vehicles.includes(vehicleId)))
  })

  async function load() {
    if (status.value === 'loading') return
    status.value = 'loading'
    try {
      const response = await fetch('/api/catalog', { headers: { accept: 'application/json' } })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()

      if (data.business) business.value = { ...localBusiness, ...data.business }
      if (data.vehicles?.length) vehicles.value = data.vehicles
      if (data.problems?.length) problems.value = data.problems
      if (data.urgencies?.length) urgencies.value = data.urgencies
      if (data.logistics?.length) logistics.value = data.logistics
      if (data.serviceGroups?.length) serviceGroups.value = data.serviceGroups
      if (data.faq?.length) faq.value = data.faq

      status.value = 'ready'
    } catch {
      // Silencioso de proposito: o conteudo local ja esta na tela.
      status.value = 'offline'
    }
  }

  return {
    business,
    vehicles,
    problems,
    urgencies,
    logistics,
    serviceGroups,
    faq,
    status,
    problemsFor,
    load,
  }
})
