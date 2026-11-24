import type { Metadata } from "next";
import Dashboard from "@/components/Dashboard";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Demo Staff Dashboard",
  description:
    "Frontend-only concept dashboard showing simulated reservations, event enquiries, availability controls and menu editing for the Twin Brothers website concept. No real customer data.",
  alternates: { canonical: "/demo/dashboard" },
  robots: { index: false, follow: true },
};

export default function DashboardPage() {
  return (
    <>
      <PageHero
        eyebrow="Concept preview · not a production system"
        title="Demo staff dashboard."
        intro="Reservations, event enquiries, sample availability and menu edits — all simulated, all stored in this browser. There is no server, no admin account and no real customer information anywhere in here."
        crumbs={[{ label: "Demo dashboard" }]}
      />
      <div className="paper py-12 md:py-16">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-8 md:px-10">
          <Dashboard />
        </div>
      </div>
    </>
  );
}
