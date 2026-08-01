/** Static assets served from /public — paths are root-relative for Next.js. */
export const PUBLIC_ASSETS = {
  icons: {
    waynxt: "/icons/waynxt.svg",
    logo: "/icons/logo.svg",
    fullLogo: "/icons/full_Logo.svg",
    fullLogoBlack: "/icons/full_logo_black.svg",
    fullLogoWhite: "/icons/full_logo_white.jpeg",
    rr: "/icons/rr.jpeg",
    logoLight: "/icons/logo_White.svg",
  },
  images: {
    worldmap: "/images/worldmap.png",
    worldmapWhite: "/images/worldmapwhite.jpeg",
    history: "/images/history.png",
    beaches: "/images/beaches.png",
    wellness: "/images/wellness.png",
    religious: "/images/religious.png",
    karnak: "/images/karnak.png",
    siwa: "/images/siwa.png",
    dahab: "/images/dahab.png",
    luxorFestival: "/images/luxor_festival.png",
    food: "/images/food.png",
    heroLight: {
      one: "/images/white/1_yellow.jpeg",
      two: "/images/white/2_yellow.jpeg",
      three: "/images/white/3_yellow.jpeg",
    },
    heroDark: {
      one: "/images/hero-dark-1.png",
      two: "/images/hero-dark-2.png",
      three: "/images/hero-dark-3.png",
    },
  },
  backgrounds: {
    pharaoh: "/images/login_bg_dark.png",
    register: "/images/register_bg_dark.png",
    loginDark: "/images/login_bg_dark.png",
  },
} as const;


const CATEGORY_IMAGE_MAP: Record<string, string> = {
  history: PUBLIC_ASSETS.images.history,
  beach: PUBLIC_ASSETS.images.beaches,
  beaches: PUBLIC_ASSETS.images.beaches,
  wellness: PUBLIC_ASSETS.images.wellness,
  religious: PUBLIC_ASSETS.images.religious,
  food: PUBLIC_ASSETS.images.food,
  adventure: PUBLIC_ASSETS.images.dahab,
  art: PUBLIC_ASSETS.images.karnak,
  nature: PUBLIC_ASSETS.images.siwa,
};

export function getCategoryImageUrl({
  category,
  imageUrl,
}: {
  category: string;
  imageUrl?: string | null;
}): string {
  if (imageUrl?.startsWith("/")) {
    return imageUrl;
  }

  const mapped = CATEGORY_IMAGE_MAP[category.toLowerCase()];
  return mapped ?? PUBLIC_ASSETS.images.history;
}
