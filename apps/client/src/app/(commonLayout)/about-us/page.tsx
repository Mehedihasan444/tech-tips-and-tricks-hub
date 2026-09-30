import React from "react";
import CompanyHistory from "./_components/CompanyHistory";
import TeamMembers from "./_components/TeamMembers";
import OurFleet from "./_components/OurFleet";
import { Button } from "@nextui-org/react";
import ValuesCommitment from "./_components/ValuesCommitment";
import aboutUs from "@/assets/aboutUs.jpg";

const AboutPage = () => {
  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <header
        className="text-white py-20 text-center bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${aboutUs.src})`,
        }}
      >
        <h1 className="text-5xl font-bold">About Tech Tips & Tricks Hub</h1>
        <p className="mt-4 text-xl">
          Empowering tech enthusiasts with knowledge, tutorials, and insights
        </p>
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
        <h2 className="text-3xl font-semibold text-teal-600">Join Us on This Tech Journey!</h2>
        <p className="text-default-700">
          Whether you’re a beginner or a pro, our community has something for everyone. Let’s grow and innovate together!
        </p>
        <Button className="bg-teal-600 text-white hover:bg-teal-500" href="/contact">
          Contact Us
        </Button>
      </section>
    </div>
  );
};

export default AboutPage;
