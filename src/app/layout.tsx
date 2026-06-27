import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActionButton from "@/components/FloatingActionButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="font-inter">
        <div className="page-background">
          <main className="max-w-[1600px] w-full mx-auto px-[60px] pt-[100px] pb-10">
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
