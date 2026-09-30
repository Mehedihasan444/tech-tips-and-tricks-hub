import React from "react";
import { Card } from "@nextui-org/react";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
// import MapSection from "./_components/MapSection";
import ContactForm from "./_components/ContactForm";
import dynamic from "next/dynamic";
// Dynamically import MapSection without SSR
const MapSection = dynamic(() => import("./_components/MapSection"), {
  ssr: false, // Disable server-side rendering
});
const ContactUs = () => {
  return (
    <div className="min-h-screen bg-default-50 py-12">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center  mb-8">
          Contact Us
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Side: Contact Form */}
          <ContactForm />

          {/* Right Side: Company Information */}
          <div className="space-y-6">
            {/* Company Info */}
            <Card className="bg-default-50 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold  mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="text-teal-600 text-2xl mr-3" />
                  <p className="">+1 123 456 7890</p>
                </div>
                <div className="flex items-center">
                  <Mail className="text-teal-600 text-2xl mr-3" />
                  <p className="">info@techtips.com</p>
                </div>
                <div className="flex items-center">
                  <MapPin className="text-teal-600 text-2xl mr-3" />
                  <p className="">
                    123 Tech Street, San Francisco, CA
                  </p>
                </div>
              </div>
            </Card>

            {/* Social Media Links */}
            <Card className="bg-default-50 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold  mb-4">
                Follow Us
              </h3>
              <div className="flex space-x-6 text-2xl">
                <a
                  href="#"
                  aria-label="Follow us on Facebook"
                  className="text-teal-600 hover:text-teal-800"
                >
                  <Facebook />
                </a>
                <a
                  href="#"
                  aria-label="Follow us on Twitter"
                  className="text-teal-600 hover:text-teal-800"
                >
                  <Twitter />
                </a>
                <a
                  href="#"
                  aria-label="Follow us on Instagram"
                  className="text-teal-600 hover:text-teal-800"
                >
                  <Instagram />
                </a>
              </div>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <MapSection />
      </div>
    </div>
  );
};

export default ContactUs;
