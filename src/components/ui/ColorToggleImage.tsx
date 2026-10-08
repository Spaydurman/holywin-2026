import { useEffect, useRef, useState } from 'react'

type ColorToggleImageProps = {
  src: string
  alt: string
  className: string
  loading?: 'eager' | 'lazy'
  onActiveChange?: (active: boolean) => void
}

export default function ColorToggleImage({ src, alt, className, loading, onActiveChange }: ColorToggleImageProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const lastPointerType = useRef<string | null>(null)
  const isColored = isHovered || isFocused || isPressed

  useEffect(() => {
    onActiveChange?.(isColored)
  }, [isColored, onActiveChange])

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
      onPointerDown={(event) => { lastPointerType.current = event.pointerType }}
      onFocus={(event) => setIsFocused(event.currentTarget.matches(':focus-visible'))}
      onBlur={() => setIsFocused(false)}
      onClick={(event) => {
        if (event.detail === 0 || lastPointerType.current === 'touch') {
          setIsPressed((pressed) => !pressed)
        }
        lastPointerType.current = null
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
