"use client";

import { useState } from "react";
import { Accordion, AccordionItem, Button, Card, CardBody, Input } from "@heroui/react";
import { LifeBuoy, Search } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    q: "How do I publish a post?",
    a: "From the home feed click Create Post, add a title, category, tags and content (images optional, up to 3). Your post appears in the feed instantly and in Explore under Trending and Topics.",
  },
  {
    q: "How do follows and friends work?",
    a: "Open any profile or the Explore → People tab and click Follow. Followed authors show up in My Friends and their posts surface more prominently in your feed.",
  },
  {
    q: "How does real-time chat work?",
    a: "Go to Messages to see friends and online users, pick a conversation, and type. Messages, typing indicators and presence update live over WebSockets. The popup chat list also works from anywhere.",
  },
  {
    q: "Where are my notifications?",
    a: "The bell icon shows the latest 15 in a dropdown. The full Notifications page adds search, per-type filters (likes, comments, follows, mentions, replies), mark-all-read and clear-all.",
  },
  {
    q: "What is Premium?",
    a: "Premium unlocks exclusive deep-dives and a profile badge. Visit the Subscription page to upgrade; premium posts are blurred for non-members with an upgrade prompt.",
  },
  {
    q: "How do saved posts work?",
    a: "Click the bookmark icon on any post. Saved posts live on the Saved Posts page on that device, stay in sync across tabs, and can be filtered by keyword.",
  },
  {
    q: "I forgot my password — what now?",
    a: "Use Forgot Password on the login screen. You'll get a reset link by email. If it doesn't arrive, check spam or contact support.",
  },
  {
    q: "How do I report abuse or delete my account?",
    a: "Use the Contact page to reach support with links and details. Account deletion requests are handled there to verify ownership first.",
  },
];

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const visible = q ? faqs.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(q)) : faqs;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <LifeBuoy size={22} />
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
          <p className="text-sm text-default-500">Answers to the most common questions</p>
        </div>
      </div>

      <Input
        startContent={<Search size={16} className="text-default-400" />}
        placeholder="Search help articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search help"
        className="mb-4"
      />

      <Card>
        <CardBody className="p-2">
          {visible.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-semibold">No articles match &quot;{query}&quot;</p>
              <p className="mt-1 text-sm text-default-500">
                Try different keywords or contact support.
              </p>
              <Button
                className="mt-4"
                size="sm"
                variant="flat"
                color="primary"
                onPress={() => setQuery("")}
              >
                Clear search
              </Button>
            </div>
          ) : (
            <Accordion variant="splitted">
              {visible.map((f) => (
                <AccordionItem
                  key={f.q}
                  title={<span className="text-sm font-semibold">{f.q}</span>}
                >
                  <p className="pb-2 text-sm leading-relaxed text-default-600">{f.a}</p>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardBody>
      </Card>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button as={Link} href="/contact-us" color="primary">
          Contact Support
        </Button>
        <Button as={Link} href="/explore" variant="flat">
          Explore the platform
        </Button>
      </div>
    </div>
  );
}
