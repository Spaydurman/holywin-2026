import { useState } from 'react'

type ColorToggleImageProps = {
  src: string
  alt: string
  className: string
  loading?: 'eager' | 'lazy'
  onPressedChange?: (pressed: boolean) => void
}

export default function ColorToggleImage({ src, alt, className, loading, onPressedChange }: ColorToggleImageProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const isColored = isHovered || isFocused || isPressed

  return (
    <button
      type="button"
      className="block w-full cursor-pointer border-0 bg-transparent p-0"
      aria-label={`Toggle color: ${alt}`}
      aria-pressed={isPressed}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') setIsHovered(true)
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'touch') setIsHovered(false)
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={() => {
        const nextPressed = !isPressed
        setIsPressed(nextPressed)
        onPressedChange?.(nextPressed)
      }}
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
