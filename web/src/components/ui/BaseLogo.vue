<script setup>
import { computed } from 'vue'

import { useCatalogStore } from '../../stores/catalog.js'

const props = defineProps({
  variant: { type: String, default: 'dark' }, // dark = texto escuro | light = texto claro
})

const catalog = useCatalogStore()
const name = computed(() => catalog.business.name)
const isLight = computed(() => props.variant === 'light')
</script>

<template>
  <span class="logo" :class="{ 'logo--light': isLight }">
    <span class="logo__mark" aria-hidden="true">
      <svg viewBox="0 0 64 64" width="34" height="34">
        <rect width="64" height="64" rx="14" fill="currentColor" />
        <path d="M36.5 8 20 34h10l-4.5 22L46 28H34l6-20z" fill="#fff" />
      </svg>
    </span>
    <span class="logo__text">
      {{ name }}
      <small>bike · patinete · scooter</small>
    </span>
  </span>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--brand);
  text-decoration: none;
}

.logo__mark {
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.logo__text {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
  font-weight: 900;
  font-size: 1.25rem;
  letter-spacing: -0.03em;
  color: var(--ink-900);
  text-transform: uppercase;
}

.logo__text small {
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.logo--light .logo__text {
  color: var(--white);
}

.logo--light .logo__text small {
  color: var(--text-inverse-muted);
}
</style>
