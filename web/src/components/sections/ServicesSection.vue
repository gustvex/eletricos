<script setup>
import BaseButton from '../ui/BaseButton.vue'
import { useCatalogStore } from '../../stores/catalog.js'

const catalog = useCatalogStore()
</script>

<template>
  <section id="servicos" class="section section--soft">
    <div class="container">
      <header class="head">
        <p class="eyebrow">Consertamos</p>
        <h2>Tudo que roda com motor elétrico leve</h2>
        <p class="text-muted">
          Da bancada elétrica à parte mecânica: um lugar só para diagnóstico, peça e mão de obra.
        </p>
      </header>

      <div class="grid services">
        <article v-for="group in catalog.serviceGroups" :key="group.id" class="service">
          <span class="service__emoji" aria-hidden="true">{{ group.emoji }}</span>
          <h3>{{ group.title }}</h3>
          <ul>
            <li v-for="item in group.items" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>

      <div class="services__cta">
        <p>Não achou o seu caso? A lista é só o mais comum — manda a sua situação que avaliamos.</p>
        <BaseButton variant="primary" to="/orcamento">Descrever meu problema</BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.head {
  max-width: 60ch;
  margin-bottom: var(--space-6);
}

.head h2 {
  margin-block: var(--space-3) var(--space-3);
}

.services {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.service {
  position: relative;
  padding: var(--space-5);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
}

.service::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 4px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  background: var(--brand);
}

.service:hover {
  transform: translateY(-4px);
  border-color: var(--red-200);
  box-shadow: var(--shadow);
}

.service__emoji {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-bottom: var(--space-3);
  border-radius: var(--radius);
  background: var(--red-50);
  font-size: 1.5rem;
}

.service h3 {
  margin-bottom: var(--space-3);
}

.service ul {
  display: grid;
  gap: var(--space-2);
  color: var(--text-muted);
  font-size: 0.95rem;
}

.service li {
  display: flex;
  gap: var(--space-2);
}

.service li::before {
  content: '✓';
  color: var(--brand);
  font-weight: 800;
  flex-shrink: 0;
}

.services__cta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-top: var(--space-6);
  padding: var(--space-5);
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius-lg);
  background: var(--surface);
}

.services__cta p {
  max-width: 52ch;
  margin: 0;
  font-weight: 600;
}
</style>
