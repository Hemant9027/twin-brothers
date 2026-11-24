import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Clock, Phone, MessageCircle, ExternalLink, Users } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { Reveal, Section, Btn } from "@/components/ui";
import { waLink } from "@/lib/wa";
import { BRAND, FAQS, HOURS_CONFLICT, LOCATIONS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact — Arawak Cay, Nassau · Call, WhatsApp or Write",
  description:
    "Contact Twin Brothers Seafood & Steakhouse: address at the Fish Fry Arawak Cay, daily hours, main line, WhatsApp, the four other island locations and the questions guests ask most.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Our home is on the water at the Fish Fry."
        intro="Visiting Nassau or from right here on the island, there's always a seat at our table — call, message, or write it out below."
        image="/images/official/2026/09/about-locale-harbour-2026.jpg"
        crumbs={[{ label: "Contact" }]}
      >
        <div className="flex flex-wrap gap-3">
          <a
            href={BRAND.phoneHref}
            className="inline-flex items-center justify-center gap-2 bg-coral px-6 py-3.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-paper transition-all hover:-translate-y-0.5 hover:bg-coral-dark"
          >
            <Phone size={15} /> Call {BRAND.phone}
          </a>
          <a
            href={waLink("Hello Twin Brothers! I have a question.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-paper/40 px-6 py-3.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-paper hover:text-ink"
          >
            <MessageCircle size={15} /> WhatsApp {BRAND.whatsapp}
          </a>
        </div>
      </PageHero>

      <Section
        index="01"
        eyebrow="Arawak Cay · the Fish Fry"
        title="Find us"
        intro={`${BRAND.hoursNote} · Near downtown, the cruise port, Atlantis and Baha Mar.`}
      >
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="border border-ink/15 bg-paper p-6">
            <p className="eyebrow text-coral">Address</p>
            <p className="mt-3 text-[1rem] leading-relaxed">{LOCATIONS[0].address}</p>
            <a
              href={BRAND.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-sea hover:underline"
            >
              <MapPin size={14} /> View on Google Maps <ExternalLink size={12} />
            </a>
          </div>
          <div className="border border-ink/15 bg-paper p-6">
            <p className="eyebrow text-coral">Hours</p>
            <p className="tabular mt-3 text-[1rem] font-semibold">{BRAND.hoursNote}</p>
            <p className="mt-2 text-[0.86rem] leading-relaxed text-mute">
              As published on the official site. Google and Facebook list different closing
              times — the full list is on the{" "}
              <Link href="/locations" className="underline hover:text-sea">locations page</Link>.
            </p>
            <a
              href="tel:+12426063600"
              className="mt-4 inline-flex items-center gap-2 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-sea hover:underline"
            >
              <Clock size={14} /> Ring before you travel
            </a>
          </div>
          <div className="border border-ink/15 bg-paper p-6">
            <p className="eyebrow text-coral">Reach us</p>
            <ul className="mt-3 space-y-3 text-[0.98rem]">
              <li><a href={BRAND.phoneHref} className="flex items-center gap-2 hover:text-sea"><Phone size={15} /> {BRAND.phone}</a></li>
              <li>
                <a href={waLink("Hello Twin Brothers!")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sea hover:underline">
                  <MessageCircle size={15} /> WhatsApp {BRAND.whatsapp}
                </a>
              </li>
              <li>
                <a href={BRAND.social.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-sea">
                  <Users size={15} /> Facebook page <ExternalLink size={12} />
                </a>
              </li>
              <li className="text-mute">Twin Brothers Catering · {BRAND.phone}</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section index="02" eyebrow="Write to us" tone="sand" title="Prefer to write?">
        <div className="border border-ink/20 bg-paper p-6 sm:p-9">
          <ContactForm />
        </div>
      </Section>

      <Section index="03" eyebrow="Our other places" title="You'll also find us here">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LOCATIONS.slice(1).map((l, i) => (
            <Reveal key={l.slug} delay={i * 0.05}>
              <a
                href={`/locations/${l.slug}`}
                className="group block h-full border border-ink/15 bg-paper p-5 transition-all hover:border-ink hover:shadow-[0_22px_48px_-34px_rgba(16,45,56,0.8)]"
              >
                <span className="eyebrow text-mute">{l.area}</span>
                <span className="mt-2 block font-display text-[1.25rem] leading-tight transition-colors group-hover:text-sea">
                  {l.name}
                </span>
                <span className="tabular mt-3 block font-sans text-[0.82rem] font-semibold">{l.phone}</span>
              </a>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section index="04" eyebrow="Questions" title="Questions we hear most" tight>
        <div className="grid gap-x-12 md:grid-cols-2">
          {FAQS.map((f) => (
            <details key={f.q} className="group border-b border-ink/15 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-1 text-left">
                <span className="font-display text-[1.1rem] leading-snug">{f.q}</span>
                <span className="shrink-0 font-sans text-[1.1rem] text-coral transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 pr-8 text-[0.94rem] leading-relaxed text-ink/75">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 border border-ink/15 p-6">
          <p className="eyebrow text-coral">Conflicting hours we found</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {HOURS_CONFLICT.map((h) => (
              <li key={h.source} className="border-t border-ink/20 pt-3">
                <p className="tabular font-sans text-[0.92rem] font-semibold">{h.value}</p>
                <p className="mt-1 font-sans text-[0.72rem] leading-snug text-mute">{h.source}</p>
                <p
                  className={`mt-1 font-sans text-[0.64rem] uppercase tracking-[0.12em] ${
                    h.status === "Used on this concept" ? "text-sea" : "text-coral"
                  }`}
                >
                  {h.status}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Btn href="/reservations" variant="coral">Reserve a Table</Btn>
          <Btn href="/events" variant="outline">Group &amp; event enquiries</Btn>
        </div>
      </Section>
    </>
  );
}
