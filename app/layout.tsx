import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { TopBar, TOPBAR_HEIGHT } from '@/ui/TopBar';
import { Providers } from './Providers';

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Reservations',
  description: 'Reservation management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contentOffset = TOPBAR_HEIGHT + 40;
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${montserrat.className}`}>
        <Providers>
          <TopBar />
          <div
            style={{
              minHeight: '100vh',
              marginTop: `${contentOffset}px`,
              paddingTop: '20px',
              paddingLeft: '0px',
            }}
          >
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
