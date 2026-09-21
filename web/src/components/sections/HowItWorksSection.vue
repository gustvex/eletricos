<script setup>
const steps = [
  {
    n: '01',
    title: 'Você conta o problema',
    text: 'Responde 4 perguntas rápidas aqui no site. Leva menos de um minuto e não precisa saber termo técnico.',
  },
  {
    n: '02',
    title: 'A mensagem chega pronta',
    text: 'O site abre o WhatsApp com equipamento, problema e detalhes já escritos. Você só confere e envia.',
  },
  {
    n: '03',
    title: 'Diagnóstico e orçamento fechado',
    text: 'Avaliamos o equipamento sem cobrar nada e mandamos o valor fechado, com prazo e o que será trocado.',
  },
  {
    n: '04',
    title: 'Conserto com garantia',
    text: 'Aprovou, a gente executa. Você recebe de volta funcionando, com garantia do serviço por escrito.',
  },
]
</script>

<template>
  <section id="como-funciona" class="section">
    <div class="container">
      <header class="head">
        <p class="eyebrow">Como funciona</p>
        <h2>Do problema ao orçamento em 4 passos</h2>
        <p class="text-muted">
          Sem formulário longo, sem esperar e-mail. Tudo acontece na conversa do WhatsApp.
        </p>
      </header>

      <ol class="steps">
        <li v-for="step in steps" :key="step.n" class="step">
          <span class="step__n" aria-hidden="true">{{ step.n }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.head {
  max-width: 60ch;
  margin-bottom: var(--space-6);
}

.head h2 {
  margin-block: var(--space-3) var(--space-3);
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: var(--space-5);
  padding: 0;
  list-style: none;
  counter-reset: step;
}

.step {
  position: relative;
  padding-top: var(--space-5);
  border-top: 3px solid var(--border);
  transition: border-color var(--transition);
}

.step:hover {
  border-top-color: var(--brand);
}

.step__n {
  display: block;
  font-size: 2.25rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--red-200);
  margin-bottom: var(--space-2);
}

.step:hover .step__n {
  color: var(--brand);
}

.step h3 {
  font-size: var(--step-1);
  margin-bottom: var(--space-2);
}

.step p {
  color: var(--text-muted);
  font-size: 0.95rem;
}
</style>
