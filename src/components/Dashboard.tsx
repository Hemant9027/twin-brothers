"use client";

import { Fragment, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { format, parseISO, addDays } from "date-fns";
import {
  LayoutDashboard,
  CalendarCheck2,
  PartyPopper,
  SlidersHorizontal,
  UtensilsCrossed,
  Search,
  RotateCcw,
  Ban,
  CheckCircle2,
  CircleSlash,
  Users,
  AlertTriangle,
} from "lucide-react";
import { LOCATIONS, MENU } from "@/lib/data";
import {
  todayISO,
  padDate,
  allSlotTimes,
  SAMPLE_SCHEDULE_NOTE,
  useStore,
  type ReservationStatus,
  type EnquiryStatus,
} from "@/lib/store";
import { Btn } from "./ui";

type Tab = "overview" | "reservations" | "events" | "availability" | "menu";

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "reservations", label: "Reservations", icon: CalendarCheck2 },
  { id: "events", label: "Event enquiries", icon: PartyPopper },
  { id: "availability", label: "Availability", icon: SlidersHorizontal },
  { id: "menu", label: "Menu", icon: UtensilsCrossed },
];

const RES_STATUS: { id: ReservationStatus; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const ENQ_STATUS: { id: EnquiryStatus; label: string }[] = [
  { id: "new", label: "New" },
  { id: "reviewing", label: "Reviewing" },
  { id: "approved", label: "Approved" },
  { id: "declined", label: "Declined" },
];

const chip: Record<string, string> = {
  pending: "border-coral text-coral",
  confirmed: "border-sea text-sea",
  completed: "border-ink/40 text-ink/60",
  cancelled: "border-ink/25 text-ink/35 line-through",
  new: "border-coral text-coral",
  reviewing: "border-sea text-sea",
  approved: "border-sea text-sea",
  declined: "border-ink/25 text-ink/40",
};

function Stat({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="border border-ink/15 bg-paper p-5">
      <p className="eyebrow text-mute">{label}</p>
      <p className="tabular mt-3 font-display text-[2.6rem] leading-none">{value}</p>
      {sub && <p className="mt-2 font-sans text-[0.72rem] text-mute">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const {
    ready,
    reservations,
    enquiries,
    availability,
    setStatus,
    setEnquiryStatus,
    blockDate,
    unblockDate,
    toggleSlot,
    setCapacity,
    setMenuOverride,
    resetDemo,
    bookingsFor,
    menu,
    itemAvailable,
  } = useStore();

  const [resQuery, setResQuery] = useState("");
  const [resFilter, setResFilter] = useState<"all" | ReservationStatus>("all");
  const [enqFilter, setEnqFilter] = useState<"all" | EnquiryStatus>("all");
  const [openRes, setOpenRes] = useState<string | null>(null);
  const [day, setDay] = useState(todayISO());
  const [menuQuery, setMenuQuery] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  const today = todayISO();

  const stats = useMemo(() => {
    const todays = reservations.filter((r) => r.date === today && r.status !== "cancelled");
    const upcoming = reservations.filter(
      (r) => r.date >= today && r.status !== "cancelled" && r.status !== "completed"
    );
    const pendingEnq = enquiries.filter((e) => e.status === "new" || e.status === "reviewing");
    const weekEnd = padDate(addDays(new Date(), 7));
    const weekGuests = reservations
      .filter((r) => r.date >= today && r.date <= weekEnd && r.status !== "cancelled")
      .reduce((s, r) => s + r.guests, 0);
    return {
      todays,
      upcoming,
      pendingEnq,
      weekGuests,
      cancelled: reservations.filter((r) => r.status === "cancelled").length,
    };
  }, [reservations, enquiries, today]);

  const filteredRes = useMemo(() => {
    const q = resQuery.trim().toLowerCase();
    return reservations.filter((r) => {
      if (resFilter !== "all" && r.status !== resFilter) return false;
      if (!q) return true;
      return (
        r.ref.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.date.includes(q)
      );
    });
  }, [reservations, resQuery, resFilter]);

  const filteredEnq = useMemo(
    () => enquiries.filter((e) => enqFilter === "all" || e.status === enqFilter),
    [enquiries, enqFilter]
  );

  const dayBookings = bookingsFor("arrawak-cay", day);

  if (!ready) {
    return <div className="py-32 text-center text-mute">Loading demo records…</div>;
  }

  return (
    <div>
      {/* banner */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border border-coral/50 bg-coral/[0.07] p-5">
        <div>
          <p className="eyebrow text-coral">Demo Dashboard — concept preview</p>
          <p className="mt-2 max-w-[74ch] text-[0.88rem] leading-relaxed text-ink/80">
            Frontend-only concept by InfyCrest Solutions. Every record below was created in this
            browser — seeded demo guests, invented references, no real customers, no real
            business records. Nothing here is connected to Twin Brothers Seafood &amp;
            Steakhouse or any provider they use.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="border border-ink/30 px-4 py-2.5 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-paper"
          >
            Exit to site
          </button>
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-2 border border-coral px-4 py-2.5 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-coral transition-colors hover:bg-coral hover:text-paper"
          >
            <RotateCcw size={14} /> Reset demo data
          </button>
        </div>
      </div>

      {confirmReset && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border border-ink/25 bg-sand/50 p-5">
          <p className="text-[0.9rem]">
            Reset every reservation, enquiry, availability change and menu edit back to the seeded
            demo state?
          </p>
          <div className="flex gap-3">
            <Btn
              variant="coral"
              onClick={() => {
                resetDemo();
                setConfirmReset(false);
              }}
            >
              Yes, reset
            </Btn>
            <Btn variant="outline" onClick={() => setConfirmReset(false)}>Keep my changes</Btn>
          </div>
        </div>
      )}

      {/* tabs */}
      <div className="no-scrollbar -mx-5 mb-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`inline-flex shrink-0 items-center gap-2 border px-4 py-2.5 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.14em] transition-all ${
              tab === t.id
                ? "border-ink bg-ink text-paper"
                : "border-ink/20 text-ink/65 hover:border-ink hover:text-ink"
            }`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {/* ---------------------------------------------- OVERVIEW */}
          {tab === "overview" && (
            <div className="space-y-8">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat label="Today's demo reservations" value={stats.todays.length} sub={format(new Date(), "EEEE d MMMM")} />
                <Stat label="Upcoming" value={stats.upcoming.length} sub="From today onward, not cancelled" />
                <Stat label="Pending event enquiries" value={stats.pendingEnq.length} sub="New or under review" />
                <Stat label="Guests in the next 7 days" value={stats.weekGuests} sub="Confirmed + pending" />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="border border-ink/15 bg-paper p-5">
                  <p className="eyebrow text-coral">Today · {format(new Date(), "EEE d MMM")}</p>
                  {stats.todays.length === 0 ? (
                    <p className="mt-4 text-[0.92rem] text-mute">
                      Nothing booked for today in this demo yet.
                    </p>
                  ) : (
                    <ul className="mt-4 divide-y divide-ink/12">
                      {stats.todays.map((r) => (
                        <li key={r.id} className="flex flex-wrap items-baseline justify-between gap-3 py-3">
                          <span>
                            <span className="tabular font-sans text-[0.94rem] font-semibold">{r.time}</span>
                            <span className="ml-3 text-[0.9rem]">{r.name}</span>
                          </span>
                          <span className="flex items-center gap-3">
                            <span className="tabular text-[0.78rem] text-mute">{r.guests} pax</span>
                            <span className={`border px-2 py-0.5 font-sans text-[0.6rem] uppercase tracking-[0.12em] ${chip[r.status]}`}>
                              {r.status}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="border border-ink/15 bg-paper p-5">
                  <p className="eyebrow text-coral">Recent activity</p>
                  <ul className="mt-4 space-y-3">
                    {[
                      ...reservations.map((r) => ({
                        id: r.id,
                        ref: r.ref,
                        createdAt: r.createdAt,
                        kind: "reservation",
                        who: r.name,
                      })),
                      ...enquiries.map((e) => ({
                        id: e.id,
                        ref: e.ref,
                        createdAt: e.createdAt,
                        kind: "event enquiry",
                        who: e.contact,
                      })),
                    ]
                      .sort((a, b) => b.createdAt - a.createdAt)
                      .slice(0, 7)
                      .map((x) => (
                        <li
                          key={x.id}
                          className="flex items-baseline justify-between gap-3 border-b border-ink/12 pb-3 last:border-0"
                        >
                          <span className="text-[0.88rem]">
                            <span className="tabular font-semibold">{x.ref}</span>{" "}
                            <span className="text-mute">· {x.kind} · {x.who}</span>
                          </span>
                          <span className="shrink-0 font-sans text-[0.7rem] text-mute">
                            {format(new Date(x.createdAt), "d MMM HH:mm")}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------- RESERVATIONS */}
          {tab === "reservations" && (
            <div>
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <label className="relative w-full lg:max-w-sm">
                  <Search size={15} className="absolute left-0 top-1/2 -translate-y-1/2 text-mute" />
                  <input
                    value={resQuery}
                    onChange={(e) => setResQuery(e.target.value)}
                    placeholder="Search reference, guest, email, date"
                    aria-label="Search reservations"
                    className="w-full border-b border-ink/30 bg-transparent py-2.5 pl-6 font-sans text-[0.92rem] outline-none focus:border-sea"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["all", ...RES_STATUS.map((s) => s.id)] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setResFilter(s)}
                      className={`border px-3.5 py-2 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.12em] transition-all ${
                        resFilter === s ? "border-coral bg-coral text-paper" : "border-ink/20 text-ink/65 hover:border-ink"
                      }`}
                    >
                      {s === "all" ? "All" : RES_STATUS.find((x) => x.id === s)?.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto border border-ink/15 bg-paper">
                <table className="w-full min-w-[860px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-ink/25 bg-sand/40">
                      {["Ref", "Date", "Time", "Guest", "Party", "Location", "Status", ""].map((h) => (
                        <th key={h} className="eyebrow px-4 py-3 text-mute">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRes.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-4 py-10 text-center text-[0.9rem] text-mute">
                          No demo reservations match that filter.
                        </td>
                      </tr>
                    )}
                    {filteredRes.map((r) => (
                      <Fragment key={r.id}>
                        <tr className="border-b border-ink/12 align-top hover:bg-ink/[0.025]">
                          <td className="tabular px-4 py-3 font-sans text-[0.86rem] font-semibold">{r.ref}</td>
                          <td className="tabular px-4 py-3 text-[0.86rem]">{format(parseISO(r.date), "EEE d MMM")}</td>
                          <td className="tabular px-4 py-3 text-[0.86rem]">{r.time}</td>
                          <td className="px-4 py-3 text-[0.86rem]">{r.name}</td>
                          <td className="tabular px-4 py-3 text-[0.86rem]">{r.guests}</td>
                          <td className="px-4 py-3 text-[0.86rem]">
                            {LOCATIONS.find((l) => l.slug === r.locationSlug)?.name}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`border px-2 py-1 font-sans text-[0.6rem] uppercase tracking-[0.12em] ${chip[r.status]}`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => setOpenRes(openRes === r.id ? null : r.id)}
                              className="font-sans text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-sea hover:underline"
                            >
                              {openRes === r.id ? "Close" : "Details"}
                            </button>
                          </td>
                        </tr>
                        {openRes === r.id && (
                          <tr className="border-b border-ink/12 bg-sand/25">
                            <td colSpan={8} className="px-4 py-5">
                              <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
                                <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 text-[0.86rem]">
                                  <div><dt className="eyebrow text-mute">Email</dt><dd className="mt-1 break-all">{r.email}</dd></div>
                                  <div><dt className="eyebrow text-mute">Phone</dt><dd className="tabular mt-1">{r.phone}</dd></div>
                                  <div><dt className="eyebrow text-mute">Occasion</dt><dd className="mt-1">{r.occasion}</dd></div>
                                  <div><dt className="eyebrow text-mute">Seating</dt><dd className="mt-1">{r.seating}</dd></div>
                                  <div><dt className="eyebrow text-mute">Created</dt><dd className="tabular mt-1">{format(new Date(r.createdAt), "d MMM yyyy HH:mm")}</dd></div>
                                  <div><dt className="eyebrow text-mute">Notes</dt><dd className="mt-1">{r.notes || "—"}</dd></div>
                                </dl>
                                <div className="flex flex-wrap gap-2">
                                  {RES_STATUS.map((s) => (
                                    <button
                                      key={s.id}
                                      type="button"
                                      onClick={() => setStatus(r.id, s.id)}
                                      disabled={r.status === s.id}
                                      className={`border px-3 py-2 font-sans text-[0.64rem] font-semibold uppercase tracking-[0.12em] transition-colors disabled:opacity-35 ${
                                        r.status === s.id
                                          ? "border-ink bg-ink text-paper"
                                          : "border-ink/25 hover:border-ink hover:bg-ink hover:text-paper"
                                      }`}
                                    >
                                      {s.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --------------------------------------- EVENTS */}
          {tab === "events" && (
            <div>
              <div className="mb-6 flex flex-wrap gap-2">
                {(["all", ...ENQ_STATUS.map((s) => s.id)] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setEnqFilter(s)}
                    className={`border px-3.5 py-2 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.12em] transition-all ${
                      enqFilter === s ? "border-coral bg-coral text-paper" : "border-ink/20 text-ink/65 hover:border-ink"
                    }`}
                  >
                    {s === "all" ? "All" : ENQ_STATUS.find((x) => x.id === s)?.label}
                  </button>
                ))}
              </div>

              {filteredEnq.length === 0 ? (
                <div className="border border-dashed border-ink/25 px-6 py-16 text-center text-[0.92rem] text-mute">
                  No demo enquiries with that status. Send one from the events or cruise page.
                </div>
              ) : (
                <ul className="grid gap-4 lg:grid-cols-2">
                  {filteredEnq.map((e) => (
                    <li key={e.id} className="border border-ink/15 bg-paper p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <span className="tabular font-sans text-[0.78rem] font-semibold text-coral">{e.ref}</span>
                          <h4 className="mt-1 text-[1.25rem] leading-tight">{e.type}</h4>
                          <p className="mt-1 font-sans text-[0.78rem] uppercase tracking-[0.12em] text-mute">
                            {e.source} source · {LOCATIONS.find((l) => l.slug === e.locationSlug)?.name}
                          </p>
                        </div>
                        <span className={`border px-2 py-1 font-sans text-[0.6rem] uppercase tracking-[0.12em] ${chip[e.status]}`}>
                          {e.status}
                        </span>
                      </div>

                      <div className="dash-rule my-4" />

                      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-[0.86rem] sm:grid-cols-4">
                        <div><dt className="eyebrow text-mute">Date</dt><dd className="tabular mt-1">{format(parseISO(e.date), "EEE d MMM")}</dd></div>
                        <div><dt className="eyebrow text-mute">Time</dt><dd className="tabular mt-1">{e.time}</dd></div>
                        <div><dt className="eyebrow text-mute">Guests</dt><dd className="tabular mt-1 flex items-center gap-1.5"><Users size={13} /> {e.guests}</dd></div>
                        <div><dt className="eyebrow text-mute">Seating</dt><dd className="mt-1">{e.seating}</dd></div>
                      </dl>

                      {(e.fandb || e.notes || e.cruiseLine) && (
                        <div className="mt-4 border-l-2 border-sea bg-sand/35 px-3 py-2.5">
                          <p className="eyebrow text-mute">Special requests</p>
                          <p className="mt-1 text-[0.86rem] leading-relaxed">
                            {[e.cruiseLine, e.fandb, e.notes].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink/12 pt-3">
                        <p className="text-[0.8rem] text-mute">
                          {e.contact} · {e.email} · {e.phone}
                        </p>
                        <select
                          value={e.status}
                          onChange={(ev) => setEnquiryStatus(e.id, ev.target.value as EnquiryStatus)}
                          aria-label={`Status for ${e.ref}`}
                          className="border border-ink/25 bg-transparent px-3 py-2 font-sans text-[0.7rem] uppercase tracking-[0.1em] outline-none focus:border-sea"
                        >
                          {ENQ_STATUS.map((s) => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* --------------------------------------- AVAILABILITY */}
          {tab === "availability" && (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-start">
              <div className="space-y-6">
                <div className="border border-ink/15 bg-paper p-5">
                  <p className="eyebrow text-coral">Sample capacity</p>
                  <p className="mt-2 font-sans text-[0.8rem] leading-relaxed text-mute">
                    Sample tables available per 30-minute slot. Changing this immediately changes
                    what guests see on the booking page.
                  </p>
                  <ul className="mt-4 space-y-4">
                    {LOCATIONS.filter((l) => l.acceptsReservations).map((l) => (
                      <li key={l.slug} className="flex items-center justify-between gap-4">
                        <span className="text-[0.9rem]">{l.name}</span>
                        <span className="flex items-center gap-3">
                          <button
                            type="button"
                            aria-label={`Decrease capacity for ${l.name}`}
                            onClick={() => setCapacity(l.slug, Math.max(1, (availability.capacity[l.slug] ?? 6) - 1))}
                            className="grid h-8 w-8 place-items-center border border-ink/25 hover:bg-ink hover:text-paper"
                          >
                            −
                          </button>
                          <span className="tabular min-w-6 text-center font-display text-xl">
                            {availability.capacity[l.slug] ?? 6}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase capacity for ${l.name}`}
                            onClick={() => setCapacity(l.slug, Math.min(20, (availability.capacity[l.slug] ?? 6) + 1))}
                            className="grid h-8 w-8 place-items-center border border-ink/25 hover:bg-ink hover:text-paper"
                          >
                            +
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-ink/15 bg-paper p-5">
                  <p className="eyebrow text-coral">Block a date</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <input
                      type="date"
                      value={day}
                      min={today}
                      onChange={(e) => setDay(e.target.value)}
                      aria-label="Date to block"
                      className="tabular flex-1 border-b border-ink/30 bg-transparent py-2 font-sans text-[0.9rem] outline-none focus:border-sea"
                    />
                    <button
                      type="button"
                      onClick={() => blockDate("arrawak-cay", day)}
                      className="inline-flex items-center gap-2 border border-coral px-4 py-2.5 font-sans text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-coral transition-colors hover:bg-coral hover:text-paper"
                    >
                      <Ban size={13} /> Block
                    </button>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {availability.blockedDates.length === 0 && (
                      <li className="text-[0.85rem] text-mute">No dates blocked.</li>
                    )}
                    {availability.blockedDates.map((k) => (
                      <li key={k} className="flex items-center justify-between gap-3 border-b border-ink/12 pb-2 text-[0.85rem]">
                        <span className="tabular">{k.split("|")[1]} · {k.split("|")[0]}</span>
                        <button
                          type="button"
                          onClick={() => unblockDate(k)}
                          className="font-sans text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-sea hover:underline"
                        >
                          Unblock
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border border-ink/15 bg-paper p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="eyebrow text-coral">Reservations by day · Arawak Cay</p>
                      <p className="tabular mt-1 text-[0.9rem]">{format(parseISO(day), "EEEE d MMMM yyyy")}</p>
                    </div>
                    <input
                      type="date"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      aria-label="Choose day"
                      className="tabular border-b border-ink/30 bg-transparent py-2 font-sans text-[0.9rem] outline-none focus:border-sea"
                    />
                  </div>

                  <div className="dash-rule my-4" />
                  {dayBookings.length === 0 ? (
                    <p className="py-6 text-center text-[0.9rem] text-mute">
                      No demo reservations on this day — availability comes purely from the
                      simulated schedule.
                    </p>
                  ) : (
                    <ul className="divide-y divide-ink/12">
                      {dayBookings.map((r) => (
                        <li key={r.id} className="flex flex-wrap items-baseline justify-between gap-3 py-3">
                          <span className="tabular text-[0.9rem] font-semibold">{r.time}</span>
                          <span className="flex-1 px-3 text-[0.9rem]">{r.name}</span>
                          <span className="tabular text-[0.8rem] text-mute">{r.guests} pax</span>
                          <span className={`border px-2 py-0.5 font-sans text-[0.6rem] uppercase tracking-[0.12em] ${chip[r.status]}`}>
                            {r.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="border border-ink/15 bg-paper p-5">
                  <p className="eyebrow text-coral">Disable time slots</p>
                  <p className="mt-2 flex items-start gap-2 font-sans text-[0.78rem] leading-relaxed text-mute">
                    <AlertTriangle size={13} className="mt-0.5 shrink-0 text-coral" />
                    {SAMPLE_SCHEDULE_NOTE}
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">
                    {allSlotTimes().map((t) => {
                      const key = `arrawak-cay|${day}|${t}`;
                      const off = availability.disabledSlots.includes(key);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleSlot(key)}
                          className={`tabular border px-2 py-2 font-sans text-[0.78rem] transition-colors ${
                            off
                              ? "border-ink/20 bg-ink/[0.05] text-ink/30 line-through"
                              : "border-ink/25 hover:border-ink hover:bg-ink hover:text-paper"
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------- MENU */}
          {tab === "menu" && (
            <div>
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <label className="relative w-full lg:max-w-sm">
                  <Search size={15} className="absolute left-0 top-1/2 -translate-y-1/2 text-mute" />
                  <input
                    value={menuQuery}
                    onChange={(e) => setMenuQuery(e.target.value)}
                    placeholder="Find a dish to edit"
                    aria-label="Search dishes"
                    className="w-full border-b border-ink/30 bg-transparent py-2.5 pl-6 font-sans text-[0.92rem] outline-none focus:border-sea"
                  />
                </label>
                <p className="font-sans text-[0.78rem] text-mute">
                  {menu.flatMap((c) => c.items).length} dishes ·{" "}
                  {Object.keys(availability).length >= 0 &&
                    menu.flatMap((c) => c.items).filter((i) => !itemAvailable(i.slug)).length}{" "}
                  marked off in demo
                </p>
              </div>

              <div className="space-y-10">
                {menu
                  .map((c) => ({
                    ...c,
                    items: c.items.filter((i) =>
                      menuQuery.trim()
                        ? i.name.toLowerCase().includes(menuQuery.trim().toLowerCase())
                        : true
                    ),
                  }))
                  .filter((c) => c.items.length > 0)
                  .map((c) => (
                    <div key={c.slug}>
                      <div className="flex items-baseline gap-4 border-b-2 border-ink pb-2">
                        <span className="tabular font-sans text-[0.7rem] font-semibold text-coral">{c.index}</span>
                        <h4 className="text-[1.4rem] leading-none">{c.name}</h4>
                      </div>
                      <ul className="divide-y divide-ink/12">
                        {c.items.map((it) => (
                          <li key={it.slug} className="grid gap-3 py-4 lg:grid-cols-[1.1fr_120px_1.4fr_auto] lg:items-start">
                            <div>
                              <p className="font-sans text-[0.95rem] font-semibold">{it.name}</p>
                              <p className="mt-0.5 font-sans text-[0.72rem] text-mute">
                                {it.desc ? "Has description" : "No published description"}
                              </p>
                            </div>
                            <label className="block">
                              <span className="eyebrow text-mute">Price $</span>
                              <input
                                type="number"
                                min={0}
                                step={1}
                                defaultValue={it.price ?? ""}
                                placeholder="MP"
                                disabled={it.price === null}
                                aria-label={`Price for ${it.name}`}
                                onBlur={(ev) => {
                                  const v = ev.target.value;
                                  setMenuOverride(it.slug, {
                                    price: v === "" ? null : Number(v),
                                    priceLabel: v === "" ? "Market price" : undefined,
                                  });
                                }}
                                className="tabular mt-1 w-full border-b border-ink/30 bg-transparent py-1.5 font-sans text-[0.9rem] outline-none focus:border-sea disabled:opacity-40"
                              />
                            </label>
                            <label className="block">
                              <span className="eyebrow text-mute">Description</span>
                              <textarea
                                rows={2}
                                defaultValue={it.desc ?? ""}
                                placeholder="No description published"
                                aria-label={`Description for ${it.name}`}
                                onBlur={(ev) =>
                                  setMenuOverride(it.slug, { desc: ev.target.value })
                                }
                                className="mt-1 w-full resize-y border border-ink/25 bg-transparent px-2 py-1.5 font-sans text-[0.84rem] leading-relaxed outline-none focus:border-sea"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => setMenuOverride(it.slug, { available: !itemAvailable(it.slug) })}
                              className={`inline-flex items-center justify-center gap-2 self-start border px-3.5 py-2 font-sans text-[0.64rem] font-semibold uppercase tracking-[0.12em] transition-colors ${
                                itemAvailable(it.slug)
                                  ? "border-sea text-sea hover:bg-sea hover:text-paper"
                                  : "border-coral bg-coral text-paper"
                              }`}
                            >
                              {itemAvailable(it.slug) ? (
                                <><CheckCircle2 size={13} /> On the board</>
                              ) : (
                                <><CircleSlash size={13} /> Sold out</>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>

              <p className="mt-8 font-sans text-[0.78rem] leading-relaxed text-mute">
                Edits are sample values stored in this browser. Prices, descriptions and
                availability on the public menu pages read from the same store, so you can see
                the effect immediately — no real menu is being changed.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
