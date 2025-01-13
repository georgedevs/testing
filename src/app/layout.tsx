'use client'
import "./globals.css";
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google'
import { Providers } from "./provider";
import Script from "next/script";
import { SocketProvider } from "@/components/SocketProvider";
import { type ReactNode } from 'react';
import LoadingScreen from "@/components/LoadingScreen";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
})
  
const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
})

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body 
        className={`${plusJakartaSans.variable} ${outfit.variable} min-h-screen bg-white dark:bg-gray-900 antialiased`}
      >
        <Providers>
          <SocketProvider>
            <LoadingScreen/>
            {children} 
          </SocketProvider>
          <Script 
            src="https://unpkg.com/@daily-co/daily-js" 
            strategy="beforeInteractive"
            onLoad={() => console.log('Daily.co SDK loaded')}
            onError={(e) => console.error('Failed to load Daily.co SDK:', e)}
          />
        </Providers>
      </body>
    </html>
  );
}