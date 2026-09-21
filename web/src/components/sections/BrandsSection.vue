<script setup>
import { useCatalogStore } from '../../stores/catalog.js'

const catalog = useCatalogStore()
</script>

<template>
  <section class="brands">
    <div class="container">
      <p class="brands__label">Atendemos as marcas que mais rodam por aqui</p>
      <ul class="brands__list">
        <li v-for="brand in catalog.business.brands" :key="brand">{{ brand }}</li>
      </ul>
      <p class="brands__note">
        Também atendemos equipamentos importados e genéricos, inclusive os sem assistência no Brasil.
      </p>
    </div>
  </section>
</template>

<style scoped>
.brands {
  padding-block: var(--space-6);
  border-block: 1px solid var(--border);
  background: var(--surface);
}

.brands__label {
  text-align: center;
  font-size: var(--step--1);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.brands__list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3) var(--space-5);
  margin-top: var(--space-4);
}

.brands__list li {
  font-size: clamp(1rem, 2.2vw, 1.25rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--ink-600);
  transition: color var(--transition);
}

.brands__list li:hover {
  color: var(--brand);
}

.brands__note {
  margin-top: var(--space-4);
  text-align: center;
  font-size: var(--step--1);
  color: var(--text-muted);
}
</style>
