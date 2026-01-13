import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";

const outfitSans = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meet AI",
  description:
    "Meet AI is a AI meeting agent creation and interaction platform created by Daniel Dao, with heavy inspiration from Code With Antonio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCReactProvider>
      <html lang="en">
        <body
          className={`${outfitSans.variable} ${outfitSans.className} antialiased`}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </TRPCReactProvider>
  );
}
