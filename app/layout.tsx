import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CodeKlay Platform',
  description: 'Advanced AI-powered development platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>CodeKlay Platform</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
