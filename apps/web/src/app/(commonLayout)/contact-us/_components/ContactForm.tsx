"use client";
import React, { useState } from "react";
import { Input, Textarea, Button } from "@heroui/react";

// No contact backend exists yet, so a validated submit opens the visitor's
// mail client with a prefilled message instead of pretending to send.
const SUPPORT_EMAIL = "support@techtips-hub.example.com";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setFormError("Please fill in every field before sending.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }
    const body = `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`;
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject.trim())}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="bg-default-50 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold  mb-4">Get in Touch</h3>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Input
          label="Your Name"
          aria-label="Your Name"
          placeholder="Enter your full name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
        />
        <Input
          label="Your Email"
          aria-label="Your Email"
          placeholder="Enter your email address"
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />
        <Input
          label="Subject"
          aria-label="Subject"
          placeholder="Enter subject"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full"
        />
        <Textarea
          label="Your Message"
          aria-label="Your Message"
          placeholder="Write your message here..."
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full"
        />
        {formError && (
          <p role="alert" className="text-sm text-danger">
            {formError}
          </p>
        )}
        <Button type="submit" color="primary" className="w-full font-semibold">
          Send Message
        </Button>
        <p className="text-xs text-default-600 text-center">
          This opens your email app addressed to {SUPPORT_EMAIL}.
        </p>
      </form>
    </div>
  );
};

export default ContactForm;
