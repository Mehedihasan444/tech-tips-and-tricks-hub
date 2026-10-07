import { Card, CardBody } from "@heroui/react";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "How Tech Tips & Tricks Hub collects, uses and protects your data.",
};

const sections = [
  {
    title: "1. What we collect",
    body: "Account details you provide (name, email, profile photo, bio), content you publish (posts, comments, stories), and technical data needed to run the service (device, usage, crash logs). Payment details are processed by our payment gateway — we never store card numbers.",
  },
  {
    title: "2. How we use it",
    body: "To operate your account, personalize your feed, deliver real-time notifications and chat, prevent abuse, and improve the platform. We do not sell your personal data.",
  },
  {
    title: "3. Sharing",
    body: "Your public profile, posts and comments are visible to other members. We share limited data with infrastructure providers (hosting, database, email, image storage, payments) under contract, and when required by law.",
  },
  {
    title: "4. Your controls",
    body: "Edit your profile anytime in Settings, manage notification preferences on-device, bookmark posts locally, and request export or deletion via the Contact page.",
  },
  {
    title: "5. Security",
    body: "Passwords are hashed with bcrypt, sessions use short-lived access tokens plus httpOnly refresh cookies, and traffic is encrypted in transit. No system is perfect — use a strong, unique password and enable provider-level 2FA where available.",
  },
  {
    title: "6. Contact",
    body: "Questions about privacy? Reach us via the Contact page and we will respond promptly.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck size={22} />
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-default-500">Last updated October 2026</p>
        </div>
      </div>
      <div className="space-y-4">
        {sections.map((s) => (
          <Card key={s.title}>
            <CardBody>
              <h2 className="mb-2 font-semibold">{s.title}</h2>
              <p className="text-sm leading-relaxed text-default-600">{s.body}</p>
            </CardBody>
          </Card>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-default-500">
        Also see our{" "}
        <Link href="/terms" className="text-primary hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/help" className="text-primary hover:underline">
          Help Center
        </Link>
        .
      </p>
    </div>
  );
}
