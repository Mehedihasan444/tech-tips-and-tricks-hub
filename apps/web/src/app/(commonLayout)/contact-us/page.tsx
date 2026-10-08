"use client";

import React, { Suspense } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { FacebookIcon, XIcon, InstagramIcon } from "@/components/ui/BrandIcons";
import ContactForm from "./_components/ContactForm";
import PageHeader from "@/components/ui/PageHeader";
import ContentCard from "@/components/ui/ContentCard";
import { siteConfig } from "@/config/site";
import { MessageSquare } from "lucide-react";
import { Skeleton } from "@heroui/react";
import dynamic from "next/dynamic";

const MapSection = dynamic(() => import("./_components/MapSection"), {
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full rounded-2xl" />,
});

const ContactUs = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        title="Contact Us"
        subtitle="Questions, feedback or partnership ideas — we reply within 2 business days."
        icon={MessageSquare}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ContactForm />

        <div className="space-y-6">
          <ContentCard title="Contact Information" subtitle="Our support team is here to help">
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone size={20} className="mr-3 shrink-0 text-primary-fg" aria-hidden="true" />
                <p>{siteConfig.contact.phone}</p>
              </div>
              <div className="flex items-center">
                <Mail size={20} className="mr-3 shrink-0 text-primary-fg" aria-hidden="true" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="transition-colors hover:text-primary-fg"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="flex items-center">
                <MapPin size={20} className="mr-3 shrink-0 text-primary-fg" aria-hidden="true" />
                <p>{siteConfig.contact.address}</p>
              </div>
            </div>
          </ContentCard>

          <ContentCard title="Follow Us" subtitle="Product updates and community highlights">
            <div className="flex space-x-3">
              <a
                href={siteConfig.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook (opens in a new tab)"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-divider text-default-500 transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary-fg"
              >
                <FacebookIcon />
              </a>
              <a
                href={siteConfig.socials.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X (opens in a new tab)"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-divider text-default-500 transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary-fg"
              >
                <XIcon />
              </a>
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram (opens in a new tab)"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-divider text-default-500 transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary-fg"
              >
                <InstagramIcon />
              </a>
            </div>
          </ContentCard>
        </div>
      </div>

      <div className="mt-6">
        <Suspense fallback={<Skeleton className="h-64 w-full rounded-2xl" />}>
          <MapSection />
        </Suspense>
      </div>
    </div>
  );
};

export default ContactUs;
