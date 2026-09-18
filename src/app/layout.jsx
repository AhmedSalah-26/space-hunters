import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';

export const metadata = {
  title: 'Space Hunters 🌱 | NASA Space Apps Challenge 2026',
  description: 'Adapting Farms with NASA Data - An interactive climate strategy game by Team Space Hunters',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/space_hunters_badge.jpg', type: 'image/jpeg' }
    ],
    shortcut: '/favicon.svg',
    apple: '/space_hunters_badge.jpg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/space_hunters_badge.jpg" />
      </head>
      <body className="bg-[#050c1b] text-slate-100 min-h-screen overflow-x-hidden selection:bg-blue-600 selection:text-white">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
