import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { AppLayout } from '@/features/app-shell/components/containers/AppLayout';
import Script from 'next/script';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Notebook',
  description: 'Prompt Management',
  manifest: '/manifest.json' // این خط را اضافه کنید
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
        {/* ثبت سرویس ورکر */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('SW registered', reg.scope))
          .catch(err => console.log('SW failed', err));
      });
    }
  `}
        </Script>
      </body>
    </html>
  );
}
