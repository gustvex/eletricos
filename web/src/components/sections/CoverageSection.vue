<script setup>
import { computed } from 'vue'

import BaseButton from '../ui/BaseButton.vue'
import IconWhatsapp from '../ui/IconWhatsapp.vue'
import { useCatalogStore } from '../../stores/catalog.js'
import { useWhatsapp } from '../../composables/useWhatsapp.js'

const catalog = useCatalogStore()
const business = computed(() => catalog.business)
const { url, open } = useWhatsapp('Queria saber se vocês atendem meu bairro.')
</script>

<template>
  <section id="atendimento" class="section section--soft">
    <div class="container coverage">
      <div class="coverage__main">
        <p class="eyebrow">Atendimento</p>
        <h2>Levamos e buscamos na {{ business.location.region }}</h2>
        <p class="text-muted">
          Não precisa carregar patinete no ônibus nem colocar a bike no carro de alguém.
          Combine pelo WhatsApp: buscamos, consertamos e devolvemos. Reparos simples podem ser
          resolvidos no seu endereço.
        </p>

        <ul class="coverage__list" aria-label="Bairros atendidos">
          <li v-for="area in business.location.coverage" :key="area">{{ area }}</li>
        </ul>

        <p class="coverage__note">
          Seu bairro não está na lista? Quase sempre dá para atender — é só perguntar.
        </p>

        <BaseButton variant="whats" :href="url" @click="open('atendimento')">
          <template #icon><IconWhatsapp :size="20" /></template>
          Consultar meu bairro
        </BaseButton>
      </div>

      <aside class="coverage__side">
        <div class="card info">
          <h3>Horário de atendimento</h3>
          <ul class="info__hours">
            <li v-for="item in business.hours" :key="item.days">
              <span>{{ item.days }}</span>
              <strong>{{ item.time }}</strong>
            </li>
          </ul>
        </div>

        <div class="card info">
          <h3>Formas de pagamento</h3>
          <ul class="info__payment">
            <li v-for="method in business.guarantees.payment" :key="method">{{ method }}</li>
          </ul>
          <p class="text-muted info__small">
            O valor é combinado antes. Nada de acréscimo na hora de retirar.
          </p>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.coverage {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-6);
  align-items: start;
}

.coverage__main h2 {
  margin-block: var(--space-3) var(--space-3);
}

.coverage__list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-block: var(--space-5) var(--space-3);
}

.coverage__list li {
  padding: 0.4rem 0.9rem;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-pill);
  background: var(--surface);
  font-size: var(--step--1);
  font-weight: 600;
}

.coverage__note {
  margin-bottom: var(--space-4);
  font-size: var(--step--1);
  color: var(--text-muted);
}

.coverage__side {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-4);
}

.info h3 {
  font-size: 1rem;
  margin-bottom: var(--space-3);
}

.info__hours {
  display: grid;
  gap: var(--space-2);
}

.info__hours li {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 1px dashed var(--border);
  font-size: 0.92rem;
  color: var(--text-muted);
}

.info__hours li:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info__hours strong {
  color: var(--text);
}

.info__payment {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.info__payment li {
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-sm);
  background: var(--ink-100);
  font-size: var(--step--1);
  font-weight: 600;
}

.info__small {
  margin-top: var(--space-3);
  font-size: var(--step--1);
}

@media (min-width: 900px) {
  .coverage {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.9fr);
    gap: var(--space-7);
  }
}
</style>
