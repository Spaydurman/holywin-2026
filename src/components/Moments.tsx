import { motion } from 'motion/react'
import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'

const photos = [
  { src: '/Holywin/H1.png', alt: 'Holywin attendees smiling together in a group photo', caption: 'GATHER TOGETHER' },
  { src: '/Holywin/H2.png', alt: 'Collage of people connecting through video calls and activities', caption: 'STAY CONNECTED' },
  { src: '/Holywin/H3.png', alt: 'Holywin group gathered beneath colorful decorations', caption: 'MAKE MEMORIES' },
  { src: '/Holywin/H4.jpg', alt: 'Holywin attendees holding gifts for a group photo', caption: 'SHARE THE JOY' },
  { src: '/Holywin/H5.jpg', alt: 'Holywin group celebrating with colorful balloons', caption: 'CELEBRATE TOGETHER' },
  { src: '/Holywin/H6.jpg', alt: 'Holywin group posing with colorful game themed decorations', caption: 'LEVEL UP TOGETHER' },
]

type Photo = (typeof photos)[number]

function GalleryCard({ photo, index }: { photo: Photo; index: number }) {
  const reveal = useReveal()
  const [colorMode, setColorMode] = useState<'default' | 'hover' | 'clicked' | 'off'>('default')
  const isColored = colorMode === 'hover' || colorMode === 'clicked'

  return (
    <motion.figure className="gallery-card" {...reveal}>
      <button
        type="button"
        className="block w-full cursor-pointer border-0 bg-transparent p-0"
        aria-label={`Toggle color: ${photo.alt}`}
        aria-pressed={colorMode === 'clicked'}
        onPointerEnter={(event) => {
          if (event.pointerType !== 'touch') setColorMode('hover')
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== 'touch') setColorMode('default')
        }}
        onFocus={() => setColorMode((mode) => mode === 'default' ? 'hover' : mode)}
        onBlur={() => setColorMode('default')}
        onClick={() => setColorMode((mode) => mode === 'clicked' ? 'off' : 'clicked')}
      >
        <img
          className={`block h-[300px] w-full transition-[filter] duration-300 ease-in-out max-[760px]:h-[380px] max-[440px]:h-[300px] motion-reduce:transition-none ${isColored ? 'grayscale-0' : 'grayscale'} ${index === 1 ? 'bg-[#111] object-contain' : 'object-cover'}`}
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
        />
      </button>
      <figcaption className="gallery-caption">
        <strong>{photo.caption}</strong>
        <span>{String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span>
      </figcaption>
    </motion.figure>
  )
}

export default function Moments() {
  const reveal = useReveal()

  return (
    <section className="moments section flex min-h-dvh items-center" id="moments" aria-labelledby="moments-title">
      <div className="container">
        <motion.div className="section-heading moments-heading" {...reveal}>
          <div>
            <span className="kicker">03 / PREVIOUS HOLYWIN</span>
            <h2 id="moments-title">LOOK BACK.<br /><span>LEAP FORWARD.</span></h2>
          </div>
          <p>Take a look at the friendships, celebrations, and shared moments from previous Holywin gatherings.</p>
        </motion.div>
        <div className="gallery-grid">
          {photos.map((photo, index) => (
            <GalleryCard photo={photo} index={index} key={photo.src} />
          ))}
        </div>
      </div>
    </section>
  )
}
