'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBrazeContext, CAROUSEL_PLACEMENT_IDS } from '@/components/braze-provider'
import { braze } from '@/lib/braze'

export function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { banners } = useBrazeContext()
  const slotRefs = useRef<(HTMLDivElement | null)[]>([])
  const insertedSlots = useRef<Set<number>>(new Set())

  // Insert or re-insert the banner for the current slide whenever the slide or banners change
  useEffect(() => {
    const placementId = CAROUSEL_PLACEMENT_IDS[currentSlide]
    const banner = banners[placementId]
    const container = slotRefs.current[currentSlide]

    if (banner && !banner.isControl && container) {
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
      <div className="relative h-64 md:h-72">
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
                // Null means no campaign targeting this slot — show a placeholder
                <div className="flex h-full items-center justify-center bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    No banner configured for <code>{placementId}</code>
                  </p>
                </div>
              ) : (
                // Container for insertBanner — Braze renders an iframe here and auto-logs impressions
                <div
                  ref={(el) => {
                    slotRefs.current[index] = el
                  }}
                  className="h-full w-full"
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow-md backdrop-blur-sm transition-all hover:bg-background hover:shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 text-foreground" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 shadow-md backdrop-blur-sm transition-all hover:bg-background hover:shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 text-foreground" />
      </button>

      {/* Dot Indicators */}
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
