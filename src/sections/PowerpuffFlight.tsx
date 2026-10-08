import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'

const spriteParts = [
  { x: 5, y: 477, width: 24, height: 27, left: 5, top: 0 }, // Bubbles
  { x: 5, y: 138, width: 26, height: 30, left: 26, top: 17 }, // Blossom
  { x: 4, y: 796, width: 24, height: 27, left: 0, top: 36 }, // Buttercup
]

const trails = [
  { position: 'top-[23%] right-[80%]', color: 'from-transparent via-[#a9e3f7]/80 to-[#6fcdf1]', echo: 'bg-[#bceafa]/55' },
  { position: 'top-[50%] right-[40%]', color: 'from-transparent via-[#f7a3bd]/80 to-[#ee719d]', echo: 'bg-[#fac4d3]/55' },
  { position: 'top-[77%] right-[90%]', color: 'from-transparent via-[#b8e9a3]/80 to-[#81cf75]', echo: 'bg-[#ccefc1]/55' },
]

const trioWidth = 52
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
    piece.height = part.height
    pieceContext.clearRect(0, 0, part.width, part.height)
    pieceContext.drawImage(image, part.x, part.y, part.width, part.height, 0, 0, part.width, part.height)

    const pixels = pieceContext.getImageData(0, 0, part.width, part.height)
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

  useEffect(() => {
    const image = new Image()
    image.onload = () => setTrioSprite(makeTrioSprite(image))
    image.src = '/powerpuff-sprite-sheet.png'
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-[185dvh] overflow-clip bg-[#eae8df] motion-reduce:h-[340px]"
      role="img"
      aria-label="Bubbles, Blossom, and Buttercup fly together from left to right, leaving blue, pink, and green trails before the next section."
    >
      <div className="sticky top-0 h-dvh overflow-hidden bg-[#eae8df] motion-reduce:relative motion-reduce:h-[340px]">
        <motion.div
          className="pointer-events-none absolute top-1/2 left-0 h-[180px] aspect-[52/64] -translate-y-1/2 min-[761px]:h-[240px]"
          style={{ x: reducedMotion ? '35vw' : x, y: reducedMotion ? 0 : bob }}
          aria-hidden="true"
        >
          {trails.map((trail) => (
            <div key={trail.position} className={['absolute', trail.position].join(' ')}>
              <div className={['absolute right-0 top-0 h-4 w-[140vw] bg-gradient-to-r min-[761px]:h-7', trail.color].join(' ')} />
              <div className={['absolute right-0 -top-4 h-2 w-[130vw] min-[761px]:h-3', trail.echo].join(' ')} />
              <div className={['absolute right-0 top-6 h-1.5 w-[125vw] min-[761px]:top-9 min-[761px]:h-2', trail.echo].join(' ')} />
            </div>
          ))}
          {trioSprite && (
            <img
              src={trioSprite}
              alt=""
              width={trioWidth}
              height={trioHeight}
              className="absolute inset-0 h-full w-full max-w-none [image-rendering:pixelated]"
              draggable={false}
            />
          )}
        </motion.div>
      </div>
    </section>
  )
}

