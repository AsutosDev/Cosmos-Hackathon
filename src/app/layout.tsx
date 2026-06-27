import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActionButton from "@/components/FloatingActionButton";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Bhada Maa | Your Community Marketplace",
  description: "Borrow and lend items with ease. Secure, sustainable, and friendly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} antialiased`}>
      <body className="font-outfit">
        <div className="page-background">
          <main className="max-w-[1600px] w-full mx-auto px-[60px] py-10">
            <Navbar />
            <div className="flex-1">
              {children}
            </div>
            <FloatingActionButton />
            <Footer />
          </main>
        </div>
      </body>
    </html>
  );
}
