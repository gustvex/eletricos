<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import OptionCard from '../ui/OptionCard.vue'
import { useCatalogStore } from '../../stores/catalog.js'
import { useQuoteStore } from '../../stores/quote.js'

const catalog = useCatalogStore()
const quote = useQuoteStore()
const { form, selectedVehicle, stepErrors, touched } = storeToRefs(quote)

/** Placeholder que muda conforme o equipamento: ajuda quem não sabe o que escrever. */
const placeholder = computed(() => {
  const byVehicle = {
    bicicleta: 'Ex.: comprei há 2 anos, rodo 15 km por dia. Começou a cortar a força na subida depois que peguei chuva.',
    patinete: 'Ex.: liga normal, mas depois de 5 minutos desliga sozinho. A bateria carrega até 50% e para.',
    scooter: 'Ex.: acende o painel mas não anda. Aparece um código de erro na tela quando giro o acelerador.',
  }
  return byVehicle[form.value.vehicle] || 'Conte desde quando acontece, o que você já tentou e se houve queda, chuva ou oficina antes.'
})

const modelPlaceholder = computed(() => selectedVehicle.value?.examples?.split(',')[0]?.trim() || 'Marca e modelo')
</script>

<template>
  <div class="step">
    <div class="field">
      <label for="marca-modelo">
        Marca e modelo <span class="field__optional">(opcional)</span>
      </label>
      <input
        id="marca-modelo"
        v-model="form.brandModel"
        type="text"
        maxlength="80"
        autocomplete="off"
        :placeholder="modelPlaceholder"
      />
      <p class="field__help">
        Se não souber, tudo bem. Se tiver o modelo na etiqueta, já adiantamos a peça certa.
      </p>
    </div>

    <div class="field">
      <label for="descricao">
        O que está acontecendo?
        <span v-if="form.problem === 'outro'" class="field__required">obrigatório</span>
        <span v-else class="field__optional">(opcional, mas ajuda muito)</span>
      </label>
      <textarea
        id="descricao"
        v-model="form.description"
        rows="4"
        maxlength="600"
        :placeholder="placeholder"
        :aria-invalid="Boolean(touched.description && stepErrors.description)"
      ></textarea>
      <div class="field__footer">
        <p v-if="touched.description && stepErrors.description" class="field__error" role="alert">
          {{ stepErrors.description }}
        </p>
        <span class="field__count">{{ form.description.length }}/600</span>
      </div>
    </div>

    <fieldset class="field">
      <legend>Qual a sua pressa?</legend>
      <div class="step__options">
        <OptionCard
          v-for="urgency in catalog.urgencies"
          :key="urgency.id"
          compact
          name="urgencia"
          :value="urgency.id"
          :model-value="form.urgency"
          :label="urgency.label"
          :hint="urgency.detail"
          @update:model-value="quote.select('urgency', $event)"
        />
      </div>
    </fieldset>
  </div>
</template>

<style scoped>
.step {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-5);
}

.field {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-2);
  border: none;
  padding: 0;
  margin: 0;
}

.field > label,
.field > legend {
  font-weight: 700;
  font-size: 0.95rem;
  padding: 0;
}

.field__optional {
  font-weight: 500;
  color: var(--text-muted);
}

.field__required {
  font-weight: 700;
  font-size: var(--step--1);
  color: var(--brand);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

input[type='text'],
textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  transition: border-color var(--transition), box-shadow var(--transition);
  resize: vertical;
}

input[type='text']:focus,
textarea:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: var(--ring);
}

input[aria-invalid='true'],
textarea[aria-invalid='true'] {
  border-color: var(--red-500);
}

.field__help {
  font-size: var(--step--1);
  color: var(--text-muted);
}

.field__footer {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  align-items: baseline;
}

.field__error {
  color: var(--red-600);
  font-size: var(--step--1);
  font-weight: 600;
}

.field__count {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.step__options {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-3);
  margin-top: var(--space-2);
}

@media (min-width: 720px) {
  .step__options {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
