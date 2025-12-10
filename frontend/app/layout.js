'use client';

import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '../context/AuthContext'
import { NotificationProvider } from '../components/NotificationProvider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

