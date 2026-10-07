"use client";
import { useUser } from "@/context/user.provider";
import { useCreatePayment } from "@/hooks/payment.hook";
import { Button } from "@heroui/react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { BadgeCheck } from "lucide-react";

const PREMIUM_PRICE = "$20/month";

const SubscriptionPage = () => {
  const { user } = useUser();
  const { mutate: handleMakePayment, isPending } = useCreatePayment();
  const [started, setStarted] = useState(false);

  const handlePay = () => {
    if (!user?._id) {
      toast.error("Please sign in to subscribe.");
      return;
    }
    setStarted(true);
    handleMakePayment(
      { userId: user._id as string },
      {
        // The hook redirects when the gateway returns a payment URL. If it
        // doesn't, that is a failure — say so instead of going silent.
        onSuccess: (res) => {
          if (!res?.data?.payment_url) {
            setStarted(false);
            toast.error("The payment gateway didn't respond. Please try again.");
          }
        },
        onError: () => setStarted(false),
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-content1 shadow-lg rounded-2xl border border-divider p-6">
        <h1 className="text-2xl font-bold text-foreground text-center">
          Subscribe to Premium Features
        </h1>

        {user?.isPremium ? (
          <div className="mt-6 text-center space-y-3">
            <p role="status" className="inline-flex items-center gap-2 text-success font-semibold">
              <BadgeCheck size={20} />
              You already have Premium
            </p>
            <p className="text-default-500 text-sm">
              Enjoy exclusive content and advanced tutorials.
            </p>
            <Button as={Link} href="/" color="primary" variant="flat" className="w-full">
              Back to Feed
            </Button>
          </div>
        ) : !user?._id ? (
          <div className="mt-6 text-center space-y-3">
            <p className="text-default-500">
              Sign in to unlock premium deep-dives for only{" "}
              <span className="font-semibold text-foreground">{PREMIUM_PRICE}</span>.
            </p>
            <Button
              as={Link}
              href="/login?redirect=/subscription"
              color="primary"
              className="w-full"
            >
              Sign In to Subscribe
            </Button>
          </div>
        ) : (
          <>
            <p className="text-default-500 mt-4 text-center">
              Get exclusive access to advanced tech tips and tutorials for only{" "}
              <span className="font-semibold text-foreground">{PREMIUM_PRICE}</span>.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-default-600 list-disc list-inside">
              <li>Premium-only tutorials and deep-dives</li>
              <li>Early access to new content</li>
              <li>Verified premium badge on your profile</li>
            </ul>

            <div className="mt-8 text-center">
              <Button
                color="primary"
                size="lg"
                className="w-full font-semibold"
                onPress={handlePay}
                isLoading={isPending || started}
                isDisabled={isPending || started}
              >
                {isPending || started
                  ? "Redirecting to payment..."
                  : `Subscribe for ${PREMIUM_PRICE}`}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-default-500 text-sm">
                Cancel anytime. Enjoy exclusive content and advanced tutorials.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
