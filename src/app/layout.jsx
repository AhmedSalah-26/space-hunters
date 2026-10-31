import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';

export const metadata = {
  title: 'Space Hunters 🌱 | NASA Space Apps Challenge 2026',
  description: 'Adapting Farms with NASA Data - An interactive climate strategy game by Team Space Hunters',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/space_hunters_badge.jpg', type: 'image/jpeg' }
    ],
    shortcut: '/icon.png',
    apple: '/space_hunters_badge.jpg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" className="h-full">
      <head>
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="shortcut icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/space_hunters_badge.jpg" />
      </head>
      <body className="bg-[#050c1b] text-slate-100 h-full overflow-hidden selection:bg-blue-600 selection:text-white">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
