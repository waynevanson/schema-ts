const basket = {}

export const hash = (): string => {
  const n = Math.random().toString(36).substring(2, 15)
  return n in basket ? hash() : (basket[n] = true) && n
}
