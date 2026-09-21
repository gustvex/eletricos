<script setup>
import BaseButton from '../ui/BaseButton.vue'
import IconWhatsapp from '../ui/IconWhatsapp.vue'
import { useCatalogStore } from '../../stores/catalog.js'
import { useWhatsapp } from '../../composables/useWhatsapp.js'

const catalog = useCatalogStore()
const { url, display, open } = useWhatsapp('Quero um orçamento para o meu equipamento.')
</script>

<template>
  <section class="cta">
    <div class="container cta__inner">
      <div>
        <h2>Seu equipamento parado não conserta sozinho.</h2>
        <p>
          Monte o orçamento em menos de um minuto ou chame {{ catalog.business.owner }} direto
          no WhatsApp. O diagnóstico é gratuito.
        </p>
      </div>

      <div class="cta__actions">
        <BaseButton variant="dark" size="lg" to="/orcamento">Montar meu orçamento</BaseButton>
        <BaseButton variant="ghost" size="lg" :href="url" @click="open('cta-final')">
          <template #icon><IconWhatsapp :size="20" /></template>
          {{ display }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  padding-block: clamp(3rem, 7vw, 4.5rem);
  background: linear-gradient(135deg, var(--red-600), var(--red-500) 55%, var(--red-400));
  color: var(--white);
}

.cta__inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-5);
  align-items: center;
}

.cta h2 {
  color: var(--white);
  max-width: 22ch;
}

.cta p {
  margin-top: var(--space-3);
  max-width: 52ch;
  color: rgb(255 255 255 / 88%);
  font-size: var(--step-1);
}

.cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

@media (min-width: 900px) {
  .cta__inner {
    grid-template-columns: minmax(0, 1.3fr) auto;
    gap: var(--space-7);
  }
}
</style>
