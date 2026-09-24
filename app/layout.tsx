import type { Metadata } from 'next';
import { Lato, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import PaisleyBackground from '@/components/layout/PaisleyBackground';

const lato = Lato({ 
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-lato'
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair'
});

export const metadata: Metadata = {
  title: 'ServeAnn — Rescue Food, Nourish Lives',
  description: 'A food rescue platform connecting donors, shelters, and volunteer drivers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lato.variable} ${playfair.variable} font-sans min-h-screen relative bg-cream`}>
        <PaisleyBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
