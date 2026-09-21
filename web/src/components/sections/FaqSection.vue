<script setup>
import { ref } from 'vue'

import { useCatalogStore } from '../../stores/catalog.js'

const catalog = useCatalogStore()

// Primeira pergunta aberta: é a de preço, a que todo mundo quer ver.
const openIndex = ref(0)

const toggle = (index) => {
  openIndex.value = openIndex.value === index ? -1 : index
}
</script>

<template>
  <section id="duvidas" class="section">
    <div class="container container--narrow">
      <header class="head">
        <p class="eyebrow">Dúvidas frequentes</p>
        <h2>As perguntas que todo cliente faz antes de fechar</h2>
      </header>

      <ul class="faq">
        <li v-for="(item, index) in catalog.faq" :key="item.q" class="faq__item">
          <h3>
            <button
              type="button"
              class="faq__trigger"
              :aria-expanded="openIndex === index"
              :aria-controls="`faq-${index}`"
              @click="toggle(index)"
            >
              <span>{{ item.q }}</span>
              <span class="faq__icon" :class="{ 'is-open': openIndex === index }" aria-hidden="true"></span>
            </button>
          </h3>
          <div v-show="openIndex === index" :id="`faq-${index}`" class="faq__answer">
            <p>{{ item.a }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.head {
  margin-bottom: var(--space-6);
}

.head h2 {
  margin-top: var(--space-3);
}

.faq {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-3);
}

.faq__item {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  overflow: hidden;
  transition: border-color var(--transition), box-shadow var(--transition);
}

.faq__item:hover {
  border-color: var(--border-strong);
}

.faq__item h3 {
  margin: 0;
  font-size: inherit;
}

.faq__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  width: 100%;
  padding: var(--space-4) var(--space-5);
  background: none;
  border: none;
  text-align: left;
  font-weight: 700;
  font-size: 1.02rem;
  color: var(--text);
}

.faq__icon {
  position: relative;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.faq__icon::before,
.faq__icon::after {
  content: '';
  position: absolute;
  inset: 50% 0 auto 0;
  height: 2.5px;
  border-radius: 2px;
  background: var(--brand);
  transform: translateY(-50%);
  transition: transform var(--transition);
}

.faq__icon::after {
  transform: translateY(-50%) rotate(90deg);
}

.faq__icon.is-open::after {
  transform: translateY(-50%) rotate(0deg);
}

.faq__answer {
  padding: 0 var(--space-5) var(--space-5);
  color: var(--text-muted);
}
</style>
