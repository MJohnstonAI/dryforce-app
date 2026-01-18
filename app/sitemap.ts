import type { MetadataRoute } from "next";

function getBaseUrl() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const lastModified = new Date();

  return [
    { url: `${baseUrl}/`, lastModified },
    { url: `${baseUrl}/services`, lastModified },
    { url: `${baseUrl}/about`, lastModified },
    { url: `${baseUrl}/contact`, lastModified },
    { url: `${baseUrl}/emergency`, lastModified },
  ];
}
