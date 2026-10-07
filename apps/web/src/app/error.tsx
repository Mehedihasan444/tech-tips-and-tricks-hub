"use client";

import { Button } from "@heroui/react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="text-default-500 max-w-md">
        {error?.message || "We couldn't load this page. Please try again."}
      </p>
      <Button color="primary" onPress={reset}>
        Try again
      </Button>
    </div>
  );
}
