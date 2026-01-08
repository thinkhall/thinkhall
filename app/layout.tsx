import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/SessionProvider";
import { Toaster } from "sonner";
import ClientLayout from "@/components/ClientLayout"; // Ensure this is imported

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thinkhall Academy",
  description: "Build Your Future with Thinkhall Academy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {/* ClientLayout handles hiding Nav/Footer logic */}
          <ClientLayout>{children}</ClientLayout>

          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
