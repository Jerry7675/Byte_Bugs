import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ClientOnlyLayout from './ClientOnlyLayout';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import Sonner from '@/components/ui/sonner';
import { AuthProvider } from '@/context/authContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'InvestLink - Bridging Investors & Startups',
  description: 'Connect verified investors with promising startups through intelligent matching, secure messaging, and verified profiles.',
  icons: {
    icon: 'https://raw.githubusercontent.com/Jerry7675/Byte_Bugs/refs/heads/main/src/(public)/logoinvest.png',
    shortcut: 'https://raw.githubusercontent.com/Jerry7675/Byte_Bugs/refs/heads/main/src/(public)/logoinvest.png',
    apple: 'https://raw.githubusercontent.com/Jerry7675/Byte_Bugs/refs/heads/main/src/(public)/logoinvest.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ThemeProvider>
            <Sonner />
            <ClientOnlyLayout>{children}</ClientOnlyLayout>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
