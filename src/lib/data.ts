/**
 * Verified business content for the Twin Brothers concept.
 *
 * Source of truth: the live official site https://twinbrothersbahamas.com/
 * (fetched during research: /, /menu/, /about/, /contact-us/, /booking/).
 * Anything NOT published on the current official site is marked
 * `verified: false` and surfaced to the visitor as an explicit gap rather
 * than being invented.
 */

export const BRAND = {
  name: "Twin Brothers Seafood & Steakhouse",
  short: "Twin Brothers",
  tagline: "Fresh Bahamian seafood, served right on the water",
  heroHeadline: "Authentic Bahamian Flavors. Unforgettable Island Moments.",
  heroSub:
    "From fresh seafood to our world-famous daiquiris, experience the taste and spirit of The Bahamas at Twin Brothers.",
  streetAddress: "At the Fish Fry, Arawak Cay, West Bay Street",
  city: "Nassau",
  country: "The Bahamas",
  phone: "242-606-3600",
  phoneHref: "tel:+12426063600",
  whatsapp: "242-810-5579",
  whatsappNumber: "12428105579",
  hoursNote: "Open daily · 11am–9pm",
  hoursVerified: true,
  serviceCharge: "A 15% service charge and 10% VAT are added to your final bill.",
  mapsUrl:
    "https://www.google.com/maps/place/?q=place_id:ChIJ22rqUid9L4kRKRbbM0vnCPI",
  geo: { latitude: 25.0799068, longitude: -77.3583928 },
  cuisines: ["Bahamian", "Seafood", "Steakhouse"],
  priceRange: "$$",
  acceptsReservations: true,
  cruiseWalk: "An easy 25-minute walk from Prince George Wharf.",
  social: {
    facebook: "https://www.facebook.com/TwinBrothers242/photos",
  },
  // TripAdvisor publishes a different main number than the official site.
  phoneDiscrepancy: {
    official: "242-606-3600",
    other: "+1 242-603-0006",
    note: "TripAdvisor and older directory listings publish 242-603-0006. The current official site uses 242-606-3600 throughout. We show the official number.",
  },
} as const;

export const SERVICE_NOTICE =
  "Personalized website concept by InfyCrest Solutions. Reservations and availability shown are for demonstration purposes only.";

/* ------------------------------------------------------------------ */
/* Locations                                                           */
/* ------------------------------------------------------------------ */

export type LocationRecord = {
  slug: string;
  name: string;
  area: string;
  address: string;
  addressVerified: boolean;
  phone: string;
  phoneHref: string;
  hours: string | null;
  hoursVerified: boolean;
  primary: boolean;
  acceptsReservations: boolean;
  mapsQuery: string;
  blurb: string;
  image: string;
  amenities: { label: string; verified: boolean }[];
};

export const LOCATIONS: LocationRecord[] = [
  {
    slug: "arrawak-cay",
    name: "Arawak Cay",
    area: "The Fish Fry · Nassau",
    address: "At the Fish Fry, Arawak Cay, West Bay Street, Nassau, The Bahamas",
    addressVerified: true,
    phone: BRAND.phone,
    phoneHref: BRAND.phoneHref,
    hours: "Open daily · 11am–9pm",
    hoursVerified: true,
    primary: true,
    acceptsReservations: true,
    mapsQuery: "Twin Brothers Seafood Steakhouse Arawak Cay Nassau",
    blurb:
      "Our home on the water. The full dining room, the fire-grill, the daiquiri bar and the room the family has freshened up for thirty years — right on the Fish Fry.",
    image: "/images/official/2026/09/about-locale-harbour-2026.jpg",
    amenities: [
      { label: "Waterfront dining", verified: true },
      { label: "Full bar & World Famous Daiquiris", verified: true },
      { label: "Online table requests", verified: true },
      { label: "Catering enquiries", verified: true },
      { label: "Beach a short walk away", verified: true },
    ],
  },
  {
    slug: "boyd-road",
    name: "Boyd Road",
    area: "Nassau · New Providence",
    address: null as unknown as string,
    addressVerified: false,
    phone: "242 425-0173",
    phoneHref: "tel:+12424250173",
    hours: null,
    hoursVerified: false,
    primary: false,
    acceptsReservations: false,
    mapsQuery: "Twin Brothers Boyd Road Nassau Bahamas",
    blurb:
      "One of the family's smaller Twin Brothers spots across the island, where locals grab conch salad, fritters, daiquiris and a few small bites on the way home.",
    image: "/images/official/2026/08/home-b2-conch-fritters-full.jpg",
    amenities: [
      { label: "Same name, same kitchen, same people", verified: true },
      { label: "Street address published", verified: false },
      { label: "Opening hours published", verified: false },
      { label: "Table reservations online", verified: false },
    ],
  },
  {
    slug: "prince-charles-drive",
    name: "Prince Charles Drive (South)",
    area: "Nassau · New Providence",
    address: null as unknown as string,
    addressVerified: false,
    phone: "242 557-0255",
    phoneHref: "tel:+12425570255",
    hours: null,
    hoursVerified: false,
    primary: false,
    acceptsReservations: false,
    mapsQuery: "Twin Brothers Prince Charles Drive Nassau Bahamas",
    blurb:
      "A neighbourhood counter run by the family. Call ahead — the current official site lists the number but no street address or hours for this spot.",
    image: "/images/official/2026/09/home-b2-conch-salad-2026.jpg",
    amenities: [
      { label: "Same name, same kitchen, same people", verified: true },
      { label: "Street address published", verified: false },
      { label: "Opening hours published", verified: false },
      { label: "Table reservations online", verified: false },
    ],
  },
  {
    slug: "carmichael-road",
    name: "Carmichael Road",
    area: "Nassau · New Providence",
    address: null as unknown as string,
    addressVerified: false,
    phone: "242 425-8881",
    phoneHref: "tel:+12424258881",
    hours: null,
    hoursVerified: false,
    primary: false,
    acceptsReservations: false,
    mapsQuery: "Twin Brothers Carmichael Road Nassau Bahamas",
    blurb:
      "A local Twin Brothers counter on Carmichael Road. The number is published on the official site; the address and hours are not.",
    image: "/images/official/2026/08/home-b2-cracked-conch.jpg",
    amenities: [
      { label: "Same name, same kitchen, same people", verified: true },
      { label: "Street address published", verified: false },
      { label: "Opening hours published", verified: false },
      { label: "Table reservations online", verified: false },
    ],
  },
  {
    slug: "hatchet-bay",
    name: "Hatchet Bay",
    area: "Eleuthera",
    address: "Hatchet Bay, Eleuthera, The Bahamas",
    addressVerified: false,
    phone: "242 335-0730",
    phoneHref: "tel:+12423350730",
    hours: null,
    hoursVerified: false,
    primary: false,
    acceptsReservations: false,
    mapsQuery: "Twin Brothers Hatchet Bay Eleuthera",
    blurb:
      "The family's Twin Brothers on Eleuthera — the island Buddy and Danny grew up on. Call for hours before you travel.",
    image: "/images/official/2026/08/home-b2-fullbleed-snapper.jpg",
    amenities: [
      { label: "Same name, same kitchen, same people", verified: true },
      { label: "Street address published", verified: false },
      { label: "Opening hours published", verified: false },
      { label: "Table reservations online", verified: false },
    ],
  },
];

// keep TS honest about the null address
export const getLocation = (slug: string) =>
  LOCATIONS.find((l) => l.slug === slug);

/* ------------------------------------------------------------------ */
/* Hours — conflicting sources, surfaced rather than merged            */
/* ------------------------------------------------------------------ */

export const HOURS_CONFLICT = [
  {
    source: "twinbrothersbahamas.com (official site, JSON-LD + page copy)",
    value: "Every day, 11:00 – 21:00",
    status: "Used on this concept",
  },
  {
    source: "Google Business listing",
    value: "Every day, 11:00 – 22:00",
    status: "Conflicts with official site",
  },
  {
    source: "Facebook page copy",
    value: "Every day, 11:00 – 23:00",
    status: "Conflicts with official site",
  },
  {
    source: "Older directory listing (bahamasnet)",
    value: "Mon–Thu 11:45 – 23:30 · Fri–Sun 11:45 – 00:00",
    status: "Legacy, not used",
  },
];

/* ------------------------------------------------------------------ */
/* Menu — transcribed from the live /menu/ page                        */
/* ------------------------------------------------------------------ */

export type MenuItem = {
  slug: string;
  name: string;
  price: number | null;
  priceLabel?: string;
  sizes?: { label: string; price: number }[];
  desc?: string;
  note?: string;
  badge?: string;
  image?: string;
};

export type MenuCategory = {
  slug: string;
  index: string;
  eyebrow: string;
  name: string;
  intro?: string;
  image: string;
  items: MenuItem[];
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const mi = (
  name: string,
  price: number | null,
  extra: Partial<MenuItem> = {}
): MenuItem => ({ slug: slugify(name), name, price, ...extra });

export const MENU: MenuCategory[] = [
  {
    slug: "starters",
    index: "01",
    eyebrow: "To start",
    name: "Starters",
    image: "/images/official/2026/08/home-b2-conch-fritters-full.jpg",
    items: [
      mi("Conch Fritters", 10, {
        desc: "A truly Bahamian delight, our conchiest fritters fried golden brown served with our special fritter sauce.",
        image: "/images/menu/conch-fritters.jpg",
      }),
      mi("Chicken Wings", 14, {
        desc: "Fried or grilled served with carrot sticks and a ranch dip, tossed in a sauce of your choice: Honey BBQ, Sweet & Spicy, Buffalo or Spicy.",
      }),
      mi("Shrimp On Da Cay", 17, {
        desc: "Fried or grilled shrimp seasoned with special herbs.",
      }),
      mi("Loaded Potato", 10, {
        desc: "A buttery baked potato with cheese, bacon bites and sour cream.",
        note: "Add on: Chicken $9 · Shrimp $12 · Salmon $20",
      }),
    ],
  },
  {
    slug: "soups-salads",
    index: "02",
    eyebrow: "Fresh & light",
    name: "Soups & Salads",
    intro:
      "Conch salads: the conch is raw. Average preparation time is 30 to 45 minutes.",
    image: "/images/official/2026/09/home-b2-conch-salad-2026.jpg",
    items: [
      mi("Bahamian Conch Salad", 18, {
        desc: "A Bahamian twist on ceviche.",
        image: "/images/menu/conch-salad.jpg",
        badge: "Made in front of you",
      }),
      mi("Bahamian Tropical Conch Salad", 20, {
        desc: "Cubes of conch together in a bowl of pineapple, mango, apple, onion, sweet pepper, tomato, lime and orange.",
        image: "/images/menu/conch-salad.jpg",
      }),
      mi("Bahamian Scorched Conch Salad", 15, {
        desc: undefined,
        image: "/images/menu/conch-salad.jpg",
      }),
      mi("Caesar Salad", 14, {
        note: "Add on: Chicken $9 · Shrimp $12 · Lobster $25",
      }),
      mi("Veggie Salad", 15),
    ],
  },
  {
    slug: "entrees",
    index: "03",
    eyebrow: "From the grill",
    name: "Entrées",
    intro: "Served with two sides of your choice.",
    image: "/images/official/2026/08/home-b2-fullbleed-snapper.jpg",
    items: [
      mi("Bahamian Snapper", null, {
        priceLabel: "Market price",
        desc: "Fresh fish fried or grilled, seasoned to perfection.",
        image: "/images/menu/bahamian-snapper.jpg",
        badge: "Market price",
      }),
      mi("Lobster In Paradise", 43, {
        desc: "Bahamian lobster fire grilled and brushed with lemon butter sauce.",
        image: "/images/official/2026/08/home-b2-fullbleed-snapper.jpg",
      }),
      mi("NY Strip Steak", 42, {
        desc: "Strip steak seasoned with a special blend of herbs.",
      }),
      mi("Salmon Supreme", 39, {
        desc: "Grilled and glazed with our signature lemon butter sauce.",
      }),
      mi("Alfredo Linguine", 16, {
        desc: "A creamy garlic alfredo served over a bed of linguine.",
        note: "Add on: Chicken $9 · Shrimp $12 · Salmon $20 · Lobster $25",
      }),
    ],
  },
  {
    slug: "signature",
    index: "04",
    eyebrow: "Signature plates",
    name: "Signature Plates",
    image: "/images/official/2026/09/home-gallery-dining-room.jpg",
    items: [
      mi("Ultimate Seafood Sensation", 69, {
        desc: "Cracked conch, shrimp and fish fillet, seasoned with our special blend.",
        badge: "Signature",
        image: "/images/menu/seafood-sensation.jpg",
      }),
      mi("Danny's Saucy Ribs", 31, {
        desc: "A must have, fall off the bone saucy ribs with a special sweet and savory BBQ sauce... just saucy.",
        badge: "Signature",
      }),
      mi("Jammin Jerk Chicken", 28, {
        desc: "Chicken seasoned with special herbs and spices, and tossed in jerk sauce, mild or hot.",
        badge: "Signature",
        image: "/images/menu/jerk-chicken.jpg",
      }),
      mi("Boil In A Foil", null, {
        priceLabel: "Market price",
        desc: "Your choice of Snapper, Salmon or Lobster grilled with fresh vegetables and seasoned with unique spices in a savory sauce.",
        badge: "Signature",
      }),
    ],
  },
  {
    slug: "quick-bites",
    index: "05",
    eyebrow: "Handhelds & more",
    name: "Quick Bites",
    intro: "Served with fries.",
    image: "/images/official/2026/08/home-b2-cracked-conch.jpg",
    items: [
      mi("Cracked Conch", 27, {
        desc: "A mouth watering Bahamian delight, tenderized conch battered and fried to a crispy golden perfection.",
        image: "/images/menu/cracked-conch.jpg",
        badge: "House favourite",
      }),
      mi("The Lobster Burger", 28, {
        desc: "Lobster seasoned with our unique blend of herbs, battered and fried to a golden crisp, served with tartar sauce, lettuce, tomatoes and onion on a toasted bun.",
      }),
      mi("Jammin Jerk Chicken Sandwich", null, {
        priceLabel: undefined,
        desc: undefined,
      }),
      mi("Fish N Chip", 25, {
        desc: "Strips of fish fillet seasoned to perfection, battered and fried golden.",
      }),
      mi("Surf N Turf Burger", 25, {
        desc: "Fish fillet seasoned with our unique blend of herbs, along with a beef patty, served with special sauce, lettuce, tomatoes and onion on a toasted bun.",
      }),
      mi("Fish Burger", 20, {
        desc: "Fish fillet seasoned with our unique blend of herbs, battered and fried to a golden crisp, served with tartar sauce, lettuce, tomatoes and onion on a toasted bun.",
      }),
      mi("Beef Burger", 17, {
        desc: "Fresh beef patty seasoned to perfection, dressed the way you like on a toasted bun.",
        image: "/images/menu/beef-burger.jpg",
      }),
      mi("Veggie Burger", 15, {
        desc: "Fresh veggie patty seasoned to perfection, dressed the way you like on a toasted bun.",
        note: "Add on: Cheese $1 or grilled onions $2",
      }),
    ],
  },
  {
    slug: "sides",
    index: "06",
    eyebrow: "On the side",
    name: "Sides",
    image: "/images/official/2026/08/home-b2-fullbleed-snapper.jpg",
    items: [
      mi("Peas 'N Rice", 7),
      mi("Mixed Veg", 7),
      mi("Side Salad", 7),
      mi("Mashed Potato", 7),
      mi("Coleslaw", 5),
      mi("Fried Plantains", 5),
      mi("French Fries", 5),
      mi("Baked Macaroni", 5),
    ],
  },
  {
    slug: "kids",
    index: "07",
    eyebrow: "For the little ones",
    name: "Kids Menu",
    intro: "10 and under.",
    image: "/images/official/2026/09/home-gallery-dining-room.jpg",
    items: [
      mi("Cheese Burger", 8, { image: "/images/menu/beef-burger.jpg" }),
      mi("Chicken Tender", 10),
      mi("Butter Pasta", 10),
    ],
  },
  {
    slug: "dessert",
    index: "08",
    eyebrow: "Something sweet",
    name: "Dessert",
    image: "/images/official/2026/09/home-gallery-dining-room.jpg",
    items: [
      mi("Bahamian Guava Duff", 9, {
        desc: "Guava duff, the national dessert of The Bahamas, made with excellence.",
        badge: "National dessert",
        image: "/images/menu/guava-duff.jpg",
      }),
      mi("Rum Cake", 10),
      mi("Chocolate Cake", 7),
    ],
  },
  {
    slug: "daiquiris",
    index: "09",
    eyebrow: "The one you came for",
    name: "The World Famous Daiquiris",
    intro:
      "The frozen daiquiris that made the name. Pick your flavour, pick your size. Add alcohol for $3.",
    image: "/images/official/2026/09/home-b2-daiquiri-miami-vice-2026.jpg",
    items: [
      "Pina Colada",
      "Strawberry",
      "Miami Vice",
      "Mango",
      "Banana",
      "Pineapple",
      "Sour Sop",
      "Passion Fruit",
    ].map((f) =>
      mi(f, 12, {
        sizes: [
          { label: "12 oz", price: 12 },
          { label: "15 oz", price: 15 },
          { label: "Large Goblet 24 oz", price: 24 },
        ],
        image:
          f === "Miami Vice"
            ? "/images/menu/miami-vice.jpg"
            : "/images/official/2026/09/home-b2-daiquiri-miami-vice-2026.jpg",
        desc: "Blended fresh at the bar, all day at the Fish Fry.",
      })
    ),
  },
  {
    slug: "frozen-cocktails",
    index: "10",
    eyebrow: "Blended cold",
    name: "Frozen Cocktails",
    image: "/images/official/2026/09/home-b2-daiquiri-miami-vice-2026.jpg",
    items: [
      mi("Frozen Margarita", 17, { desc: "Strawberry, Tropical." }),
      mi("Frozen Mojito", 16, {
        desc: "Regular, Strawberry, Mango, Passion Fruit.",
      }),
      mi("Frozen Blitz", 16),
      mi("Coffee Colada", 17),
    ],
  },
  {
    slug: "cocktails",
    index: "11",
    eyebrow: "From the bar",
    name: "Cocktails",
    image: "/images/official/2026/09/home-b2-daiquiri-miami-vice-2026.jpg",
    items: [
      mi("Seeing Double", 22),
      mi("Twin Bros Special", 22),
      mi("Long Island Ice Tea", 18),
      mi("Long Beach Tea", 18),
      mi("Blue Long Island Ice Tea", 18),
      mi("Hawaiian Long Island Ice Tea", 18),
      mi("Tokyo Tea", 18),
      mi("Bahama Mama", 15, { image: "/images/menu/bahama-mama.jpg" }),
      mi("Goombay Smash", 15),
      mi("Strawberry Mule", 14),
      mi("Tropical Mule", 14),
      mi("Mojito", 14),
      mi("Moscow Mule", 13),
      mi("Sky Juice", 12, { desc: "Gin & coconut water." }),
    ],
  },
  {
    slug: "shots",
    index: "12",
    eyebrow: "A quick one",
    name: "Shots",
    image: "/images/official/2026/09/home-b2-daiquiri-miami-vice-2026.jpg",
    items: [
      mi("Emerald Shot", 9),
      mi("Bubble Gum Shot", 9),
      mi("Lemon Drop Shot", 9),
      mi("Blue Razz Shot", 9),
      mi("Sunkissed Shot", 9),
      mi("Jolly Rancher Shot", 9),
      mi("Green Tea", 9),
    ],
  },
  {
    slug: "beverages",
    index: "13",
    eyebrow: "To drink",
    name: "Beverages",
    image: "/images/official/2026/09/home-gallery-dining-room.jpg",
    items: [
      mi("Beers", 7),
      mi("Lemonade", 5, { desc: "Strawberry, Mango." }),
      mi("Fruit Punch", 5),
      mi("Ice Tea", 5),
      mi("Sodas", 2),
      mi("Water", 2),
    ],
  },
];

// The quick-bites entry above needs correcting — remove the placeholder item.
const qb = MENU.find((c) => c.slug === "quick-bites");
if (qb) qb.items = qb.items.filter((i) => i.slug !== "jammin-jerk-chicken-sandwich");

export const ALL_ITEMS: (MenuItem & { category: MenuCategory })[] = MENU.flatMap(
  (c) => c.items.map((i) => ({ ...i, category: c }))
);

export const findItem = (slug: string) => ALL_ITEMS.find((i) => i.slug === slug);

/** Items the older, still-indexed version of the site listed differently. */
export const MENU_DISCREPANCIES = [
  {
    item: "Shrimp Fettuccine",
    published: "$27 on an older indexed menu page",
    current: "Not on the current live menu — the pasta line today is Alfredo Linguine $16.",
  },
  {
    item: "Chicken Pasta",
    published: "$23 on an older indexed menu page",
    current: "Not on the current live menu.",
  },
  {
    item: "Calamari",
    published: "$15 on an older indexed menu page",
    current: "Not on the current live menu.",
  },
  {
    item: "Seafood Platter",
    published: "$85 on an older indexed menu page",
    current: "Not listed on the current live menu. The closest current plate is the Ultimate Seafood Sensation $69.",
  },
  {
    item: "Hamburger",
    published: "$16 on an older indexed menu page",
    current: "The current live menu lists a Beef Burger at $17.",
  },
  {
    item: "Miami Vice Daiquiri",
    published: "$3 on a legacy listing",
    current: "The live menu prices Miami Vice daiquiris at 12 oz $12 · 15 oz $15 · Goblet 24 oz $24. Do not treat $3 as a current dine-in price.",
  },
];

/* ------------------------------------------------------------------ */
/* Reviews — quoted from the official site's own review block           */
/* ------------------------------------------------------------------ */

export const REVIEWS = {
  googleCount: "5,800+ Google reviews",
  items: [
    {
      quote:
        "amazing conch fritters! and best daiquiris ever — they say they are world famous which could be true. i went with a group of 5 and everyone absolutely loved their drinks.",
      name: "Jennifer Vincent",
      meta: "5 stars · Google",
    },
    {
      quote:
        "Truly a Nassau island vibe. This where the locals eat and it was delicious!!!",
      name: "Bruno Schirripa",
      meta: "5 stars · Google",
    },
    {
      quote:
        "Melanie was great! Came for dinner on a Thursday and food took 20 minutes. Food was fantastic and so was the hospitality. Big portions as well. They are also allergy friendly!",
      name: "Hannah Roth",
      meta: "5 stars · Google",
    },
  ],
  sourceNote:
    "Quoted verbatim from the review block published on twinbrothersbahamas.com. Third-party listings disagree with each other — TripAdvisor shows 4.1 of 5 bubbles but publishes two different review totals (705 and 1,912) across its own pages, so we do not show a consolidated score here.",
};

/* ------------------------------------------------------------------ */
/* About / story — from /about/                                        */
/* ------------------------------------------------------------------ */

export const STORY = {
  headline: "Three generations of Bahamian seafood at Twin Brothers.",
  lede: "From Buddy and Danny's daiquiri stand to the family restaurant on the Fish Fry at Arawak Cay, Nassau: conch, snapper, and the World Famous Daiquiris, still made by the same family, 25 minutes on foot from the cruise port.",
  chapters: [
    {
      title: "It started with two brothers",
      body: [
        "Before there was a kitchen, there were two brothers and a daiquiri recipe.",
        "Identical twins Buddy and Danny McCardy grew up in a proud Eleuthera family and came to Nassau to work in the hotels. On the side, they started making frozen daiquiris the way the family liked them: fresh fruit, ice, and their own syrup mix.",
        "The daiquiris earned a name of their own downtown at the Old Straw Market. Then the customers started asking for food, and the brothers listened. The stand became a restaurant, and the restaurant found its home on the water at Arawak Cay.",
        "More than thirty years on, the same family still runs the room at the Fish Fry. The people who cook your conch and pour your daiquiri carry the name that's on the door. That's the part we're proudest to keep.",
      ],
    },
    {
      title: "The fresh-up tradition",
      body: [
        "Every year, you freshen up. Buddy and Danny started that, and we've never stopped.",
        "So when you see fresh paint and a new bar, that's the tradition, not a trend. We keep the place cared for year after year, so it feels new every time you walk in. Lately, it's been the daiquiri bar's turn. Same fire-grill, same conch, same faces. Just freshened up, the way Buddy and Danny always meant it to be.",
      ],
    },
    {
      title: "Our corner of Arawak Cay",
      body: [
        "The Fish Fry is the island's row of waterfront kitchens, and Twin Brothers has cooked here for years. We're an easy 25-minute walk from the cruise ships at Prince George Wharf, minutes from downtown Nassau, and right by the beach. Come off the boat, spend the afternoon on the sand, and finish at our table on the water.",
      ],
    },
  ],
  catering: [
    "Weddings",
    "Birthday Parties",
    "Baby Showers",
    "Bridal Showers",
    "Repast / Funerals",
    "Family Dinners",
    "Retirement Parties",
    "Engagement Parties",
    "Reunions",
    "Corporate Events",
    "Holiday Parties",
  ],
};

/* ------------------------------------------------------------------ */
/* FAQ — quoted from /contact-us/                                      */
/* ------------------------------------------------------------------ */

export const FAQS = [
  {
    q: "How far are you from the cruise ships?",
    a: "An easy 25-minute walk from Prince George Wharf. We're right on the water at Arawak Cay's Fish Fry.",
  },
  {
    q: "When are you open?",
    a: "Every day, 11am to 9pm.",
  },
  {
    q: "Can I book a table?",
    a: "Yes. Book a table online, or WhatsApp us at 242-810-5579.",
  },
  {
    q: "Are you near the beach?",
    a: "Yes, we're right by the beach on Arawak Cay, minutes from downtown Nassau.",
  },
  {
    q: "What is added to the bill?",
    a: "A 15% service charge and 10% VAT are added to your final bill.",
  },
  {
    q: "Do you cater?",
    a: "Yes — Twin Brothers Catering handles weddings, birthday parties, showers, repasts, family dinners, retirements, engagements, reunions, corporate and holiday parties. Tel: 242-606-3600.",
  },
];

/* ------------------------------------------------------------------ */
/* Experiences                                                         */
/* ------------------------------------------------------------------ */

export const EXPERIENCES = [
  {
    slug: "seated-dining",
    title: "Seated dining on the water",
    body: "Lunch through dinner at the Fish Fry — conch salad made in front of you, whole snapper off the fire-grill, and the daiquiri bar blending all day.",
    image: "/images/official/2026/09/home-gallery-dining-room.jpg",
  },
  {
    slug: "celebrations",
    title: "Celebrations & birthdays",
    body: "The official booking form has a Birthday occasion field — choose it and the team sets the table up for it. Larger parties go through the catering team.",
    image: "/images/official/2026/08/home-b2-conch-fritters-full.jpg",
  },
  {
    slug: "group-dining",
    title: "Group & corporate dining",
    body: "Family dinners, reunions, corporate events and holiday parties are catered by the same kitchen. Enquiries go straight to the team.",
    image: "/images/official/2026/09/home-b2-daiquiri-miami-vice-2026.jpg",
  },
];

export const EVENT_TYPES = [
  "Birthday celebration",
  "Anniversary",
  "Family gathering",
  "Corporate dining",
  "Cruise passenger group",
  "Wedding / bridal shower",
  "Reunion",
  "Other private celebration",
];

export const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Engagement",
  "Business meal",
  "Family gathering",
  "Cruise group",
  "Just because",
];

export const SEATING = [
  "No preference",
  "Indoor dining room",
  "Outdoor / waterfront",
  "Upstairs bar & patio",
  "Large table for the full party",
];

/* ------------------------------------------------------------------ */
/* Gallery — captions describe the illustration set used in this concept|
   No photograph on this page is claimed to be an official Twin Brothers
   press image; each caption states that plainly.                      */
/* ------------------------------------------------------------------ */

/**
 * Gallery — downloaded from the restaurant's own website
 * (twinbrothersbahamas.com and its published gallery set) into
 * /public/images/official. Captions describe what the official site shows
 * for each file; the last four are unlabelled frames from the restaurant's
 * own gallery, so they carry a neutral caption.
 */
export const GALLERY = [
  { src: "/images/official/2026/09/home-gallery-dining-room.jpg", caption: "The dining room at Twin Brothers", tag: "Atmosphere" },
  { src: "/images/official/2026/09/home-b2-conch-salad-2026.jpg", caption: "Bahamian conch salad, made in front of you", tag: "Conch" },
  { src: "/images/official/2026/08/home-b2-cracked-conch.jpg", caption: "Cracked conch with seasoned fries", tag: "Dining" },
  { src: "/images/official/2026/09/home-b2-daiquiri-miami-vice-2026.jpg", caption: "A Miami Vice at the bar", tag: "Bar" },
  { src: "/images/official/2026/08/home-b2-fullbleed-snapper.jpg", caption: "Whole fried snapper, peas 'n rice, plantains", tag: "Seafood" },
  { src: "/images/official/2026/08/home-b2-conch-fritters-full.jpg", caption: "Conch fritters with house fritter sauce", tag: "Starters" },
  { src: "/images/official/2026/08/home-b3-findus-photo.jpg", caption: "The storefront on Arawak Cay", tag: "Place" },
  { src: "/images/official/2026/09/home-gallery-fresh-daiquiri.jpg", caption: "Daiquiris blended fresh at the bar", tag: "Bar" },
  { src: "/images/official/2026/09/about-locale-harbour-2026.jpg", caption: "The water at Arawak Cay, steps from the door", tag: "Place" },
  { src: "/images/official/2026/08/gallery-bar-poster-v3.jpg", caption: "Behind the daiquiri bar", tag: "Bar" },
  { src: "/images/official/2026/09/about-then-dining-room.jpg", caption: "The old dining room — then", tag: "Atmosphere" },
  { src: "/images/official/2026/09/about-now-servers-2026.jpg", caption: "Service in the room today", tag: "Atmosphere" },
  { src: "/images/official/2026/09/about-team-bar.jpg", caption: "The bar team", tag: "Service" },
  { src: "/images/official/2026/08/home-b6-tile-service.jpg", caption: "Service on the floor", tag: "Service" },
  { src: "/images/official/tb-legacy-gallery/food-DSC06835.jpg", caption: "From the restaurant's own gallery", tag: "Food" },
  { src: "/images/official/tb-legacy-gallery/restaurant-DSC06793.jpg", caption: "From the restaurant's own gallery", tag: "Room" },
  { src: "/images/official/tb-legacy-gallery/daiquiris-DSC06850.jpg", caption: "From the restaurant's own gallery", tag: "Bar" },
  { src: "/images/official/tb-legacy-gallery/drinks-DSC06918.jpg", caption: "From the restaurant's own gallery", tag: "Drinks" },
];

export const GALLERY_CREDIT =
  "Photography downloaded from the restaurant's own website (twinbrothersbahamas.com) and its published gallery set, stored locally for this concept. None of it is third-party stock imagery.";
