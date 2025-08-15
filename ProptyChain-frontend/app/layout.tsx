import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { PageTransition } from "@/components/page-transition"
import "./globals.css"

export const metadata: Metadata = {
  title: "ProptyChain - Transparent Real Estate on Blockchain",
  description:
    "Experience fraud-free property transactions with NFT titles, community reviews, smart contract escrow, and gamified engagement across Nigeria and beyond.",
  generator: "v0.app",
  keywords: "real estate, blockchain, NFT, Web3, Nigeria, property, escrow, reviews",
  authors: [{ name: "ProptyChain Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#c79340",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="antialiased">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
