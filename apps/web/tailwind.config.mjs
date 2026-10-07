import { heroui } from "@heroui/react";
import typography from "@tailwindcss/typography";

/**
 * The `heroui()` plugin supplies HeroUI's design tokens (`--border-width-medium`,
 * `--radius-large`, `--min-height-12`, …). Without it the utilities HeroUI's
 * components ask for do not exist and everything renders unstyled.
 *
 * `typography` backs the `prose` classes used to render user-authored post HTML;
 * without it post bodies lose all heading/list/link/blockquote formatting.
 *
 * Source scanning is handled separately in `src/app/globals.css` via `@source`,
 * which points at the `.heroui-theme/` mirror rather than at `node_modules`.
 * Do not add the theme package here: Tailwind v4 ignores `node_modules/`, so a
 * `content` entry aimed at it is a silent no-op.
 *
 * @type {import("tailwindcss").Config}
 */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  plugins: [heroui(), typography],
};

export default config;
