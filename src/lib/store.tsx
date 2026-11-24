"use client";

/**
 * Demo state layer. Everything is deterministic and persisted to
 * localStorage. Nothing here talks to a server, and no real guest data is
 * ever collected — the dashboard says so on the tin.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LOCATIONS, MENU, type MenuCategory, type MenuItem } from "./data";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type ReservationStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type EnquiryStatus = "new" | "reviewing" | "approved" | "declined";

export type Reservation = {
  id: string;
  ref: string;
  locationSlug: string;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  guests: number;
  seating: string;
  occasion: string;
  notes: string;
  name: string;
  email: string;
  phone: string;
  status: ReservationStatus;
  createdAt: number;
};

export type Enquiry = {
  id: string;
  ref: string;
  source: "events" | "birthdays" | "cruise";
  type: string;
  locationSlug: string;
  date: string;
  time: string;
  guests: number;
  contact: string;
  email: string;
  phone: string;
  seating: string;
  fandb: string;
  notes: string;
  cruiseLine?: string;
  status: EnquiryStatus;
  createdAt: number;
};

export type AvailabilityConfig = {
  /** tables available per 30-minute slot, per location */
  capacity: Record<string, number>;
  /** "yyyy-MM-dd" — location prefixed, e.g. "arrawak-cay|2026-04-01" */
  blockedDates: string[];
  /** "location|yyyy-MM-dd|HH:mm" */
  disabledSlots: string[];
};

export type MenuOverride = {
  price?: number | null;
  priceLabel?: string;
  desc?: string;
  available?: boolean;
};

export type SlotState = "open" | "limited" | "booked" | "closed";

export type Slot = { time: string; state: SlotState; left: number };

/* ------------------------------------------------------------------ */
/* Keys + safe storage                                                 */
/* ------------------------------------------------------------------ */

const K = {
  reservations: "tb.demo.reservations.v1",
  enquiries: "tb.demo.enquiries.v1",
  availability: "tb.demo.availability.v1",
  menu: "tb.demo.menuOverrides.v1",
  seeded: "tb.demo.seeded.v1",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...(fallback as object), ...JSON.parse(raw) } as T;
  } catch {
    return fallback;
  }
}
function readList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}
function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota — demo only */
  }
}

/* ------------------------------------------------------------------ */
/* Deterministic pseudo-randomness                                     */
/* ------------------------------------------------------------------ */

export function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return h >>> 0;
}

/* ------------------------------------------------------------------ */
/* Sample schedule — NOT verified operating hours.                     */
/* Derived from the official "daily 11am–9pm" statement purely so the  */
/* demo has something to show; labelled as such everywhere it appears.  */
/* ------------------------------------------------------------------ */

export const SLOT_STEP = 30;
const OPEN_MIN = 11 * 60 + 30;
const CLOSE_MIN = 20 * 60 + 30;

export const SAMPLE_SCHEDULE_NOTE =
  "Sample schedule generated for this demonstration. Twin Brothers publishes daily 11am–9pm service; actual table times are set by the restaurant.";

export function allSlotTimes(): string[] {
  const out: string[] = [];
  for (let m = OPEN_MIN; m <= CLOSE_MIN; m += SLOT_STEP) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return out;
}

export const DEFAULT_CAPACITY: Record<string, number> = Object.fromEntries(
  LOCATIONS.filter((l) => l.acceptsReservations).map((l) => [l.slug, 6])
);

const DEFAULT_AVAILABILITY: AvailabilityConfig = {
  capacity: DEFAULT_CAPACITY,
  blockedDates: [],
  disabledSlots: [],
};

/** Base load for a slot before any demo bookings are subtracted. */
function baseLoad(locationSlug: string, date: string, time: string): number {
  const capacity = 6;
  const r = hash(`${locationSlug}|${date}|${time}`) % 100;
  const [h] = time.split(":").map(Number);
  // dinner peak is busier than mid-afternoon in the simulated room
  const peak = h >= 18 && h <= 20 ? 34 : h >= 12 && h <= 14 ? 20 : 8;
  const load = Math.floor(((r + peak) % 100) / 100 * capacity);
  return Math.max(0, Math.min(capacity, load));
}

export function padDate(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return padDate(new Date());
}

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

type Ctx = {
  ready: boolean;
  reservations: Reservation[];
  enquiries: Enquiry[];
  availability: AvailabilityConfig;
  menuOverrides: Record<string, MenuOverride>;
  saveReservation: (r: Omit<Reservation, "id" | "ref" | "status" | "createdAt">) => Reservation;
  saveEnquiry: (e: Omit<Enquiry, "id" | "ref" | "status" | "createdAt">) => Enquiry;
  setStatus: (id: string, status: ReservationStatus) => void;
  setEnquiryStatus: (id: string, status: EnquiryStatus) => void;
  blockDate: (locationSlug: string, date: string) => void;
  unblockDate: (key: string) => void;
  toggleSlot: (key: string) => void;
  setCapacity: (locationSlug: string, n: number) => void;
  setMenuOverride: (slug: string, patch: MenuOverride) => void;
  resetDemo: () => void;
  slotsFor: (locationSlug: string, date: string) => Slot[];
  bookingsFor: (locationSlug: string, date: string) => Reservation[];
  capacityFor: (locationSlug: string) => number;
  menu: MenuCategory[];
  itemAvailable: (slug: string) => boolean;
  effectivePrice: (item: MenuItem) => { price: number | null; priceLabel?: string };
};

const StoreCtx = createContext<Ctx | null>(null);

function makeRef(prefix: string, seed: number) {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let n = seed;
  let out = "";
  for (let i = 0; i < 5; i++) {
    out += alphabet[n % alphabet.length];
    n = Math.floor(n / alphabet.length) + 977 * (i + 1);
  }
  return `${prefix}-${out}`;
}

/** Pre-seeded demo records so the dashboard is never an empty shell. */
function seed(): { reservations: Reservation[]; enquiries: Enquiry[] } {
  const now = Date.now();
  const d = (offset: number) => {
    const x = new Date();
    x.setDate(x.getDate() + offset);
    return padDate(x);
  };
  const reservations: Reservation[] = [
    {
      id: "seed-1",
      ref: makeRef("TB", 41),
      locationSlug: "arrawak-cay",
      date: d(0),
      time: "18:30",
      guests: 4,
      seating: "Outdoor / waterfront",
      occasion: "Anniversary",
      notes: "Would love a table away from the bar if possible.",
      name: "Demo Guest — Alder",
      email: "demo.alder@example.com",
      phone: "+1 242 000 0001",
      status: "confirmed",
      createdAt: now - 86400000 * 2,
    },
    {
      id: "seed-2",
      ref: makeRef("TB", 77),
      locationSlug: "arrawak-cay",
      date: d(0),
      time: "12:30",
      guests: 2,
      seating: "Indoor dining room",
      occasion: "Just because",
      notes: "",
      name: "Demo Guest — Marlow",
      email: "demo.marlow@example.com",
      phone: "+1 242 000 0002",
      status: "pending",
      createdAt: now - 86400000,
    },
    {
      id: "seed-3",
      ref: makeRef("TB", 208),
      locationSlug: "arrawak-cay",
      date: d(3),
      time: "19:00",
      guests: 8,
      seating: "Large table for the full party",
      occasion: "Cruise group",
      notes: "Party of eight arriving together from the ship.",
      name: "Demo Guest — Okonkwo",
      email: "demo.okonkwo@example.com",
      phone: "+1 242 000 0003",
      status: "confirmed",
      createdAt: now - 3600000 * 5,
    },
    {
      id: "seed-4",
      ref: makeRef("TB", 355),
      locationSlug: "arrawak-cay",
      date: d(-2),
      time: "13:00",
      guests: 3,
      seating: "Indoor dining room",
      occasion: "Business meal",
      notes: "",
      name: "Demo Guest — Ferreira",
      email: "demo.ferreira@example.com",
      phone: "+1 242 000 0004",
      status: "completed",
      createdAt: now - 86400000 * 5,
    },
    {
      id: "seed-5",
      ref: makeRef("TB", 512),
      locationSlug: "arrawak-cay",
      date: d(6),
      time: "17:30",
      guests: 5,
      seating: "Upstairs bar & patio",
      occasion: "Birthday",
      notes: "Demo record — cake is being handled offline.",
      name: "Demo Guest — Rivera",
      email: "demo.rivera@example.com",
      phone: "+1 242 000 0005",
      status: "pending",
      createdAt: now - 3600000 * 20,
    },
  ];
  const enquiries: Enquiry[] = [
    {
      id: "seed-e1",
      ref: makeRef("EV", 91),
      source: "birthdays",
      type: "Birthday celebration",
      locationSlug: "arrawak-cay",
      date: d(9),
      time: "18:00",
      guests: 18,
      contact: "Demo Enquirer — Hall",
      email: "demo.hall@example.com",
      phone: "+1 242 000 0111",
      seating: "Upstairs bar & patio",
      fandb: "One daiquiri tower for the table, no shellfish for two guests.",
      notes: "Demo enquiry — not a real booking.",
      status: "reviewing",
      createdAt: now - 86400000 * 2,
    },
    {
      id: "seed-e2",
      ref: makeRef("EV", 144),
      source: "cruise",
      type: "Cruise passenger group",
      locationSlug: "arrawak-cay",
      date: d(12),
      time: "12:00",
      guests: 32,
      contact: "Demo Enquirer — Vidal",
      email: "demo.vidal@example.com",
      phone: "+1 242 000 0112",
      seating: "Large table for the full party",
      fandb: "Lunch service for a ship excursion group.",
      cruiseLine: "Demo Cruise Line — Aurora",
      notes: "Demo enquiry — not a real booking.",
      status: "new",
      createdAt: now - 3600000 * 9,
    },
    {
      id: "seed-e3",
      ref: makeRef("EV", 260),
      source: "events",
      type: "Corporate dining",
      locationSlug: "arrawak-cay",
      date: d(21),
      time: "13:00",
      guests: 12,
      contact: "Demo Enquirer — Pinder",
      email: "demo.pinder@example.com",
      phone: "+1 242 000 0113",
      seating: "Indoor dining room",
      fandb: "Set menu discussion pending.",
      notes: "Demo enquiry — not a real booking.",
      status: "approved",
      createdAt: now - 86400000 * 6,
    },
  ];
  return { reservations, enquiries };
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [availability, setAvailability] = useState<AvailabilityConfig>(DEFAULT_AVAILABILITY);
  const [menuOverrides, setMenuOverrides] = useState<Record<string, MenuOverride>>({});

  useEffect(() => {
    const seededFlag = window.localStorage.getItem(K.seeded);
    let res = readList<Reservation>(K.reservations);
    let enq = readList<Enquiry>(K.enquiries);
    if (!seededFlag && res.length === 0 && enq.length === 0) {
      const s = seed();
      res = s.reservations;
      enq = s.enquiries;
      write(K.reservations, res);
      write(K.enquiries, enq);
      window.localStorage.setItem(K.seeded, "1");
    }
    const id = window.setTimeout(() => {
      setReservations(res);
      setEnquiries(enq);
      setAvailability(read<AvailabilityConfig>(K.availability, DEFAULT_AVAILABILITY));
      setMenuOverrides(read<Record<string, MenuOverride>>(K.menu, {}));
      setReady(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (ready) write(K.reservations, reservations);
  }, [reservations, ready]);
  useEffect(() => {
    if (ready) write(K.enquiries, enquiries);
  }, [enquiries, ready]);
  useEffect(() => {
    if (ready) write(K.availability, availability);
  }, [availability, ready]);
  useEffect(() => {
    if (ready) write(K.menu, menuOverrides);
  }, [menuOverrides, ready]);

  const capacityFor = useCallback(
    (slug: string) => availability.capacity[slug] ?? DEFAULT_CAPACITY[slug] ?? 6,
    [availability]
  );

  const bookingsFor = useCallback(
    (slug: string, date: string) =>
      reservations.filter(
        (r) =>
          r.locationSlug === slug &&
          r.date === date &&
          r.status !== "cancelled"
      ),
    [reservations]
  );

  const slotsFor = useCallback(
    (slug: string, date: string): Slot[] => {
      const today = todayISO();
      if (date < today) return [];
      if (availability.blockedDates.includes(`${slug}|${date}`)) return [];
      const capacity = capacityFor(slug);
      const booked = bookingsFor(slug, date);
      return allSlotTimes().map((time) => {
        const disabled = availability.disabledSlots.includes(`${slug}|${date}|${time}`);
        if (disabled) return { time, state: "closed" as SlotState, left: 0 };
        const guestsAtSlot = booked
          .filter((b) => b.time === time)
          .reduce((s, b) => s + b.guests, 0);
        const base = baseLoad(slug, date, time);
        const used = Math.min(capacity, base + Math.ceil(guestsAtSlot / 2));
        const left = capacity - used;
        const state: SlotState =
          left <= 0 ? "booked" : left <= 1 ? "limited" : left <= 2 ? "limited" : "open";
        return { time, state, left };
      });
    },
    [availability, capacityFor, bookingsFor]
  );

  const saveReservation: Ctx["saveReservation"] = useCallback((input) => {
    const id = `r-${Date.now()}-${Math.floor(Math.random() * 999)}`;
    const ref = makeRef("TB", hash(id) % 100000);
    const record: Reservation = {
      ...input,
      id,
      ref,
      status: "confirmed",
      createdAt: Date.now(),
    };
    setReservations((prev) => [record, ...prev]);
    return record;
  }, []);

  const saveEnquiry: Ctx["saveEnquiry"] = useCallback((input) => {
    const id = `e-${Date.now()}-${Math.floor(Math.random() * 999)}`;
    const ref = makeRef("EV", hash(id) % 100000);
    const record: Enquiry = { ...input, id, ref, status: "new", createdAt: Date.now() };
    setEnquiries((prev) => [record, ...prev]);
    return record;
  }, []);

  const setStatus: Ctx["setStatus"] = useCallback((id, status) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }, []);

  const setEnquiryStatus: Ctx["setEnquiryStatus"] = useCallback((id, status) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  }, []);

  const blockDate = useCallback((slug: string, date: string) => {
    setAvailability((a) => {
      const key = `${slug}|${date}`;
      return a.blockedDates.includes(key)
        ? a
        : { ...a, blockedDates: [...a.blockedDates, key] };
    });
  }, []);
  const unblockDate = useCallback((key: string) => {
    setAvailability((a) => ({
      ...a,
      blockedDates: a.blockedDates.filter((k) => k !== key),
    }));
  }, []);
  const toggleSlot = useCallback((key: string) => {
    setAvailability((a) => ({
      ...a,
      disabledSlots: a.disabledSlots.includes(key)
        ? a.disabledSlots.filter((k) => k !== key)
        : [...a.disabledSlots, key],
    }));
  }, []);
  const setCapacity = useCallback((slug: string, n: number) => {
    setAvailability((a) => ({ ...a, capacity: { ...a.capacity, [slug]: n } }));
  }, []);
  const setMenuOverride = useCallback((slug: string, patch: MenuOverride) => {
    setMenuOverrides((prev) => ({ ...prev, [slug]: { ...prev[slug], ...patch } }));
  }, []);

  const resetDemo = useCallback(() => {
    const s = seed();
    setReservations(s.reservations);
    setEnquiries(s.enquiries);
    setAvailability(DEFAULT_AVAILABILITY);
    setMenuOverrides({});
  }, []);

  const menu = useMemo(
    () =>
      MENU.map((c) => ({
        ...c,
        items: c.items.map((it) => {
          const o = menuOverrides[it.slug];
          if (!o) return it;
          return {
            ...it,
            price: o.price !== undefined ? o.price : it.price,
            priceLabel: o.priceLabel !== undefined ? o.priceLabel : it.priceLabel,
            desc: o.desc !== undefined ? o.desc : it.desc,
          };
        }),
      })),
    [menuOverrides]
  );

  const itemAvailable = useCallback(
    (slug: string) => menuOverrides[slug]?.available !== false,
    [menuOverrides]
  );

  const effectivePrice = useCallback(
    (item: MenuItem) => {
      const o = menuOverrides[item.slug];
      return {
        price: o && o.price !== undefined ? o.price : item.price,
        priceLabel:
          o && o.priceLabel !== undefined ? o.priceLabel : item.priceLabel,
      };
    },
    [menuOverrides]
  );

  const value: Ctx = {
    ready,
    reservations,
    enquiries,
    availability,
    menuOverrides,
    saveReservation,
    saveEnquiry,
    setStatus,
    setEnquiryStatus,
    blockDate,
    unblockDate,
    toggleSlot,
    setCapacity,
    setMenuOverride,
    resetDemo,
    slotsFor,
    bookingsFor,
    capacityFor,
    menu,
    itemAvailable,
    effectivePrice,
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore(): Ctx {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
