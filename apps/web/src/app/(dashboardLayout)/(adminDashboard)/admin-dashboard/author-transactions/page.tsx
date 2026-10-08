"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Avatar,
} from "@heroui/react";
import PageTitle from "@/app/(dashboardLayout)/components/_page-title/PageTitle";
import EmptyState from "@/components/ui/EmptyState";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { getPayments } from "@/services/PaymentService";
import { IUser } from "@/types/IUser";

type TPayment = {
  userId: IUser | string | null;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
};

interface AuthorSummary {
  key: string;
  name: string;
  email: string;
  avatar?: string;
  totalPayments: number;
  lastPaymentAt: string;
}

const formatPaymentDate = (value?: string): string => {
  if (!value) return "—";
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? "—" : new Date(value).toLocaleDateString();
};

// Author view is derived ONLY from verified payment records, grouped by the
// paying customer. No payout figures are invented — the gateway stores one
// record per verified subscription, so the count and latest date are real.
const summarizeByAuthor = (payments: TPayment[]): AuthorSummary[] => {
  const map = new Map<string, AuthorSummary>();
  for (const payment of payments) {
    const user =
      typeof payment.userId === "object" && payment.userId !== null ? payment.userId : null;
    const key = user?._id ?? user?.email ?? payment.transactionId ?? `unknown-${map.size}`;
    const prev = map.get(key);
    const createdAt = payment.createdAt ?? "";
    if (prev) {
      prev.totalPayments += 1;
      if (createdAt && (!prev.lastPaymentAt || createdAt > prev.lastPaymentAt)) {
        prev.lastPaymentAt = createdAt;
      }
    } else {
      map.set(key, {
        key,
        name: user?.name ?? "Unknown User",
        email: user?.email ?? "",
        avatar: user?.profilePhoto,
        totalPayments: 1,
        lastPaymentAt: createdAt,
      });
    }
  }
  return [...map.values()].sort((a, b) =>
    (b.lastPaymentAt ?? "").localeCompare(a.lastPaymentAt ?? ""),
  );
};

export default function AuthorTransactionsPage() {
  const [payments, setPayments] = useState<TPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const res = await getPayments();
      setPayments(res?.data ?? []);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setLoadError("We couldn't load transactions. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPayments();
  }, []);

  const summaries = useMemo(() => summarizeByAuthor(payments), [payments]);

  if (loading) {
    return (
      <div
        className="mx-auto w-full max-w-6xl px-4 py-6"
        role="status"
        aria-label="Loading author transactions..."
      >
        <PageTitle title="Author Transactions" />
        <TableRowSkeleton columns={4} />
        <TableRowSkeleton columns={4} />
        <TableRowSkeleton columns={4} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <PageTitle title="Author Transactions" />
        <div className="surface overflow-hidden rounded-2xl">
          <EmptyState
            type="custom"
            title="Couldn't load transactions"
            description={loadError}
            actionLabel="Try Again"
            onAction={() => void fetchPayments()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <PageTitle title="Author Transactions" />
      <p className="text-sm text-default-500 mb-6 -mt-2">
        Verified premium payments grouped by customer. Records appear here only after gateway
        verification succeeds.
      </p>

      <Card>
        <CardBody className="p-0">
          <Table aria-label="Author transactions table" removeWrapper>
            <TableHeader>
              <TableColumn>CUSTOMER</TableColumn>
              <TableColumn>TOTAL PAYMENTS</TableColumn>
              <TableColumn>LAST PAYMENT</TableColumn>
              <TableColumn>STATUS</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                <EmptyState
                  type="custom"
                  title="No transactions yet"
                  description="Verified payments will appear here once users subscribe to premium."
                />
              }
            >
              {summaries.map((summary) => (
                <TableRow key={summary.key}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={summary.avatar} name={summary.name} size="sm" />
                      <div>
                        <p className="font-medium">{summary.name}</p>
                        {summary.email ? (
                          <p className="text-xs text-default-500">{summary.email}</p>
                        ) : null}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{summary.totalPayments}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-default-500">
                      {formatPaymentDate(summary.lastPaymentAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Chip color="success" variant="flat" size="sm">
                      Successful
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <div className="text-center mt-6 text-sm text-default-500">
        If you have any issues with payments, please contact support at{" "}
        <a href="mailto:support@techtips-hub.com" className="text-primary-fg underline">
          support@techtips-hub.com
        </a>
        .
      </div>
      <div className="flex justify-center mt-4">
        <Button color="primary" variant="flat" size="sm" onPress={() => void fetchPayments()}>
          Refresh
        </Button>
      </div>
    </div>
  );
}
