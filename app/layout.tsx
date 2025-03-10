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
  title: 'Ragnarok Games',
  description: 'Norse-themed blockchain games',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const cookieStore = headersList.get('cookie');

  return (
    <html lang="en" className="bg-dark-900 text-gray-100">
      <body className={`min-h-screen bg-dark-900 ${aboreto.className}`}>
        <Providers cookies={cookieStore}>
          <Header />
          <main>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}