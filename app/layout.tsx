import type { Metadata } from "next";
import { Bangers, Oswald } from "next/font/google"; // Importing Bangers font
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Russo_One } from "next/font/google";
// Import the Bangers font

// Import the Oswald font
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Only Roasts",
  description: "Get Roasted by your wallet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${oswald.className} antialiased`}>{children}</body>
    </html>
  );
}
