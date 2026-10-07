/**
 * Mirrors `@heroui/theme/dist` into `.heroui-theme/` at the web app root.
 *
 * WHY THIS EXISTS
 * HeroUI v2 emits its component classes (`border-medium`, `rounded-large`,
 * `min-h-12`, `border-small`, …) from `@heroui/theme/dist`. Those are *candidates*:
 * Tailwind only generates a utility if the class name is found in a scanned source.
 * HeroUI ships no CSS, so the theme package must be scanned.
 *
 * Tailwind v4 hard-excludes `node_modules/` from source detection, and `@source`
 * cannot re-include it (verified against tailwindcss 4.3.3: a `@source` pointing at
 * the pnpm store path produces zero utilities, while a copy under `.heroui-theme/`
 * produces all of them). Pointing `@source` straight at `node_modules` is therefore
 * silently a no-op, and the result is a UI where every HeroUI Input renders with no
 * border, no radius and no hover/focus state.
 *
 * This script bridges that gap. It runs from `predev`/`prebuild`, so the copy can
 * never go stale after a HeroUI upgrade. It fails loudly (non-zero exit) if the
 * theme cannot be resolved, so the failure mode is a broken build rather than a
 * silently unstyled UI.
 */
import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const destDir = join(appRoot, ".heroui-theme");

const resolveThemeDist = () => {
  // Resolve through the realpath of @heroui/react so pnpm's symlinked store layout
  // is followed the same way Node would follow it at runtime.
  const herouiEntry = createRequire(import.meta.url).resolve("@heroui/react");
  const req = createRequire(herouiEntry);
  return join(dirname(req.resolve("@heroui/theme/package.json")), "dist");
};

const mtimesMatch = async (src, dest) => {
  try {
    const [a, b] = await Promise.all([stat(src), stat(dest)]);
    return (
      Math.abs(a.mtimeMs - b.mtimeMs) < 1 &&
      (await readdir(src)).length === (await readdir(dest)).length
    );
  } catch {
    return false;
  }
};

const main = async () => {
  let srcDir;
  try {
    srcDir = resolveThemeDist();
  } catch (error) {
    console.error(
      "[sync-heroui-theme] Could not resolve @heroui/theme from @heroui/react.\n" +
        "HeroUI utilities will be missing and every component will render unstyled.\n" +
        "Run `pnpm install` first.\n" +
        `Cause: ${error.message}`,
    );
    process.exit(1);
  }

  // `srcDir` is the whole `dist` folder; compare against a marker inside destDir.
  const marker = join(destDir, "index.js");
  if (await mtimesMatch(join(srcDir, "index.js"), marker)) return;

  await rm(destDir, { recursive: true, force: true });
  await mkdir(destDir, { recursive: true });
  await cp(srcDir, destDir, { recursive: true });
};

await main();
