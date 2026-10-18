import type { Metadata } from 'next'
import { Caveat, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const primary = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-primary',
  display: 'swap',
})

const script = Caveat({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-script',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'XMUM Navigate',
  description:
    'Campus wayfinding for Xiamen University Malaysia — final year project in development.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${primary.variable} ${script.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
