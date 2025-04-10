// app/layout.tsx


import { Providers } from './providers'; // Import providers
import './globals.css'; // Tailwind styles
import { Aboreto } from 'next/font/google';
import { headers } from 'next/headers';
import { Analytics } from '@vercel/analytics/next';
import ScrollRestoration from '@/components/ScrollRestoration';

const aboreto = Aboreto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Alice',
  description: 'Welcome to Wonderland',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const cookieStore = headersList.get('cookie');

  return (
    <html lang="en" className="bg-background">
      <body className={`min-h-screen bg-background ${aboreto.className}`}>
        <Providers cookies={cookieStore}>
          <ScrollRestoration />
          <div className="opacity-0 animate-fade-in">
            <main>
              {children}
              <Analytics />
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}