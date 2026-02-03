import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navigation } from "./components/Navigation";

const inter = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    { path: "../../public/fonts/Inter/woff-hinted/Inter-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Inter/woff-hinted/Inter-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Inter/woff-hinted/Inter-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/Inter/woff-hinted/Inter-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/Inter/woff-hinted/Inter-Italic.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/Inter/woff-hinted/Inter-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../../public/fonts/Inter/woff-hinted/Inter-SemiBoldItalic.woff2", weight: "600", style: "italic" },
    { path: "../../public/fonts/Inter/woff-hinted/Inter-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
});

export const metadata: Metadata = {
  title: "BodyGoGo",
  description: "Strict Algorithm Health Tracker",
};

import { getUserSettings } from '@/lib/data/supabase-repository';

// ...

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getUserSettings();
  const theme = settings?.theme || 'cozy_light';

  return (
    <html lang="zh-TW" className={inter.variable} suppressHydrationWarning data-theme={theme}>
      <body>
        {children}
        <Navigation />
      </body>
    </html>
  );
}
