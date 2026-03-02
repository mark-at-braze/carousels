'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BannerSlide {
  id: string
  title: string
  description: string
  ctaText?: string
  backgroundColor: string
}

interface BannerCarouselProps {
  slides: BannerSlide[]
}

export function BannerCarousel({ slides }: BannerCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const handleCtaClick = (slideId: string) => {
    console.log(`CTA clicked for ${slideId}`)
    // In a real app, this would trigger the appropriate action
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-border shadow-sm">
      {/* Slides */}
      <div className="relative h-64 md:h-72">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              'absolute inset-0 transition-all duration-500 ease-in-out',
              index === currentSlide
                ? 'translate-x-0 opacity-100'
                : index < currentSlide
                  ? '-translate-x-full opacity-0'
                  : 'translate-x-full opacity-0'
            )}
          >
            <div
              className="flex h-full flex-col items-start justify-center px-8 md:px-12"
              style={{ backgroundColor: slide.backgroundColor }}
            >
              <h3 className="mb-3 text-2xl font-semibold text-foreground md:text-3xl">
                {slide.title}
              </h3>
              <p className="mb-6 max-w-2xl text-base text-foreground/80 md:text-lg">
                {slide.description}
              </p>
              {slide.ctaText && (
                <Button
                  onClick={() => handleCtaClick(slide.id)}
                  size="lg"
                  className="bg-foreground text-background hover:bg-foreground/90"
                >
                  {slide.ctaText}
                </Button>
              )}
            </div>
          </div>
        ))}
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
        {slides.map((_, index) => (
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
