// app/robots.txt/route.tsx

import { getData } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  const c = await getData();

  const content = `
User-agent: *
Allow: /

Sitemap: https://${c.data.domainName}/sitemap.xml
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
