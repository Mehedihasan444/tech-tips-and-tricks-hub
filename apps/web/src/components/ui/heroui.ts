"use client";

/**
 * Client-side re-export of the HeroUI components that Server Components render.
 *
 * `@heroui/react` is a barrel, and importing it from a Server Component pulls the
 * entire library into the server module graph — including `@heroui/modal` →
 * `@heroui/use-viewport-size`. That package calls `React.createContext()` at module
 * scope *without* a `"use client"` directive, so the server runtime throws:
 *
 *   TypeError: createContext only works in Client Components.
 *
 * Re-exporting through a module that does carry the directive keeps the barrel in
 * the client graph, while the importing page stays a Server Component. That matters
 * here: these pages use `generateMetadata`, `notFound()` and server-side data
 * fetching, none of which are available in a Client Component.
 *
 * Usage: in a Server Component import from `@/components/ui/heroui`.
 * Client Components may keep importing `@heroui/react` directly — they already
 * evaluate the barrel on the client, where `createContext` is fine.
 */
export { Badge, Button, Divider, Tooltip, User } from "@heroui/react";
