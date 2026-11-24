"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MessageCircle, X, Printer, Eye } from "lucide-react";
import { findItem } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Btn, PriceTag, waLink } from "./ui";

export default function ItemDetail({
  slug,
  prevSlug,
  nextSlug,
}: {
  slug: string;
  prevSlug: string;
  nextSlug: string;
}) {
  const { menu, effectivePrice, itemAvailable, ready, setMenuOverride, menuOverrides } =
    useStore();
  const [open, setOpen] = useState(false);

  const item = menu.flatMap((c) => c.items.map((i) => ({ ...i, cat: c }))).find((i) => i.slug === slug);
  if (!item) return null;
  const p = effectivePrice(item);
  const off = !itemAvailable(item.slug);
  const image = item.image ?? item.cat.image;

  return (
    <div className="paper py-16 md:py-20">
      <div className="mx-auto grid max-w-[88rem] grid-cols-12 gap-x-6 gap-y-10 px-5 sm:px-8 md:px-10">
        <div className="col-span-12 lg:col-span-5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group relative block w-full overflow-hidden"
            aria-label={`View ${item.name} full screen`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={item.name}
              className="aspect-[4/3] w-full object-cover transition-transform duration-[1.1s] group-hover:scale-[1.05]"
            />
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-paper/92 px-3 py-2 font-sans text-[0.6rem] uppercase tracking-[0.14em] opacity-0 transition-opacity group-hover:opacity-100">
              <Eye size={12} /> Full screen
            </span>
          </button>
          <p className="mt-3 font-sans text-[0.7rem] leading-relaxed text-mute">
            Photography downloaded from the restaurant&apos;s own website for this concept, so the
            dish on screen is the dish as Twin Brothers publishes it.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b-2 border-ink pb-4">
            <div>
              <span className="eyebrow text-coral">{item.cat.name}</span>
              <h1 className="mt-2 text-[clamp(1.9rem,4.4vw,3rem)] leading-none">{item.name}</h1>
            </div>
            <PriceTag price={p.price} priceLabel={p.priceLabel} />
          </div>

          <p className="mt-6 max-w-[64ch] text-[1.05rem] leading-relaxed text-ink/80">
            {item.desc ?? "The current menu lists this item without a published description."}
          </p>

          {item.note && (
            <p className="mt-4 border-l-2 border-sea pl-4 font-sans text-[0.9rem] text-ink/70">
              {item.note}
            </p>
          )}

          {item.sizes && (
            <div className="mt-8">
              <p className="eyebrow text-mute">Sizes</p>
              <ul className="mt-3 border-t border-ink/20">
                {item.sizes.map((s) => (
                  <li
                    key={s.label}
                    className="flex items-baseline justify-between gap-4 border-b border-ink/12 py-3"
                  >
                    <span className="font-sans text-[0.95rem]">{s.label}</span>
                    <span className="tabular font-sans text-[0.98rem] font-semibold">${s.price}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-sans text-[0.84rem] text-mute">Add alcohol for $3.</p>
            </div>
          )}

          <dl className="mt-8 grid gap-4 border-t border-ink/15 pt-6 sm:grid-cols-2">
            <div>
              <dt className="eyebrow text-mute">Price basis</dt>
              <dd className="mt-1.5 text-[0.92rem]">
                {p.price === null
                  ? "Market price — ask the team today. Not estimated here."
                  : `$${p.price} USD · ${item.cat.name}`}
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-mute">Availability in this demo</dt>
              <dd className="mt-1.5 text-[0.92rem]">
                {ready ? (off ? "Marked off the board" : "On the board") : "Loading…"}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Btn href="/reservations" variant="coral">Reserve a Table <ArrowRight size={14} /></Btn>
            <a
              href={waLink(
                `Hello Twin Brothers! Is the ${item.name} available at your Arawak Cay restaurant?`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-ink/30 px-6 py-3.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-paper"
            >
              <MessageCircle size={15} /> Ask about this dish
            </a>
            <Btn variant="outline" onClick={() => window.print()}>
              <Printer size={14} /> Print
            </Btn>
          </div>

          <nav className="mt-10 flex items-center justify-between gap-4 border-t border-ink/15 pt-5" aria-label="Menu item pagination">
            <Link
              href={`/menu/${prevSlug}`}
              className="group inline-flex items-center gap-2 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-ink/70 hover:text-coral"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              <span className="max-w-[16ch] truncate">{prevSlug.replace(/-/g, " ")}</span>
            </Link>
            <Link
              href={`/menu/${nextSlug}`}
              className="group inline-flex items-center gap-2 text-right font-sans text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-ink/70 hover:text-coral"
            >
              <span className="max-w-[16ch] truncate">{nextSlug.replace(/-/g, " ")}</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </nav>

          <div className="mt-8 flex flex-wrap items-center gap-3 border border-ink/15 bg-sand/35 p-4">
            <span className="eyebrow text-mute">Demo control</span>
            <button
              type="button"
              onClick={() => setMenuOverride(item.slug, { available: !off })}
              className="border border-ink/30 px-3.5 py-2 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-paper"
            >
              {off ? "Put back on the board" : "Mark sold out"}
            </button>
            <span className="font-sans text-[0.76rem] text-mute">
              Toggles persist in this browser and appear in the demo staff dashboard.
              {menuOverrides[item.slug] ? " (edited)" : ""}
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-char/96 p-5"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close image"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center border border-paper/40 text-paper hover:bg-paper hover:text-char"
            >
              <X size={18} />
            </button>
            <motion.img
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              transition={{ duration: 0.3 }}
              src={image}
              alt={item.name}
              className="max-h-[86vh] max-w-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
