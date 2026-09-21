/**
 * Dados do negocio.
 *
 * ESTE E O UNICO ARQUIVO QUE PRECISA SER EDITADO para trocar telefone,
 * horarios, bairros atendidos, garantia, redes sociais etc.
 * Tudo no site (header, rodape, WhatsApp, SEO/JSON-LD) le daqui.
 */

export const business = {
  /** Nome curto usado no logo e no titulo das paginas. */
  name: 'Elétricos',
  /** Nome completo usado no SEO e no JSON-LD. */
  legalName: 'Elétricos — Manutenção de Bikes, Patinetes e Scooters Elétricas',
  /** Como o cliente chama o responsavel na conversa do WhatsApp. */
  owner: 'Guilherme',
  tagline: 'Problemas com sua bike, patinete ou scooter elétrica? Nós resolvemos.',

  whatsapp: {
    /** Formato internacional, so digitos: 55 + DDD + numero. Usado no link wa.me. */
    phone: '5565999901389',
    /** Como o numero aparece na tela. */
    display: '(65) 99990-1389',
    /** Link tel: para o clique-para-ligar no celular. */
    tel: '+5565999901389',
  },

  /** Ajuste conforme a realidade da oficina. */
  hours: [
    { days: 'Segunda a sexta', time: '08h às 18h' },
    { days: 'Sábado', time: '08h às 12h' },
    { days: 'Domingo e feriados', time: 'Fechado' },
  ],
  /** Fora desse intervalo o site avisa que a resposta sai no proximo horario. */
  openingHoursRange: { start: 8, end: 18, weekdays: [1, 2, 3, 4, 5], saturday: { start: 8, end: 12 } },

  location: {
    city: 'Cuiabá',
    state: 'MT',
    region: 'Cuiabá e Várzea Grande',
    /** Deixe vazio enquanto o atendimento for a domicilio / sem loja fisica. */
    street: '',
    neighborhood: '',
    zip: '',
    /** Bairros com busca e entrega. Edite a vontade. */
    coverage: [
      'Centro',
      'Coxipó',
      'Jardim Itália',
      'Santa Rosa',
      'Goiabeiras',
      'Morada da Serra (CPA)',
      'Boa Esperança',
      'Várzea Grande',
    ],
  },

  /** Diferenciais exibidos na home. Edite os textos conforme o combinado. */
  guarantees: {
    warrantyDays: 90,
    freeDiagnosis: true,
    pickupAndDelivery: true,
    payment: ['Pix', 'Cartão em até 12x', 'Dinheiro'],
  },

  /** Marcas mais comuns no Brasil. Serve de prova social e ajuda no SEO. */
  brands: [
    'Xiaomi',
    'Ninebot / Segway',
    'Caloi E-Vibe',
    'Sense',
    'Oggi',
    'Shineray',
    'Mottu / Watts',
    'Foston',
    'Multilaser',
    'Two Dogs',
  ],

  social: {
    instagram: '',
    facebook: '',
    googleMaps: '',
  },

  /** Dominio final do site. Usado nas tags canonical/Open Graph. */
  siteUrl: 'https://eletricos.com.br',
}

export default business
