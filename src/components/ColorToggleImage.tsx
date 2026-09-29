import { useState } from 'react'

type ColorToggleImageProps = {
  src: string
  alt: string
  className: string
  loading?: 'eager' | 'lazy'
}

export default function ColorToggleImage({ src, alt, className, loading }: ColorToggleImageProps) {
  const [colorMode, setColorMode] = useState<'default' | 'hover' | 'clicked' | 'off'>('default')
  const isColored = colorMode === 'hover' || colorMode === 'clicked'

  return (
    <button
      type="button"
      className="block w-full cursor-pointer border-0 bg-transparent p-0"
      aria-label={`Toggle color: ${alt}`}
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
        className={`block w-full transition-[filter] duration-300 ease-in-out motion-reduce:transition-none ${isColored ? 'grayscale-0' : 'grayscale'} ${className}`}
        src={src}
        alt={alt}
        loading={loading}
      />
    </button>
  )
}
