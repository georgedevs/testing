import { Plus_Jakarta_Sans, Outfit, Galada } from 'next/font/google';

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export const galada = Galada({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-galada',
});