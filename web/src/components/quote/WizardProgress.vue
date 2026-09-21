<script setup>
import { storeToRefs } from 'pinia'

import { STEPS, useQuoteStore } from '../../stores/quote.js'

const quote = useQuoteStore()
const { stepIndex, progress } = storeToRefs(quote)
</script>

<template>
  <div class="progress">
    <div class="progress__bar" role="progressbar" :aria-valuenow="Math.round(progress)" aria-valuemin="0" aria-valuemax="100" :aria-label="`Passo ${stepIndex + 1} de ${STEPS.length}`">
      <span class="progress__fill" :style="{ width: `${progress}%` }"></span>
    </div>

    <ol class="progress__steps">
      <li
        v-for="(step, index) in STEPS"
        :key="step.id"
        class="progress__step"
        :class="{ 'is-done': index < stepIndex, 'is-current': index === stepIndex }"
      >
        <button
          type="button"
          :disabled="index > stepIndex"
          :aria-current="index === stepIndex ? 'step' : undefined"
          @click="quote.goTo(index)"
        >
          <span class="progress__n">{{ index < stepIndex ? '✓' : index + 1 }}</span>
          <span class="progress__label">{{ step.label }}</span>
        </button>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.progress {
  margin-bottom: var(--space-5);
}

.progress__bar {
  height: 6px;
  border-radius: var(--radius-pill);
  background: var(--ink-200);
  overflow: hidden;
}

.progress__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--red-600), var(--red-400));
  transition: width var(--transition);
}

.progress__steps {
  display: flex;
  justify-content: space-between;
  gap: var(--space-2);
  margin-top: var(--space-3);
  padding: 0;
  list-style: none;
}

.progress__step button {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: var(--step--1);
  font-weight: 600;
}

.progress__step button:disabled {
  cursor: default;
  opacity: 0.55;
}

.progress__n {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid var(--border-strong);
  font-size: 0.75rem;
  font-weight: 800;
  flex-shrink: 0;
}

.progress__step.is-done .progress__n {
  background: var(--brand);
  border-color: var(--brand);
  color: var(--white);
}

.progress__step.is-current button {
  color: var(--brand);
}

.progress__step.is-current .progress__n {
  border-color: var(--brand);
  color: var(--brand);
}

.progress__label {
  display: none;
}

@media (min-width: 620px) {
  .progress__label {
    display: inline;
  }
}
</style>
