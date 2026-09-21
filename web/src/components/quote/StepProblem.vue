<script setup>
import { storeToRefs } from 'pinia'

import OptionCard from '../ui/OptionCard.vue'
import { useQuoteStore } from '../../stores/quote.js'

const quote = useQuoteStore()
const { form, availableProblems, selectedVehicle, stepErrors, touched } = storeToRefs(quote)
</script>

<template>
  <fieldset class="step">
    <legend class="sr-only">Escolha o problema</legend>

    <p class="step__intro">
      Escolha o que mais parece com o seu caso no
      <strong>{{ selectedVehicle?.short?.toLowerCase() || 'equipamento' }}</strong>.
      Não precisa acertar o termo técnico — o diagnóstico confirma na bancada.
    </p>

    <div class="step__options">
      <OptionCard
        v-for="problem in availableProblems"
        :key="problem.id"
        compact
        name="problema"
        :value="problem.id"
        :model-value="form.problem"
        :label="problem.label"
        :hint="problem.hint"
        :emoji="problem.emoji"
        @update:model-value="quote.select('problem', $event)"
      />
    </div>

    <p v-if="touched.problem && stepErrors.problem" class="step__error" role="alert">
      {{ stepErrors.problem }}
    </p>
  </fieldset>
</template>

<style scoped>
.step {
  border: none;
  padding: 0;
  margin: 0;
}

.step__intro {
  margin-bottom: var(--space-4);
  color: var(--text-muted);
  font-size: var(--step--1);
}

.step__options {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-3);
}

.step__error {
  margin-top: var(--space-3);
  color: var(--red-600);
  font-size: var(--step--1);
  font-weight: 600;
}

@media (min-width: 720px) {
  .step__options {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
