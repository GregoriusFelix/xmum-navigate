import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

type ImageCardProps = {
  title: string
  subtitle: string
  imageSrc: string
  imageAlt: string
}

export function ImageCard({ title, subtitle, imageSrc, imageAlt }: ImageCardProps) {
  return (
    <article className="group relative min-h-[250px] min-w-[70vw] flex-[1_1_165px] snap-start overflow-hidden rounded-card shadow-card transition-transform duration-slow ease-ds hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none sm:min-w-[200px] md:min-w-[220px] lg:min-w-[240px]">
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-slow ease-ds group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
          sizes="(max-width: 640px) 70vw, 260px"
        />
        <div className="absolute inset-0 bg-card-scrim" aria-hidden />
        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-pill bg-[rgba(255,255,255,0.75)] backdrop-blur-[6px]">
          <ArrowUpRight size={16} strokeWidth={1.5} className="text-ink" aria-hidden />
        </span>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-bold leading-tight tracking-[-0.01em] text-on-dark-primary">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-snug text-on-dark-secondary">{subtitle}</p>
        </div>
      </div>
    </article>
  )
}
