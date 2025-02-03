"use client";
import { Oswald } from "next/font/google"; // Importing Bangers font
import "./globals.css";
import { PrivyProvider } from "@privy-io/react-auth";
import { privyConfig } from "../lib/privyConfig";
import { config } from "../lib/wagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "@privy-io/wagmi";
import Header from "@/components/Header";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: "400",
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${oswald.className}`}>
        <PrivyProvider appId="cm6gnt8v801ze12vjotttzrat" config={privyConfig}>
          <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
              <Header />
              {children}
            </WagmiProvider>
          </QueryClientProvider>
        </PrivyProvider>
      </body>
    </html>
  );
}
