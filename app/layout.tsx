import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { AppLayout } from '@/features/app-shell/components/AppLayout';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Notebook',
  description: 'Prompt Management'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
