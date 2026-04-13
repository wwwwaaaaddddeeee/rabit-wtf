import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "rabit.wtf",
  description: "Things found on the internet.",
  metadataBase: new URL("https://rabit.wtf"),
  openGraph: {
    title: "rabit.wtf",
    description: "Things found on the internet.",
    url: "https://rabit.wtf",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "rabit.wtf",
    description: "Things found on the internet.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
        {children}
      </body>
    </html>
  );
}
