import PageTitle from "@/app/(dashboardLayout)/components/_page-title/PageTitle";
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
  return Number.isNaN(time) ? "—" : new Date(value).toLocaleDateString();
};
const PaymentInfoPage = async () => {
  const user = await getCurrentUser();
  const userId = user?._id;
  // Without a signed-in user there is nothing to scope the query to — return
  // an empty list rather than falling back to every payment in the system.
  const { data: payments } = userId ? await getPayments(userId) : { data: [] };
  return (
    <div className="min-h-screen flex justify-center p-8">
      <div className="w-full h-full bg-content1 border border-divider shadow-md rounded-lg p-4">
        {/* Page Title */}
        <PageTitle title="Payment Information"></PageTitle>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-content1 border border-divider">
            <thead>
              <tr className="text-foreground">
                <th className="px-4 py-2 border border-divider">Transaction ID</th>
                <th className="px-4 py-2 border border-divider">Customer</th>
                <th className="px-4 py-2 border border-divider">Payment Date</th>
                <th className="px-4 py-2 border border-divider">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments && payments.length > 0 ? (
                payments.map((payment: TPayment, index: number) => (
                  <tr key={index} className="text-foreground">
                    <td className="border border-divider px-4 py-2">{payment.transactionId}</td>
                    <td className="border border-divider px-4 py-2">
                      {payment?.userId?.name ?? "—"}
                    </td>
                    <td className="border border-divider px-4 py-2">
                      {formatPaymentDate(payment.createdAt)}
                    </td>
                    {/* Records are only stored after gateway verification succeeds. */}
                    <td className="border border-divider px-4 py-2">Successful</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center px-4 py-2 text-default-500">
                    No payment data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Information */}
        <div className="text-center mt-6 text-sm text-default-500">
          If you have any issues with payments, please contact support at{" "}
          <a href="mailto:support@technest.com" className="text-primary-fg underline">
            support@technest.com
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default PaymentInfoPage;
