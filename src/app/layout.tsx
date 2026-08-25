import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cardora — Your Identity, Your Card",
  description: "Create shareable digital business cards with live previews, QR codes, vCard exports, and instant tap analytics.",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Cardora — Digital Business Cards",
    description: "Replace physical cards with dynamic, shareable digital profile cards.",
    url: "https://cardora-seven.vercel.app",
    siteName: "Cardora",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Cardora Logo",
      },
    ],
    locale: "en_US",
    type: "website",
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
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-black text-slate-100 min-h-screen selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
