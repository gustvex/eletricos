<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import BaseButton from '../ui/BaseButton.vue'
import IconWhatsapp from '../ui/IconWhatsapp.vue'
import { useCatalogStore } from '../../stores/catalog.js'
import { useQuoteStore } from '../../stores/quote.js'
import { trackWhatsappClick } from '../../utils/analytics.js'
import { isOpenNow } from '../../utils/hours.js'

const catalog = useCatalogStore()
const quote = useQuoteStore()
const { form, message, whatsappUrl, selectedVehicle, selectedProblem, sent } = storeToRefs(quote)

const copied = ref(false)
const openNow = computed(() => isOpenNow())

const rows = computed(() =>
  [
    { label: 'Equipamento', value: selectedVehicle.value?.label },
    { label: 'Marca/modelo', value: form.value.brandModel },
    { label: 'Problema', value: selectedProblem.value?.label },
    { label: 'Prazo', value: catalog.urgencies.find((u) => u.id === form.value.urgency)?.label },
    { label: 'Atendimento', value: catalog.logistics.find((l) => l.id === form.value.logistic)?.label },
    { label: 'Bairro', value: form.value.neighborhood },
    { label: 'Nome', value: form.value.name },
  ].filter((row) => row.value),
)

/**
 * O href já está pronto no botão, então o navegador abre o WhatsApp no
 * mesmo gesto do clique. O registro do lead sai em paralelo — se falhar,
 * o cliente chega no WhatsApp do mesmo jeito.
 */
function handleSend() {
  trackWhatsappClick('orcamento-final', {
    vehicle: form.value.vehicle,
    problem: form.value.problem,
  })
  quote.submit()
}

async function copyMessage() {
  try {
    await navigator.clipboard.writeText(message.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2500)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div class="summary">
    <dl class="summary__rows">
      <div v-for="row in rows" :key="row.label" class="summary__row">
        <dt>{{ row.label }}</dt>
        <dd>{{ row.value }}</dd>
      </div>
    </dl>

    <div v-if="form.description" class="summary__description">
      <h3>Seu relato</h3>
      <p>{{ form.description }}</p>
    </div>

    <section class="preview" aria-labelledby="preview-titulo">
      <h3 id="preview-titulo">Mensagem que será enviada</h3>
      <pre class="preview__text">{{ message }}</pre>
      <button type="button" class="preview__copy" @click="copyMessage">
        {{ copied ? '✓ Copiado' : 'Copiar mensagem' }}
      </button>
    </section>

    <div class="send">
      <BaseButton
        variant="whats"
        size="lg"
        block
        :href="whatsappUrl"
        @click="handleSend"
      >
        <template #icon><IconWhatsapp :size="24" /></template>
        Enviar para {{ catalog.business.owner }} no WhatsApp
      </BaseButton>

      <p class="send__note">
        {{
          openNow
            ? 'Estamos atendendo agora — a resposta costuma sair em poucos minutos.'
            : 'Fora do horário de atendimento. Pode mandar assim mesmo: respondemos assim que abrir.'
        }}
      </p>
    </div>

    <p v-if="sent" class="sent" role="status">
      Abrimos o WhatsApp com a sua mensagem. Não abriu?
      <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer">clique aqui</a>
      ou copie o texto acima e mande para
      <strong>{{ catalog.business.whatsapp.display }}</strong>.
    </p>

    <button type="button" class="restart" @click="quote.reset()">
      Começar um novo orçamento
    </button>
  </div>
</template>

<style scoped>
.summary {
  display: grid;
  /* minmax(0, 1fr) em vez de 1fr: sem isso os filhos herdam min-width auto
     e um valor longo (ex.: "Bateria não carrega ou dura pouco") estica a
     coluna além da tela no celular. */
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-5);
}

.summary__rows {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-2);
  margin: 0;
}

.summary__row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 1px dashed var(--border);
}

.summary__row dt {
  min-width: 0;
  font-size: var(--step--1);
  font-weight: 600;
  color: var(--text-muted);
}

.summary__row dd {
  min-width: 0;
  margin: 0;
  font-weight: 700;
  text-align: right;
}

.summary__description h3,
.preview h3 {
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: var(--space-2);
}

.summary__description p {
  padding: var(--space-3);
  border-left: 3px solid var(--brand);
  background: var(--ink-50);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  font-size: 0.95rem;
}

.preview__text {
  margin: 0;
  padding: var(--space-4);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--ink-50);
  font-family: var(--font-sans);
  font-size: 0.88rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 260px;
  overflow-y: auto;
}

.preview__copy {
  margin-top: var(--space-2);
  padding: 0;
  background: none;
  border: none;
  color: var(--brand);
  font-size: var(--step--1);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.send__note {
  margin-top: var(--space-3);
  text-align: center;
  font-size: var(--step--1);
  color: var(--text-muted);
}

.sent {
  padding: var(--space-4);
  border: 1px solid var(--whats-500);
  border-radius: var(--radius);
  background: rgb(37 211 102 / 10%);
  font-size: var(--step--1);
}

.restart {
  justify-self: center;
  padding: 0;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: var(--step--1);
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
