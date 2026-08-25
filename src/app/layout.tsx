import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cardora — Your Identity, Your Card",
  description: "Create shareable digital business cards with live previews, QR codes, vCard exports, and instant tap analytics.",
  openGraph: {
    title: "Cardora — Digital Business Cards",
    description: "Replace physical cards with dynamic, shareable digital profile cards.",
    url: "https://cardora.io",
    siteName: "Cardora",
    images: [
      {
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Cardora Digital Business Cards",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
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
      </head>
      <body className="antialiased bg-black text-slate-100 min-h-screen selection:bg-lime-400 selection:text-black">
        {children}
      </body>
    </html>
  );
}
