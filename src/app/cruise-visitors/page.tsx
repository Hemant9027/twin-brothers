import type { Metadata } from "next";
import EventEnquiryForm from "@/components/EventEnquiryForm";
import { PageHero } from "@/components/PageHero";
import { Reveal, Section, Btn, PriceTag } from "@/components/ui";
import { waLink } from "@/lib/wa";
import { BRAND, MENU } from "@/lib/data";
import Link from "next/link";
import {
  Ship,
  Footprints,
  MapPin,
  Clock,
  MessageCircle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Cruise Visitors — Dining Steps from Prince George Wharf, Nassau",
  description:
    "Visiting Nassau on a cruise? Twin Brothers Seafood & Steakhouse sits on the water at the Arawak Cay Fish Fry: conch salad, cracked conch, whole snapper and the World Famous Daiquiris, plus a cruise group enquiry.",
  alternates: { canonical: "/cruise-visitors" },
  keywords: ["restaurants near Nassau cruise port", "Arawak Cay restaurants", "Nassau seafood restaurant", "conch salad Nassau"],
};

const QUICK = [
  { slug: "bahamian-conch-salad" },
  { slug: "conch-fritters" },
  { slug: "cracked-conch" },
  { slug: "bahamian-snapper" },
];

export default function CruisePage() {
  const quick = QUICK.map((q) =>
    MENU.flatMap((c) => c.items).find((i) => i.slug === q.slug)
  ).filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow="For cruise visitors"
        title="Off the ship, onto the water."
        intro="Twin Brothers sits at the Fish Fry on Arawak Cay — the restaurant's own site describes it as an easy 25-minute walk from Prince George Wharf, right on the water."
        image="/images/official/2026/09/about-locale-harbour-2026.jpg"
        crumbs={[{ label: "Cruise visitors" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Btn href="#enquiry" variant="coral">Cruise group enquiry <ArrowRight size={14} /></Btn>
          <Btn href="/reservations" variant="paper">Reserve a table</Btn>
        </div>
      </PageHero>

      <Section
        index="01"
        eyebrow="The facts we can stand behind"
        title="Everything on this page is sourced"
        intro="Cruise days are tight, so nothing here is promised loosely. Each line below is either published by the restaurant or explicitly marked as unverified."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              icon: Footprints,
              ok: true,
              k: "Walk from the cruise port",
              v: `${BRAND.cruiseWalk} This is the restaurant's own published wording — not a measurement made here.`,
            },
            {
              icon: MapPin,
              ok: true,
              k: "Where",
              v: `${BRAND.streetAddress}, ${BRAND.city}. Right on the water at the Fish Fry, minutes from downtown Nassau and beside the beach.`,
            },
            {
              icon: Clock,
              ok: true,
              k: "Hours",
              v: `${BRAND.hoursNote} on the official site. Third-party listings disagree — see the reservations page for the full conflict list.`,
            },
            {
              icon: Ship,
              ok: false,
              k: "Return times, ship schedules, guaranteed seating",
              v: "Not published and not promised by this concept. Build your own buffer around your ship's all-aboard time.",
            },
          ].map((f, i) => (
            <Reveal key={f.k} delay={i * 0.06}>
              <article
                className={`h-full border-t-2 p-5 ${
                  f.ok ? "border-sea bg-sand/30" : "border-coral bg-coral/[0.06]"
                }`}
              >
                <p className="flex items-center gap-2 eyebrow text-ink">
                  <f.icon size={15} className={f.ok ? "text-sea" : "text-coral"} />
                  {f.k}
                </p>
                <p className="mt-3 text-[0.94rem] leading-relaxed text-ink/80">{f.v}</p>
                {!f.ok && (
                  <p className="mt-3 inline-flex items-center gap-1.5 font-sans text-[0.68rem] uppercase tracking-[0.14em] text-coral">
                    <AlertTriangle size={12} /> Unverified — not promised
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={BRAND.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-ink px-6 py-3.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-paper transition-all hover:bg-sea"
          >
            <MapPin size={15} /> Open in Google Maps
          </a>
          <a
            href={waLink(
              `Hello Twin Brothers! I'm visiting from a cruise ship — is there a table available?`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-ink/30 px-6 py-3.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-paper"
          >
            <MessageCircle size={15} /> WhatsApp {BRAND.whatsapp}
          </a>
        </div>
      </Section>

      <Section index="02" eyebrow="Order this" tone="sand" title="If the afternoon is short" tight
        intro="Four plates the restaurant leads with on its own homepage. Prices are the live menu's; the snapper is market price."
      >
        <ul className="border-t-2 border-ink">
          {quick.map((it, i) =>
            it ? (
              <Reveal as="li" key={it.slug} delay={i * 0.05}>
                <Link
                  href={`/menu/${it.slug}`}
                  className="group grid grid-cols-[1fr_auto] items-baseline gap-5 border-b border-ink/20 py-4 transition-colors hover:bg-paper/70"
                >
                  <span>
                    <span className="font-display text-[1.3rem] transition-colors group-hover:text-sea">
                      {it.name}
                    </span>
                    <span className="mt-1 block max-w-[64ch] text-[0.9rem] leading-relaxed text-ink/65">
                      {it.desc ?? "Description not published on the current menu."}
                    </span>
                  </span>
                  <PriceTag price={it.price} priceLabel={it.priceLabel} />
                </Link>
              </Reveal>
            ) : null
          )}
        </ul>
        <p className="mt-5 font-sans text-[0.84rem] leading-relaxed text-ink/65">
          Conch salads are made with raw conch and the restaurant notes an average preparation
          time of 30 to 45 minutes — worth knowing against a ship timetable.{" "}
          <Link href="/menu" className="underline hover:text-sea">See the full menu</Link>.
        </p>
      </Section>

      <section id="enquiry" className="paper scroll-mt-24 border-t border-ink/15 py-20 md:py-28">
        <div className="mx-auto grid max-w-[88rem] grid-cols-12 gap-x-6 gap-y-10 px-5 sm:px-8 md:px-10">
          <div className="col-span-12 lg:col-span-4">
            <span className="eyebrow text-coral">03 · Group enquiry</span>
            <h2 className="mt-4 text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.03]">
              Bringing the whole table off the ship?
            </h2>
            <p className="mt-5 max-w-[44ch] text-[0.96rem] leading-relaxed text-mute">
              Ship excursion groups are filed as an event enquiry rather than a table booking, so
              the team can confirm everyone at once. Add your ship name and arrival date.
            </p>
            <div className="mt-6 border border-ink/15 bg-sand/40 p-5">
              <p className="eyebrow text-mute">This form does not</p>
              <ul className="mt-3 space-y-2 text-[0.88rem] text-ink/75">
                <li>Reserve or hold a table</li>
                <li>Know your ship&apos;s schedule</li>
                <li>Promise seating for a fixed time</li>
                <li>Send anything outside this browser</li>
              </ul>
            </div>
            <div className="mt-6">
              <Btn href="/events" variant="outline">All group &amp; event enquiries</Btn>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <div className="border border-ink/15 bg-paper p-6 sm:p-9">
              <EventEnquiryForm source="cruise" defaultType="Cruise passenger group" cruiseFields />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
