<script setup>
import { computed } from 'vue'

import QuoteWizard from '../components/quote/QuoteWizard.vue'
import IconWhatsapp from '../components/ui/IconWhatsapp.vue'
import { useCatalogStore } from '../stores/catalog.js'
import { useWhatsapp } from '../composables/useWhatsapp.js'

const catalog = useCatalogStore()
const { url, display, open } = useWhatsapp('Prefiro explicar o problema direto por aqui.')

const business = computed(() => catalog.business)
</script>

<template>
  <section class="quote">
    <div class="container container--narrow quote__head">
      <p class="eyebrow">Orçamento em 1 minuto</p>
      <h1>Conte o problema. A gente monta a mensagem.</h1>
      <p class="text-muted">
        Responda as perguntas abaixo e o site abre o WhatsApp de
        {{ business.owner }} com tudo escrito. Diagnóstico gratuito e sem compromisso.
      </p>
    </div>

    <div class="container container--narrow">
      <QuoteWizard />

      <aside class="quote__alt">
        <p>Prefere explicar do seu jeito?</p>
        <a :href="url" target="_blank" rel="noopener noreferrer" @click="open('orcamento-atalho')">
          <IconWhatsapp :size="18" />
          Falar direto no {{ display }}
        </a>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.quote {
  padding-block: clamp(2rem, 6vw, 3.5rem) clamp(3rem, 8vw, 5rem);
  background: var(--bg-soft);
}

.quote__head {
  margin-bottom: var(--space-6);
}

.quote__head h1 {
  font-size: var(--step-3);
  margin-block: var(--space-3) var(--space-3);
}

.quote__alt {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-2) var(--space-3);
  margin-top: var(--space-5);
  font-size: var(--step--1);
  color: var(--text-muted);
}

.quote__alt a {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--whats-700);
  font-weight: 700;
  text-decoration: none;
}

.quote__alt a:hover {
  text-decoration: underline;
}
</style>
