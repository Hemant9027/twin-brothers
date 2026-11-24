import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Phone, Clock, Check, X, ArrowRight, MessageCircle } from "lucide-react";
import { LOCATIONS, getLocation, BRAND } from "@/lib/data";
import { PageHero } from "@/components/PageHero";
import { Reveal, Section, Btn } from "@/components/ui";
import { waLink } from "@/lib/wa";
import LocationActions from "@/components/LocationActions";

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) return { title: "Location" };
  return {
    title: `${loc.name} · ${loc.area}`,
    description: `${loc.name} — ${loc.blurb} Twin Brothers Seafood & Steakhouse, ${loc.area}.`,
    alternates: { canonical: `/locations/${loc.slug}` },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) notFound();

  return (
    <>
      <PageHero
        eyebrow={loc.primary ? "Featured location" : "Also ours"}
        title={`${loc.name}.`}
        intro={loc.blurb}
        image={loc.image}
        crumbs={[{ label: "Locations", href: "/locations" }, { label: loc.name }]}
      >
        <LocationActions slug={loc.slug} />
      </PageHero>

      <Section
        index="01"
        eyebrow="The details"
        title={loc.primary ? "Everything published, in one place" : "What is — and isn't — published"}
        intro={
          loc.addressVerified
            ? "Address, phone, hours and map link all come from the restaurant's current official site."
            : "This counter is listed on the official site with a phone number only. Address and hours are not published there, so we leave them blank rather than guess."
        }
      >
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="border border-ink/15 bg-paper p-6 sm:p-8">
            <dl className="space-y-6">
              <div className="flex gap-4 border-b border-ink/12 pb-5">
                <dt className="mt-0.5 shrink-0"><MapPin size={18} className="text-coral" /></dt>
                <dd>
                  <span className="eyebrow block text-mute">Address</span>
                  <span className="mt-1.5 block text-[1rem] leading-relaxed">
                    {loc.addressVerified ? loc.address : "Not published on the current site."}
                  </span>
                  {!loc.addressVerified && (
                    <a
                      href={waLink(`Hello Twin Brothers! Could you send me the address for your ${loc.name} location?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-sea hover:underline"
                    >
                      <MessageCircle size={13} /> Ask for the address
                    </a>
                  )}
                </dd>
              </div>

              <div className="flex gap-4 border-b border-ink/12 pb-5">
                <dt className="mt-0.5 shrink-0"><Clock size={18} className="text-coral" /></dt>
                <dd>
                  <span className="eyebrow block text-mute">Opening hours</span>
                  <span className="tabular mt-1.5 block text-[1rem]">
                    {loc.hours ?? "Not published — call before you travel."}
                  </span>
                  {!loc.hoursVerified && (
                    <span className="mt-1 block font-sans text-[0.72rem] text-coral">
                      Unverified for this branch
                    </span>
                  )}
                </dd>
              </div>

              <div className="flex gap-4 border-b border-ink/12 pb-5">
                <dt className="mt-0.5 shrink-0"><Phone size={18} className="text-coral" /></dt>
                <dd>
                  <span className="eyebrow block text-mute">Telephone</span>
                  <a href={loc.phoneHref} className="tabular mt-1.5 block text-[1.15rem] font-semibold hover:text-sea">
                    {loc.phone}
                  </a>
                </dd>
              </div>

              <div className="flex gap-4">
                <dt className="mt-0.5 shrink-0"><MapPin size={18} className="text-coral" /></dt>
                <dd>
                  <span className="eyebrow block text-mute">Directions</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.mapsQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-2 text-[1rem] text-sea hover:underline"
                  >
                    Search on Google Maps <ArrowRight size={15} />
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="space-y-6">
            <div className="border border-ink/15 p-6 sm:p-8">
              <p className="eyebrow text-mute">What this branch offers</p>
              <ul className="mt-4 space-y-3">
                {loc.amenities.map((a) => (
                  <li key={a.label} className="flex items-start gap-3 border-b border-ink/12 pb-3 last:border-0">
                    {a.verified ? (
                      <Check size={16} className="mt-0.5 shrink-0 text-sea" />
                    ) : (
                      <X size={16} className="mt-0.5 shrink-0 text-coral" />
                    )}
                    <span className="text-[0.94rem]">
                      {a.label}
                      {!a.verified && (
                        <span className="ml-2 font-sans text-[0.68rem] uppercase tracking-[0.12em] text-coral">
                          not published
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-ink/15 bg-sand/40 p-6 sm:p-8">
              <p className="eyebrow text-coral">Branch differences</p>
              <p className="mt-3 text-[0.94rem] leading-relaxed text-ink/80">
                The restaurant does not publish identical menus for every counter, and only the
                Arawak Cay page offers online table requests. This concept therefore routes all
                reservations to Arawak Cay and sends every other branch to a phone or WhatsApp
                enquiry.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Btn href="/menu" variant="outline">See the Arawak Cay menu</Btn>
                <Btn href="/locations" variant="outline">All locations</Btn>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section index="02" eyebrow="Also ours" tone="sand" tight title="Nearby Twin Brothers spots">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LOCATIONS.filter((l) => l.slug !== loc.slug).map((l, i) => (
            <Reveal key={l.slug} delay={i * 0.05}>
              <a
                href={`/locations/${l.slug}`}
                className="group block h-full border border-ink/20 bg-paper p-5 transition-all hover:border-ink hover:shadow-[0_22px_48px_-34px_rgba(16,45,56,0.8)]"
              >
                <span className="eyebrow text-mute">{l.area}</span>
                <span className="mt-2 block font-display text-[1.25rem] leading-tight transition-colors group-hover:text-sea">
                  {l.name}
                </span>
                <span className="tabular mt-3 block font-sans text-[0.82rem] font-semibold">
                  {l.phone}
                </span>
              </a>
            </Reveal>
          ))}
        </div>
        <p className="mt-7 font-sans text-[0.84rem] text-mute">
          Main line:{" "}
          <a href={BRAND.phoneHref} className="font-semibold text-sea hover:underline">
            {BRAND.phone}
          </a>{" "}
          · WhatsApp{" "}
          <a
            href={waLink("Hello Twin Brothers! I have a question.")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sea hover:underline"
          >
            {BRAND.whatsapp}
          </a>
        </p>
      </Section>
    </>
  );
}
