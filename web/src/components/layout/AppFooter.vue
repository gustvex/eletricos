<script setup>
import { computed } from 'vue'

import BaseLogo from '../ui/BaseLogo.vue'
import IconWhatsapp from '../ui/IconWhatsapp.vue'
import { useCatalogStore } from '../../stores/catalog.js'
import { useWhatsapp } from '../../composables/useWhatsapp.js'

const catalog = useCatalogStore()
const { url, display, tel, open } = useWhatsapp('Vim pelo rodapé do site.')

const business = computed(() => catalog.business)
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__grid">
      <div class="footer__brand">
        <BaseLogo variant="light" />
        <p>{{ business.tagline }}</p>
        <a class="footer__whats" :href="url" target="_blank" rel="noopener noreferrer" @click="open('rodape')">
          <IconWhatsapp :size="20" />
          {{ display }}
        </a>
        <a class="footer__tel" :href="tel" @click="open('rodape-telefone')">Ligar agora</a>
      </div>

      <div class="footer__col">
        <h3>Serviços</h3>
        <ul>
          <li v-for="group in catalog.serviceGroups" :key="group.id">
            {{ group.emoji }} {{ group.title }}
          </li>
        </ul>
      </div>

      <div class="footer__col">
        <h3>Atendimento</h3>
        <ul>
          <li v-for="item in business.hours" :key="item.days">
            <strong>{{ item.days }}:</strong> {{ item.time }}
          </li>
        </ul>
        <p class="footer__area">
          {{ business.location.region }} — {{ business.location.state }}
        </p>
      </div>

      <div class="footer__col">
        <h3>Pagamento</h3>
        <ul>
          <li v-for="method in business.guarantees.payment" :key="method">{{ method }}</li>
        </ul>
        <RouterLink to="/orcamento" class="footer__link">Pedir orçamento</RouterLink>
      </div>
    </div>

    <div class="container footer__bottom">
      <p>© {{ year }} {{ business.name }} — {{ business.owner }}. Todos os direitos reservados.</p>
      <p>Bicicletas, patinetes e scooters elétricas · {{ business.location.city }}/{{ business.location.state }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--ink-900);
  color: var(--text-inverse-muted);
  padding-block: var(--space-7) var(--space-5);
  /* espaço para o botão flutuante não cobrir o conteúdo final */
  padding-bottom: 6rem;
}

.footer__grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: minmax(0, 1fr);
}

.footer__brand p {
  margin-top: var(--space-3);
  max-width: 34ch;
}

.footer__whats {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
  color: var(--whats-500);
  font-weight: 800;
  font-size: 1.15rem;
  text-decoration: none;
}

.footer__tel {
  display: block;
  margin-top: var(--space-2);
  color: var(--text-inverse-muted);
  font-size: var(--step--1);
}

.footer__col h3 {
  color: var(--white);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: var(--space-3);
}

.footer__col ul {
  display: grid;
  gap: var(--space-2);
  font-size: 0.92rem;
}

.footer__col strong {
  color: var(--ink-200);
  font-weight: 600;
}

.footer__area {
  margin-top: var(--space-3);
  font-size: 0.92rem;
}

.footer__link {
  display: inline-block;
  margin-top: var(--space-3);
  color: var(--red-400);
  font-weight: 700;
}

.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-2);
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--ink-700);
  font-size: 0.8rem;
  color: var(--ink-400);
}

@media (min-width: 720px) {
  .footer__grid {
    grid-template-columns: minmax(0, 1.4fr) repeat(3, minmax(0, 1fr));
  }
}
</style>
