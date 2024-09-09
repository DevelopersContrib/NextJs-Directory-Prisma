import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getDomain, getData } from "@/lib/data";
import "./public.scss";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata() {
  const domain = getDomain();
  const c = await getData();

  return {
    title: c.data.title,
    description: c.data.description,
  };
}

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
