"use client";

import React, { useEffect, useState } from "react";
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
import PageTitle from "../../../components/_page-title/PageTitle";
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

const formatPaymentDate = (value?: string): string => {
  if (!value) return "—";
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? "—" : new Date(value).toLocaleDateString();
};

const customerName = (payment: TPayment): string =>
  typeof payment.userId === "object" && payment.userId !== null
    ? (payment.userId.name ?? "—")
    : "—";

const customerEmail = (payment: TPayment): string =>
  typeof payment.userId === "object" && payment.userId !== null ? (payment.userId.email ?? "") : "";

const customerAvatar = (payment: TPayment): string | undefined =>
  typeof payment.userId === "object" && payment.userId !== null
    ? payment.userId.profilePhoto
    : undefined;

export default function UserTransactionsPage() {
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

  if (loading) {
    return (
      <div className="p-6" role="status" aria-label="Loading transactions...">
        <PageTitle title="User Transactions" />
        <TableRowSkeleton columns={4} />
        <TableRowSkeleton columns={4} />
        <TableRowSkeleton columns={4} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6">
        <PageTitle title="User Transactions" />
        <div className="bg-content1 rounded-2xl border border-divider">
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
    <div className="p-6">
      <PageTitle title="User Transactions" />
      <p className="text-sm text-default-500 mb-6 -mt-2">
        Verified premium payments from the payment gateway. Records appear here only after gateway
        verification succeeds.
      </p>

      <Card>
        <CardBody className="p-0">
          <Table aria-label="User transactions table" removeWrapper>
            <TableHeader>
              <TableColumn>TRANSACTION ID</TableColumn>
              <TableColumn>CUSTOMER</TableColumn>
              <TableColumn>PAYMENT DATE</TableColumn>
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
              {payments.map((payment, index) => (
                <TableRow key={payment.transactionId ?? index}>
                  <TableCell>
                    <span className="font-mono text-sm">{payment.transactionId}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={customerAvatar(payment)}
                        name={customerName(payment)}
                        size="sm"
                      />
                      <div>
                        <p className="font-medium">{customerName(payment)}</p>
                        {customerEmail(payment) ? (
                          <p className="text-xs text-default-500">{customerEmail(payment)}</p>
                        ) : null}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-default-500">{formatPaymentDate(payment.createdAt)}</span>
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
        <a href="mailto:support@technest.com" className="text-primary-fg underline">
          support@technest.com
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
