<script setup>
import { storeToRefs } from 'pinia'

import OptionCard from '../ui/OptionCard.vue'
import { useCatalogStore } from '../../stores/catalog.js'
import { useQuoteStore } from '../../stores/quote.js'

const catalog = useCatalogStore()
const quote = useQuoteStore()
const { form, stepErrors, touched } = storeToRefs(quote)
</script>

<template>
  <fieldset class="step">
    <legend class="sr-only">Escolha o equipamento</legend>

    <div class="step__options">
      <OptionCard
        v-for="vehicle in catalog.vehicles"
        :key="vehicle.id"
        name="equipamento"
        :value="vehicle.id"
        :model-value="form.vehicle"
        :label="vehicle.label"
        :hint="vehicle.description"
        :emoji="vehicle.emoji"
        @update:model-value="quote.select('vehicle', $event)"
      />
    </div>

    <p v-if="form.vehicle" class="step__examples">
      Exemplos que atendemos:
      <strong>{{ catalog.vehicles.find((v) => v.id === form.vehicle)?.examples }}</strong>
    </p>

    <p v-if="touched.vehicle && stepErrors.vehicle" class="step__error" role="alert">
      {{ stepErrors.vehicle }}
    </p>
  </fieldset>
</template>

<style scoped>
.step {
  border: none;
  padding: 0;
  margin: 0;
}

.step__options {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-3);
}

.step__examples {
  margin-top: var(--space-4);
  font-size: var(--step--1);
  color: var(--text-muted);
}

.step__error {
  margin-top: var(--space-3);
  color: var(--red-600);
  font-size: var(--step--1);
  font-weight: 600;
}

@media (min-width: 720px) {
  .step__options {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
