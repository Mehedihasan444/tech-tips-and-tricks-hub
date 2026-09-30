import PageTitle from "@/app/(dashboardLayout)/components/_page-title/PageTitle";
import { getCurrentUser } from "@/services/AuthService";
import { getPayments } from "@/services/PaymentService";
import { IUser } from "@/types/IUser";
import React from "react";
type TPayment={
  userId:IUser,
  transactionId:string;
  createdAt:string;
  updatedAt:string;
}
const PaymentInfoPage = async () => {
  const user=await getCurrentUser()
  const userId=user?._id
  const { data: payments } = await getPayments(userId);
  return (
    <div className="min-h-screen bg-gray-50 flex  justify-center p-8">
      <div className="w-full h-full  bg-default-50 shadow-md rounded-lg p-4">
        {/* Page Title */}
        <PageTitle title="Payment Information"></PageTitle>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-default-50 border">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Transaction ID</th>
                <th className="px-4 py-2 border">Payment Method</th>
                <th className="px-4 py-2 border">Cardholder Name</th>
                <th className="px-4 py-2 border">Payment Date</th>
                <th className="px-4 py-2 border">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments && payments.length > 0 ? (
                payments.map((payment: TPayment, index: number) => (
                  <tr key={index} className="text-default-700">
                    <td className="border px-4 py-2">
                      {payment.transactionId}
                    </td>
                    <td className="border px-4 py-2">N/A</td>
                    <td className="border px-4 py-2">
                      {payment?.userId?.name}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">$20</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center px-4 py-2 text-default-500"
                  >
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
          <a
            href="mailto:support@technest.com"
            className="text-teal-600 underline"
          >
            support@technest.com
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default PaymentInfoPage;
