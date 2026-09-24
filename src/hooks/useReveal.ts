import { useReducedMotion } from 'motion/react'

export function useReveal() {
  const reduceMotion = useReducedMotion()
  return reduceMotion ? {} : { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.55, ease: 'easeOut' as const } }
}
