"use client";

import { ShieldCheck, User, Zap } from "lucide-react";
import { DEMO_ACCOUNTS } from "@/contants/demoAccounts";
import type { TDemoAccount } from "@/contants/demoUsers";

type Props = {
  /** Called with the chosen account; the parent owns the credentials + submit. */
  onSelect: (account: TDemoAccount) => void;
  pendingEmail?: string | null;
};

/**
 * Role picker for the demo accounts.
 *
 * Rendered only when `isDemoLoginEnabled` is true (see `contants/demoUsers.ts`),
 * which is a build-time condition, so neither this component nor the demo
 * credentials it imports are present in a production bundle.
 */
export default function DemoLoginPanel({ onSelect, pendingEmail }: Props) {
  return (
    <section aria-labelledby="demo-login-heading" className="space-y-3">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="h-px flex-1 bg-divider" />
        <span
          id="demo-login-heading"
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-default-600"
        >
          <Zap size={12} aria-hidden="true" className="text-primary-fg" />
          Demo accounts
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-divider" />
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {DEMO_ACCOUNTS.map((account) => {
          const Icon = account.icon === "shield" ? ShieldCheck : User;
          const isPending = pendingEmail === account.email;

          return (
            <li key={account.id}>
              <button
                type="button"
                onClick={() => onSelect(account)}
                disabled={Boolean(pendingEmail)}
                aria-label={`Sign in as demo ${account.label} (${account.role})`}
                className="group flex w-full items-center gap-3 rounded-xl border border-divider bg-default-50 px-3 py-2.5 text-left transition-colors hover:border-primary hover:bg-default-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-fg"
                >
                  <Icon size={18} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {isPending ? "Signing in..." : account.label}
                    </span>
                    <span className="rounded bg-default-200 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-default-700">
                      {account.role}
                    </span>
                  </span>
                  <span className="block truncate text-xs text-default-600">
                    {account.description}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="text-center text-xs text-default-600">
        Development only. These accounts are never created in production.
      </p>
    </section>
  );
}
