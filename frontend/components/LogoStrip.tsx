import type { LogoStripItem } from '@/data/landing-content'

type LogoStripProps = {
  items: LogoStripItem[]
}

export function LogoStrip({ items }: LogoStripProps) {
  return (
    <section
      className="px-6 pb-6 pt-14 md:px-10 md:pt-[56px]"
      aria-label="Campus areas"
    >
      <ul className="flex gap-8 overflow-x-auto pb-2 scrollbar-hide md:flex-wrap md:justify-between md:overflow-visible">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <li
              key={item.id}
              className="flex min-w-[120px] shrink-0 flex-col items-center gap-2 opacity-70 md:min-w-0 md:flex-1"
            >
              <Icon size={28} strokeWidth={1.5} className="text-partner-logo" aria-hidden />
              <div className="text-center">
                <p className="text-base font-medium uppercase tracking-[0.12em] text-partner-logo">
                  {item.name}
                </p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-partner-logo">
                  {item.tagline}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
