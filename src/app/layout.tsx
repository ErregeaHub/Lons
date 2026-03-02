import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Lons | Share Secrets. Stay Invisible.',
  description: 'The premier anonymous social platform. Post your thoughts without tracking—just whispers sent directly to the vault.',
  openGraph: {
    title: 'Lons | Share Secrets. Stay Invisible.',
    description: 'Post your thoughts anonymously or with a name. No tracking, just raw human expression. Join the vault today.',
    url: 'https://lons.xyz', // Replace with your actual domain
    siteName: 'Lons Anonymous',
    images: [
      {
        url: '/og-image.png', // Large preview image placeholder
        width: 1200,
        height: 630,
        alt: 'Lons - Share Secrets. Stay Invisible.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lons | Share Secrets. Stay Invisible.',
    description: 'The premier anonymous social platform. No tracking, just whispers.',
    images: ['/og-image.png'], // Large preview image placeholder
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}