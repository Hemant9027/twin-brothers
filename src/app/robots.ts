import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/demo/dashboard", "/reservations/confirmation"],
      },
    ],
    sitemap: "https://twinbrothersbahamas.com/sitemap.xml",
  };
}
