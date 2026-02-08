import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ServerWaker from '@/components/ServerWaker'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PIMS - Placement Management',
  description: 'Campus Recruitment System',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ServerWaker />
        {children}
      </body>
    </html>
  )
}
