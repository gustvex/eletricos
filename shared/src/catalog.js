/**
 * Catalogo de equipamentos, problemas e opcoes do orcamento.
 * O front monta o passo a passo a partir daqui e o back valida o lead
 * contra as mesmas listas, entao nao existe divergencia entre os dois.
 */

/** Equipamentos atendidos (os tres do cartao). */
export const vehicles = [
  {
    id: 'bicicleta',
    label: 'Bicicleta elétrica',
    short: 'Bike elétrica',
    emoji: '🚲',
    description: 'Motor de roda ou central, bateria, controlador, freios e parte ciclística.',
    examples: 'Caloi E-Vibe, Sense, Oggi, Shineray, e-bikes de entrega',
  },
  {
    id: 'patinete',
    label: 'Patinete elétrico',
    short: 'Patinete',
    emoji: '🛴',
    description: 'Dobradiça, coluna, pneus, bateria, controlador e display.',
    examples: 'Xiaomi M365/Pro, Ninebot, Foston, Multilaser, Two Dogs',
  },
  {
    id: 'scooter',
    label: 'Scooter elétrica',
    short: 'Scooter',
    emoji: '🛵',
    description: 'Motor, bateria de lítio ou chumbo, chicote elétrico, freios e suspensão.',
    examples: 'Shineray, Mottu/Watts, Super Soco, scooters de entrega',
  },
]

/**
 * Problemas mais comuns na bancada. A ordem importa: os primeiros sao os
 * que mais aparecem em oficina de eletrica leve.
 * `vehicles: null` = vale para todos os equipamentos.
 */
export const problems = [
  {
    id: 'nao-liga',
    label: 'Não liga / sem energia',
    hint: 'Aperta o botão e não acontece nada, ou liga e desliga sozinha.',
    emoji: '⚡',
    vehicles: null,
  },
  {
    id: 'bateria',
    label: 'Bateria não carrega ou dura pouco',
    hint: 'Autonomia caiu, não completa a carga ou o carregador esquenta demais.',
    emoji: '🔋',
    vehicles: null,
  },
  {
    id: 'perda-de-forca',
    label: 'Perda de força / desliga na subida',
    hint: 'Não sustenta velocidade, corta a aceleração ou trava em ladeira.',
    emoji: '📉',
    vehicles: null,
  },
  {
    id: 'motor',
    label: 'Motor com barulho ou travando',
    hint: 'Ruído, estalo, trepidação ou roda travada.',
    emoji: '⚙️',
    vehicles: null,
  },
  {
    id: 'controlador',
    label: 'Controlador / módulo queimado',
    hint: 'Cheiro de queimado, fusível estourando ou comportamento aleatório.',
    emoji: '🧠',
    vehicles: null,
  },
  {
    id: 'acelerador',
    label: 'Acelerador não responde',
    hint: 'Manopla ou gatilho sem resposta, falhando ou acelerando sozinho.',
    emoji: '🎛️',
    vehicles: null,
  },
  {
    id: 'display',
    label: 'Display / painel com erro',
    hint: 'Código de erro na tela, painel apagado ou marcando errado.',
    emoji: '📟',
    vehicles: null,
  },
  {
    id: 'freios',
    label: 'Freio fraco, rangendo ou travado',
    hint: 'Pastilha, disco, cabo, freio elétrico ou sangria do sistema hidráulico.',
    emoji: '🛑',
    vehicles: null,
  },
  {
    id: 'pneu',
    label: 'Pneu furado / troca de pneu ou câmara',
    hint: 'Furo, pneu careca, câmara ou conversão para pneu tubeless.',
    emoji: '🛞',
    vehicles: null,
  },
  {
    id: 'eletrica',
    label: 'Parte elétrica: luz, buzina, chicote',
    hint: 'Farol, seta, buzina, fiação com mau contato ou emenda mal feita.',
    emoji: '💡',
    vehicles: null,
  },
  {
    id: 'dobradica',
    label: 'Dobradiça / coluna com folga',
    hint: 'Guidão balançando, coluna bamba ou trava da dobra sem firmeza.',
    emoji: '🔩',
    vehicles: ['patinete'],
  },
  {
    id: 'transmissao',
    label: 'Corrente, câmbio ou pedivela',
    hint: 'Corrente pulando, câmbio desregulado ou pedal com folga.',
    emoji: '🔗',
    vehicles: ['bicicleta'],
  },
  {
    id: 'suspensao',
    label: 'Suspensão e rolamentos',
    hint: 'Batendo no fim de curso, vazando óleo ou com barulho na direção.',
    emoji: '🪛',
    vehicles: ['bicicleta', 'scooter'],
  },
  {
    id: 'revisao',
    label: 'Revisão geral preventiva',
    hint: 'Check-up completo: elétrica, freios, torques, pneus e bateria.',
    emoji: '🧰',
    vehicles: null,
  },
  {
    id: 'upgrade',
    label: 'Upgrade / melhoria de desempenho',
    hint: 'Troca de bateria, upgrade de controlador, pneus ou iluminação.',
    emoji: '🚀',
    vehicles: null,
  },
  {
    id: 'outro',
    label: 'Outro problema',
    hint: 'Conta o que está acontecendo que a gente identifica.',
    emoji: '💬',
    vehicles: null,
  },
]

/** Quando o cliente precisa do equipamento de volta. */
export const urgencies = [
  { id: 'normal', label: 'Sem pressa', detail: 'Posso aguardar o prazo normal da oficina.' },
  { id: 'rapido', label: 'O quanto antes', detail: 'Preciso voltar a usar nos próximos dias.' },
  { id: 'urgente', label: 'Urgente — uso para trabalhar', detail: 'Uso para trabalho/entregas, cada dia parado é prejuízo.' },
]

/** Como o equipamento chega ate a oficina. */
export const logistics = [
  { id: 'levar', label: 'Eu levo até a oficina', detail: 'Combinamos um horário pelo WhatsApp.' },
  { id: 'buscar', label: 'Prefiro busca e entrega', detail: 'Buscamos e devolvemos no seu endereço (consulte a taxa por região).' },
  { id: 'domicilio', label: 'Atendimento no local', detail: 'Reparos simples podem ser resolvidos no seu endereço.' },
]

/** Servicos exibidos na home, espelhando o cartao de visita. */
export const serviceGroups = [
  {
    id: 'bicicleta',
    title: 'Bicicletas elétricas',
    emoji: '🚲',
    items: [
      'Diagnóstico elétrico completo',
      'Bateria: teste, recuperação e troca de células',
      'Motor, controlador e sensor de pedal',
      'Freios, câmbio, corrente e rolamentos',
      'Revisão preventiva e conversão de kit elétrico',
    ],
  },
  {
    id: 'patinete',
    title: 'Patinetes elétricos',
    emoji: '🛴',
    items: [
      'Patinete que não liga ou perde força',
      'Troca de bateria, BMS e carregador',
      'Display, acelerador e chicote elétrico',
      'Pneus, câmaras e conversão tubeless',
      'Dobradiça, coluna e folgas na direção',
    ],
  },
  {
    id: 'scooter',
    title: 'Scooters elétricas',
    emoji: '🛵',
    items: [
      'Motor, controlador e chave geral',
      'Baterias de lítio e chumbo-ácido',
      'Freios, suspensão e parte ciclística',
      'Farol, seta, buzina e alarme',
      'Preparação para uso em entregas',
    ],
  },
]

/** Helpers usados pelo front e pelas validacoes do back. */
export const findVehicle = (id) => vehicles.find((v) => v.id === id) || null
export const findProblem = (id) => problems.find((p) => p.id === id) || null
export const findUrgency = (id) => urgencies.find((u) => u.id === id) || null
export const findLogistic = (id) => logistics.find((l) => l.id === id) || null

/** Problemas validos para um equipamento (os gerais + os especificos dele). */
export const problemsForVehicle = (vehicleId) =>
  problems.filter((p) => !p.vehicles || (vehicleId && p.vehicles.includes(vehicleId)))

export const catalog = { vehicles, problems, urgencies, logistics, serviceGroups }

export default catalog
