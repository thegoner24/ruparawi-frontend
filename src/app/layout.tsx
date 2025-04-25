import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rupa Rawi",
  description: "Rupa Rawi - Sustainable Community BatikS",
};

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Rupa Rawi - Sustainable Community Batik" />
        <link rel="icon" href="/RupaRawi.ico" />
        <link href="https://fonts.googleapis.com/css2?family=League+Script&family=Ballet:opsz@16..72&family=Cormorant+Garamond:wght@400;700&family=Inter:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F9F8F6] text-gray-900 antialiased font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
        <style>{`
          .font-serif { font-family: 'Cormorant Garamond', serif !important; }
          .font-sans { font-family: 'Inter', sans-serif !important; }
        `}</style>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
