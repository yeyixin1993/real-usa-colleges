import './globals.css';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL('https://northatlas.example.com'),
  title: {
    default: 'North Atlas',
    template: '%s | North Atlas',
  },
  description: 'Multilingual U.S. college intelligence for Chinese families and internationally minded students.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
