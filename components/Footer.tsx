// components/Footer.tsx
"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://www.facebook.com/thinkhallacademy/",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://www.instagram.com/thinkhall_academy/?hl=en",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      // I removed 'admin/dashboard/' so visitors see the public profile instead of an error
      href: "https://www.linkedin.com/company/13655219/",
    },
    {
      name: "YouTube",
      icon: Youtube,
      href: "https://www.youtube.com/@thinkhallacademyprivateltd6923",
    },
  ];

  return (
    <footer className="bg-gray-900 text-white py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold font-display mb-4">
              Thinkhall<span className="text-yellow-400">.</span>
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              AI-powered SkillTech platform designed to assess, coach, and
              elevate professionals at every stage.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-gray-900 transition-all"
                  aria-label={`Visit our ${social.name} page`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-3">
              {[
                "How It Works",
                "Assessments",
                "THINKMATE AI",
                "Learning Programs",
                "Dashboards",
              ].map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Solutions</h4>
            <ul className="space-y-3">
              {[
                "Enterprise",
                "L&D Teams",
                "Managers",
                "Learners",
                "Industries",
              ].map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {["About Us", "Careers", "Blog", "Contact", "Book a Demo"].map(
                (link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} Thinkhall Academy. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (link) => (
                <Link
                  key={link}
                  href="#"
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  {link}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
