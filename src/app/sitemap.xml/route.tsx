// app/sitemap.xml/route.tsx

import { getData } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  const c = await getData();
  const baseUrl = `https://${c.data.domainName}`;

  const staticPages = ["", "/about", "/contact"];

  const urls = staticPages
    .map((page) => {
      return `
  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  `;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
