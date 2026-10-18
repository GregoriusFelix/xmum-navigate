'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import type { CarouselCard } from '@/data/landing-content'
import { ImageCard } from './ImageCard'

type CardCarouselProps = {
  heading: string
  subtext: string
  cards: CarouselCard[]
}

export function CardCarousel({ heading, subtext, cards }: CardCarouselProps) {
  const railRef = useRef<HTMLDivElement>(null)

  const scrollByCard = (direction: 'prev' | 'next') => {
    const rail = railRef.current
    if (!rail) return
    const card = rail.querySelector('article')
    const gap = 16
    const amount = (card?.getBoundingClientRect().width ?? 240) + gap
    rail.scrollBy({ left: direction === 'next' ? amount : -amount, behavior: 'smooth' })
  }

  return (
    <section
      className="grid gap-8 px-6 pb-10 pt-6 md:grid-cols-[280px_1fr] md:gap-8 md:px-10 md:pb-10 md:pt-6"
      aria-labelledby="featured-heading"
    >
      <div className="flex flex-col justify-between md:min-h-[320px]">
        <div>
          <span className="mb-5 block h-0.5 w-12 bg-accent" aria-hidden />
          <h2
            id="featured-heading"
            className="text-[clamp(32px,3.5vw,44px)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink"
          >
            {heading}
          </h2>
          <p className="mt-3 max-w-[260px] text-base leading-relaxed text-ink-soft">{subtext}</p>
        </div>
        <div className="mt-10 flex gap-4 md:mt-[72px]">
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-pill border border-[rgba(0,0,0,0.15)] text-ghost-icon transition-colors duration-base ease-ds focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/60"
            aria-label="Previous destinations"
            onClick={() => scrollByCard('prev')}
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-pill bg-brand-dark text-on-accent transition-colors duration-base ease-ds hover:bg-brand-dark-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/60"
            aria-label="Next destinations"
            onClick={() => scrollByCard('next')}
          >
            <ArrowRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-hide md:pb-0"
        role="region"
        aria-label="Featured places carousel"
      >
        {cards.map((card) => (
          <ImageCard
            key={card.id}
            title={card.title}
            subtitle={card.subtitle}
            imageSrc={card.imageSrc}
            imageAlt={card.imageAlt}
          />
        ))}
      </div>
    </section>
  )
}
