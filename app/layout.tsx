import './globals.css'
import { Inter } from 'next/font/google'
import styles from '@/app/Page.module.css'
import NavBar from '@/components/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ICANTREAD',
  description: 'for the illiterate ppl out there <3',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        <div className={styles.content}>
         {children}
        </div>
      </body>
    </html>
  )
}
