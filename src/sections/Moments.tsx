import { motion } from 'motion/react'
import { useReveal } from '../hooks/useReveal'
import GalleryCard from '../components/ui/GalleryCard'

const photos = [
  { src: '/Holywin/H1.png', alt: 'Holywin attendees smiling together in a group photo', caption: 'Wanderland - 2019' },
  { src: '/Holywin/H2.png', alt: 'Collage of people connecting through video calls and activities', caption: 'Squid Game - 2021' },
  { src: '/Holywin/H3.png', alt: 'Holywin group gathered beneath colorful decorations', caption: 'Book of Life - 2022' },
  { src: '/Holywin/H4.jpg', alt: 'Holywin attendees holding gifts for a group photo', caption: 'One Peace - 2023' },
  { src: '/Holywin/H5.jpg', alt: 'Holywin group celebrating with colorful balloons', caption: 'Inside out - 2024' },
  { src: '/Holywin/H6.jpg', alt: 'Holywin group posing with colorful game themed decorations', caption: 'Level Up - 2025' },
]

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
            <GalleryCard photo={photo} index={index} total={photos.length} key={photo.src} />
          ))}
        </div>
      </div>
    </section>
  )
}
