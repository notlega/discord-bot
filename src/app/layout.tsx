import type { Metadata } from 'next';

import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Home',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <head />
    <body className="max-w-6xl min-h-screen mx-auto py-8 px-4">
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <main>{children}</main>
      </ThemeProvider>
      <Toaster />
    </body>
  </html>
);

export default RootLayout;
