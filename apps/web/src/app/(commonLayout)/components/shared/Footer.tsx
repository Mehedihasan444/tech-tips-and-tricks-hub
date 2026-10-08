import Link from "next/link";
import CopyrightYear from "./CopyrightYear";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "Messages", href: "/messages" },
  { label: "Notifications", href: "/notifications" },
  { label: "About Us", href: "/about-us" },
  { label: "Community", href: "/community" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Premium", href: "/subscription" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Help Center", href: "/help" },
];

const socialLinks = [
  {
    label: "Follow us on X (Twitter)",
    href: "https://x.com/techtipshub",
    path: "M24 4.557a9.953 9.953 0 0 1-2.828.775A4.933 4.933 0 0 0 23.337 3.7a9.864 9.864 0 0 1-3.127 1.195 4.923 4.923 0 0 0-8.39 4.482A13.965 13.965 0 0 1 1.67 3.149a4.923 4.923 0 0 0 1.523 6.574 4.903 4.903 0 0 1-2.23-.616v.062a4.924 4.924 0 0 0 3.946 4.83 4.908 4.908 0 0 1-2.224.084 4.928 4.928 0 0 0 4.6 3.42 9.873 9.873 0 0 1-6.102 2.102c-.396 0-.786-.023-1.17-.068A13.94 13.94 0 0 0 7.548 21c9.057 0 14.01-7.505 14.01-14.01 0-.213-.004-.426-.013-.637A10.025 10.025 0 0 0 24 4.557z",
  },
  {
    label: "Follow us on Facebook",
    href: "https://facebook.com/techtipshub",
    path: "M22.675 0h-21.35C.596 0 0 .593 0 1.326v21.349C0 23.407.595 24 1.325 24h11.49v-9.294H9.692v-3.622h3.122V8.413c0-3.1 1.892-4.788 4.658-4.788 1.325 0 2.462.099 2.793.143v3.237h-1.916c-1.503 0-1.795.715-1.795 1.762v2.309h3.589l-.468 3.622h-3.121V24h6.112C23.404 24 24 23.407 24 22.675V1.326C24 .593 23.404 0 22.675 0z",
  },
  {
    label: "Follow us on Instagram",
    href: "https://instagram.com/techtipshub",
    path: "M12 2.163c3.204 0 3.584.012 4.849.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.057 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.265.057-1.645.07-4.849.07s-3.584-.012-4.849-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608C2.175 15.583 2.163 15.204 2.163 12s.012-3.584.07-4.849c.062-1.366.332-2.633 1.308-3.608C4.516 2.495 5.783 2.225 7.149 2.163 8.415 2.105 8.795 2.163 12 2.163m0-2.163C8.737 0 8.332 0 7.052.069 5.746.135 4.633.4 3.678 1.355 2.722 2.311 2.456 3.423 2.39 4.729.069 5.952 0 7.052 0 12s0 6.048.069 7.271c.066 1.306.331 2.418 1.287 3.374.955.955 2.067 1.22 3.374 1.287C8.332 24 8.737 24 12 24s3.668-.069 4.948-.069c1.306-.066 2.418-.331 3.374-1.287.955-.955 1.22-2.067 1.287-3.374.069-1.223.069-2.323.069-7.271s0-6.048-.069-7.271c-.066-1.306-.331-2.418-1.287-3.374-.955-.955-2.067-1.22-3.374-1.287C15.668 0 15.263 0 12 0z",
  },
];

const Footer = () => {
  return (
    <footer className="relative bg-content1 text-default-600 border-t border-divider/70 mt-auto">
      {/* Hairline brand accent along the top edge: a single low-contrast cue that
          ties the footer to the brand without a heavy coloured bar. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent"
      />
      <div className="px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {/* Logo and Description */}
        <div className="flex-1 flex flex-col">
          <Link href="/" className="inline-flex items-center gap-2.5 group w-fit">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 via-primary-500 to-secondary-500 flex items-center justify-center shadow-glow-primary transition-transform duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100">
              <span className="text-white font-bold leading-none">T</span>
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/25 to-transparent"
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-gradient">
              Tech Tips &amp; Tricks
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed max-w-xs">
            Your go-to platform for expert tech advice, personal experiences, and the latest on
            software, gadgets, and digital tools.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex md:justify-center">
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block transition-colors duration-200 hover:text-primary-fg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-sm font-semibold text-foreground uppercase tracking-wider">
              Legal & Help
            </h3>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block transition-colors duration-200 hover:text-primary-fg"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex-1 flex flex-col md:items-end">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Follow Us
          </h3>
          <ul className="mt-4 flex gap-2">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-divider text-default-500 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-500/40 hover:bg-primary-500/10 hover:text-primary-fg motion-reduce:hover:translate-y-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d={social.path} />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-divider/70">
        <p className="text-center py-5 text-default-500 text-sm px-4">
          &copy; <CopyrightYear /> Tech Tips &amp; Tricks Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
