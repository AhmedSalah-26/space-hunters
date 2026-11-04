import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import { WorkingSessionProvider } from '../context/WorkingSessionContext';

export const metadata = {
  title: 'Space Hunters 🌱 | NASA Space Apps Challenge 2026',
  description: 'Adapting Farms with NASA Data - An interactive climate strategy game by Team Space Hunters',
  icons: {
    icon: '/icon.png',
    apple: '/space_hunters_badge.jpg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" className="h-full">
      <body className="bg-[#050c1b] text-slate-100 h-full overflow-hidden selection:bg-blue-600 selection:text-white">
        <LanguageProvider>
          <WorkingSessionProvider>
            {children}
          </WorkingSessionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
