// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = rateLimit.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimit.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  rateLimit.forEach((value, key) => {
    if (now > value.resetTime) {
      rateLimit.delete(key)
    }
  })
}, 60000)
