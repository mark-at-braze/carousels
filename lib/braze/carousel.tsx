'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBrazeContext, CAROUSEL_PLACEMENT_IDS } from './provider'
import { braze } from './init'

// Must match the height of the banners created in Braze (e.g. 768×256 → 256px)
const BANNER_HEIGHT_PX = 256

export function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { banners } = useBrazeContext()
  const slotRefs = useRef<(HTMLDivElement | null)[]>([])
  const insertedSlots = useRef<Set<number>>(new Set())

  useEffect(() => {
    const placementId = CAROUSEL_PLACEMENT_IDS[currentSlide]
    const banner = banners[placementId]
    const container = slotRefs.current[currentSlide]

    if (banner && !banner.isControl && container && !insertedSlots.current.has(currentSlide)) {
      braze.insertBanner(banner, container)
      insertedSlots.current.add(currentSlide)
    }
  }, [currentSlide, banners])

  const hasAnyBanner = CAROUSEL_PLACEMENT_IDS.some((id) => banners[id])

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_PLACEMENT_IDS.length)

  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + CAROUSEL_PLACEMENT_IDS.length) % CAROUSEL_PLACEMENT_IDS.length
    )

  const goToSlide = (index: number) => setCurrentSlide(index)

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-border shadow-sm">
      <div className="relative" style={{ height: BANNER_HEIGHT_PX }}>
        {!hasAnyBanner && (
          <div className="flex h-full items-center justify-center bg-muted/30">
            <p className="text-muted-foreground">Loading banner content…</p>
          </div>
        )}

        {CAROUSEL_PLACEMENT_IDS.map((placementId, index) => {
          const banner = banners[placementId]
          return (
            <div
              key={placementId}
              className={cn(
                'absolute inset-0 transition-all duration-500 ease-in-out',
                index === currentSlide
                  ? 'translate-x-0 opacity-100'
                  : index < currentSlide
                    ? '-translate-x-full opacity-0'
                    : 'translate-x-full opacity-0'
              )}
            >
              {banner === null || banner?.isControl ? (
                <div className="flex h-full items-center justify-center bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    No banner configured for <code>{placementId}</code>
                  </p>
                </div>
              ) : (
                <div
                  ref={(el) => { slotRefs.current[index] = el }}
                  className="banner-slot"
                  style={{ width: '100%', height: BANNER_HEIGHT_PX }}
                />
              )}
            </div>
          )
        })}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-1 backdrop-blur-sm transition-all hover:bg-black/35"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-1 backdrop-blur-sm transition-all hover:bg-black/35"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 text-white" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {CAROUSEL_PLACEMENT_IDS.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'h-2 rounded-full transition-all',
              index === currentSlide
                ? 'w-8 bg-foreground'
                : 'w-2 bg-foreground/30 hover:bg-foreground/50'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
