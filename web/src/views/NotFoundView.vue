<script setup>
import BaseButton from '../components/ui/BaseButton.vue'
import IconWhatsapp from '../components/ui/IconWhatsapp.vue'
import { useWhatsapp } from '../composables/useWhatsapp.js'

const { url, display, open } = useWhatsapp('Não achei o que procurava no site.')
</script>

<template>
  <section class="notfound">
    <div class="container container--narrow">
      <p class="notfound__code" aria-hidden="true">404</p>
      <h1>Essa página saiu para conserto.</h1>
      <p class="text-muted">
        O endereço não existe (ou mudou). Mas o importante continua funcionando:
        seu orçamento sai em um minuto.
      </p>

      <div class="notfound__actions">
        <BaseButton variant="primary" to="/">Voltar para a home</BaseButton>
        <BaseButton variant="whats" :href="url" @click="open('404')">
          <template #icon><IconWhatsapp :size="20" /></template>
          {{ display }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.notfound {
  padding-block: clamp(3rem, 10vw, 6rem);
  text-align: center;
}

.notfound__code {
  font-size: clamp(4rem, 18vw, 9rem);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.05em;
  color: var(--red-100);
}

.notfound h1 {
  font-size: var(--step-3);
  margin-block: var(--space-3) var(--space-3);
}

.notfound__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
  margin-top: var(--space-5);
}
</style>
