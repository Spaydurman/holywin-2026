import { motion, useReducedMotion } from 'motion/react'

const rows = 6
const rowDensity = [10, 34, 72, 72, 34, 10]

function PixelGrid({ columns, className, reducedMotion }: {
  columns: number
  className: string
  reducedMotion: boolean | null
}) {
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : 'hidden'}
      whileInView={reducedMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.2 }}
    >
      {Array.from({ length: rows * columns }, (_, index) => {
        const row = Math.floor(index / columns)
        const column = index % columns
        const filled = (column * 37 + row * 19) % 101 < rowDensity[row]

        return filled ? (
          <motion.span
            key={index}
            className="relative aspect-square w-full"
            variants={reducedMotion ? undefined : {
              hidden: { opacity: 0, scale: 0 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 0.24,
                  delay: row * 0.09 + ((column * 13) % 7) * 0.045,
                  ease: 'easeOut',
                },
              },
            }}
          >
            <span className={`absolute -inset-px ${row < rows / 2 ? 'bg-black' : 'bg-[#f7f5ed]'}`} />
          </motion.span>
        ) : <span key={index} className="aspect-square w-full" />
      })}
    </motion.div>
  )
}

export default function PixelTransition() {
  const reducedMotion = useReducedMotion()

  return (
    <div className="pointer-events-none relative z-10 h-0" aria-hidden="true">
      <PixelGrid
        columns={24}
        className="absolute left-0 top-0 grid w-full -translate-y-1/2 grid-cols-[repeat(24,minmax(0,1fr))] md:hidden"
        reducedMotion={reducedMotion}
      />
      <PixelGrid
        columns={48}
        className="absolute left-0 top-0 hidden w-full -translate-y-1/2 md:grid md:grid-cols-[repeat(48,minmax(0,1fr))]"
        reducedMotion={reducedMotion}
      />
    </div>
  )
}
