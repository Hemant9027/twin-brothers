import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ConceptStrip, Footer, FloatingActions, Header } from "@/components/chrome";
import { StoreProvider } from "@/lib/store";
import { BRAND, MENU, LOCATIONS } from "@/lib/data";

const SITE = "https://twinbrothersbahamas.com/";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default:
      "Twin Brothers Seafood & Steakhouse · Bahamian Seafood & Daiquiris · Arawak Cay, Nassau",
    template: "%s · Twin Brothers Seafood & Steakhouse",
  },
  description:
        "Fresh Bahamian seafood, steak and the World Famous Daiquiris at the Fish Fry, Arawak Cay, Nassau — conch salad, cracked conch, whole snapper and group dining minutes from the cruise port. Website concept by InfyCrest Solutions.",
  keywords: [
    "Twin Brothers Nassau",
    "Bahamian seafood Nassau",
    "Arawak Cay restaurants",
    "Nassau seafood restaurant",
    "conch salad Nassau",
    "group dining Nassau",
    "restaurants near Nassau cruise port",
    "Fish Fry Nassau",
    "daiquiris Nassau",
    "cracked conch Bahamas",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: BRAND.name,
    title: "Twin Brothers Seafood & Steakhouse · Arawak Cay, Nassau",
    description:
      "Fresh Bahamian seafood, steak and the World Famous Daiquiris, right on the water at the Fish Fry.",
    images: [{ url: "/images/official/2026/08/hero-v14-2-poster.jpg", width: 1536, height: 1024 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Twin Brothers Seafood & Steakhouse · Arawak Cay, Nassau",
    description:
      "Fresh Bahamian seafood, steak and the World Famous Daiquiris at the Fish Fry.",
    images: ["/images/official/2026/08/hero-v14-2-poster.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#102D38",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Restaurant",
      "@id": `${SITE}#restaurant`,
      name: BRAND.name,
      url: SITE,
      image: `${SITE}/images/official/2026/08/hero-v14-2-poster.jpg`,
      priceRange: BRAND.priceRange,
      servesCuisine: BRAND.cuisines,
      acceptsReservations: BRAND.acceptsReservations,
      telephone: "+1-242-606-3600",
      address: {
        "@type": "PostalAddress",
        streetAddress: BRAND.streetAddress,
        addressLocality: BRAND.city,
        addressCountry: "BS",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: BRAND.geo.latitude,
        longitude: BRAND.geo.longitude,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "11:00",
          closes: "21:00",
        },
      ],
      hasMenu: {
        "@type": "Menu",
        name: "Twin Brothers Menu",
        hasMenuSection: MENU.map((c) => ({
          "@type": "MenuSection",
          name: c.name,
          hasMenuItem: c.items.map((i) => ({
            "@type": "MenuItem",
            name: i.name,
            ...(i.price !== null
              ? { offers: { "@type": "Offer", price: i.price, priceCurrency: "USD" } }
              : {}),
          })),
        })),
      },
      areaServed: "Nassau, New Providence, The Bahamas",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}#website`,
      url: SITE,
      name: BRAND.name,
    },
    ...LOCATIONS.filter((l) => l.addressVerified).map((l) => ({
      "@type": "LocalBusiness",
      name: `${BRAND.name} — ${l.name}`,
      telephone: `+1${l.phone.replace(/\D/g, "")}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: BRAND.streetAddress,
        addressLocality: BRAND.city,
        addressCountry: "BS",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: BRAND.geo.latitude,
        longitude: BRAND.geo.longitude,
      },
    })),
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <StoreProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <FloatingActions />
        </StoreProvider>
      </body>
    </html>
  );
}
