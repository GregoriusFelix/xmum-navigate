'use client'

import { ChevronDown, Search } from 'lucide-react'
import type { SearchField } from '@/data/landing-content'
import { Button } from './Button'

type SearchBarProps = {
  fields: SearchField[]
  submitLabel: string
}

export function SearchBar({ fields, submitLabel }: SearchBarProps) {
  return (
    <form
      role="search"
      className="absolute bottom-0 left-1/2 z-20 w-[calc(100%-64px)] max-w-search -translate-x-1/2 translate-y-1/2"
      aria-label="Campus search"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex flex-col gap-3 rounded-hero bg-panel-alt p-4 shadow-float md:h-[72px] md:flex-row md:items-center md:rounded-pill md:p-2 md:pl-5">
        {fields.map((field, index) => {
          const Icon = field.icon
          const isLast = index === fields.length - 1
          return (
            <div
              key={field.id}
              className={`flex flex-1 items-center gap-3 px-2 md:px-5 ${index > 0 ? 'md:border-l md:border-[rgba(0,0,0,0.12)]' : ''} ${isLast ? 'md:flex-none' : ''}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-icon-chip">
                <Icon size={20} strokeWidth={1.5} className="text-ink" aria-hidden />
              </span>
              <label className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-xs font-medium leading-tight text-ink">{field.label}</span>
                <span className="flex items-center gap-1 text-[13px] leading-tight text-ink-soft">
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    className="w-full bg-transparent text-[13px] text-ink-soft placeholder:text-ink-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 rounded-sm"
                    aria-label={field.label}
                  />
                  {isLast ? (
                    <ChevronDown size={16} strokeWidth={1.5} className="shrink-0 text-ink-muted" aria-hidden />
                  ) : null}
                </span>
              </label>
            </div>
          )
        })}
        <Button
          type="submit"
          variant="primary-dark"
          size="search"
          leadingIcon={Search}
          className="w-full shrink-0 md:w-auto"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
