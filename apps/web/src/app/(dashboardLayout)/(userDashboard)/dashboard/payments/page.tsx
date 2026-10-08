import Link from "next/link";
import PageTitle from "@/app/(dashboardLayout)/components/_page-title/PageTitle";
import EmptyState from "@/components/ui/EmptyState";
// Via the client shim: importing the @heroui/react barrel from a Server
// Component evaluates createContext on the server. See @/components/ui/heroui.
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/ui/heroui";
import { getCurrentUser } from "@/services/AuthService";
import { getPayments } from "@/services/PaymentService";
import { IUser } from "@/types/IUser";
import React from "react";

type TPayment = {
  userId: IUser;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
};

const formatPaymentDate = (value?: string): string => {
  if (!value) return "—";
  const time = new Date(value).getTime();
  return Number.isNaN(time)
    ? "—"
    : new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const PaymentInfoPage = async () => {
  const user = await getCurrentUser();
  const userId = user?._id;
  // Without a signed-in user there is nothing to scope the query to — return
  // an empty list rather than falling back to every payment in the system.
  const { data: payments } = userId ? await getPayments(userId) : { data: [] };
  const list: TPayment[] = Array.isArray(payments) ? payments : [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <PageTitle
        title="Payment Information"
        subtitle="Your subscription history and premium billing records."
      />

      <div className="surface overflow-hidden rounded-2xl">
        {list.length === 0 ? (
          <>
            <EmptyState
              type="payments"
              title="No payments yet"
              description="You haven't made any payments. Premium unlocks exclusive deep-dives, early access and an ad-free experience."
            />
            <div className="flex justify-center pb-8">
              <Link
                href="/subscription"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                View Premium Plans
              </Link>
            </div>
          </>
        ) : (
          <Table aria-label="Payment history" removeWrapper>
            <TableHeader>
              <TableColumn>Transaction ID</TableColumn>
              <TableColumn>Payment Date</TableColumn>
              <TableColumn>Status</TableColumn>
            </TableHeader>
            <TableBody items={list}>
              {(payment) => (
                <TableRow key={payment.transactionId}>
                  <TableCell>
                    <span className="font-mono text-xs">{payment.transactionId}</span>
                  </TableCell>
                  <TableCell>{formatPaymentDate(payment.createdAt)}</TableCell>
                  {/* Records are only stored after gateway verification succeeds. */}
                  <TableCell>
                    <Chip size="sm" color="success" variant="flat">
                      Successful
                    </Chip>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-default-500">
        Issues with payments? Contact support at{" "}
        <a href="mailto:support@techtips-hub.com" className="text-primary-fg hover:underline">
          support@techtips-hub.com
        </a>
        .
      </p>
    </div>
  );
};

export default PaymentInfoPage;
