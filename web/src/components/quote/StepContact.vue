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
  <div class="step">
    <p class="step__intro">
      Não pedimos telefone nem e-mail: a conversa acontece no seu próprio WhatsApp.
      Só precisamos saber com quem estamos falando.
    </p>

    <div class="step__row">
      <div class="field">
        <label for="nome">Seu nome</label>
        <input
          id="nome"
          v-model="form.name"
          type="text"
          maxlength="60"
          autocomplete="given-name"
          placeholder="Como podemos te chamar?"
          :aria-invalid="Boolean(touched.name && stepErrors.name)"
          @blur="touched.name = true"
        />
        <p v-if="touched.name && stepErrors.name" class="field__error" role="alert">
          {{ stepErrors.name }}
        </p>
      </div>

      <div class="field">
        <label for="bairro">
          Bairro / cidade <span class="field__optional">(opcional)</span>
        </label>
        <input
          id="bairro"
          v-model="form.neighborhood"
          type="text"
          maxlength="80"
          autocomplete="address-level3"
          :placeholder="`Ex.: Centro, ${catalog.business.location.city}`"
        />
      </div>
    </div>

    <fieldset class="field">
      <legend>Como prefere o atendimento?</legend>
      <div class="step__options">
        <OptionCard
          v-for="option in catalog.logistics"
          :key="option.id"
          compact
          name="logistica"
          :value="option.id"
          :model-value="form.logistic"
          :label="option.label"
          :hint="option.detail"
          @update:model-value="quote.select('logistic', $event)"
        />
      </div>
    </fieldset>

    <!-- Honeypot: invisível para gente, irresistível para bot. -->
    <div class="honeypot" aria-hidden="true">
      <label for="website">Não preencha este campo</label>
      <input id="website" v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
    </div>
  </div>
</template>

<style scoped>
.step {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-5);
}

.step__intro {
  color: var(--text-muted);
  font-size: var(--step--1);
}

.step__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-4);
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

input[type='text'] {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  transition: border-color var(--transition), box-shadow var(--transition);
}

input[type='text']:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: var(--ring);
}

input[aria-invalid='true'] {
  border-color: var(--red-500);
}

.field__error {
  color: var(--red-600);
  font-size: var(--step--1);
  font-weight: 600;
}

.step__options {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.honeypot {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

@media (min-width: 720px) {
  .step__row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .step__options {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
