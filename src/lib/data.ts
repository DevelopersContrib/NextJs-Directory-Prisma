import { headers } from "next/headers";
import axios from "axios";

let DOMAIN = process.env.NEXT_PUBLIC_VERCEL_URL;

export function getDomain() {
  try {
    const headersList = headers();
    const referrer = headersList.get("host");
    
    // Check if referrer is null
    if (!referrer) {
      console.warn("Host header is missing, using fallback domain");
      return DOMAIN || "localhost";
    }

    const domainName = referrer.includes("localhost")
      ? DOMAIN || "localhost"
      : referrer.replace("www.", "");
      
    return domainName;
  } catch (error) {
    console.error("Error getting domain:", error);
    return DOMAIN || "localhost";
  }
}

export async function getData() {
  try {
    const domain = getDomain();
    const url = process.env.CONTRIB_API1 + `&domain=${domain}`;
    
    if (!process.env.CONTRIB_API1) {
      console.warn("CONTRIB_API1 environment variable not set");
      return { data: { title: 'Welcome', domainName: domain, description: '', author: '', keywords: '' } };
    }
    
    const res = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    const domain = getDomain();
    return { data: { title: 'Welcome', domainName: domain, description: '', author: '', keywords: '' } };
  }
}

export async function getCategories() {
  const domain = getDomain();
  const url = process.env.GET_CATEGORIES + `&domain=${domain}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getchatdomains(limit: number, keyword: string, sort: string) {
  const domain = getDomain();
  const url = process.env.GET_CHAT_DOMAINS + `&domain=${domain}&limit=${limit}&keyword=${keyword}&sort=${sort}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export async function getScript(url: string) {
  try {
    const res = await axios.get(url);
    return res.data.data.content;
  } catch (e) {
    console.log("Error in getScript", e);
    return { error: "Error in getScript" };
  }
}
