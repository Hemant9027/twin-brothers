import type { Metadata } from "next";
import MenuBrowser from "@/components/MenuBrowser";
import { PageHero } from "@/components/PageHero";
import { Btn } from "@/components/ui";
import { MENU } from "@/lib/data";

export const metadata: Metadata = {
  title: "The Full Menu — Conch, Snapper, Steaks & World Famous Daiquiris",
  description:
    "The complete Twin Brothers menu in Nassau: starters, conch salads, entrées, signature plates, quick bites, sides, kids menu, desserts, the World Famous Daiquiris, cocktails, shots and beverages — with market prices labelled.",
  alternates: { canonical: "/menu" },
  keywords: [
    "Twin Brothers menu Nassau",
    "conch salad Nassau menu",
    "cracked conch price",
    "daiquiris Nassau menu",
    "Arawak Cay restaurant menu",
  ],
};

export default function MenuPage() {
  return (
    <>
      <PageHero
        eyebrow="To start, from the grill, from the bar"
        title="The full menu."
        intro="Thirteen categories, transcribed item by item from the restaurant's live menu. Market prices say market price — we never estimate them. A 15% service charge and 10% VAT are added to the final bill."
        image="/images/official/2026/09/home-b2-conch-salad-2026.jpg"
        crumbs={[{ label: "Menu" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Btn href="/reservations" variant="coral">Reserve a Table</Btn>
          <Btn href="#price-notes" variant="paper">Price &amp; listing notes</Btn>
        </div>
      </PageHero>

      <div className="paper py-10">
        <div className="mx-auto mb-8 flex max-w-[88rem] flex-wrap gap-x-6 gap-y-2 px-5 sm:px-8 md:px-10">
          {MENU.map((c) => (
            <span key={c.slug} className="font-sans text-[0.7rem] uppercase tracking-[0.14em] text-mute">
              {c.name}
            </span>
          ))}
        </div>
        <MenuBrowser />
      </div>
    </>
  );
}
