import type { ReactNode } from 'react'

type MainPanelProps = {
  children: ReactNode
}

export function MainPanel({ children }: MainPanelProps) {
  return (
    <div className="mx-3 max-w-panel overflow-hidden rounded-panel border-2 border-[rgba(255,255,255,0.9)] bg-panel shadow-panel md:mx-6 lg:mx-auto">
      {children}
    </div>
  )
}
