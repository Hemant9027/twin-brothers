"use client";

import Link from "next/link";
import { useMemo, useState, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { Search, X, ImageOff, ArrowUpRight, Info } from "lucide-react";
import { MENU_DISCREPANCIES } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Btn, PriceTag, Reveal, waLink } from "./ui";

type Filter = "all" | "value" | "market" | "described" | "bar";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "value", label: "Under $15" },
  { id: "market", label: "Market price" },
  { id: "described", label: "Has a published description" },
  { id: "bar", label: "Bar only" },
];

const BAR_CATS = ["daiquiris", "frozen-cocktails", "cocktails", "shots", "beverages"];

export default function MenuBrowser() {
  const { menu, effectivePrice, itemAvailable, ready } = useStore();
  const [activeCat, setActiveCat] = useState(menu[0].slug);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [lightBox, setLightBox] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ image: string; name: string } | null>(null);
  const previewX = useMotionValue(0);
  const previewY = useMotionValue(0);

  const q = query.trim().toLowerCase();
  const searching = q.length > 0 || filter !== "all";

  const pass = useMemo(() => {
    return (slug: string, name: string, price: number | null, desc: string | undefined, cat: string) => {
      if (q && !name.toLowerCase().includes(q) && !cat.toLowerCase().includes(q)) return false;
      if (filter === "value") return price !== null && price < 15;
      if (filter === "market") return price === null;
      if (filter === "described") return !!desc;
      if (filter === "bar") return BAR_CATS.includes(cat);
      return true;
    };
  }, [q, filter]);

  const results = searching
    ? menu
        .flatMap((c) =>
          c.items.map((i) => ({
            ...i,
            cat: c.name,
            catSlug: c.slug,
            catIntro: c.intro,
            catImage: c.image,
          }))
        )
        .filter((i) => pass(i.slug, i.name, i.price, i.desc, i.catSlug))
    : [];

  const cat = menu.find((c) => c.slug === activeCat) ?? menu[0];

  const movePreview = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const viewport = event.currentTarget.ownerDocument.defaultView;
    if (!viewport) return;

    previewX.set(
      Math.max(12, Math.min(event.clientX + 18, viewport.innerWidth - 236))
    );
    previewY.set(
      Math.max(12, Math.min(event.clientY + 18, viewport.innerHeight - 220))
    );
  };

  const showPreview = (
    event: ReactPointerEvent<HTMLElement>,
    image: string,
    name: string
  ) => {
    if (event.pointerType === "touch") return;
    setPreview({ image, name });
    movePreview(event);
  };

  return (
    <div className="mx-auto max-w-[88rem] px-5 pb-24 sm:px-8 md:px-10">
      {/* toolbar */}
      <div className="sticky top-[92px] z-30 -mx-5 mb-10 border-b border-ink/15 bg-paper/95 px-5 py-4 backdrop-blur-md sm:-mx-8 sm:px-8 md:-mx-10 md:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative flex-1 lg:max-w-md">
            <Search size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-mute" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conch, daiquiri, snapper…"
              aria-label="Search the menu"
              className="w-full border-b border-ink/25 bg-transparent py-2.5 pl-7 pr-8 font-sans text-[0.95rem] outline-none transition-colors placeholder:text-ink/35 focus:border-sea"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-mute hover:text-coral"
              >
                <X size={15} />
              </button>
            )}
          </label>

          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`shrink-0 border px-3.5 py-2 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.12em] transition-all ${
                  filter === f.id
                    ? "border-coral bg-coral text-paper"
                    : "border-ink/20 text-ink/65 hover:border-ink hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        {searching && (
          <p className="mt-3 font-sans text-[0.74rem] text-mute" role="status">
            {results.length} {results.length === 1 ? "item" : "items"} match
            {q ? ` “${query}”` : ""}
            {filter !== "all" ? ` · ${FILTERS.find((f) => f.id === filter)?.label}` : ""}
          </p>
        )}
      </div>

      {searching ? (
        results.length === 0 ? (
          <div className="border border-dashed border-ink/25 px-6 py-16 text-center">
            <ImageOff className="mx-auto text-ink/30" size={26} />
            <p className="mt-4 font-display text-2xl">Nothing matches that yet</p>
            <p className="mx-auto mt-2 max-w-[46ch] text-[0.92rem] text-mute">
              Try a broader word — conch, rice, burger, shot — or clear the filters.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Btn variant="outline" onClick={() => { setQuery(""); setFilter("all"); }}>
                Clear search
              </Btn>
              <Btn href="/menu" variant="ink">Back to categories</Btn>
            </div>
          </div>
        ) : (
          <ul className="border-t border-ink/20">
            {results.map((it, i) => {
              const p = effectivePrice(it);
              return (
                <Reveal as="li" key={`${it.catSlug}-${it.slug}`} delay={Math.min(i * 0.02, 0.3)}>
                  <Link
                    href={`/menu/${it.slug}`}
                    onPointerEnter={(event) => showPreview(event, it.image ?? it.catImage, it.name)}
                    onPointerMove={movePreview}
                    onPointerLeave={() => setPreview(null)}
                    className="group grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-ink/15 py-4 transition-colors hover:bg-ink/[0.035]"
                  >
                    <span>
                      <span className="flex flex-wrap items-baseline gap-3">
                        <span className="font-sans text-[1.02rem] font-medium group-hover:text-sea">
                          {it.name}
                        </span>
                        <span className="eyebrow text-[0.55rem] text-mute">{it.cat}</span>
                        {!itemAvailable(it.slug) && (
                          <span className="eyebrow text-[0.55rem] text-coral">Off in demo</span>
                        )}
                      </span>
                      {it.desc && (
                        <span className="mt-1 block max-w-[70ch] text-[0.86rem] leading-relaxed text-mute">
                          {it.desc}
                        </span>
                      )}
                    </span>
                    <PriceTag price={p.price} priceLabel={p.priceLabel} />
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        )
      ) : (
        <div className="grid gap-10 lg:grid-cols-[210px_1fr] lg:items-start">
          {/* sticky category index */}
          <nav aria-label="Menu categories" className="lg:sticky lg:top-[172px]">
            <p className="eyebrow mb-4 text-mute">Categories</p>
            <ul className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
              {menu.map((c) => (
                <li key={c.slug} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => setActiveCat(c.slug)}
                    className={`flex w-full items-baseline gap-3 whitespace-nowrap border-ink/15 px-3 py-2.5 text-left font-sans text-[0.82rem] transition-all lg:border-b ${
                      activeCat === c.slug
                        ? "border-coral text-ink lg:border-l-2 lg:border-l-coral lg:bg-sand/40 lg:font-semibold"
                        : "text-ink/60 hover:text-ink lg:hover:bg-ink/[0.04]"
                    }`}
                  >
                    <span className={`tabular text-[0.62rem] ${activeCat === c.slug ? "text-coral" : "text-ink/35"}`}>
                      {c.index}
                    </span>
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* category panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={cat.slug}
              id={cat.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 0.9, 0.3, 1] }}
            >
              <div className="grid gap-6 md:grid-cols-[minmax(0,300px)_1fr] md:items-end">
                <button
                  type="button"
                  onClick={() => setLightBox(cat.image)}
                  className="group relative block overflow-hidden"
                  aria-label={`Preview ${cat.name} image`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cat.image}
                    alt={`${cat.name} at Twin Brothers`}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-[1s] group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-paper/90 px-2.5 py-1.5 font-sans text-[0.6rem] uppercase tracking-[0.14em] opacity-0 transition-opacity group-hover:opacity-100">
                    Full screen
                  </span>
                </button>

                <div>
                  <span className="eyebrow text-coral">{cat.eyebrow}</span>
                  <h2 className="mt-3 text-[clamp(2rem,5vw,3.4rem)] leading-none">{cat.name}</h2>
                  {cat.intro && (
                    <p className="mt-4 max-w-[60ch] border-l-2 border-sea pl-4 text-[0.92rem] leading-relaxed text-mute">
                      {cat.intro}
                    </p>
                  )}
                </div>
              </div>

              <ul className="mt-8 border-t-2 border-ink">
                {cat.items.map((it, i) => {
                  const p = effectivePrice(it);
                  const off = !itemAvailable(it.slug);
                  return (
                    <Reveal as="li" key={it.slug} delay={Math.min(i * 0.03, 0.25)}>
                      <Link
                        href={`/menu/${it.slug}`}
                        onPointerEnter={(event) => showPreview(event, it.image ?? cat.image, it.name)}
                        onPointerMove={movePreview}
                        onPointerLeave={() => setPreview(null)}
                        className={`group grid grid-cols-[1fr_auto] items-start gap-5 border-b border-ink/15 py-4 transition-colors ${
                          off ? "opacity-45 hover:opacity-70" : "hover:bg-ink/[0.035]"
                        }`}
                      >
                        <span>
                          <span className="flex flex-wrap items-baseline gap-3">
                            <span className="font-display text-[1.25rem] leading-tight transition-colors group-hover:text-sea">
                              {it.name}
                            </span>
                            {it.badge && (
                              <span className="eyebrow border border-coral/50 px-1.5 py-0.5 text-[0.54rem] text-coral">
                                {it.badge}
                              </span>
                            )}
                            {off && (
                              <span className="eyebrow text-[0.54rem] text-coral">Off in demo</span>
                            )}
                          </span>
                          {it.desc && (
                            <span className="mt-1.5 block max-w-[68ch] text-[0.88rem] leading-relaxed text-mute">
                              {it.desc}
                            </span>
                          )}
                          {it.note && (
                            <span className="mt-1.5 block font-sans text-[0.76rem] text-ink/55">
                              {it.note}
                            </span>
                          )}
                          {it.sizes && (
                            <span className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1">
                              {it.sizes.map((s) => (
                                <span
                                  key={s.label}
                                  className="tabular font-sans text-[0.78rem] text-mute"
                                >
                                  {s.label}{" "}
                                  <span className="font-semibold text-ink">${s.price}</span>
                                </span>
                              ))}
                            </span>
                          )}
                        </span>
                        <span className="flex items-baseline gap-3 pt-1">
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
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* honesty panels */}
      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        <div className="border border-ink/15 bg-sand/35 p-6">
          <p className="flex items-center gap-2 eyebrow text-coral">
            <Info size={14} /> No dietary filters — on purpose
          </p>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-ink/75">
            The official menu does not publish full ingredient lists or allergen data, so this
            concept offers convenience filters instead of guessing at dietary or allergen
            classifications. Ask the restaurant directly for ingredient questions.
          </p>
          <a
            href={waLink("Hello Twin Brothers! Could you tell me about ingredients and allergens?")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-sea hover:underline"
          >
            Ask on WhatsApp
          </a>
        </div>

        <div className="border border-ink/15 p-6">
          <p className="eyebrow text-coral">Source &amp; price notes</p>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-ink/75">
            Items and prices are transcribed from{" "}
            <a
              href="https://twinbrothersbahamas.com/menu/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-sea"
            >
              twinbrothersbahamas.com/menu
            </a>{" "}
            in US dollars. A 15% service charge and 10% VAT are added to the final bill. Market
            price items are labelled rather than estimated. No official menu PDF is published on
            the current site, so there is no download offered here.
          </p>
          <ul className="mt-4 space-y-2 border-t border-ink/15 pt-4">
            {MENU_DISCREPANCIES.slice(0, 3).map((d) => (
              <li key={d.item} className="text-[0.82rem] leading-relaxed text-mute">
                <span className="font-semibold text-ink">{d.item}</span> — {d.current}
              </li>
            ))}
          </ul>
          <Link
            href="/menu#price-notes"
            className="mt-4 inline-block font-sans text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-coral hover:underline"
          >
            See all listing discrepancies
          </Link>
        </div>
      </div>

      <div id="price-notes" className="mt-10 border border-coral/40 bg-coral/[0.05] p-6">
        <p className="eyebrow text-coral">Flagged · conflicting menu listings</p>
        <p className="mt-2 max-w-[74ch] text-[0.88rem] leading-relaxed text-ink/75">
          Older versions of this restaurant&apos;s website remain indexed by search engines
          alongside the current menu. Rather than blend them silently, here is exactly where
          they disagree.
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink/25">
                <th className="eyebrow py-2 pr-4 text-mute">Item</th>
                <th className="eyebrow py-2 pr-4 text-mute">Older listing</th>
                <th className="eyebrow py-2 text-mute">Current live menu</th>
              </tr>
            </thead>
            <tbody>
              {MENU_DISCREPANCIES.map((d) => (
                <tr key={d.item} className="border-b border-ink/12 align-top">
                  <td className="py-3 pr-4 font-sans text-[0.88rem] font-semibold">{d.item}</td>
                  <td className="py-3 pr-4 font-sans text-[0.86rem] text-mute">{d.published}</td>
                  <td className="py-3 font-sans text-[0.86rem] text-ink/80">{d.current}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {preview && (
          <motion.div
            key={preview.name}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            style={{ x: previewX, y: previewY }}
            className="pointer-events-none fixed left-0 top-0 z-[70] w-56 border border-ink/15 bg-paper p-2 shadow-xl"
            aria-hidden="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview.image}
              alt=""
              className="aspect-[4/3] w-full object-cover"
            />
            <p className="mt-2 truncate font-sans text-[0.68rem] font-semibold text-ink">
              {preview.name}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* lightbox */}
      <AnimatePresence>
        {lightBox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-char/95 p-5"
            onClick={() => setLightBox(null)}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setLightBox(null)}
              aria-label="Close image"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center border border-paper/40 text-paper hover:bg-paper hover:text-char"
            >
              <X size={18} />
            </button>
            <motion.img
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={lightBox}
              alt=""
              className="max-h-[85vh] max-w-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
