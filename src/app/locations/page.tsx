import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Clock, ArrowUpRight, AlertTriangle } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal, Section, Btn } from "@/components/ui";
import { HOURS_CONFLICT, LOCATIONS, BRAND } from "@/lib/data";

export const metadata: Metadata = {
  title: "Locations — Arawak Cay, Boyd Road, Prince Charles Drive, Carmichael Road, Hatchet Bay",
  description:
    "Where to find Twin Brothers Seafood & Steakhouse in Nassau and Eleuthera: the Fish Fry at Arawak Cay plus the family's other island counters, with published phone numbers and clearly marked gaps.",
  alternates: { canonical: "/locations" },
  keywords: ["Arawak Cay restaurants", "Twin Brothers Nassau locations", "Nassau seafood restaurant"],
};

export default function LocationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Find us"
        title="Arawak Cay is home. Same name, same kitchen, same people."
        intro="Five Twin Brothers spots are listed on the restaurant's current official site. Where an address or opening hours are not published, we show the gap instead of filling it."
        image="/images/official/2026/09/about-locale-harbour-2026.jpg"
        crumbs={[{ label: "Locations" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Btn href="#all" variant="coral">See all five <ArrowUpRight size={14} /></Btn>
          <Btn href="/reservations" variant="paper">Reserve at Arawak Cay</Btn>
        </div>
      </PageHero>

      <Section
        index="01"
        eyebrow="Featured"
        title="On the Fish Fry, Arawak Cay"
        intro="The full dining room, the fire-grill, the daiquiri bar — and the only location on the current site that takes online table requests."
      >
        <Reveal>
          <Link
            href="/locations/arrawak-cay"
            className="group grid gap-7 border border-ink/20 bg-paper p-5 transition-all hover:border-ink hover:shadow-[0_34px_70px_-46px_rgba(16,45,56,0.85)] sm:p-7 md:grid-cols-2"
          >
            <div className="relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/official/2026/09/about-locale-harbour-2026.jpg"
                alt="Arawak Cay waterfront, Nassau"
                className="aspect-[16/10] w-full object-cover transition-transform duration-[1.1s] group-hover:scale-105"
              />
              <div className="grain absolute inset-0" />
              <span className="absolute left-0 top-0 bg-coral px-3 py-1.5 font-sans text-[0.6rem] font-bold uppercase tracking-[0.18em] text-paper">
                Featured
              </span>
            </div>
            <div className="flex flex-col">
              <span className="eyebrow text-coral">Arawak Cay · Nassau</span>
              <h3 className="mt-3 text-[clamp(1.7rem,3.4vw,2.6rem)] leading-none">
                Arawak Cay — the Fish Fry
              </h3>
              <p className="mt-4 text-[0.96rem] leading-relaxed text-mute">{LOCATIONS[0].blurb}</p>
              <dl className="mt-6 space-y-3 border-t border-ink/15 pt-5 text-[0.9rem]">
                <div className="flex gap-3">
                  <dt><MapPin size={15} className="text-coral" /></dt>
                  <dd>{LOCATIONS[0].address}</dd>
                </div>
                <div className="flex gap-3">
                  <dt><Clock size={15} className="text-coral" /></dt>
                  <dd className="tabular">{BRAND.hoursNote}</dd>
                </div>
                <div className="flex gap-3">
                  <dt><Phone size={15} className="text-coral" /></dt>
                  <dd className="tabular">{BRAND.phone}</dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 border border-ink/30 px-4 py-2.5 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors group-hover:bg-ink group-hover:text-paper">
                  Location details
                </span>
                <span className="inline-flex items-center gap-2 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-sea">
                  Accepts online table requests
                </span>
              </div>
            </div>
          </Link>
        </Reveal>
      </Section>

      <Section index="02" eyebrow="Also ours" tone="sand" id="all" title="The other four"
        intro="Smaller counters where locals grab conch salad, fritters, daiquiris and a few small bites on the way home."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LOCATIONS.slice(1).map((l, i) => (
            <Reveal key={l.slug} delay={i * 0.06}>
              <Link
                href={`/locations/${l.slug}`}
                className="group flex h-full flex-col border border-ink/20 bg-paper transition-all hover:border-ink hover:shadow-[0_26px_55px_-38px_rgba(16,45,56,0.8)]"
              >
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={l.image}
                    alt={l.name}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-[1s] group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="grain absolute inset-0" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="eyebrow text-mute">{l.area}</span>
                  <h3 className="mt-2 text-[1.3rem] leading-tight">{l.name}</h3>
                  <p className="mt-3 flex-1 text-[0.86rem] leading-relaxed text-mute">
                    {l.addressVerified ? l.address : "Street address not published on the current site."}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-ink/15 pt-3">
                    <span className="tabular font-sans text-[0.8rem] font-semibold">{l.phone}</span>
                    <ArrowUpRight size={15} className="text-ink/30 transition-all group-hover:translate-x-0.5 group-hover:text-coral" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        index="03"
        eyebrow="Flagged"
        title="Hours and numbers that disagree"
        intro="Rather than silently pick a version, here is every conflicting source we found for the flagship location."
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="border border-coral/45 bg-coral/[0.05] p-6">
            <p className="flex items-center gap-2 eyebrow text-coral">
              <AlertTriangle size={14} /> Opening hours
            </p>
            <ul className="mt-4 divide-y divide-ink/12">
              {HOURS_CONFLICT.map((h) => (
                <li key={h.source} className="py-3">
                  <p className="tabular font-sans text-[0.94rem] font-semibold">{h.value}</p>
                  <p className="mt-1 font-sans text-[0.74rem] text-mute">{h.source}</p>
                  <p
                    className={`mt-1 font-sans text-[0.66rem] uppercase tracking-[0.12em] ${
                      h.status === "Used on this concept" ? "text-sea" : "text-coral"
                    }`}
                  >
                    {h.status}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-ink/15 p-6">
            <p className="flex items-center gap-2 eyebrow text-coral">
              <AlertTriangle size={14} /> Phone numbers
            </p>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="eyebrow text-mute">Used on this concept (official site)</dt>
                <dd className="tabular mt-1 font-display text-2xl">{BRAND.phone}</dd>
              </div>
              <div>
                <dt className="eyebrow text-mute">Published by TripAdvisor &amp; older directories</dt>
                <dd className="tabular mt-1 font-display text-2xl text-mute">
                  {BRAND.phoneDiscrepancy.other}
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-mute">WhatsApp (from the official booking page)</dt>
                <dd className="tabular mt-1 font-display text-2xl text-sea">{BRAND.whatsapp}</dd>
              </div>
            </dl>
            <p className="mt-4 text-[0.86rem] leading-relaxed text-mute">
              {BRAND.phoneDiscrepancy.note} Legacy directory listings also name branches —
              Potter&apos;s Cay Dock, Coconut Grove and the Mall at Marathon — that no longer
              appear on the official site, so they are not listed here.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Btn href="/contact" variant="ink">Contact the team</Btn>
          <Btn href="/reservations" variant="outline">Reserve a table</Btn>
        </div>
      </Section>
    </>
  );
}
