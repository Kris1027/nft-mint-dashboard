import type { Metadata } from 'next';
import './globals.css';
import { ErrorBoundary } from '../components/error-boundary';

export const metadata: Metadata = {
  title: 'NFT Mint Dashboard',
  description: 'A simple dashboard to mint NFTs with image upload using Lighthouse storage',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
