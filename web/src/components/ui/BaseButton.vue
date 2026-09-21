<script setup>
/**
 * Botao unico do site. Renderiza <a> quando recebe href/to e <button>
 * caso contrario — isso mantem o link do WhatsApp como link de verdade
 * (abre em nova aba, da para copiar, funciona com o teclado).
 */
defineProps({
  variant: { type: String, default: 'primary' }, // primary | whats | ghost | dark
  size: { type: String, default: 'md' }, // sm | md | lg
  href: { type: String, default: '' },
  to: { type: [String, Object], default: null },
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
})
</script>

<template>
  <RouterLink
    v-if="to"
    :to="to"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block }]"
  >
    <slot name="icon" />
    <span><slot /></span>
  </RouterLink>

  <a
    v-else-if="href"
    :href="href"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block }]"
    target="_blank"
    rel="noopener noreferrer"
  >
    <slot name="icon" />
    <span><slot /></span>
  </a>

  <button
    v-else
    :type="type"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block }]"
    :disabled="disabled"
  >
    <slot name="icon" />
    <span><slot /></span>
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 0.85rem 1.5rem;
  border: 2px solid transparent;
  border-radius: var(--radius-pill);
  font-weight: 700;
  font-size: var(--step-0);
  line-height: 1.2;
  text-decoration: none;
  /* Rotulo pode quebrar: em telas de 320px labels como "Enviar para Guilherme
     no WhatsApp" nao cabem em uma linha. `balance` divide as linhas de forma
     equilibrada em vez de deixar uma palavra sozinha embaixo. */
  white-space: normal;
  text-wrap: balance;
  transition: transform var(--transition), box-shadow var(--transition),
    background-color var(--transition), border-color var(--transition), color var(--transition);
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn--sm {
  padding: 0.55rem 1rem;
  font-size: var(--step--1);
}

.btn--lg {
  padding: 1.05rem 2rem;
  font-size: var(--step-1);
}

.btn--block {
  width: 100%;
}

.btn--primary {
  background: var(--brand);
  color: var(--brand-contrast);
  box-shadow: var(--shadow-brand);
}

.btn--primary:hover:not(:disabled) {
  background: var(--brand-hover);
}

.btn--whats {
  background: var(--whats-500);
  color: #05310f;
  box-shadow: var(--shadow-whats);
}

.btn--whats:hover:not(:disabled) {
  background: var(--whats-600);
}

.btn--dark {
  background: var(--ink-900);
  color: var(--white);
}

.btn--dark:hover:not(:disabled) {
  background: var(--ink-700);
}

.btn--ghost {
  background: transparent;
  border-color: currentColor;
  color: inherit;
  box-shadow: none;
}

.btn--ghost:hover:not(:disabled) {
  background: rgb(255 255 255 / 10%);
}

:deep(svg) {
  flex-shrink: 0;
}
</style>
