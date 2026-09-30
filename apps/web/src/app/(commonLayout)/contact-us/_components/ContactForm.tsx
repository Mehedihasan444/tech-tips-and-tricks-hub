"use client";
import React from "react";
import { Input, Textarea, Button } from "@nextui-org/react";
const ContactForm = () => {
  return (
    <div className="bg-default-50 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold  mb-4">
        Get in Touch
      </h3>
      <form className="space-y-4">
        <Input
          label="Your Name"
          aria-label="Your Name"
          placeholder="Enter your full name"
          required
          fullWidth
          className=""
        />
        <Input
          label="Your Email"
          aria-label="Your Email"
          placeholder="Enter your email address"
          required
          fullWidth
          type="email"
          className=""
        />
        <Input
          label="Subject"
              aria-label="Subject"
          placeholder="Enter subject"
          required
          fullWidth
          className=""
        />
        <Textarea
          label="Your Message"
              aria-label="Your Message"
          placeholder="Write your message here..."
          required
          fullWidth
          rows={6}
          className=""
        />
        <Button color="primary" className="w-full bg-teal-600 text-default-50">
          Send Message
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
