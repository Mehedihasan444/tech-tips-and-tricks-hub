import React from "react";
import CompanyHistory from "./_components/CompanyHistory";
import TeamMembers from "./_components/TeamMembers";
import OurFleet from "./_components/OurFleet";
import { Button } from "@/components/ui/heroui";
import ValuesCommitment from "./_components/ValuesCommitment";
import aboutUs from "@/assets/aboutUs.jpg";

const AboutPage = () => {
  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 pb-12">
      {/* Header */}
      <header
        className="text-white py-20 text-center bg-center bg-cover bg-no-repeat relative"
        style={{
          backgroundImage: `url(${aboutUs.src})`,
        }}
      >
        {/* Scrim so the headline stays readable on any photo brightness */}
        <div aria-hidden="true" className="absolute inset-0 bg-black/55" />
        <div className="relative">
          <h1 className="text-5xl font-bold">About Tech Tips & Tricks Hub</h1>
          <p className="mt-4 text-xl">
            Empowering tech enthusiasts with knowledge, tutorials, and insights
          </p>
        </div>
      </header>

      {/* Company History */}
      <CompanyHistory />

      {/* Our Team */}
      <TeamMembers />

      {/* Our Mission */}
      <OurFleet />

      {/* Values & Commitment */}
      <ValuesCommitment />

      {/* Call to Action */}
      <section className="text-center space-y-4 my-12">
        <h2 className="text-3xl font-semibold text-primary-fg">Join Us on This Tech Journey!</h2>
        <p className="text-default-700">
          Whether you’re a beginner or a pro, our community has something for everyone. Let’s grow
          and innovate together!
        </p>
        <Button as="a" color="primary" href="/contact-us">
          Contact Us
        </Button>
      </section>
    </div>
  );
};

export default AboutPage;
