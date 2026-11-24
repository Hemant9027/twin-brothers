"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  crumbs = [],
  children,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  image?: string;
  crumbs?: { label: string; href?: string }[];
  children?: ReactNode;
  align?: "left" | "wide";
}) {
  const reduce = useReducedMotion();
  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      {image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            aria-hidden
            className="absolute inset-0 -z-10 h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/35" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-transparent to-ink/50" />
        </>
      )}
      <div className="grain absolute inset-0 -z-10" />
      <div className="mx-auto max-w-[88rem] px-5 pb-16 pt-14 sm:px-8 md:px-10 md:pb-24 md:pt-20">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 font-sans text-[0.66rem] uppercase tracking-[0.16em] text-paper/55">
            <Link href="/" className="hover:text-paper">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-2">
                <ChevronRight size={12} />
                {c.href ? (
                  <Link href={c.href} className="hover:text-paper">{c.label}</Link>
                ) : (
                  <span className="text-paper/85">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <motion.p
            initial={reduce ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow text-coral"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={reduce ? {} : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 0.9, 0.3, 1] }}
          className={`mt-5 font-display text-[clamp(2.3rem,6.4vw,5rem)] leading-[0.98] ${
            align === "left" ? "max-w-[18ch]" : "max-w-[26ch]"
          }`}
        >
          {title}
        </motion.h1>
        {intro && (
          <motion.p
            initial={reduce ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-[64ch] text-[1rem] leading-relaxed text-paper/78 sm:text-[1.06rem]"
          >
            {intro}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
