"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Ship,
  Users,
} from "lucide-react";
import {
  BRAND,
  EXPERIENCES,
  FAQS,
  GALLERY,
  LOCATIONS,
  REVIEWS,
  STORY,
  type MenuItem,
} from "@/lib/data";
import { useStore } from "@/lib/store";
import { Btn, PriceTag, Reveal, Section, waLink } from "./ui";
import { HeroTicket } from "./booking";

/* ---------------------------------------------------------------- */
/* 01 — Cinematic hero                                                */
/* ---------------------------------------------------------------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const scrim = useTransform(scrollYProgress, [0, 1], [0.86, 0.35]);

  const lines = ["Authentic Bahamian", "Flavors. Unforgettable", "Island Moments."];

  return (
    <div ref={ref} className="relative isolate overflow-hidden bg-ink">
      <motion.div
        style={reduce ? undefined : { y }}
        className="absolute inset-0 -z-10 h-[118%] w-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/official/2026/08/hero-v14-2-poster.jpg"
          alt="Cruise ships docked at Prince George Wharf across turquoise water near Arawak Cay, Nassau, with swimmers in the foreground"
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
        />
      </motion.div>
      <motion.div
        style={reduce ? undefined : { opacity: scrim }}
        className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/75 to-ink/10"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-transparent to-ink/45" />
      <div className="grain absolute inset-0 -z-10" />

      <div className="mx-auto flex min-h-[86svh] max-w-[88rem] flex-col justify-end px-5 pb-28 pt-32 sm:px-8 md:px-10 md:pb-36">
        <motion.p
          initial={reduce ? {} : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="eyebrow text-coral"
        >
          Arawak Cay · Nassau, The Bahamas
        </motion.p>

        <h1 className="mt-5 max-w-[16ch] font-display text-[clamp(2.5rem,7.6vw,6.4rem)] text-paper">
          {lines.map((l, i) => (
            <span key={l} className="block overflow-hidden">
              <motion.span
                initial={reduce ? {} : { y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.18 + i * 0.11, ease: [0.16, 0.9, 0.3, 1] }}
                className={`block font-medium leading-[0.96] tracking-[-0.03em] ${
                  i === lines.length - 1 ? "poster-rule w-fit text-paper" : ""
                }`}
              >
                {l}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={reduce ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-7 max-w-[54ch] text-[1.02rem] leading-relaxed text-paper/80 sm:text-[1.1rem]"
        >
          {BRAND.heroSub}
        </motion.p>

        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.74 }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <Btn href="/menu" variant="coral">
            Explore Our Menu <ArrowRight size={14} />
          </Btn>
          <Btn href="/reservations" variant="paper">
            Reserve a Table
          </Btn>
        </motion.div>

        <motion.div
          initial={reduce ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1 }}
          className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-2 font-sans text-[0.72rem] uppercase tracking-[0.14em] text-paper/65"
        >
          <span className="inline-flex items-center gap-2"><Clock size={13} /> {BRAND.hoursNote}</span>
          <span className="inline-flex items-center gap-2"><MapPin size={13} /> On the Fish Fry</span>
          <a href={BRAND.phoneHref} className="inline-flex items-center gap-2 hover:text-paper">
            <Phone size={13} /> {BRAND.phone}
          </a>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 03 — Signature dishes (ledger, not cards)                          */
/* ---------------------------------------------------------------- */

const SIGNATURES = [
  "bahamian-conch-salad",
  "cracked-conch",
  "conch-fritters",
  "bahamian-snapper",
  "ultimate-seafood-sensation",
];

function SignatureDishes() {
  const { menu, effectivePrice, itemAvailable } = useStore();
  const items = SIGNATURES
    .map((s) => menu.flatMap((c) => c.items).find((i) => i.slug === s))
    .filter(Boolean) as MenuItem[];

  return (
    <Section
      index="01"
      eyebrow="What to order"
      title="The plates we're known for"
      intro="Start with a conch salad made in front of you, then a whole fried snapper with peas 'n rice and plantains, and a cold Bahama Mama beside it."
      action={
        <Btn href="/menu" variant="outline">
          See the full menu <ArrowRight size={14} />
        </Btn>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-start">
        <Reveal className="relative">
          <div className="relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/official/2026/08/home-b2-fullbleed-snapper.jpg"
              alt="A whole Bahamian fried snapper dinner with peas 'n rice and fried plantains"
              className="aspect-[4/3] w-full object-cover transition-transform duration-[1.2s] hover:scale-[1.04]"
              loading="lazy"
            />
            <div className="grain absolute inset-0" />
          </div>
          <p className="mt-3 font-sans text-[0.72rem] leading-relaxed text-mute">
            Whole fried snapper, peas &apos;n rice, fried plantains — the plate the room is
            ordered around.
          </p>
        </Reveal>

        <ul className="border-t border-ink/15">
          {items.map((it, i) => {
            const p = effectivePrice(it);
            return (
              <Reveal as="li" key={it.slug} delay={i * 0.05}>
                <Link
                  href={`/menu/${it.slug}`}
                  className="group grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-ink/15 py-5 transition-colors hover:bg-ink/[0.035]"
                >
                  <span>
                    <span className="flex flex-wrap items-baseline gap-3">
                      <span className="font-display text-[1.35rem] leading-none transition-colors group-hover:text-sea">
                        {it.name}
                      </span>
                      {it.badge && (
                        <span className="eyebrow border border-coral/50 px-1.5 py-0.5 text-[0.55rem] text-coral">
                          {it.badge}
                        </span>
                      )}
                      {!itemAvailable(it.slug) && (
                        <span className="eyebrow text-[0.55rem] text-mute">Off in demo</span>
                      )}
                    </span>
                    <span className="mt-2 block max-w-[52ch] text-[0.88rem] leading-relaxed text-mute">
                      {it.desc ?? "Description not published on the current menu."}
                    </span>
                  </span>
                  <span className="flex items-baseline gap-3">
                    <PriceTag price={p.price} priceLabel={p.priceLabel} />
                    <ArrowUpRight
                      size={15}
                      className="text-ink/25 transition-all group-hover:translate-x-0.5 group-hover:text-coral"
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* 04 — About                                                         */
/* ---------------------------------------------------------------- */

function AboutBand() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto grid max-w-[88rem] grid-cols-12 gap-x-6 gap-y-10 px-5 py-20 sm:px-8 md:px-10 md:py-28">
        <div className="col-span-12 md:col-span-2">
          <span className="tabular font-sans text-[0.7rem] font-semibold tracking-[0.2em] text-sea">02</span>
          <span className="eyebrow mt-3 block text-paper/55">About Twin Brothers</span>
        </div>
        <div className="col-span-12 md:col-span-5">
          <h2 className="text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.05]">
            Three generations of one family, cooking on the Fish Fry.
          </h2>
          <div className="mt-7 space-y-4 text-[0.98rem] leading-relaxed text-paper/72">
            <p>{STORY.chapters[0].body[1]}</p>
            <p>{STORY.chapters[0].body[3]}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn href="/about" variant="paper">Read our story <ArrowRight size={14} /></Btn>
            <Btn href="/locations" variant="paper">Where to find us</Btn>
          </div>
        </div>
        <div className="col-span-12 md:col-span-5">
          <div className="relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/official/2026/09/home-gallery-dining-room.jpg"
              alt="The dining room at Twin Brothers, Arawak Cay"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
            <div className="grain absolute inset-0" />
          </div>
          <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-paper/20 pt-5">
            {[
              ["30+", "years on the cay"],
              ["4", "island locations"],
              ["5,800+", "Google reviews"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="tabular font-display text-[1.8rem] leading-none text-coral">{n}</dt>
                <dd className="mt-1.5 font-sans text-[0.66rem] uppercase leading-snug tracking-[0.12em] text-paper/55">
                  {l}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 05 — Interactive menu preview                                      */
/* ---------------------------------------------------------------- */

function MenuPreview() {
  const { menu, effectivePrice } = useStore();
  const [active, setActive] = useState(menu[0].slug);
  const cat = menu.find((c) => c.slug === active) ?? menu[0];
  const shown = cat.items.slice(0, 7);

  return (
    <Section
      index="03"
      eyebrow="The menu"
      title="Dinner, drinks, a quick bite, and something sweet."
      intro="Thirteen categories, transcribed from the live Twin Brothers menu. Market prices are labelled as market price — nothing is estimated."
      action={<Btn href="/menu" variant="ink">Open the full menu <ArrowRight size={14} /></Btn>}
    >
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
        {menu.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setActive(c.slug)}
            className={`shrink-0 border px-4 py-2.5 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.12em] transition-all duration-250 ${
              active === c.slug
                ? "border-ink bg-ink text-paper"
                : "border-ink/20 text-ink/70 hover:border-ink hover:text-ink"
            }`}
          >
            <span className="tabular mr-2 text-coral">{c.index}</span>
            {c.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.16, 0.9, 0.3, 1] }}
          className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,300px)_1fr] lg:items-start"
        >
          <div className="relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cat.image}
              alt={`${cat.name} at Twin Brothers`}
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
            <div className="grain absolute inset-0" />
            <p className="mt-3 font-sans text-[0.7rem] uppercase tracking-[0.14em] text-mute">
              {cat.eyebrow}
            </p>
          </div>

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-ink pb-3">
              <h3 className="text-[1.7rem] leading-none">{cat.name}</h3>
              <span className="tabular font-sans text-[0.7rem] uppercase tracking-[0.16em] text-mute">
                {cat.items.length} items
              </span>
            </div>
            {cat.intro && (
              <p className="mt-3 text-[0.86rem] leading-relaxed text-mute">{cat.intro}</p>
            )}
            <ul className="mt-1">
              {shown.map((it, i) => {
                const p = effectivePrice(it);
                return (
                  <motion.li
                    key={it.slug}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.4 }}
                  >
                    <Link
                      href={`/menu/${it.slug}`}
                      className="group flex items-baseline gap-3 border-b border-ink/12 py-3.5"
                    >
                      <span className="font-sans text-[0.98rem] font-medium transition-colors group-hover:text-sea">
                        {it.name}
                      </span>
                      <span className="dash-rule mt-auto min-w-6 flex-1 self-end mb-1.5 opacity-70" />
                      <PriceTag price={p.price} priceLabel={p.priceLabel} />
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
            {cat.items.length > shown.length && (
              <Link
                href={`/menu#${cat.slug}`}
                className="mt-5 inline-flex items-center gap-2 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-coral hover:underline"
              >
                +{cat.items.length - shown.length} more in {cat.name} <ArrowRight size={13} />
              </Link>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* 06 — Daiquiris                                                     */
/* ---------------------------------------------------------------- */

const DAIQUIRY_FLAVOURS = [
  "Miami Vice", "Sour Sop", "Mango", "Pina Colada", "Strawberry",
  "Passion Fruit", "Banana", "Pineapple",
];

function DaiquiriShowcase() {
  return (
    <section className="relative overflow-hidden bg-sea-dark text-paper">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto grid max-w-[88rem] grid-cols-12 gap-x-6 gap-y-10 px-5 py-20 sm:px-8 md:px-10 md:py-28">
        <div className="col-span-12 md:col-span-6">
          <span className="eyebrow text-paper/70">04 · The bar</span>
          <h2 className="mt-5 text-[clamp(2.1rem,5.4vw,4.2rem)] leading-[0.98]">
            The World Famous
            <span className="poster-rule mt-2 block w-fit">Daiquiris</span>
          </h2>
          <p className="mt-6 max-w-[46ch] text-[1rem] leading-relaxed text-paper/80">
            It started with two brothers and a daiquiri recipe — fresh fruit, ice and their own
            syrup mix, first sold downtown at the Old Straw Market. Eight flavours still blend
            cold all day at the Fish Fry.
          </p>

          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4 lg:grid-cols-2">
            {DAIQUIRY_FLAVOURS.map((f, i) => (
              <Reveal as="li" key={f} delay={i * 0.04} className="border-b border-paper/25 py-2">
                <span className="font-sans text-[0.88rem] tracking-wide">{f}</span>
              </Reveal>
            ))}
          </ul>

          <div className="mt-8 border-t border-paper/30 pt-5">
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              {[
                ["12 oz", "$12"],
                ["15 oz", "$15"],
                ["Large Goblet 24 oz", "$24"],
              ].map(([s, p]) => (
                <div key={s}>
                  <p className="tabular font-display text-[2rem] leading-none">{p}</p>
                  <p className="mt-1.5 font-sans text-[0.64rem] uppercase tracking-[0.16em] text-paper/65">
                    {s}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 font-sans text-[0.76rem] text-paper/70">Add alcohol for $3.</p>
          </div>

          <Btn href="/menu/daiquiris" variant="paper" className="mt-8">
            See every flavour <ArrowRight size={14} />
          </Btn>
        </div>

        <div className="col-span-12 md:col-span-6">
          <Reveal className="relative h-full">
            <div className="relative h-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/official/2026/09/home-b2-daiquiri-miami-vice-2026.jpg"
                alt="A Miami Vice daiquiri — strawberry and piña colada swirled together — at the Twin Brothers bar on Arawak Cay"
                className="h-full min-h-[320px] w-full object-cover"
                loading="lazy"
              />
              <div className="grain absolute inset-0" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 07 — Experiences                                                   */
/* ---------------------------------------------------------------- */

function Experiences() {
  return (
    <Section
      index="05"
      eyebrow="Dining & celebrations"
      title="Three ways to spend an evening on the cay"
      intro="Every arrangement below is confirmed by the restaurant — this concept only routes the enquiry."
    >
      <div className="space-y-14">
        {EXPERIENCES.map((e, i) => (
          <Reveal key={e.slug} delay={i * 0.06}>
            <article
              className={`grid items-center gap-7 md:grid-cols-12 ${
                i % 2 === 1 ? "md:[direction:rtl]" : ""
              }`}
            >
              <div className={`md:col-span-7 ${i % 2 === 1 ? "md:[direction:ltr]" : ""}`}>
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={e.image}
                    alt={e.title}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-[1.1s] hover:scale-[1.05]"
                    loading="lazy"
                  />
                  <div className="grain absolute inset-0" />
                </div>
              </div>
              <div className={`md:col-span-5 ${i % 2 === 1 ? "md:[direction:ltr]" : ""}`}>
                <span className="tabular font-sans text-[0.7rem] font-semibold tracking-[0.2em] text-coral">
                  0{i + 1}
                </span>
                <h3 className="mt-3 text-[clamp(1.5rem,3vw,2.3rem)] leading-tight">{e.title}</h3>
                <p className="mt-4 max-w-[46ch] text-[0.96rem] leading-relaxed text-mute">{e.body}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {e.slug === "celebrations" && (
                    <Btn href="/events/birthdays" variant="ink">Plan a birthday</Btn>
                  )}
                  {e.slug === "group-dining" && <Btn href="/events" variant="ink">Group enquiries</Btn>}
                  {e.slug === "seated-dining" && <Btn href="/reservations" variant="ink">Reserve a table</Btn>}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* 08 — Group & birthdays                                             */
/* ---------------------------------------------------------------- */

function GroupBand() {
  return (
    <Section index="06" eyebrow="Groups & birthdays" tone="sand" tight
      title="Book the whole room, not just a table"
      intro="Weddings, birthday parties, showers, repasts, family dinners, retirements, engagements, reunions, corporate and holiday parties — catered by the same kitchen."
      action={
        <div className="flex flex-wrap gap-3">
          <Btn href="/events" variant="ink">Group dining &amp; events <ArrowRight size={14} /></Btn>
          <Btn href="/events/birthdays" variant="outline">Birthday celebrations</Btn>
          <a
            href={waLink(
              `Hello Twin Brothers! I'd like to enquire about a group booking at your Arawak Cay restaurant.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-ink/30 px-6 py-3.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-paper"
          >
            <MessageCircle size={15} /> Ask on WhatsApp
          </a>
        </div>
      }
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
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* 09 — Cruise                                                        */
/* ---------------------------------------------------------------- */

function CruiseBand() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/official/2026/09/about-locale-harbour-2026.jpg"
        alt="Turquoise water and the quay at Arawak Cay with cruise ships across the harbour"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        loading="lazy"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
      <div className="grain absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-[88rem] grid-cols-12 gap-x-6 gap-y-8 px-5 py-20 sm:px-8 md:px-10 md:py-28">
        <div className="col-span-12 md:col-span-2">
          <span className="eyebrow text-coral">07 · Cruise</span>
        </div>
        <div className="col-span-12 md:col-span-6">
          <h2 className="text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.02]">
            Coming off a cruise ship?
          </h2>
          <ul className="mt-7 space-y-4">
            {[BRAND.cruiseWalk, "We're right on the water at Arawak Cay's Fish Fry."].map((t) => (
              <li key={t} className="flex gap-3 border-b border-paper/20 pb-4 text-[1rem] text-paper/85">
                <Ship size={17} className="mt-1 shrink-0 text-sea" /> {t}
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-[52ch] text-[0.85rem] leading-relaxed text-paper/60">
            Walking time is quoted from the restaurant&apos;s own website. This concept makes no
            promise about return times, seating guarantees or ship schedules.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn href="/cruise-visitors" variant="coral">Cruise visitor guide <ArrowRight size={14} /></Btn>
            <Btn href="/reservations" variant="paper">Book your table</Btn>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4">
          <div className="border border-paper/25 p-6 backdrop-blur-sm">
            <p className="eyebrow text-sea">Party of 10 or more?</p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-paper/75">
              Ship excursion groups are handled as an event enquiry, not a table booking — the
              team confirms availability directly.
            </p>
            <Btn href="/cruise-visitors#enquiry" variant="paper" className="mt-5 w-full">
              Cruise group enquiry
            </Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* 10 — Locations                                                     */
/* ---------------------------------------------------------------- */

function LocationsRail() {
  return (
    <Section
      index="08"
      eyebrow="Find us"
      title="Arawak Cay is home — but not the only one"
      intro="Four more Twin Brothers spots are published on the official site. Where a street address or opening hours are not published, we say so rather than fill the gap."
      action={<Btn href="/locations" variant="ink">All locations <ArrowRight size={14} /></Btn>}
    >
      <div className="no-scrollbar -mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0">
        {LOCATIONS.map((l, i) => (
          <Reveal
            key={l.slug}
            delay={i * 0.05}
            className="w-[80vw] shrink-0 snap-start sm:w-[360px]"
          >
            <Link
              href={`/locations/${l.slug}`}
              className="group flex h-full flex-col border border-ink/15 bg-paper transition-all duration-300 hover:border-ink hover:shadow-[0_24px_50px_-34px_rgba(16,45,56,0.75)]"
            >
              <div className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={l.image}
                  alt={l.name}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-[1s] group-hover:scale-105"
                  loading="lazy"
                />
                <div className="grain absolute inset-0" />
                {l.primary && (
                  <span className="absolute left-0 top-0 bg-coral px-3 py-1.5 font-sans text-[0.6rem] font-bold uppercase tracking-[0.18em] text-paper">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="eyebrow text-mute">{l.area}</span>
                <h3 className="mt-2 text-[1.4rem] leading-tight">{l.name}</h3>
                <p className="mt-3 flex-1 text-[0.88rem] leading-relaxed text-mute">
                  {l.addressVerified ? l.address : "Street address not published — call the team."}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-ink/15 pt-4">
                  <span className="tabular font-sans text-[0.8rem] font-semibold">{l.phone}</span>
                  <ArrowUpRight size={16} className="text-ink/30 transition-all group-hover:translate-x-0.5 group-hover:text-coral" />
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* 11 — Gallery mosaic                                                */
/* ---------------------------------------------------------------- */

function GalleryStrip() {
  const tiles = GALLERY.slice(0, 6);
  const spans = [
    "md:col-span-5 md:row-span-2",
    "md:col-span-4",
    "md:col-span-3",
    "md:col-span-3",
    "md:col-span-4",
    "md:col-span-5",
  ];
  return (
    <Section
      index="09"
      eyebrow="A look around"
      title="Inside Twin Brothers"
      action={<Btn href="/gallery" variant="outline">Open the gallery <ArrowRight size={14} /></Btn>}
    >
      <div className="grid auto-rows-[190px] grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-12">
        {tiles.map((g, i) => (
          <Reveal
            key={g.src}
            delay={i * 0.05}
            className={`group relative overflow-hidden ${spans[i]} ${
              i === 0 ? "auto-rows-[190px] sm:row-span-2" : ""
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.src}
              alt={g.caption}
              className="h-full w-full object-cover transition-transform duration-[1.1s] group-hover:scale-[1.06]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <figcaption className="absolute inset-x-0 bottom-0 translate-y-3 p-4 font-sans text-[0.76rem] text-paper opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="eyebrow block text-coral">{g.tag}</span>
              <span className="mt-1 block">{g.caption}</span>
            </figcaption>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* 12 — Reviews                                                       */
/* ---------------------------------------------------------------- */

function Reviews() {
  return (
    <Section
      index="10"
      eyebrow="Guest reviews"
      title={`What our guests say — ${REVIEWS.googleCount}`}
      intro={REVIEWS.sourceNote}
      tone="paper"
    >
      <div className="grid gap-6 md:grid-cols-3">
        {REVIEWS.items.map((r, i) => (
          <Reveal key={r.name} delay={i * 0.07}>
            <figure className="flex h-full flex-col border-t-2 border-ink bg-sand/35 p-6">
              <span className="font-display text-[2.6rem] leading-none text-coral" aria-hidden>
                &ldquo;
              </span>
              <blockquote className="mt-2 flex-1 font-display text-[1.08rem] leading-[1.5]">
                {r.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-ink/15 pt-4">
                <span className="block font-sans text-[0.88rem] font-semibold">{r.name}</span>
                <span className="mt-0.5 block font-sans text-[0.7rem] uppercase tracking-[0.14em] text-mute">
                  {r.meta}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 font-sans text-[0.76rem] text-mute">
        Quotes are reproduced from the review block on the restaurant&apos;s own website. No
        scores, names or testimonials on this concept were invented.
      </p>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* 13 — FAQ                                                           */
/* ---------------------------------------------------------------- */

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section index="11" eyebrow="Questions" title="Questions we hear most" tone="sand" tight>
      <div className="grid gap-x-12 md:grid-cols-2">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 0.04}>
              <div className="border-b border-ink/20">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-5 py-5 text-left"
                >
                  <span className="font-display text-[1.12rem] leading-snug">{f.q}</span>
                  <ChevronDown
                    size={17}
                    className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-coral" : "text-mute"}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.16, 0.9, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pr-8 text-[0.94rem] leading-relaxed text-ink/75">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------------- */
/* 14 — Final CTA                                                     */
/* ---------------------------------------------------------------- */

function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-[88rem] px-5 py-20 text-center sm:px-8 md:px-10 md:py-28">
        <span className="eyebrow text-coral">Come be part of it</span>
        <h2 className="mx-auto mt-6 max-w-[16ch] text-[clamp(2.3rem,7vw,5.4rem)] leading-[0.98]">
          There&apos;s always a seat at our table.
        </h2>
        <p className="mx-auto mt-6 max-w-[58ch] text-[1rem] leading-relaxed text-paper/70">
          Visiting Nassau or from right here on the island. Order the conch or the fresh
          snapper, and have a cold daiquiri with it.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Btn href="/reservations" variant="coral">Reserve a Table <ArrowRight size={14} /></Btn>
          <Btn href="/menu" variant="paper">Explore Our Menu</Btn>
          <a
            href={waLink(`Hello Twin Brothers! I'd like to enquire about a table.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-paper/40 px-6 py-3.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-paper hover:text-ink"
          >
            <MessageCircle size={15} /> WhatsApp {BRAND.whatsapp}
          </a>
        </div>
        <p className="mx-auto mt-8 flex items-center justify-center gap-2 font-sans text-[0.72rem] uppercase tracking-[0.16em] text-paper/50">
          <Users size={14} /> {BRAND.hoursNote} · {BRAND.phone}
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */

export default function HomeClient() {
  return (
    <>
      <Hero />
      <div className="relative z-20 mx-auto -mt-16 max-w-[82rem] px-5 sm:px-8 md:-mt-24 md:px-10">
        <HeroTicket />
      </div>
      <SignatureDishes />
      <AboutBand />
      <MenuPreview />
      <DaiquiriShowcase />
      <Experiences />
      <GroupBand />
      <CruiseBand />
      <LocationsRail />
      <GalleryStrip />
      <Reviews />
      <Faq />
      <FinalCta />
    </>
  );
}
