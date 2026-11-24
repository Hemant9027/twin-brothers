import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import EventEnquiryForm from "@/components/EventEnquiryForm";
import { Reveal, Section, Btn } from "@/components/ui";
import { waLink } from "@/lib/wa";
import { BRAND, STORY } from "@/lib/data";
import { Cake, MessageCircle, Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Birthday Celebrations — Book a Birthday Table in Nassau",
  description:
    "Plan a birthday celebration at Twin Brothers Seafood & Steakhouse, Arawak Cay, Nassau: party sizes, seating preferences, daiquiris and a multi-step birthday enquiry.",
  alternates: { canonical: "/events/birthdays" },
  keywords: ["birthday dinner Nassau", "group dining Nassau birthday", "Arawak Cay birthday party"],
};

const STEPS = [
  {
    n: "01",
    t: "Tell us the size",
    d: "Rough headcount, date and preferred time. Groups of two to three hundred can be filed here; anything bigger goes through catering.",
  },
  {
    n: "02",
    t: "Flag it as a birthday",
    d: "The restaurant's own booking form carries a Birthday occasion field — choose it and the team sets the table up for it. This concept mirrors that.",
  },
  {
    n: "03",
    t: "We confirm, not the form",
    d: "Availability for a large party is always confirmed by the restaurant. Your reference here is a demo record in this browser only.",
  },
];

export default function BirthdaysPage() {
  return (
    <>
      <PageHero
        eyebrow="Birthday celebrations"
        title="Blow out the candles over the water."
        intro="Birthdays sit on the restaurant's own catering list, and its booking form has a dedicated Birthday occasion. This page wires that into a proper group enquiry for the whole party."
        image="/images/official/2026/08/home-b2-conch-fritters-full.jpg"
        crumbs={[{ label: "Events", href: "/events" }, { label: "Birthdays" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Btn href="#enquiry" variant="coral">Plan the birthday <ArrowRight size={14} /></Btn>
          <Btn href="/menu/daiquiris" variant="paper">See the daiquiri sizes</Btn>
        </div>
      </PageHero>

      <Section
        index="01"
        eyebrow="How it works"
        title="Three steps, then the team takes over"
        action={
          <a
            href={waLink(
              `Hello Twin Brothers! I'd like to enquire about a birthday celebration at your Arawak Cay restaurant.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-sea hover:underline"
          >
            <MessageCircle size={15} /> Or message the team now
          </a>
        }
      >
        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.07}>
              <article className="border-t-2 border-coral pt-5">
                <span className="tabular font-sans text-[0.7rem] font-semibold tracking-[0.2em] text-coral">
                  {s.n}
                </span>
                <h3 className="mt-3 text-[1.4rem] leading-tight">{s.t}</h3>
                <p className="mt-3 text-[0.94rem] leading-relaxed text-mute">{s.d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="relative isolate overflow-hidden bg-ink text-paper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/official/2026/09/home-gallery-dining-room.jpg"
          alt="The covered dining room at dusk, set for a celebration"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35"
          loading="lazy"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/45" />
        <div className="grain absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-[88rem] grid-cols-12 gap-x-6 gap-y-8 px-5 py-20 sm:px-8 md:px-10 md:py-24">
          <div className="col-span-12 md:col-span-2">
            <span className="eyebrow text-coral">02 · The table</span>
          </div>
          <div className="col-span-12 md:col-span-6">
            <h2 className="text-[clamp(1.9rem,4.4vw,3.2rem)] leading-[1.03]">
              What we&apos;re allowed to promise, and what we&apos;re not.
            </h2>
            <ul className="mt-7 space-y-4">
              {[
                ["Promised", "A birthday occasion field on the booking form, and birthday parties on the restaurant's published catering list."],
                ["Promised", "Seating preferences — indoor room, waterfront, upstairs bar & patio, or one large table."],
                ["Not promised here", "Cake service, decorations, fixed group menus or discounted rates: none of that is published, so we don't offer it."],
                ["Not promised here", "Availability. Large parties are confirmed by the restaurant."],
              ].map(([k, v], i) => (
                <li key={i} className="flex flex-wrap gap-x-4 gap-y-1 border-b border-paper/20 pb-4">
                  <span
                    className={`eyebrow w-32 shrink-0 ${
                      k === "Promised" ? "text-sea" : "text-coral"
                    }`}
                  >
                    {k}
                  </span>
                  <span className="flex-1 text-[0.96rem] text-paper/85">{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 md:col-span-4">
            <div className="border border-paper/25 p-6">
              <Cake size={24} className="text-coral" />
              <p className="mt-4 font-display text-2xl leading-tight">
                {STORY.catering.length} occasions on the published catering list
              </p>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-paper/70">
                {STORY.catering.slice(0, 6).join(" · ")} — and more.
              </p>
              <a
                href={BRAND.phoneHref}
                className="mt-5 inline-flex items-center gap-2 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-sea hover:text-paper"
              >
                <Sparkles size={14} /> Catering {BRAND.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="enquiry" className="paper scroll-mt-24 py-20 md:py-28">
        <div className="mx-auto grid max-w-[88rem] grid-cols-12 gap-x-6 gap-y-10 px-5 sm:px-8 md:px-10">
          <div className="col-span-12 lg:col-span-4">
            <span className="eyebrow text-coral">03 · Enquiry</span>
            <h2 className="mt-4 text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.03]">
              Start the birthday enquiry.
            </h2>
            <p className="mt-5 max-w-[44ch] text-[0.96rem] leading-relaxed text-mute">
              Pre-set to <strong className="font-semibold text-ink">Birthday celebration</strong>{" "}
              at Arawak Cay. Change anything you like — three short steps, then you get a demo
              reference.
            </p>
            <div className="mt-6 border border-ink/15 bg-sand/40 p-5">
              <p className="eyebrow text-mute">Good to include</p>
              <ul className="mt-3 space-y-2 text-[0.88rem] text-ink/75">
                <li>Headcount (even if it moves)</li>
                <li>Anything the kitchen should know</li>
                <li>Where the candles are coming from</li>
                <li>Whether the whole party arrives together</li>
              </ul>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-8">
            <div className="border border-ink/15 bg-paper p-6 sm:p-9">
              <EventEnquiryForm source="birthdays" defaultType="Birthday celebration" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
