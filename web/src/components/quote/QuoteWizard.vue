<script setup>
import { nextTick, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import BaseButton from '../ui/BaseButton.vue'
import WizardProgress from './WizardProgress.vue'
import StepVehicle from './StepVehicle.vue'
import StepProblem from './StepProblem.vue'
import StepDetails from './StepDetails.vue'
import StepContact from './StepContact.vue'
import QuoteSummary from './QuoteSummary.vue'
import { useQuoteStore } from '../../stores/quote.js'

const quote = useQuoteStore()
const { stepIndex, currentStep, canAdvance, isLastStep } = storeToRefs(quote)

const stepComponents = {
  equipamento: StepVehicle,
  problema: StepProblem,
  detalhes: StepDetails,
  contato: StepContact,
  resumo: QuoteSummary,
}

const headingRef = ref(null)

/**
 * A cada troca de passo o foco vai para o título.
 * Sem isso quem usa teclado ou leitor de tela continua com o foco no
 * botão "Continuar" e não percebe que a pergunta mudou.
 */
watch(stepIndex, async () => {
  await nextTick()
  headingRef.value?.focus()
})
</script>

<template>
  <div class="wizard card">
    <WizardProgress />

    <h2 ref="headingRef" class="wizard__title" tabindex="-1">
      {{ currentStep.title }}
    </h2>

    <div class="wizard__body">
      <Transition name="step" mode="out-in">
        <component :is="stepComponents[currentStep.id]" :key="currentStep.id" />
      </Transition>
    </div>

    <footer v-if="!isLastStep" class="wizard__footer">
      <BaseButton
        v-if="stepIndex > 0"
        variant="ghost"
        class="wizard__back"
        @click="quote.back()"
      >
        Voltar
      </BaseButton>

      <BaseButton variant="primary" :disabled="!canAdvance" @click="quote.next()">
        Continuar
      </BaseButton>
    </footer>

    <footer v-else class="wizard__footer wizard__footer--last">
      <BaseButton variant="ghost" class="wizard__back" @click="quote.back()">
        Ajustar respostas
      </BaseButton>
    </footer>
  </div>
</template>

<style scoped>
.wizard {
  padding: clamp(1.25rem, 4vw, 2rem);
  box-shadow: var(--shadow);
}

.wizard__title {
  font-size: var(--step-2);
  margin-bottom: var(--space-5);
}

.wizard__title:focus {
  outline: none;
}

.wizard__body {
  min-height: 220px;
}

.wizard__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border);
}

.wizard__back {
  margin-right: auto;
  color: var(--text-muted);
}

.wizard__footer--last {
  justify-content: flex-start;
}

.step-enter-active,
.step-leave-active {
  transition: opacity var(--transition), transform var(--transition);
}

.step-enter-from {
  opacity: 0;
  transform: translateX(14px);
}

.step-leave-to {
  opacity: 0;
  transform: translateX(-14px);
}
</style>
