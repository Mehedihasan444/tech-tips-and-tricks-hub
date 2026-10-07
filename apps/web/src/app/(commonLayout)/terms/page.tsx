import { Card, CardBody } from "@heroui/react";
import { FileText } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
  description: "The rules for using Tech Tips & Tricks Hub.",
};

const sections = [
  {
    title: "1. Acceptable use",
    body: "Share original, helpful tech content. No spam, harassment, hate speech, malware, or content you don't have the right to publish. Premium content must not be redistributed outside the platform.",
  },
  {
    title: "2. Your content",
    body: "You keep ownership of what you post and grant us a license to host, display and distribute it so the feed, search and sharing features work. You are responsible for your posts, comments and messages.",
  },
  {
    title: "3. Accounts",
    body: "One account per person, keep your credentials safe, and keep your profile accurate. We may suspend accounts that abuse the platform, scrape at scale, or violate these terms.",
  },
  {
    title: "4. Premium & payments",
    body: "Premium unlocks exclusive content and is billed via our payment provider. Subscriptions can be cancelled anytime; refunds follow the provider's policy and applicable law.",
  },
  {
    title: "5. Liability",
    body: "The service is provided as-is. Community content is the author's own and not professional advice — verify critical steps (security, data loss, production changes) before applying them.",
  },
  {
    title: "6. Changes",
    body: "We may update these terms as the platform evolves. Continued use after changes take effect means you accept the updated terms.",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FileText size={22} />
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
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
        Questions? Visit the{" "}
        <Link href="/help" className="text-primary hover:underline">
          Help Center
        </Link>{" "}
        or{" "}
        <Link href="/contact-us" className="text-primary hover:underline">
          contact us
        </Link>
        .
      </p>
    </div>
  );
}
