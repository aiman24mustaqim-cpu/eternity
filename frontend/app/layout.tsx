import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans, Great_Vibes } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { config } from '@/lib/config'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
})
const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-great-vibes',
})

export const metadata: Metadata = {
  title: `${config.appName} — Digital Wedding Invitations`,
  description: 'Create breathtaking digital wedding invitations. Elegant templates, real-time customization, instant sharing.',
  keywords: 'wedding invitation, digital invitation, kad kahwin, kad jemputan',
  openGraph: {
    title: `${config.appName} — Digital Wedding Invitations`,
    description: 'Create breathtaking digital wedding invitations.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${greatVibes.variable}`}>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#2C2825',
              color: '#FAF7F2',
              borderRadius: '14px',
              fontSize: '13px',
            },
          }}
        />
      </body>
    </html>
  )
}