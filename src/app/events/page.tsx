import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import EventEnquiryForm from "@/components/EventEnquiryForm";
import { Reveal, Section, Btn } from "@/components/ui";
import { waLink } from "@/lib/wa";
import { EVENT_TYPES, STORY, EXPERIENCES, BRAND } from "@/lib/data";
import Link from "next/link";
import { ArrowRight, Users, CalendarCheck, UtensilsCrossed, Ship, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Group Dining & Private Events in Nassau",
  description:
    "Group dining, corporate dinners, reunions, cruise passenger groups and private celebrations at Twin Brothers Seafood & Steakhouse, Arawak Cay, Nassau — multi-step event enquiry.",
  alternates: { canonical: "/events" },
  keywords: ["group dining Nassau", "private dining Arawak Cay", "corporate dining Nassau", "cruise group dining Bahamas"],
};

const BENEFITS = [
  {
    icon: Users,
    title: "One kitchen, one bill conversation",
    body: "Group menus, dietary notes and timings are handled by the same team that runs the room — catering enquiries go straight to them.",
  },
  {
    icon: CalendarCheck,
    title: "Occasion-aware setups",
    body: "The official booking form carries occasion fields, including Birthday — choose it and the team sets the table up for it.",
  },
  {
    icon: UtensilsCrossed,
    title: "The full menu travels",
    body: "Conch salads, cracked conch, fire-grilled snapper, steaks, the World Famous Daiquiris, guava duff — no separate event-only menu is published.",
  },
  {
    icon: Ship,
    title: "Ship-excursion groups",
    body: "Arriving together from Prince George Wharf? Files as an event enquiry so the team can confirm the whole party at once.",
  },
];

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Group dining & events"
        title="The whole party, at one table on the water."
        intro="Weddings, birthdays, showers, repasts, family dinners, retirements, engagements, reunions, corporate and holiday parties — the catering list the restaurant publishes, gathered into one enquiry."
        image="/images/official/2026/09/home-gallery-dining-room.jpg"
        crumbs={[{ label: "Events" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Btn href="#enquiry" variant="coral">Start an event enquiry <ArrowRight size={14} /></Btn>
          <Btn href="/events/birthdays" variant="paper">Birthday celebrations</Btn>
        </div>
      </PageHero>

      <Section
        index="01"
        eyebrow="Who books"
        title="Occasions the team already handles"
        intro="Taken verbatim from the catering list published on the restaurant's own site. Nothing here is invented."
      >
        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {STORY.catering.map((c, i) => (
            <Reveal as="li" key={c} delay={i * 0.03} className="flex items-baseline gap-3 border-b border-ink/15 pb-3">
              <span className="tabular font-sans text-[0.66rem] font-semibold text-coral">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-sans text-[0.95rem]">{c}</span>
            </Reveal>
          ))}
        </ul>
        <p className="mt-6 flex flex-wrap items-center gap-3 font-sans text-[0.86rem] text-mute">
          Twin Brothers Catering, Tel:
          <a href={BRAND.phoneHref} className="font-semibold text-sea hover:underline">{BRAND.phone}</a>
        </p>
      </Section>

      <Section
        index="02"
        eyebrow="Group dining benefits"
        tone="sand"
        title="What a group booking gets you"
      >
        <div className="grid gap-8 md:grid-cols-2">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.06}>
              <article className="flex h-full gap-5 border-t-2 border-ink pt-5">
                <b.icon size={22} className="mt-1 shrink-0 text-coral" />
                <div>
                  <h3 className="text-[1.3rem] leading-tight">{b.title}</h3>
                  <p className="mt-3 max-w-[46ch] text-[0.94rem] leading-relaxed text-ink/72">{b.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section index="03" eyebrow="Ways to gather" title="Three shapes a night can take">
        <div className="grid gap-6 md:grid-cols-3">
          {EXPERIENCES.map((e, i) => (
            <Reveal key={e.slug} delay={i * 0.06}>
              <article className="flex h-full flex-col border border-ink/15 bg-paper transition-all hover:border-ink hover:shadow-[0_26px_55px_-38px_rgba(16,45,56,0.8)]">
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={e.image} alt={e.title} className="aspect-[16/10] w-full object-cover" loading="lazy" />
                  <div className="grain absolute inset-0" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-[1.35rem] leading-tight">{e.title}</h3>
                  <p className="mt-3 flex-1 text-[0.92rem] leading-relaxed text-mute">{e.body}</p>
                  <div className="mt-5">
                    {e.slug === "celebrations" ? (
                      <Link href="/events/birthdays" className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-coral hover:underline">
                        Birthday bookings →
                      </Link>
                    ) : e.slug === "group-dining" ? (
                      <a href="#enquiry" className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-coral hover:underline">
                        Start an enquiry →
                      </a>
                    ) : (
                      <Link href="/reservations" className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-coral hover:underline">
                        Reserve a table →
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <section id="enquiry" className="paper scroll-mt-24 border-t border-ink/15 py-20 md:py-28">
        <div className="mx-auto grid max-w-[88rem] grid-cols-12 gap-x-6 gap-y-10 px-5 sm:px-8 md:px-10">
          <div className="col-span-12 lg:col-span-4">
            <span className="eyebrow text-coral">04 · Enquiry</span>
            <h2 className="mt-4 text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.03]">
              Tell us what you&apos;re planning.
            </h2>
            <p className="mt-5 max-w-[44ch] text-[0.96rem] leading-relaxed text-mute">
              Three short steps. The enquiry is filed into this browser and appears in the demo
              staff dashboard — it is not transmitted to the restaurant.
            </p>
            <div className="mt-7 border border-ink/15 bg-sand/40 p-5">
              <p className="eyebrow text-mute">Event types you can pick</p>
              <ul className="mt-3 space-y-1.5">
                {EVENT_TYPES.map((t) => (
                  <li key={t} className="text-[0.88rem] text-ink/75">{t}</li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={waLink("Hello Twin Brothers! I'd like to enquire about a group booking at your Arawak Cay restaurant.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-ink/30 px-6 py-3.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-paper"
              >
                <MessageCircle size={15} /> Ask on WhatsApp instead
              </a>
              <Btn href="/cruise-visitors" variant="outline">Arriving by cruise ship?</Btn>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <div className="border border-ink/15 bg-paper p-6 sm:p-9">
              <EventEnquiryForm source="events" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
