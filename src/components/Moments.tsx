import { motion } from 'motion/react'
import { useReveal } from '../hooks/useReveal'

const photos = [
  { src: '/Holywin/H1.png', alt: 'Holywin attendees smiling together in a group photo', caption: 'GATHER TOGETHER' },
  { src: '/Holywin/H2.png', alt: 'Collage of people connecting through video calls and activities', caption: 'STAY CONNECTED' },
  { src: '/Holywin/H3.png', alt: 'Holywin group gathered beneath colorful decorations', caption: 'MAKE MEMORIES' },
  { src: '/Holywin/H4.jpg', alt: 'Holywin attendees holding gifts for a group photo', caption: 'SHARE THE JOY' },
  { src: '/Holywin/H5.jpg', alt: 'Holywin group celebrating with colorful balloons', caption: 'CELEBRATE TOGETHER' },
  { src: '/Holywin/H6.jpg', alt: 'Holywin group posing with colorful game themed decorations', caption: 'LEVEL UP TOGETHER' },
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
            <motion.figure className="gallery-card" key={photo.src} {...reveal}>
              <img className="gallery-photo" src={photo.src} alt={photo.alt} loading="lazy" />
              <figcaption className="gallery-caption">
                <strong>{photo.caption}</strong>
                <span>{String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
