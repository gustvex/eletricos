import { business } from '@eletricos/shared/business'

/**
 * Diz se a oficina esta aberta agora.
 * Serve para o site prometer o certo: dentro do horario, "resposta rapida";
 * fora dele, "respondemos no proximo horario" — o que evita frustracao.
 */
export function isOpenNow(now = new Date()) {
  const { weekdays, start, end, saturday } = business.openingHoursRange
  const day = now.getDay()
  const hour = now.getHours() + now.getMinutes() / 60

  if (weekdays.includes(day)) return hour >= start && hour < end
  if (day === 6 && saturday) return hour >= saturday.start && hour < saturday.end
  return false
}

export function openStatusLabel(now = new Date()) {
  if (isOpenNow(now)) return 'Aberto agora · resposta rápida no WhatsApp'
  return 'Fora do horário · mande a mensagem que respondemos assim que abrir'
}
