import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import BrazeProvider from '@/lib/braze/provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Braze Banners Carousel Demo',
  description:
    'Reference implementation: build a web carousel using Braze Banners with multiple placements. Live demo and step-by-step integration guide.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <BrazeProvider>
          {children}
        </BrazeProvider>
        <Analytics />
      </body>
    </html>
  )
}
