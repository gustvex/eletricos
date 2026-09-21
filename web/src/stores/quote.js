import { computed, reactive, ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { buildQuoteMessage, buildWhatsappUrl } from '@eletricos/shared/whatsapp'

import { useCatalogStore } from './catalog.js'
import { trackQuoteStep, trackQuoteSubmit } from '../utils/analytics.js'

const STORAGE_KEY = 'eletricos:orcamento'

export const STEPS = [
  { id: 'equipamento', label: 'Equipamento', title: 'Qual equipamento precisa de manutenção?' },
  { id: 'problema', label: 'Problema', title: 'O que está acontecendo com ele?' },
  { id: 'detalhes', label: 'Detalhes', title: 'Conta um pouco mais' },
  { id: 'contato', label: 'Contato', title: 'Por último: como falamos com você?' },
  { id: 'resumo', label: 'Enviar', title: 'Confira a mensagem antes de enviar' },
]

const emptyForm = () => ({
  vehicle: '',
  problem: '',
  brandModel: '',
  description: '',
  urgency: 'rapido',
  logistic: 'levar',
  name: '',
  neighborhood: '',
  /** Honeypot: fica escondido no formulario, so bot preenche. */
  website: '',
})

export const useQuoteStore = defineStore('quote', () => {
  const catalog = useCatalogStore()

  const form = reactive(emptyForm())
  const stepIndex = ref(0)
  const submitting = ref(false)
  const sent = ref(false)
  /** Campos que o usuario ja tentou passar sem preencher. */
  const touched = reactive({})

  restore()

  const currentStep = computed(() => STEPS[stepIndex.value])
  const isLastStep = computed(() => stepIndex.value === STEPS.length - 1)
  const progress = computed(() => ((stepIndex.value + 1) / STEPS.length) * 100)

  const availableProblems = computed(() => catalog.problemsFor(form.vehicle))

  const selectedVehicle = computed(
    () => catalog.vehicles.find((v) => v.id === form.vehicle) || null,
  )
  const selectedProblem = computed(
    () => catalog.problems.find((p) => p.id === form.problem) || null,
  )

  /** Erros do passo atual. Vazio = pode avançar. */
  const stepErrors = computed(() => {
    const errors = {}
    const step = currentStep.value.id

    if (step === 'equipamento' && !form.vehicle) {
      errors.vehicle = 'Escolha o equipamento para continuar.'
    }
    if (step === 'problema' && !form.problem) {
      errors.problem = 'Escolha o problema mais parecido com o seu.'
    }
    if (step === 'detalhes' && form.problem === 'outro' && form.description.trim().length < 10) {
      errors.description = 'Descreva em poucas palavras o que está acontecendo.'
    }
    if (step === 'contato' && form.name.trim().length < 2) {
      errors.name = 'Informe seu nome.'
    }
    return errors
  })

  const canAdvance = computed(() => Object.keys(stepErrors.value).length === 0)

  /** Mensagem final — é exatamente o que o cliente vai enviar. */
  const message = computed(() => buildQuoteMessage(form))

  const whatsappUrl = computed(() =>
    buildWhatsappUrl(message.value, catalog.business.whatsapp.phone),
  )

  function select(field, value) {
    form[field] = value
    // Trocar de equipamento pode invalidar o problema escolhido antes.
    if (field === 'vehicle') {
      const stillValid = catalog.problemsFor(value).some((p) => p.id === form.problem)
      if (!stillValid) form.problem = ''
    }
  }

  function next() {
    if (!canAdvance.value) {
      Object.keys(stepErrors.value).forEach((field) => {
        touched[field] = true
      })
      return false
    }
    if (isLastStep.value) return false
    stepIndex.value += 1
    trackQuoteStep(currentStep.value.id, { vehicle: form.vehicle, problem: form.problem })
    return true
  }

  function back() {
    if (stepIndex.value === 0) return false
    stepIndex.value -= 1
    return true
  }

  function goTo(index) {
    // Só permite voltar para passos já visitados.
    if (index < 0 || index > stepIndex.value) return
    stepIndex.value = index
  }

  function reset() {
    Object.assign(form, emptyForm())
    Object.keys(touched).forEach((key) => delete touched[key])
    stepIndex.value = 0
    sent.value = false
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* modo privado pode bloquear o storage */
    }
  }

  /**
   * Registra o lead na API. Falha de rede nao pode travar o cliente:
   * o WhatsApp abre de qualquer jeito, o registro e o que e opcional.
   */
  async function submit() {
    submitting.value = true
    trackQuoteSubmit({ vehicle: form.vehicle, problem: form.problem, urgency: form.urgency })
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'site-orcamento' }),
        keepalive: true,
      })
    } catch {
      /* ignora: o importante e o cliente chegar no WhatsApp */
    } finally {
      submitting.value = false
      sent.value = true
    }
  }

  /** Guarda o rascunho para quem sai e volta depois (acontece muito no celular). */
  function persist() {
    try {
      const { website, ...rest } = form
      void website
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ form: rest, stepIndex: stepIndex.value }))
    } catch {
      /* sem storage disponivel, segue sem rascunho */
    }
  }

  function restore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const saved = JSON.parse(raw)
      if (saved?.form) Object.assign(form, emptyForm(), saved.form, { website: '' })
      if (Number.isInteger(saved?.stepIndex)) {
        stepIndex.value = Math.min(saved.stepIndex, STEPS.length - 1)
      }
    } catch {
      /* rascunho corrompido: comeca do zero */
    }
  }

  watch([form, stepIndex], persist, { deep: true })

  return {
    STEPS,
    form,
    touched,
    stepIndex,
    currentStep,
    isLastStep,
    progress,
    stepErrors,
    canAdvance,
    availableProblems,
    selectedVehicle,
    selectedProblem,
    message,
    whatsappUrl,
    submitting,
    sent,
    select,
    next,
    back,
    goTo,
    reset,
    submit,
  }
})
