// app/layout.tsx
import { Providers } from './providers'; // Import providers
import './globals.css'; // Tailwind styles
import { Aboreto } from 'next/font/google';
import Header from '@/components/ui/Header';
import { headers } from 'next/headers';

const aboreto = Aboreto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Alice',
  description: 'Norse-themed blockchain games',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const cookieStore = headersList.get('cookie');

  return (
    <html lang="en" className="bg-black">
      <body className={`min-h-screen bg-black ${aboreto.className}`} style={{ backgroundColor: 'black' }}>
        <Providers cookies={cookieStore}>
          <div className="opacity-0 animate-fade-in">
            <main>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}