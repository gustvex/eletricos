/**
 * Rate limit em memoria. Suficiente para uma instancia unica; se o site
 * crescer para varias instancias, troque por Redis ou pelo limite do proxy.
 */
export function rateLimit({ windowMs = 60_000, max = 10 } = {}) {
  /** @type {Map<string, {count: number, resetAt: number}>} */
  const hits = new Map()

  // Limpeza periodica para o Map nao crescer indefinidamente.
  const sweep = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key)
    }
  }, windowMs)
  sweep.unref?.()

  return function rateLimitMiddleware(req, res, next) {
    const key = req.ip || req.socket.remoteAddress || 'desconhecido'
    const now = Date.now()
    const entry = hits.get(key)

    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs })
      return next()
    }

    entry.count += 1
    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
      res.set('Retry-After', String(retryAfter))
      return res.status(429).json({
        error: 'too_many_requests',
        message: 'Muitas solicitações em sequência. Tente novamente em instantes.',
      })
    }

    return next()
  }
}

export default rateLimit
