import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@/components/layout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MamiPalabra",
  description: "Juego de palabras para Mami - ¡Adivina la palabra del día!",
  manifest: "/manifest.json", 
  icons: {
    icon: process.env.NODE_ENV === 'production' ? '/MamiPalabra/logo.png' : '/logo.png',
    apple: process.env.NODE_ENV === 'production' ? '/MamiPalabra/logo.png' : '/logo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MamiPalabra",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f7" },
    { media: "(prefers-color-scheme: dark)", color: "#121213" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
