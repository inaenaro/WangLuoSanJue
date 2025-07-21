import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const myFont = localFont({
  src: '../public/fonts/LXGWWenKaiLite-Medium.ttf',
  display: 'swap',
  variable: "--font-ch"
});

export const metadata: Metadata = {
  title: "网络三绝"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${myFont.variable} antialiased`}
      >
        <Providers>
          <main className="relative flex min-h-screen p-4 text-text bg-background3" >
            <div className="bg-background1 w-full rounded-md">
              <Header title="网络三绝" />
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
