import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from './Button'

type HeroProps = {
  imageSrc: string
  imageAlt: string
  headlineLine1: string
  headlineLine2: string
  subtext: string
  ctaLabel: string
}

export function Hero({
  imageSrc,
  imageAlt,
  headlineLine1,
  headlineLine2,
  subtext,
  ctaLabel,
}: HeroProps) {
  return (
    <section className="relative px-1.5 pt-1.5" aria-labelledby="hero-heading">
      <div className="relative h-[420px] overflow-hidden rounded-hero md:h-[480px]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover object-[center_40%]"
          sizes="(max-width: 768px) 100vw, 1200px"
        />
        <div className="absolute inset-0 bg-hero-scrim" aria-hidden />
        <div className="absolute left-6 top-[42%] max-w-[520px] -translate-y-1/2 space-y-4 md:left-10">
          <h1
            id="hero-heading"
            className="text-[clamp(44px,7vw,84px)] font-extrabold leading-[0.95] tracking-[-0.03em] text-on-dark-primary"
          >
            {headlineLine1}
            <br />
            {headlineLine2}
          </h1>
          <p className="max-w-[420px] text-lg leading-normal text-on-dark-secondary">{subtext}</p>
          <Button variant="primary-accent" size="hero" trailingIcon={ArrowRight}>
            {ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  )
}
