import { motion } from 'motion/react'
import { useReveal } from '../../hooks/useReveal'
import ColorToggleImage from './ColorToggleImage'

export type GalleryPhoto = { src: string; alt: string; caption: string }

export default function GalleryCard({ photo, index, total }: { photo: GalleryPhoto; index: number; total: number }) {
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
        <span>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      </figcaption>
    </motion.figure>
  )
}

