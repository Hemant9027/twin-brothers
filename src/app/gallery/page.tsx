import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";
import { PageHero } from "@/components/PageHero";
import { Btn } from "@/components/ui";

export const metadata: Metadata = {
  title: "Gallery — Conch, Daiquiris & the Fish Fry",
  description:
    "A look around Twin Brothers Seafood & Steakhouse in Nassau: conch salad, cracked conch, whole snapper, the frozen daiquiri row, the dining room at dusk and Arawak Cay itself.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="A look around"
        title="Inside Twin Brothers."
        intro="Conch out of the bowl, daiquiris down the row, the room filling up as the light goes. Photography downloaded from the restaurant's own website."
        image="/images/official/2026/09/home-gallery-dining-room.jpg"
        crumbs={[{ label: "Gallery" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Btn href="/menu" variant="coral">Explore Our Menu</Btn>
          <Btn href="/reservations" variant="paper">Reserve a Table</Btn>
        </div>
      </PageHero>
      <div className="paper py-12 md:py-16">
        <GalleryGrid />
      </div>
    </>
  );
}
