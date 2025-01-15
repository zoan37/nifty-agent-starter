import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nifty Agent Starter',
  description: 'Example for AI agent that is compatible with Nifty Island',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
