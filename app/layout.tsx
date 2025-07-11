import type { Metadata } from "next";
import { Geist, Geist_Mono, VT323 } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: "--font-vt323"
})

export const metadata: Metadata = {
  title: "Vik's Portfolio",
  description: "Made at home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
     <head>
       <meta name="viewport" content="width=device-width, initial-scale=1" />
       <meta name="apple-mobile-web-app-capable" content="yes" />
       <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
     </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${vt323.variable} antialiased`}
      >
        {/* <Navbar /> */}
        {children}
      </body>
    </html>
  );
}
