import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { getDomain, getData } from "@/lib/data";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata() {
  const domain = getDomain();
  const c = await getData();

  return {
    title: c.data.title,
    description: c.data.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
