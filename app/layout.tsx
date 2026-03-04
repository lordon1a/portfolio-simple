import './global.css'
import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import { Navbar } from './components/nav'
import Footer from './components/footer'
import { baseUrl } from './sitemap'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Yiğit Güldal',
    template: '%s | Yiğit Güldal',
  },
  description: 'Personal portfolio of Yiğit Güldal, software developer.',
  openGraph: {
    title: 'Yiğit Güldal',
    description: 'Personal portfolio of Yiğit Güldal, software developer.',
    url: baseUrl,
    siteName: 'Yiğit Güldal Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className="text-gray-300 bg-primary"
    >
      <body className="antialiased">
        <main className="flex-auto min-w-0 flex flex-col">
          {children}
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  )
}
