/**
 * Single source of truth for brand, contact, pricing and layout constants.
 * Use these instead of hardcoding strings / colors across pages.
 */
export const siteConfig = {
  name: "Tech Tips & Tricks Hub",
  shortName: "Tech Tips & Tricks",
  tagline: "Bite-size tech tips, tutorials, and premium deep-dives.",
  description:
    "Bite-size tech tips, tutorials, and premium deep-dives from engineers shipping in production.",
  supportEmail: "support@techtips-hub.com",
  contact: {
    email: "support@techtips-hub.com",
    phone: "+1 (415) 555-0132",
    address: "548 Market Street, San Francisco, CA 94104",
  },
  socials: {
    x: "https://x.com/techtipshub",
    facebook: "https://facebook.com/techtipshub",
    instagram: "https://instagram.com/techtipshub",
    github: "https://github.com/techtipshub",
  },
  premium: {
    priceUSD: 20,
    priceLabel: "$20/month",
    interval: "month",
    features: [
      "Premium-only tutorials and deep-dives",
      "Early access to new content",
      "Verified premium badge on your profile",
      "Ad-free reading experience",
      "Download posts as PDF",
    ],
  },
} as const;

/** Standardized container widths — pick one per page type. */
export const containerWidths = {
  prose: "max-w-3xl",
  feed: "max-w-5xl",
  browse: "max-w-6xl",
  wide: "max-w-7xl",
} as const;

export type ContainerWidth = keyof typeof containerWidths;
