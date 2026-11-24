"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X, Phone, MessageCircle, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { BRAND, LOCATIONS } from "@/lib/data";
import { Btn, Mark, Wordmark, waLink, demoNotice } from "./ui";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/reservations", label: "Reservations" },
  { href: "/events", label: "Events" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function ConceptStrip() {
  return (
    <div className="no-print relative z-[60] bg-char text-paper/80">
      <div className="mx-auto flex max-w-[88rem] items-center justify-between gap-4 px-5 py-2 sm:px-8">
        <p className="font-sans text-[0.62rem] leading-relaxed tracking-[0.08em] sm:text-[0.66rem]">
          <span className="mr-2 inline-block bg-coral px-1.5 py-0.5 font-semibold uppercase tracking-[0.18em] text-paper">
            Concept
          </span>
          {demoNotice}
        </p>
        <Link
          href="/demo/dashboard"
          className="hidden shrink-0 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-sea transition-colors hover:text-paper md:inline-flex"
        >
          Demo Staff Dashboard
        </Link>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const startsTransparent = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || !startsTransparent;

  return (
    <header
      className={`no-print z-50 ${
        startsTransparent ? "fixed inset-x-0 top-0" : "sticky top-0"
      }`}
    >
      <ConceptStrip />
      <div
        className={`transition-all duration-500 ${
          solid
            ? "bg-ink/95 text-paper shadow-[0_14px_40px_-30px_rgba(0,0,0,0.9)] backdrop-blur-md"
            : "bg-transparent text-paper"
        }`}
      >
        <div className="mx-auto flex max-w-[88rem] items-center justify-between gap-6 px-5 py-4 sm:px-8 md:px-10">
          <Link href="/" aria-label="Twin Brothers home" className="shrink-0">
            <Wordmark tone="paper" compact />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {NAV.map((n) => {
              const active =
                n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`relative font-sans text-[0.72rem] font-medium uppercase tracking-[0.16em] transition-opacity hover:opacity-100 ${
                    active ? "opacity-100" : "opacity-75"
                  }`}
                >
                  {n.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-coral transition-all duration-300 ${
                      active ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={BRAND.phoneHref}
              className="hidden font-sans text-[0.72rem] font-semibold uppercase tracking-[0.14em] opacity-80 transition-opacity hover:opacity-100 xl:inline-flex"
            >
              {BRAND.phone}
            </a>
            <Btn href="/reservations" variant="coral" className="hidden md:inline-flex !px-5 !py-3">
              Reserve a Table
            </Btn>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid h-11 w-11 place-items-center border border-current/30 lg:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        <div className="h-px w-full bg-current/15" />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] overflow-y-auto bg-ink text-paper lg:hidden"
          >
            <div className="flex min-h-full flex-col px-5 pb-10 pt-5 sm:px-8">
              <div className="flex items-center justify-between">
                <Wordmark tone="paper" compact />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-11 w-11 place-items-center border border-paper/30"
                >
                  <X size={18} />
                </button>
              </div>
              <nav className="mt-10 flex-1" aria-label="Mobile">
                <ul>
                  {NAV.map((n, i) => (
                    <motion.li
                      key={n.href}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.045, duration: 0.4 }}
                      className="border-b border-paper/12"
                    >
                      <Link
                        href={n.href}
                        onClick={() => setOpen(false)}
                        className="flex items-baseline justify-between py-4 font-display text-[2rem] leading-none tracking-tight"
                      >
                        {n.label}
                        <span className="tabular font-sans text-[0.62rem] tracking-[0.2em] text-sea">
                          0{i + 1}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              <div className="mt-8 grid gap-3">
                <Btn href="/reservations" variant="coral">
                  Reserve a Table
                </Btn>
                <a
                  href={waLink(
                    `Hello Twin Brothers! I have a question about dining at your Arawak Cay restaurant.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-paper/40 px-6 py-3.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em]"
                >
                  <MessageCircle size={15} /> WhatsApp {BRAND.whatsapp}
                </a>
                <Link
                  href="/demo/dashboard"
                  className="mt-1 text-center font-sans text-[0.66rem] uppercase tracking-[0.18em] text-sea"
                >
                  Demo Staff Dashboard
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---------------------------------------------------------------- */
/* Floating WhatsApp + sticky mobile reserve bar                      */
/* ---------------------------------------------------------------- */

export function FloatingActions() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="no-print pointer-events-none fixed inset-x-0 bottom-0 z-50">
      {/* mobile: sticky reserve bar */}
      <div className="pointer-events-auto flex border-t border-ink/15 bg-paper/95 backdrop-blur md:hidden">
        <a
          href={waLink(
            `Hello Twin Brothers! I'd like to enquire about a table at your Arawak Cay restaurant.`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-[42%] items-center justify-center gap-2 border-r border-ink/15 py-4 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink"
        >
          <MessageCircle size={15} /> WhatsApp
        </a>
        <Link
          href="/reservations"
          className="flex flex-1 items-center justify-center bg-coral py-4 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-paper"
        >
          Reserve a Table
        </Link>
      </div>

      <AnimatePresence>
        {show && (
          <motion.a
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            href={waLink(
              `Hello Twin Brothers! I'd like to enquire about a table at your Arawak Cay restaurant.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Enquire on WhatsApp"
            className="pointer-events-auto absolute bottom-24 right-5 hidden h-14 w-14 items-center justify-center rounded-full bg-sea text-paper shadow-[0_16px_40px_-16px_rgba(28,140,145,0.9)] transition-transform hover:scale-105 md:right-8 md:flex"
          >
            <MessageCircle size={22} />
            <span className="absolute right-full mr-3 whitespace-nowrap bg-ink px-3 py-2 font-sans text-[0.62rem] uppercase tracking-[0.16em] text-paper opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Footer                                                             */
/* ---------------------------------------------------------------- */

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-char text-paper">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-[88rem] px-5 pb-28 pt-16 sm:px-8 md:px-10 md:pb-12 md:pt-24">
        <div className="grid grid-cols-12 gap-y-12 gap-x-6">
          <div className="col-span-12 md:col-span-4">
            <Wordmark tone="paper" />
            <p className="mt-6 max-w-[36ch] text-[0.94rem] leading-relaxed text-paper/65">
              {BRAND.tagline}. Fresh conch, fire-grilled snapper and the World Famous
              Daiquiris, on the water at the Fish Fry.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={BRAND.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-paper/25 px-3 py-2 font-sans text-[0.64rem] uppercase tracking-[0.16em] transition-colors hover:border-paper hover:bg-paper hover:text-char"
              >
                Facebook <ArrowUpRight size={12} />
              </a>
              <a
                href={BRAND.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-paper/25 px-3 py-2 font-sans text-[0.64rem] uppercase tracking-[0.16em] transition-colors hover:border-paper hover:bg-paper hover:text-char"
              >
                Google Maps <ArrowUpRight size={12} />
              </a>
            </div>
          </div>

          <div className="col-span-6 md:col-span-2">
            <p className="eyebrow text-sea">Explore</p>
            <ul className="mt-5 space-y-3 text-[0.9rem] text-paper/75">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="link-underline hover:text-paper">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <p className="eyebrow text-sea">More</p>
            <ul className="mt-5 space-y-3 text-[0.9rem] text-paper/75">
              <li><Link href="/events/birthdays" className="link-underline hover:text-paper">Birthdays</Link></li>
              <li><Link href="/cruise-visitors" className="link-underline hover:text-paper">Cruise Visitors</Link></li>
              <li><Link href="/gallery" className="link-underline hover:text-paper">Gallery</Link></li>
              <li><Link href="/reservations/confirmation" className="link-underline hover:text-paper">Find a booking</Link></li>
              <li><Link href="/demo/dashboard" className="link-underline hover:text-paper">Demo Dashboard</Link></li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-4">
            <p className="eyebrow text-sea">Find us</p>
            <ul className="mt-5 space-y-4 text-[0.92rem] text-paper/75">
              <li className="flex gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-coral" />
                <span>{BRAND.streetAddress}, {BRAND.city}, {BRAND.country}</span>
              </li>
              <li className="flex gap-3">
                <Clock size={16} className="mt-0.5 shrink-0 text-coral" />
                <span>{BRAND.hoursNote}</span>
              </li>
              <li className="flex gap-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-coral" />
                <a href={BRAND.phoneHref} className="link-underline hover:text-paper">
                  {BRAND.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <MessageCircle size={16} className="mt-0.5 shrink-0 text-coral" />
                <a
                  href={waLink("Hello Twin Brothers! I have a question.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline hover:text-paper"
                >
                  WhatsApp {BRAND.whatsapp}
                </a>
              </li>
            </ul>
            <p className="mt-5 text-[0.8rem] leading-relaxed text-paper/45">
              {BRAND.serviceCharge}
            </p>
          </div>
        </div>

        <div className="mt-14 border-t border-paper/15 pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <p className="max-w-[70ch] text-[0.74rem] leading-relaxed text-paper/55">
              {demoNotice} This page is not affiliated with, or endorsed by, Twin Brothers
              Seafood &amp; Steakhouse, and is not a booking system of any restaurant
              provider. No payments are taken and no real guest data is used.
            </p>
            <p className="font-sans text-[0.66rem] uppercase tracking-[0.18em] text-paper/45">
              © {new Date().getFullYear()} · Designed and developed by{" "}
              <a
                href="https://infycrestsolutions.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-paper"
              >
                InfyCrest Solutions
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { LOCATIONS };
