import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'

const spriteParts = [
  { x: 5, y: 478, width: 24, left: 0, top: 0 }, // Bubbles
  { x: 5, y: 142, width: 26, left: 12, top: 17 }, // Blossom
  { x: 4, y: 793, width: 24, left: 23, top: 34 }, // Buttercup
]

const trails = [
  { position: 'top-[23%]', color: 'from-transparent via-[#a9e3f7]/80 to-[#6fcdf1]', echo: 'bg-[#bceafa]/55' },
  { position: 'top-[50%]', color: 'from-transparent via-[#f7a3bd]/80 to-[#ee719d]', echo: 'bg-[#fac4d3]/55' },
  { position: 'top-[77%]', color: 'from-transparent via-[#b8e9a3]/80 to-[#81cf75]', echo: 'bg-[#ccefc1]/55' },
]

const spriteHeight = 30
const trioWidth = 49
const trioHeight = 64

function makeTrioSprite(image: HTMLImageElement): string | null {
  const sprite = document.createElement('canvas')
  sprite.width = trioWidth
  sprite.height = trioHeight
  const spriteContext = sprite.getContext('2d')
  if (!spriteContext) return null

  const piece = document.createElement('canvas')
  const pieceContext = piece.getContext('2d', { willReadFrequently: true })
  if (!pieceContext) return null

  for (const part of spriteParts) {
    piece.width = part.width
    piece.height = spriteHeight
    pieceContext.clearRect(0, 0, part.width, spriteHeight)
    pieceContext.drawImage(image, part.x, part.y, part.width, spriteHeight, 0, 0, part.width, spriteHeight)

    const pixels = pieceContext.getImageData(0, 0, part.width, spriteHeight)
    for (let index = 0; index < pixels.data.length; index += 4) {
      const red = pixels.data[index]
      const green = pixels.data[index + 1]
      const blue = pixels.data[index + 2]
      // The supplied sheet uses two solid teal backgrounds around these poses.
      if (red === 0 && ((green === 128 && blue === 128) || (green === 53 && blue === 53))) {
        pixels.data[index + 3] = 0
      }
    }
    pieceContext.putImageData(pixels, 0, 0)
    spriteContext.drawImage(piece, part.left, part.top)
  }

  return sprite.toDataURL('image/png')
}

export default function PowerpuffFlight() {
  const sectionRef = useRef<HTMLElement>(null)
  const [trioSprite, setTrioSprite] = useState<string | null>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 150, damping: 30, mass: 0.25 })
  const x = useTransform(progress, [0, 1], ['-22vw', '112vw'])
  const bob = useTransform(progress, [0, 0.25, 0.5, 0.75, 1], [0, -7, 3, -5, 0])
  const trailScale = useTransform(progress, [0.04, 0.88], [0, 1])

  useEffect(() => {
    const image = new Image()
    image.onload = () => setTrioSprite(makeTrioSprite(image))
    image.src = '/powerpuff-sprite-sheet.png'
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-[185dvh] overflow-clip bg-[#f7f5ed] motion-reduce:h-[340px]"
      role="img"
      aria-label="Bubbles, Blossom, and Buttercup fly together from left to right, leaving blue, pink, and green trails before the next section."
    >
      <div className="sticky top-0 h-dvh overflow-hidden bg-[linear-gradient(180deg,#f7f5ed_0%,#f7f0f4_46%,#f7f5ed_100%)] motion-reduce:relative motion-reduce:h-[340px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#111]/15" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[180px] -translate-y-1/2 min-[761px]:h-[240px]" aria-hidden="true">
          {trails.map((trail) => (
            <div key={trail.position} className={['absolute inset-x-0', trail.position].join(' ')}>
              <motion.div
                className={['absolute left-0 top-0 h-4 w-screen origin-left bg-gradient-to-r min-[761px]:h-7', trail.color].join(' ')}
                style={{ scaleX: reducedMotion ? 0.52 : trailScale }}
              />
              <motion.div
                className={['absolute left-0 -top-4 h-2 w-[90vw] origin-left min-[761px]:h-3', trail.echo].join(' ')}
                style={{ scaleX: reducedMotion ? 0.45 : trailScale }}
              />
              <motion.div
                className={['absolute left-0 top-6 h-1.5 w-[82vw] origin-left min-[761px]:top-9 min-[761px]:h-2', trail.echo].join(' ')}
                style={{ scaleX: reducedMotion ? 0.42 : trailScale }}
              />
            </div>
          ))}
          {trioSprite && (
            <motion.img
              src={trioSprite}
              alt=""
              width={trioWidth}
              height={trioHeight}
              className="absolute left-0 top-0 h-full w-auto max-w-none [image-rendering:pixelated]"
              style={{ x: reducedMotion ? '35vw' : x, y: reducedMotion ? 0 : bob }}
              draggable={false}
            />
          )}
        </div>
      </div>
    </section>
  )
}

