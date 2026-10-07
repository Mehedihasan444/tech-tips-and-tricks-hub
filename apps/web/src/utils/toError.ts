/**
 * Normalises anything thrown by `fetch`, axios or a Server Action into a real
 * `Error` with a useful message.
 *
 * `new Error(someObject)` stringifies to the literal text "[object Object]",
 * which is what users were shown on every failed request. Server Actions can
 * only transport `Error` instances, so the message has to be flattened here.
 */
export const toError = (error: unknown, fallback = "Something went wrong"): Error => {
  if (error instanceof Error) return error;

  if (typeof error === "string" && error.length > 0) return new Error(error);

  if (typeof error === "object" && error !== null) {
    const candidate = error as {
      message?: unknown;
      error?: { message?: unknown };
      response?: { data?: { message?: unknown } };
      data?: { message?: unknown };
    };

    const message =
      (typeof candidate.message === "string" && candidate.message) ||
      (typeof candidate.error?.message === "string" && candidate.error.message) ||
      (typeof candidate.response?.data?.message === "string" && candidate.response.data.message) ||
      (typeof candidate.data?.message === "string" && candidate.data.message);

    if (message) return new Error(message);
  }

  return new Error(fallback);
};

/** Message-only variant for `throw` sites that previously did `throw new Error(error)`. */
export const toErrorMessage = (error: unknown, fallback = "Something went wrong"): string =>
  toError(error, fallback).message;
