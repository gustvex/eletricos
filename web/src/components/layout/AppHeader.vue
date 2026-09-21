<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import BaseLogo from '../ui/BaseLogo.vue'
import BaseButton from '../ui/BaseButton.vue'
import IconWhatsapp from '../ui/IconWhatsapp.vue'
import { useWhatsapp } from '../../composables/useWhatsapp.js'

const route = useRoute()
const { url, display, tel, open } = useWhatsapp('Preciso de um orçamento.')

const menuOpen = ref(false)
const scrolled = ref(false)

const links = [
  { label: 'Serviços', hash: '#servicos' },
  { label: 'Como funciona', hash: '#como-funciona' },
  { label: 'Atendimento', hash: '#atendimento' },
  { label: 'Dúvidas', hash: '#duvidas' },
]

const onScroll = () => {
  scrolled.value = window.scrollY > 12
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

// Fecha o menu ao navegar e trava o scroll do fundo enquanto ele está aberto.
watch(() => route.fullPath, () => { menuOpen.value = false })
watch(menuOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})
onBeforeUnmount(() => { document.body.style.overflow = '' })
</script>

<template>
  <header class="header" :class="{ 'header--scrolled': scrolled }">
    <div class="header__inner container">
      <RouterLink to="/" class="header__logo" aria-label="Ir para a página inicial">
        <BaseLogo />
      </RouterLink>

      <nav class="header__nav" aria-label="Navegação principal">
        <RouterLink v-for="link in links" :key="link.hash" :to="{ path: '/', hash: link.hash }" class="header__link">
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="header__actions">
        <a class="header__phone" :href="tel" @click="open('header-telefone')">
          <span class="header__phone-label">Fale agora</span>
          <strong>{{ display }}</strong>
        </a>
        <BaseButton variant="whats" size="sm" :href="url" class="header__cta" @click="open('header')">
          <template #icon><IconWhatsapp :size="18" /></template>
          WhatsApp
        </BaseButton>

        <button
          class="header__burger"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="menu-mobile"
          @click="menuOpen = !menuOpen"
        >
          <span class="sr-only">{{ menuOpen ? 'Fechar menu' : 'Abrir menu' }}</span>
          <span class="header__burger-bars" :class="{ 'is-open': menuOpen }" aria-hidden="true">
            <i></i><i></i><i></i>
          </span>
        </button>
      </div>
    </div>

    <div v-show="menuOpen" id="menu-mobile" class="drawer">
      <nav class="drawer__nav container" aria-label="Navegação mobile">
        <RouterLink
          v-for="link in links"
          :key="link.hash"
          :to="{ path: '/', hash: link.hash }"
          class="drawer__link"
        >
          {{ link.label }}
        </RouterLink>
        <RouterLink to="/orcamento" class="drawer__link drawer__link--highlight">
          Pedir orçamento
        </RouterLink>
        <BaseButton variant="whats" :href="url" block @click="open('menu-mobile')">
          <template #icon><IconWhatsapp :size="20" /></template>
          Chamar no WhatsApp
        </BaseButton>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgb(255 255 255 / 92%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid transparent;
  transition: box-shadow var(--transition), border-color var(--transition);
}

.header--scrolled {
  border-bottom-color: var(--border);
  box-shadow: var(--shadow-sm);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  min-height: var(--header-height);
}

.header__logo {
  text-decoration: none;
  flex-shrink: 0;
}

.header__nav {
  display: none;
  gap: var(--space-5);
}

.header__link {
  color: var(--ink-700);
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  padding-block: var(--space-2);
  border-bottom: 2px solid transparent;
  transition: color var(--transition), border-color var(--transition);
}

.header__link:hover {
  color: var(--brand);
  border-bottom-color: var(--brand);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.header__phone {
  display: none;
  flex-direction: column;
  line-height: 1.1;
  text-decoration: none;
  color: var(--ink-900);
}

.header__phone-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand);
}

.header__phone strong {
  font-size: 1rem;
  font-weight: 800;
}

.header__cta {
  display: none;
}

.header__burger {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  background: var(--ink-900);
  border: none;
  border-radius: var(--radius-sm);
  color: var(--white);
}

.header__burger-bars {
  display: grid;
  gap: 4px;
  width: 20px;
}

.header__burger-bars i {
  display: block;
  height: 2px;
  background: currentColor;
  border-radius: 2px;
  transition: transform var(--transition), opacity var(--transition);
}

.header__burger-bars.is-open i:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.header__burger-bars.is-open i:nth-child(2) {
  opacity: 0;
}

.header__burger-bars.is-open i:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

.drawer {
  border-top: 1px solid var(--border);
  background: var(--white);
  box-shadow: var(--shadow);
}

.drawer__nav {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-2);
  padding-block: var(--space-4) var(--space-5);
}

.drawer__link {
  padding: var(--space-3) var(--space-2);
  border-radius: var(--radius-sm);
  color: var(--ink-800);
  font-weight: 700;
  text-decoration: none;
}

.drawer__link:hover {
  background: var(--ink-50);
}

.drawer__link--highlight {
  color: var(--brand);
}

@media (min-width: 900px) {
  .header__nav,
  .header__phone,
  .header__cta {
    display: flex;
  }

  .header__burger {
    display: none;
  }

  .drawer {
    display: none !important;
  }
}
</style>
