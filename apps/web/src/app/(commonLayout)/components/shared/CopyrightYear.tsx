"use client";

import { useEffect, useState } from "react";

/**
 * Renders the current year on the client.
 *
 * The Footer is a Server Component, so `new Date().getFullYear()` there was
 * evaluated once at build time and the year never rolled over.
 */
export default function CopyrightYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <>{year ?? ""}</>;
}
