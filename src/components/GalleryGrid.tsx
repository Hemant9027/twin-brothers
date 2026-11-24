"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { GALLERY } from "@/lib/data";
import { Btn } from "./ui";

const TAGS = ["All", ...Array.from(new Set(GALLERY.map((g) => g.tag)))];

export default function GalleryGrid() {
  const [tag, setTag] = useState("All");
  const [open, setOpen] = useState<number | null>(null);

  const shown = GALLERY.filter((g) => tag === "All" || g.tag === tag);

  const move = (dir: number) => {
    if (open === null) return;
    const n = (open + dir + GALLERY.length) % GALLERY.length;
    setOpen(n);
  };

  return (
    <div className="mx-auto max-w-[88rem] px-5 pb-24 sm:px-8 md:px-10">
      <div className="no-scrollbar -mx-5 mb-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
        {TAGS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTag(t)}
            className={`shrink-0 border px-4 py-2.5 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-all ${
              tag === t
                ? "border-ink bg-ink text-paper"
                : "border-ink/20 text-ink/65 hover:border-ink hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="border border-dashed border-ink/25 px-6 py-20 text-center">
          <ImageOff className="mx-auto text-ink/30" size={26} />
          <p className="mt-4 font-display text-2xl">Nothing filed under that tag</p>
          <div className="mt-6 flex justify-center">
            <Btn variant="outline" onClick={() => setTag("All")}>Show everything</Btn>
          </div>
        </div>
      ) : (
        <div className="grid auto-rows-[200px] grid-cols-2 gap-3 md:grid-cols-4">
          {shown.map((g, i) => (
            <motion.button
              key={g.src}
              type="button"
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.35) }}
              onClick={() => setOpen(GALLERY.findIndex((x) => x.src === g.src))}
              className={`group relative overflow-hidden ${
                i % 5 === 0 ? "col-span-2 row-span-2" : "col-span-2 sm:col-span-1"
              }`}
              aria-label={`Open ${g.caption}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.src}
                alt={g.caption}
                className="h-full w-full object-cover transition-transform duration-[1.1s] group-hover:scale-[1.06]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="eyebrow block text-coral">{g.tag}</span>
                <span className="mt-1 block font-sans text-[0.8rem] text-paper">{g.caption}</span>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      <p className="mt-8 max-w-[74ch] font-sans text-[0.82rem] leading-relaxed text-mute">
        Photography downloaded from the restaurant&apos;s own website (twinbrothersbahamas.com)
        and its published gallery set, stored locally for this concept. Nothing here is
        third-party stock imagery.
      </p>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-char/97 p-4 sm:p-8"
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Close gallery"
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center border border-paper/40 text-paper hover:bg-paper hover:text-char sm:right-6 sm:top-6"
            >
              <X size={18} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); move(-1); }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center border border-paper/40 text-paper hover:bg-paper hover:text-char sm:left-6"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); move(1); }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center border border-paper/40 text-paper hover:bg-paper hover:text-char sm:right-6"
            >
              <ChevronRight size={18} />
            </button>

            <div className="max-h-full w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={GALLERY[open].src}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={GALLERY[open].src}
                alt={GALLERY[open].caption}
                className="mx-auto max-h-[76vh] w-auto object-contain"
              />
              <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3 border-t border-paper/25 pt-3">
                <p className="font-display text-lg text-paper">{GALLERY[open].caption}</p>
                <p className="tabular font-sans text-[0.7rem] uppercase tracking-[0.16em] text-paper/55">
                  {GALLERY[open].tag} · {open + 1} / {GALLERY.length}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
