/**
 * Normalize a nickname for display with an `@` prefix.
 * Seed/demo accounts sometimes store the `@` already (e.g. `"@demo user"`),
 * which rendered as `"@@demo user"`. Internal spacing is left untouched —
 * that's a data issue, not a display one.
 */
export const formatHandle = (nickName?: string | null): string => {
  // Trim first: leading whitespace would otherwise shield a stored `@`
  // from the strip below (`"  @demo"` rendered as `"@@demo"`).
  const clean = (nickName ?? "").trim().replace(/^@+/, "");
  return clean ? `@${clean}` : "@unknown";
};
