import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal, Section, Btn } from "@/components/ui";
import { STORY, LOCATIONS, BRAND, REVIEWS } from "@/lib/data";
import Link from "next/link";
import { ArrowRight, Sparkles, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Story — Two Brothers, One Daiquiri Recipe, Three Generations",
  description:
    "From Buddy and Danny McCardy's daiquiri stand at the Old Straw Market to the family restaurant on the Fish Fry at Arawak Cay, Nassau: conch, snapper and the World Famous Daiquiris, thirty years on.",
  alternates: { canonical: "/about" },
  keywords: ["Twin Brothers Nassau story", "Bahamian seafood Nassau", "Arawak Cay Fish Fry history"],
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        title={STORY.headline}
        intro={STORY.lede}
        image="/images/official/2026/09/home-b2-daiquiri-miami-vice-2026.jpg"
        crumbs={[{ label: "About" }]}
        align="wide"
      >
        <div className="flex flex-wrap gap-3">
          <Btn href="/menu" variant="coral">Explore Our Menu <ArrowRight size={14} /></Btn>
          <Btn href="/reservations" variant="paper">Reserve a Table</Btn>
        </div>
      </PageHero>

      <Section index="01" eyebrow="It started with two brothers" title="Before there was a kitchen, there were two brothers and a daiquiri recipe.">
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,380px)] lg:items-start">
          <div className="space-y-5 text-[1.02rem] leading-[1.75] text-ink/82">
            {STORY.chapters[0].body.slice(1).map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className={i === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-[4.2rem] first-letter:leading-[0.78] first-letter:text-coral" : ""}>
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <div className="border border-ink/15 bg-sand/40 p-6">
              <p className="eyebrow text-coral">Timeline</p>
              <ol className="mt-5 space-y-5">
                {[
                  ["Then", "Buddy and Danny McCardy, identical twins from Eleuthera, work the Nassau hotels and blend frozen daiquiris on the side."],
                  ["The stand", "The daiquiris earn a name downtown at the Old Straw Market — and then customers start asking for food."],
                  ["The Fish Fry", "The stand becomes a restaurant and finds its home on the water at Arawak Cay."],
                  ["Today", "More than thirty years on, the same family still runs the room, and the fresh-up tradition keeps it new."],
                ].map(([k, v], i) => (
                  <li key={k} className="flex gap-4 border-b border-ink/15 pb-4 last:border-0">
                    <span className="tabular shrink-0 font-sans text-[0.66rem] font-semibold text-coral">
                      0{i + 1}
                    </span>
                    <span>
                      <span className="block font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink">{k}</span>
                      <span className="mt-1 block text-[0.9rem] leading-relaxed text-mute">{v}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </Section>

      <section className="relative isolate overflow-hidden bg-ink text-paper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/official/2026/09/home-b2-conch-salad-2026.jpg"
          alt="Bahamian conch salad at Twin Brothers, Arawak Cay"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45"
          loading="lazy"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        <div className="grain absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-[88rem] grid-cols-12 gap-x-6 gap-y-8 px-5 py-20 sm:px-8 md:px-10 md:py-28">
          <div className="col-span-12 md:col-span-2">
            <span className="eyebrow text-coral">02 · The fresh-up</span>
          </div>
          <div className="col-span-12 md:col-span-6">
            <h2 className="text-[clamp(1.9rem,4.4vw,3.3rem)] leading-[1.03]">
              {STORY.chapters[1].title}
            </h2>
            {STORY.chapters[1].body.map((p) => (
              <p key={p.slice(0, 24)} className="mt-5 text-[1rem] leading-relaxed text-paper/78">
                {p}
              </p>
            ))}
            <p className="mt-7 flex items-center gap-2 font-sans text-[0.74rem] uppercase tracking-[0.16em] text-sea">
              <Sparkles size={14} /> Same fire-grill, same conch, same faces
            </p>
          </div>
          <div className="col-span-12 md:col-span-4">
            <figure className="border border-paper/25 p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/official/2026/09/about-now-servers-2026.jpg"
                alt="Two servers taking an order at a table in the dining room"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <figcaption className="mt-3 font-sans text-[0.76rem] leading-relaxed text-paper/60">
                Fresh paint and a new bar are the tradition, not a trend — the room you sit in
                today.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <Section
        index="03"
        eyebrow="Our corner of Arawak Cay"
        title={STORY.chapters[2].title}
        intro={STORY.chapters[2].body[0]}
        action={
          <div className="flex flex-wrap gap-3">
            <Btn href="/cruise-visitors" variant="ink">Coming off a cruise ship?</Btn>
            <a
              href={BRAND.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-ink/30 px-6 py-3.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-paper"
            >
              <MapPin size={15} /> View on Google Maps
            </a>
          </div>
        }
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[STORY.chapters[2].title, "Catering beyond dinner", "More than one Twin Brothers"].map(
            (t, i) => (
              <Reveal key={t} delay={i * 0.06}>
                <article className="h-full border-t-2 border-ink pt-5">
                  <h3 className="text-[1.35rem] leading-tight">{t}</h3>
                  <p className="mt-3 text-[0.94rem] leading-relaxed text-mute">
                    {i === 0 && "Right by the beach on Arawak Cay, minutes from downtown Nassau and a 25-minute walk from Prince George Wharf."}
                    {i === 1 &&
                      "Weddings, birthday parties, baby and bridal showers, repasts, family dinners, retirements, engagements, reunions, corporate and holiday parties."}
                    {i === 2 &&
                      "Boyd Road, Prince Charles Drive (South), Carmichael Road and Hatchet Bay on Eleuthera — smaller counters run by the same family."}
                  </p>
                  <div className="mt-4">
                    {i === 0 ? (
                      <Link href="/locations" className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-coral hover:underline">All locations →</Link>
                    ) : i === 1 ? (
                      <Link href="/events" className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-coral hover:underline">Group enquiries →</Link>
                    ) : (
                      <Link href="/locations" className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-coral hover:underline">Where to find us →</Link>
                    )}
                  </div>
                </article>
              </Reveal>
            )
          )}
        </div>
        <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          {STORY.catering.map((c) => (
            <li key={c} className="flex items-baseline gap-3 border-b border-ink/15 pb-3">
              <span className="font-sans text-[0.92rem]">{c}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 font-sans text-[0.86rem] text-mute">
          Twin Brothers Catering, Tel:{" "}
          <a href={BRAND.phoneHref} className="font-semibold text-sea hover:underline">{BRAND.phone}</a>
        </p>
      </Section>

      <Section index="04" eyebrow="On camera" tone="sand" title="Guests keep posting from the Fish Fry" tight>
        <div className="grid gap-6 md:grid-cols-3">
          {REVIEWS.items.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.06}>
              <figure className="h-full border-t-2 border-ink bg-paper p-5">
                <blockquote className="font-display text-[1.05rem] leading-[1.5]">&ldquo;{r.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 border-t border-ink/15 pt-3">
                  <span className="block font-sans text-[0.86rem] font-semibold">{r.name}</span>
                  <span className="block font-sans text-[0.68rem] uppercase tracking-[0.14em] text-mute">{r.meta}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 max-w-[76ch] font-sans text-[0.8rem] leading-relaxed text-mute">
          {REVIEWS.sourceNote}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Btn href="/about" variant="outline">Back to the top of this story</Btn>
          <Btn href="/reservations" variant="coral">Come pull up a chair <ArrowRight size={14} /></Btn>
        </div>
      </Section>

      <section className="paper border-t border-ink/15 py-16">
        <div className="mx-auto flex max-w-[88rem] flex-wrap items-end justify-between gap-6 px-5 sm:px-8 md:px-10">
          <div>
            <p className="eyebrow text-coral">Come be part of it</p>
            <h2 className="mt-3 max-w-[18ch] text-[clamp(1.8rem,4vw,3rem)] leading-[1.05]">
              You&apos;ve read the story. Now pull up a chair.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Btn href="/reservations" variant="coral">Reserve a Table</Btn>
            <Btn href="/menu" variant="outline">See what to order</Btn>
          </div>
        </div>
        <div className="mx-auto mt-10 grid max-w-[88rem] gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4 sm:px-8 md:px-10">
          {LOCATIONS.map((l) => (
            <Link
              key={l.slug}
              href={`/locations/${l.slug}`}
              className="group border border-ink/15 p-4 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              <span className="eyebrow block opacity-60">{l.area}</span>
              <span className="mt-1.5 block font-display text-[1.2rem]">{l.name}</span>
              <span className="tabular mt-1 block font-sans text-[0.8rem] opacity-70">{l.phone}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
