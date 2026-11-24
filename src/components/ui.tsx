"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/* ---------------------------------------------------------------- */
/* The Twin Brothers mark — hand-drawn, twin mirrored conch spirals    */
/* locked into a square cartouche. Not a raster asset.                 */
/* ---------------------------------------------------------------- */

export function Mark({
  className = "h-10 w-10",
  title = "Twin Brothers",
}: {
  className?: string;
  title?: string;
}) {
  const uid = "tb-spiral";
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
    >
      <defs>
        <path
          id={uid}
          d="M30 15.5C20.6 15.5 13 22.9 13 32.2c0 7.1 4.6 12.6 11.3 13.9-3.9-2.9-5.6-7.6-4.2-12.1 1.6-5.1 6.9-8.1 11.9-6.7 4.4 1.2 7.2 5.5 6.4 9.9"
          strokeLinecap="round"
        />
      </defs>
      <rect
        x="2.25"
        y="2.25"
        width="59.5"
        height="59.5"
        rx="7"
        stroke="currentColor"
        strokeWidth="3"
      />
      <g stroke="currentColor" strokeWidth="3.4" strokeLinecap="round">
        <use href={`#${uid}`} />
        <use href={`#${uid}`} transform="matrix(-1 0 0 1 64 0)" />
      </g>
      <circle cx="25.5" cy="34.5" r="2.6" fill="currentColor" />
      <circle cx="38.5" cy="34.5" r="2.6" fill="currentColor" />
      <path
        d="M16 54.5h32"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export function Wordmark({
  tone = "ink",
  compact = false,
}: {
  tone?: "ink" | "paper";
  compact?: boolean;
}) {
  const color = tone === "paper" ? "text-paper" : "text-ink";
  return (
    <span className={`flex items-center gap-3 ${color}`}>
      <Mark className={compact ? "h-8 w-8" : "h-10 w-10"} />
      <span className="leading-none">
        <span
          className={`block font-sans font-bold uppercase ${
            compact ? "text-[0.8rem] tracking-[0.2em]" : "text-[0.92rem] tracking-[0.22em]"
          }`}
        >
          Twin Brothers
        </span>
        <span className="mt-1 block font-sans text-[0.58rem] font-medium uppercase tracking-[0.3em] opacity-70">
          Seafood &amp; Steakhouse
        </span>
      </span>
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* Motion                                                             */
/* ---------------------------------------------------------------- */

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const reduce = useReducedMotion();
  const M = motion[as] as typeof motion.div;
  return (
    <M
      className={className}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.62, delay, ease: [0.16, 0.9, 0.3, 1] }}
    >
      {children}
    </M>
  );
}

/* ---------------------------------------------------------------- */
/* Editorial section frame: index numeral + eyebrow live in the left   */
/* rail, content occupies the right of an asymmetric grid.            */
/* ---------------------------------------------------------------- */

export function Section({
  index,
  eyebrow,
  title,
  intro,
  id,
  tone = "paper",
  children,
  action,
  tight = false,
}: {
  index?: string;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  id?: string;
  tone?: "paper" | "ink" | "sand";
  children: ReactNode;
  action?: ReactNode;
  tight?: boolean;
}) {
  const bg =
    tone === "ink" ? "bg-ink text-paper" : tone === "sand" ? "bg-sand text-ink" : "paper text-ink";
  const muted = tone === "ink" ? "text-paper/65" : "text-mute";
  return (
    <section
      id={id}
      className={`relative ${bg} ${tight ? "py-14 md:py-20" : "py-20 md:py-28"} ${
        tone === "paper" ? "paper" : ""
      }`}
    >
      <div className="mx-auto grid max-w-[88rem] grid-cols-12 gap-x-5 px-5 sm:px-8 md:px-10">
        <div className="col-span-12 mb-8 flex items-baseline gap-4 md:col-span-2 md:mb-0 md:block">
          {index && (
            <span
              className={`tabular font-sans text-[0.7rem] font-semibold tracking-[0.2em] ${
                tone === "ink" ? "text-sea" : "text-coral"
              }`}
            >
              {index}
            </span>
          )}
          {eyebrow && (
            <span className={`eyebrow md:mt-3 md:block ${muted}`}>{eyebrow}</span>
          )}
        </div>
        <div className="col-span-12 md:col-span-10">
          {(title || intro || action) && (
            <header className="mb-10 md:mb-14">
              {title && (
                <h2 className="max-w-[22ch] text-[clamp(2rem,5vw,3.6rem)] leading-[1.02]">
                  {title}
                </h2>
              )}
              {intro && (
                <p className={`mt-5 max-w-[62ch] text-[1.02rem] leading-relaxed ${muted}`}>
                  {intro}
                </p>
              )}
              {action && <div className="mt-7">{action}</div>}
            </header>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Buttons                                                            */
/* ---------------------------------------------------------------- */

type BtnProps = {
  href?: string;
  children: ReactNode;
  variant?: "coral" | "ink" | "outline" | "paper" | "sea";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  target?: string;
};

const btnBase =
  "group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-45";

const variants: Record<string, string> = {
  coral: "bg-coral text-paper hover:bg-coral-dark hover:-translate-y-0.5 shadow-[0_10px_30px_-14px_rgba(216,121,88,0.9)]",
  ink: "bg-ink text-paper hover:bg-ink-700 hover:-translate-y-0.5",
  sea: "bg-sea text-paper hover:bg-sea-dark hover:-translate-y-0.5",
  outline:
    "border border-ink/30 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  paper:
    "border border-paper/40 text-paper hover:bg-paper hover:text-ink",
};

export function Btn({
  href,
  children,
  variant = "coral",
  className = "",
  onClick,
  type = "button",
  disabled,
  target,
}: BtnProps) {
  const cls = `${btnBase} ${variants[variant]} ${className}`;
  if (href) {
    const external = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("wa.me");
    return (
      <Link
        href={href}
        className={cls}
        onClick={onClick}
        target={target ?? (external ? "_blank" : undefined)}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
}

/* ---------------------------------------------------------------- */
/* Price — right-aligned tabular figures on a hairline, market price   */
/* is labelled rather than faked.                                      */
/* ---------------------------------------------------------------- */

export function PriceTag({
  price,
  priceLabel,
  tone = "ink",
}: {
  price: number | null;
  priceLabel?: string;
  tone?: "ink" | "paper";
}) {
  const isMarket = price === null || /market/i.test(priceLabel ?? "");
  return (
    <span
      className={`tabular shrink-0 font-sans text-[0.98rem] font-semibold ${
        isMarket ? "text-coral" : tone === "paper" ? "text-paper" : "text-ink"
      }`}
    >
      {isMarket ? (
        <span className="eyebrow text-[0.6rem] text-coral">Market price</span>
      ) : (
        `$${price}`
      )}
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* WhatsApp — official number verified from the live booking page.     */
/* Messages are prefilled, never auto-sent.                            */
/* ---------------------------------------------------------------- */

export { waLink, demoNotice } from "@/lib/wa";
