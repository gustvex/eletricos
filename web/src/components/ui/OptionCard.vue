<script setup>
/**
 * Opcao selecionavel do formulario.
 *
 * Por baixo e um <input type="radio"> de verdade: navega com as setas do
 * teclado, e lido corretamente por leitor de tela e funciona sem JS de apoio.
 * O visual e feito no <label> irmao.
 */
defineProps({
  name: { type: String, required: true },
  value: { type: String, required: true },
  modelValue: { type: String, default: '' },
  label: { type: String, required: true },
  hint: { type: String, default: '' },
  emoji: { type: String, default: '' },
  compact: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="option" :class="{ 'option--compact': compact, 'is-selected': modelValue === value }">
    <input
      :id="`${name}-${value}`"
      class="option__input"
      type="radio"
      :name="name"
      :value="value"
      :checked="modelValue === value"
      @change="$emit('update:modelValue', value)"
    />
    <label class="option__label" :for="`${name}-${value}`">
      <span v-if="emoji" class="option__emoji" aria-hidden="true">{{ emoji }}</span>
      <span class="option__text">
        <strong>{{ label }}</strong>
        <small v-if="hint">{{ hint }}</small>
      </span>
      <span class="option__check" aria-hidden="true"></span>
    </label>
  </div>
</template>

<style scoped>
.option {
  position: relative;
}

.option__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.option__label {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  height: 100%;
  padding: var(--space-4);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  cursor: pointer;
  transition: border-color var(--transition), background-color var(--transition),
    box-shadow var(--transition), transform var(--transition);
}

.option__label:hover {
  border-color: var(--red-200);
  transform: translateY(-2px);
}

.option__input:focus-visible + .option__label {
  outline: 3px solid var(--brand);
  outline-offset: 2px;
}

.option__input:checked + .option__label {
  border-color: var(--brand);
  background: var(--red-50);
  box-shadow: var(--shadow-sm);
}

.option__emoji {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  background: var(--ink-100);
  font-size: 1.4rem;
}

.option__input:checked + .option__label .option__emoji {
  background: var(--white);
}

.option__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.option__text strong {
  font-weight: 700;
  line-height: 1.25;
}

.option__text small {
  font-size: var(--step--1);
  color: var(--text-muted);
  line-height: 1.4;
}

.option__check {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border: 2px solid var(--border-strong);
  border-radius: 50%;
  transition: border-color var(--transition), background-color var(--transition);
}

.option__input:checked + .option__label .option__check {
  border-color: var(--brand);
  background: var(--brand);
  box-shadow: inset 0 0 0 4px var(--white);
}

.option--compact .option__label {
  padding: var(--space-3) var(--space-4);
}
</style>
