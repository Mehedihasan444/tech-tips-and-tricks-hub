"use client";
import { useUser } from "@/context/user.provider";
import { useCreatePayment } from "@/hooks/payment.hook";
import React from "react";

const SubscriptionPage = () => {
  const { user } = useUser();
  const { mutate: handleMakePayment } = useCreatePayment();

  const handlePay = () => {
    // Implement payment logic here
    handleMakePayment({ userId: user?._id as string });
  };
  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-default-100 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-default-800 text-center">
          Subscribe to Premium Features
        </h1>
        <p className="text-default-600 mt-4 text-center">
          Get exclusive access to advanced tech tips and tutorials for only{" "}
          <span className="font-semibold">$20/month</span>.
        </p>

        <div className="mt-8 text-center">
          <button
            onClick={handlePay}
            className="bg-teal-500 text-default-50 py-3 px-6 rounded-lg text-lg font-semibold hover:text-teal-600 transition duration-300 ease-in-out"
          >
            Subscribe for $20/month
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-default-500 text-sm">
            Cancel anytime. Enjoy exclusive content and advanced tutorials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
