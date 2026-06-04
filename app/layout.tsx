import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { ApiProvider } from '@/lib/api-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tugas Besar Cloud Computing 2026',
  description: 'Tester dan kelola endpoint REST API Anda',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        <ApiProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ApiProvider>
      </body>
    </html>
  )
}
