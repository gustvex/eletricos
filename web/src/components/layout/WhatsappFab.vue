<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import IconWhatsapp from '../ui/IconWhatsapp.vue'
import { useWhatsapp } from '../../composables/useWhatsapp.js'
import { isOpenNow } from '../../utils/hours.js'

/**
 * Botao flutuante do WhatsApp.
 * So aparece depois que a pessoa rola um pouco, para nao competir com o
 * CTA principal do topo, e some quando ja esta na tela de orcamento.
 */
const { url, open } = useWhatsapp('Vi o site e quero tirar uma dúvida.')

const visible = ref(false)
const openNow = computed(() => isOpenNow())

const onScroll = () => {
  visible.value = window.scrollY > 420
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="fab">
    <a
      v-show="visible"
      class="fab"
      :href="url"
      target="_blank"
      rel="noopener noreferrer"
      @click="open('botao-flutuante')"
    >
      <IconWhatsapp :size="26" />
      <span class="fab__label">
        <strong>Falar no WhatsApp</strong>
        <small>{{ openNow ? 'Respondemos agora' : 'Deixe sua mensagem' }}</small>
      </span>
      <span v-if="openNow" class="fab__pulse" aria-hidden="true"></span>
    </a>
  </Transition>
</template>

<style scoped>
.fab {
  position: fixed;
  right: clamp(1rem, 4vw, 2rem);
  bottom: clamp(1rem, 4vw, 2rem);
  z-index: 90;
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0.8rem 1.1rem;
  background: var(--whats-500);
  color: #05310f;
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-whats);
  text-decoration: none;
  font-weight: 800;
}

.fab:hover {
  background: var(--whats-600);
}

.fab__label {
  display: none;
  flex-direction: column;
  line-height: 1.15;
}

.fab__label small {
  font-size: 0.7rem;
  font-weight: 600;
  opacity: 0.75;
}

.fab__pulse {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 2px solid var(--whats-500);
  animation: pulse 2.4s ease-out infinite;
  pointer-events: none;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.7; }
  70% { transform: scale(1.18); opacity: 0; }
  100% { opacity: 0; }
}

.fab-enter-active,
.fab-leave-active {
  transition: opacity var(--transition), transform var(--transition);
}

.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.92);
}

@media (min-width: 560px) {
  .fab__label {
    display: flex;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fab__pulse {
    animation: none;
  }
}
</style>
