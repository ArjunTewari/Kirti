import type { Metadata } from "next";
import { Lora, Raleway } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kirti Yoga",
  description: "Yoga class management for teachers and students",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lora.variable} ${raleway.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-raleway, system-ui)" }}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
