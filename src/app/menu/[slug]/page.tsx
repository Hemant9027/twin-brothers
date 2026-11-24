import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ALL_ITEMS, MENU, findItem } from "@/lib/data";
import { PageHero } from "@/components/PageHero";
import ItemDetail from "@/components/ItemDetail";

export function generateStaticParams() {
  return ALL_ITEMS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = findItem(slug);
  if (!item) return { title: "Menu item" };
  const priceLine =
    item.price !== null ? `$${item.price} USD` : "market price";
  return {
    title: `${item.name} · ${priceLine}`,
    description: item.desc
      ? `${item.name} — ${item.desc} Twin Brothers Seafood & Steakhouse, Arawak Cay, Nassau.`
      : `${item.name} on the Twin Brothers menu at Arawak Cay, Nassau.`,
    alternates: { canonical: `/menu/${item.slug}` },
  };
}

export default async function MenuItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findItem(slug);
  if (!item) notFound();

  const siblings = item.category.items;
  const idx = siblings.findIndex((s) => s.slug === item.slug);
  const prev = siblings[(idx - 1 + siblings.length) % siblings.length];
  const next = siblings[(idx + 1) % siblings.length];

  return (
    <>
      <PageHero
        eyebrow={`${item.category.eyebrow} · ${item.category.name}`}
        title={item.name}
        intro={item.desc ?? "Description not published on the current menu — ask the team when you arrive."}
        image={item.image ?? item.category.image}
        crumbs={[{ label: "Menu", href: "/menu" }, { label: item.name }]}
      />
      <ItemDetail slug={item.slug} prevSlug={prev.slug} nextSlug={next.slug} />
      <div className="paper border-t border-ink/15 py-14">
        <div className="mx-auto flex max-w-[88rem] flex-wrap items-center justify-between gap-6 px-5 sm:px-8 md:px-10">
          <div>
            <p className="eyebrow text-coral">Also in {item.category.name}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {siblings.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/menu/${s.slug}`}
                    className="inline-block border border-ink/20 px-3.5 py-2 font-sans text-[0.78rem] transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/menu"
            className="font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-sea hover:underline"
          >
            ← Back to the full menu
          </Link>
        </div>
      </div>
    </>
  );
}
