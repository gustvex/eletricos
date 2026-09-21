<script setup>
import { computed } from 'vue'

import { useCatalogStore } from '../../stores/catalog.js'

const catalog = useCatalogStore()

/**
 * Compromissos, não elogios. Cada item aqui é algo que a oficina cumpre
 * na prática — é isso que sustenta a confiança de quem nunca comprou de você.
 */
const commitments = computed(() => [
  {
    icon: '🧾',
    title: 'Nada é trocado sem sua autorização',
    text: 'Você recebe o diagnóstico, o valor fechado e o prazo antes do serviço começar. Sem surpresa na entrega.',
  },
  {
    icon: '📸',
    title: 'Você enxerga o problema',
    text: 'Mandamos foto ou vídeo da peça com defeito no WhatsApp. Se não fizer sentido consertar, a gente fala.',
  },
  {
    icon: '🔋',
    title: 'Bateria testada célula por célula',
    text: 'Muita bateria "morta" é um grupo de células ou o BMS. Testamos antes de sugerir troca completa.',
  },
  {
    icon: '🛡️',
    title: `Garantia de ${catalog.business.guarantees.warrantyDays} dias na mão de obra`,
    text: 'Peças seguem a garantia do fabricante, e tudo fica registrado na sua ordem de serviço.',
  },
  {
    icon: '🏍️',
    title: 'Prioridade para quem trabalha rodando',
    text: 'Entregador parado é dinheiro perdido. Avisa que o equipamento é de trabalho e entra na frente da fila.',
  },
  {
    icon: '🔧',
    title: 'Especialista em elétrico, não bicicletaria comum',
    text: 'Motor, controlador, BMS, display e chicote. Ferramenta e bancada preparadas para esse tipo de serviço.',
  },
])
</script>

<template>
  <section class="section section--dark why">
    <div class="container">
      <header class="head">
        <p class="eyebrow eyebrow--light">Por que confiar</p>
        <h2>Oficina elétrica trabalha diferente — e você merece saber como</h2>
        <p>
          Equipamento elétrico envolve bateria de lítio, alta corrente e eletrônica.
          Serviço mal feito vira risco. Estes são os compromissos que assumimos em cada ordem.
        </p>
      </header>

      <div class="grid commitments">
        <article v-for="item in commitments" :key="item.title" class="commitment">
          <span class="commitment__icon" aria-hidden="true">{{ item.icon }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.head {
  max-width: 62ch;
  margin-bottom: var(--space-6);
}

.head h2 {
  margin-block: var(--space-3) var(--space-3);
  color: var(--white);
}

.eyebrow--light {
  color: var(--red-400);
}

.eyebrow--light::before {
  background: var(--red-400);
}

.commitments {
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
}

.commitment {
  padding: var(--space-5);
  border: 1px solid var(--ink-700);
  border-radius: var(--radius-lg);
  background: rgb(255 255 255 / 3%);
  transition: border-color var(--transition), background-color var(--transition);
}

.commitment:hover {
  border-color: var(--red-700);
  background: rgb(255 255 255 / 6%);
}

.commitment__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-bottom: var(--space-3);
  border-radius: var(--radius);
  background: rgb(220 28 36 / 18%);
  font-size: 1.35rem;
}

.commitment h3 {
  font-size: 1.05rem;
  color: var(--white);
  margin-bottom: var(--space-2);
}

.commitment p {
  font-size: 0.93rem;
}
</style>
