import type { MetadataRoute } from "next";
import { ALL_ITEMS, LOCATIONS } from "@/lib/data";

const SITE = "https://twinbrothersbahamas.com/";

const ROUTES = [
  "",
  "/menu",
  "/reservations",
  "/reservations/confirmation",
  "/events",
  "/events/birthdays",
  "/cruise-visitors",
  "/locations",
  "/gallery",
  "/about",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...ROUTES.map((r) => ({
      url: `${SITE}${r}`,
      lastModified: now,
      changeFrequency: (r === "" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: r === "" ? 1 : r === "/menu" || r === "/reservations" ? 0.9 : 0.7,
    })),
    ...ALL_ITEMS.map((i) => ({
      url: `${SITE}menu/${i.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...LOCATIONS.map((l) => ({
      url: `${SITE}locations/${l.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
