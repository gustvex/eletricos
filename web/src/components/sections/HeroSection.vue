<script setup>
import { computed } from 'vue'

import BaseButton from '../ui/BaseButton.vue'
import IconWhatsapp from '../ui/IconWhatsapp.vue'
import { useCatalogStore } from '../../stores/catalog.js'
import { useWhatsapp } from '../../composables/useWhatsapp.js'
import { isOpenNow, openStatusLabel } from '../../utils/hours.js'

const catalog = useCatalogStore()
const { url, display, open } = useWhatsapp('Quero falar sobre um conserto.')

const business = computed(() => catalog.business)
const openNow = computed(() => isOpenNow())
const statusLabel = computed(() => openStatusLabel())

const highlights = computed(() => [
  { icon: '🔎', label: 'Diagnóstico gratuito' },
  { icon: '🛡️', label: `Garantia de ${business.value.guarantees.warrantyDays} dias` },
  { icon: '🚚', label: 'Busca e entrega na região' },
  { icon: '💳', label: 'Pix ou cartão em até 12x' },
])
</script>

<template>
  <section class="hero">
    <div class="hero__glow" aria-hidden="true"></div>

    <div class="container hero__inner">
      <div class="hero__content">
        <p class="hero__status" :class="{ 'is-open': openNow }">
          <span class="hero__dot" aria-hidden="true"></span>
          {{ statusLabel }}
        </p>

        <h1>
          Problemas com sua bike, patinete ou scooter elétrica?
          <span class="hero__accent">Nós resolvemos.</span>
        </h1>

        <p class="hero__lead">
          Oficina especializada em equipamentos elétricos leves em
          {{ business.location.region }}. A gente diagnostica, explica o que deu errado e
          <strong>só coloca a mão depois que você aprovar o orçamento</strong>.
        </p>

        <div class="hero__actions">
          <BaseButton variant="whats" size="lg" to="/orcamento">
            <template #icon><IconWhatsapp :size="22" /></template>
            Montar meu orçamento
          </BaseButton>
          <BaseButton variant="ghost" size="lg" :href="url" @click="open('hero')">
            Chamar {{ business.owner }} agora
          </BaseButton>
        </div>

        <p class="hero__phone">
          Prefere ligar? <a :href="business.whatsapp.tel">{{ display }}</a>
        </p>

        <ul class="hero__highlights">
          <li v-for="item in highlights" :key="item.label">
            <span aria-hidden="true">{{ item.icon }}</span> {{ item.label }}
          </li>
        </ul>
      </div>

      <!-- Prévia do que o cliente recebe: deixa claro que o site já monta a mensagem. -->
      <aside class="hero__preview" aria-label="Exemplo da mensagem enviada no WhatsApp">
        <div class="preview">
          <header class="preview__bar">
            <IconWhatsapp :size="18" />
            <span>{{ business.owner }} · {{ display }}</span>
          </header>
          <div class="preview__body">
            <div class="bubble">
              <p>Olá, {{ business.owner }}! Vim pelo site e queria um orçamento. ⚡</p>
              <p>🛴 <strong>Equipamento:</strong> Patinete elétrico</p>
              <p>🏷️ <strong>Marca/modelo:</strong> Xiaomi M365 Pro</p>
              <p>🔋 <strong>Problema:</strong> Bateria não carrega ou dura pouco</p>
              <p>📝 <strong>Detalhes:</strong> Carrega até 50% e desliga na subida.</p>
              <p>📍 <strong>Atendimento:</strong> Prefiro busca e entrega</p>
              <span class="bubble__time">agora ✓✓</span>
            </div>
            <p class="preview__note">
              O site monta essa mensagem sozinho com as suas respostas. Você só confere e envia.
            </p>
          </div>
        </div>
      </aside>
    </div>

    <ul class="hero__equipments container" aria-label="Equipamentos atendidos">
      <li v-for="vehicle in catalog.vehicles" :key="vehicle.id">
        <span aria-hidden="true">{{ vehicle.emoji }}</span>
        {{ vehicle.label }}
      </li>
    </ul>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  background: var(--ink-900);
  color: var(--white);
  padding-block: clamp(2.5rem, 7vw, 5rem) clamp(2rem, 5vw, 3rem);
}

.hero__glow {
  position: absolute;
  inset: -30% -10% auto -20%;
  height: 120%;
  background:
    radial-gradient(60% 55% at 15% 25%, rgb(220 28 36 / 42%) 0%, transparent 65%),
    radial-gradient(45% 45% at 85% 10%, rgb(220 28 36 / 18%) 0%, transparent 70%);
  pointer-events: none;
}

.hero__inner {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 3.5rem);
  align-items: center;
}

.hero__status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0.4rem 0.9rem;
  margin-bottom: var(--space-4);
  border: 1px solid var(--ink-700);
  border-radius: var(--radius-pill);
  background: rgb(255 255 255 / 5%);
  font-size: var(--step--1);
  font-weight: 600;
  color: var(--ink-200);
}

.hero__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ink-400);
}

.hero__status.is-open .hero__dot {
  background: var(--whats-500);
  box-shadow: 0 0 0 4px rgb(37 211 102 / 22%);
}

.hero__accent {
  display: block;
  color: var(--red-400);
}

.hero__lead {
  margin-top: var(--space-4);
  max-width: 52ch;
  font-size: var(--step-1);
  color: var(--ink-200);
}

.hero__lead strong {
  color: var(--white);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-5);
}

/* Em celular estreito os dois CTAs ocupam a largura toda, empilhados.
   Acima disso eles dividem a linha. */
.hero__actions > * {
  flex: 1 1 240px;
  min-width: 0;
}

.hero__phone {
  margin-top: var(--space-4);
  color: var(--ink-400);
  font-size: var(--step--1);
}

.hero__phone a {
  color: var(--white);
  font-weight: 700;
}

.hero__highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: var(--space-3);
  margin-top: var(--space-6);
  font-size: var(--step--1);
  color: var(--ink-200);
}

.hero__highlights li {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  border: 1px solid var(--ink-700);
  border-radius: var(--radius);
  background: rgb(255 255 255 / 4%);
}

/* --- prévia da conversa --- */
.preview {
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: #0b141a;
  border: 1px solid var(--ink-700);
  box-shadow: var(--shadow-lg);
  max-width: 420px;
  margin-inline: auto;
}

.preview__bar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--whats-700);
  color: var(--white);
  font-weight: 700;
  font-size: var(--step--1);
}

.preview__body {
  padding: var(--space-4);
  background-image:
    radial-gradient(circle at 20% 20%, rgb(255 255 255 / 3%) 1px, transparent 1px),
    radial-gradient(circle at 70% 60%, rgb(255 255 255 / 3%) 1px, transparent 1px);
  background-size: 28px 28px;
}

.bubble {
  position: relative;
  padding: var(--space-4);
  border-radius: 14px 14px 4px 14px;
  background: #005c4b;
  color: #e9edef;
  font-size: 0.88rem;
  line-height: 1.5;
  box-shadow: var(--shadow-sm);
}

.bubble p + p {
  margin-top: 0.35rem;
}

.bubble strong {
  color: #fff;
  font-weight: 700;
}

.bubble__time {
  display: block;
  margin-top: var(--space-2);
  text-align: right;
  font-size: 0.68rem;
  color: #8fb8ab;
}

.preview__note {
  margin-top: var(--space-4);
  font-size: var(--step--1);
  color: var(--ink-400);
  text-align: center;
}

/* --- faixa de equipamentos --- */
.hero__equipments {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3) var(--space-6);
  justify-content: center;
  margin-top: clamp(2rem, 5vw, 3rem);
  padding-top: var(--space-5);
  border-top: 1px solid var(--ink-700);
  font-weight: 700;
  font-size: var(--step--1);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ink-300);
}

.hero__equipments li {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

@media (min-width: 980px) {
  .hero__inner {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  }
}
</style>
