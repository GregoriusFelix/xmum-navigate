import { Map } from 'lucide-react'

type FooterOutroProps = {
  wordmark: string
  tagline: string
  scriptLines: string[]
  badgeText: string
}

export function FooterOutro({ wordmark, tagline, scriptLines, badgeText }: FooterOutroProps) {
  return (
    <footer className="relative min-h-[200px] bg-footer-tint px-6 pb-16 pt-10 text-center">
      <div className="relative mx-auto flex max-w-panel flex-col items-center">
        <Map size={28} strokeWidth={1.5} className="text-on-dark-primary" aria-hidden />
        <p className="mt-4 text-[32px] font-normal uppercase tracking-[0.2em] text-on-dark-primary">
          {wordmark}
        </p>
        <span className="my-3.5 block h-px w-10 bg-[rgba(255,255,255,0.6)]" aria-hidden />
        <p className="max-w-md text-sm tracking-[0.25em] text-on-dark-secondary">{tagline}</p>
      </div>

      <div
        className="pointer-events-none absolute bottom-10 left-6 hidden md:block lg:left-10"
        aria-hidden
      >
        <svg width="84" height="84" viewBox="0 0 84 84" className="text-[rgba(255,255,255,0.9)]">
          <circle cx="42" cy="42" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
          <defs>
            <path id="badge-circle" d="M 42,42 m -32,0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0" />
          </defs>
          <text fill="currentColor" fontSize="9" letterSpacing="0.2em">
            <textPath href="#badge-circle" startOffset="0">
              {badgeText.repeat(2)}
            </textPath>
          </text>
          <circle cx="42" cy="42" r="4" fill="currentColor" />
        </svg>
      </div>

      <div
        className="pointer-events-none absolute bottom-12 right-6 hidden text-left md:block lg:right-12"
        aria-hidden
      >
        <div className="-rotate-[8deg] font-script text-[28px] leading-tight text-[rgba(255,255,255,0.9)]">
          {scriptLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </div>
        <svg width="80" height="8" viewBox="0 0 80 8" className="mt-1 text-on-dark-primary">
          <path
            d="M 2 5 Q 40 2, 78 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </footer>
  )
}
