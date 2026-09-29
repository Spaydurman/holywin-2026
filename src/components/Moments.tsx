import { motion } from 'motion/react'
import { useReveal } from '../hooks/useReveal'
import ColorToggleImage from './ColorToggleImage'

const photos = [
  { src: '/Holywin/H1.png', alt: 'Holywin attendees smiling together in a group photo', caption: 'Wanderland - 2019' },
  { src: '/Holywin/H2.png', alt: 'Collage of people connecting through video calls and activities', caption: 'Squid Game - 2021' },
  { src: '/Holywin/H3.png', alt: 'Holywin group gathered beneath colorful decorations', caption: 'Book of Life - 2022' },
  { src: '/Holywin/H4.jpg', alt: 'Holywin attendees holding gifts for a group photo', caption: 'One Peace - 2023' },
  { src: '/Holywin/H5.jpg', alt: 'Holywin group celebrating with colorful balloons', caption: 'Inside out - 2024' },
  { src: '/Holywin/H6.jpg', alt: 'Holywin group posing with colorful game themed decorations', caption: 'Level Up - 2025' },
]

type Photo = (typeof photos)[number]

function GalleryCard({ photo, index }: { photo: Photo; index: number }) {
  const reveal = useReveal()

  return (
    <motion.figure className="gallery-card" {...reveal}>
      <ColorToggleImage
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        className={`h-[300px] max-[760px]:h-[380px] max-[440px]:h-[300px] ${index === 1 ? 'bg-[#111] object-contain' : 'object-cover'}`}
      />
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
