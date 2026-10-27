import { useState } from 'react'

interface CollegeImageProps {
  src: string
  fallbackSrc?: string
  alt: string
  className?: string
  aspectRatio?: 'video' | 'square' | 'wide'
}

export default function CollegeImage({
  src,
  fallbackSrc = '/images/campus-fallback.svg',
  alt,
  className = '',
  aspectRatio = 'video',
}: CollegeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleError = () => {
    if (!hasError && fallbackSrc && currentSrc !== fallbackSrc) {
      setHasError(true)
      setCurrentSrc(fallbackSrc)
    } else if (currentSrc !== '/images/campus-fallback.svg') {
      setCurrentSrc('/images/campus-fallback.svg')
    }
  }

  const aspectClass =
    aspectRatio === 'video' ? 'aspect-[16/9]' : aspectRatio === 'wide' ? 'aspect-[21/9]' : 'aspect-square'

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${aspectClass} ${className}`}>
      {/* Background placeholder shimmer */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200" />
      )}
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`h-full w-full object-cover transition-all duration-300 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        }`}
      />
    </div>
  )
}
