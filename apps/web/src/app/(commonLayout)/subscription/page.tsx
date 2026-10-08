"use client";
import { useUser } from "@/context/user.provider";
import { useCreatePayment } from "@/hooks/payment.hook";
import { Button, Card, CardBody, Chip, Divider } from "@heroui/react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, Check, Crown, Sparkles, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import { siteConfig } from "@/config/site";

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
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        title="Premium"
        subtitle={`Unlock deep-dives, early access and an ad-free experience for ${siteConfig.premium.priceLabel}.`}
        icon={Crown}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Free plan */}
        <Card className="surface overflow-hidden">
          <CardBody className="p-6">
            <Chip size="sm" variant="flat">
              Free
            </Chip>
            <h2 className="mt-3 text-2xl font-bold">$0</h2>
            <p className="text-sm text-default-500">For casual readers and new members.</p>
            <Divider className="my-4" />
            <ul className="space-y-2.5 text-sm text-default-600">
              <li className="flex gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-success" /> Community feed and
                stories
              </li>
              <li className="flex gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-success" /> Comments and follows
              </li>
              <li className="flex gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-success" /> Save posts for later
              </li>
            </ul>
            <Button as={Link} href="/" variant="flat" className="mt-6 w-full">
              Continue with Free
            </Button>
          </CardBody>
        </Card>

        {/* Premium plan */}
        <Card className="surface overflow-hidden border-primary/30 shadow-glow-primary">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <Chip size="sm" color="warning" variant="flat" startContent={<Sparkles size={13} />}>
                Premium
              </Chip>
              <span className="text-xs text-default-500">Cancel anytime</span>
            </div>
            <h2 className="mt-3 text-2xl font-bold">
              {siteConfig.premium.priceLabel}{" "}
              <span className="text-sm font-normal text-default-500">per month</span>
            </h2>
            <p className="text-sm text-default-500">For engineers who want depth, not just tips.</p>
            <Divider className="my-4" />
            <ul className="space-y-2.5 text-sm text-default-600">
              {siteConfig.premium.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-success" /> {f}
                </li>
              ))}
            </ul>

            {user?.isPremium ? (
              <div className="mt-6 space-y-3 text-center">
                <p
                  role="status"
                  className="inline-flex items-center gap-2 font-semibold text-success"
                >
                  <BadgeCheck size={20} />
                  Premium is active on your account
                </p>
                <Button as={Link} href="/" color="primary" variant="flat" className="w-full">
                  Back to Feed
                </Button>
              </div>
            ) : !user?._id ? (
              <div className="mt-6 space-y-3">
                <Button
                  as={Link}
                  href="/login?redirect=/subscription"
                  color="primary"
                  className="w-full font-semibold"
                >
                  Sign In to Subscribe
                </Button>
                <p className="text-center text-xs text-default-500">
                  Secure checkout via our payment partner.
                </p>
              </div>
            ) : (
              <div className="mt-6">
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
                    : `Subscribe for ${siteConfig.premium.priceLabel}`}
                </Button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-default-500">
                  <ShieldCheck size={13} /> Secure checkout · Cancel anytime
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <Card className="surface mt-6">
        <CardBody className="p-6">
          <h3 className="font-semibold">How premium works</h3>
          <div className="mt-3 grid grid-cols-1 gap-4 text-sm text-default-600 sm:grid-cols-3">
            <div>
              <p className="font-medium text-foreground">1. Subscribe</p>
              <p>Checkout takes under a minute. Your account upgrades instantly after payment.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">2. Read premium deep-dives</p>
              <p>Premium posts unlock across feed, search and your saved list.</p>
            </div>
            <div>
              <p className="font-medium text-foreground">3. Cancel anytime</p>
              <p>
                Keep access until the end of the billing period. Questions?{" "}
                <a
                  href={`mailto:${siteConfig.supportEmail}`}
                  className="text-primary-fg hover:underline"
                >
                  {siteConfig.supportEmail}
                </a>
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SubscriptionPage;
