import * as React from "react";
import Link from "next/link";
import { Github, Linkedin, Mail, Phone } from "lucide-react";

const footerLinks = {
  social: [
    {
      href: "https://github.com/yourusername",
      label: "GitHub",
      icon: Github,
    },
    {
      href: "https://linkedin.com/in/yourusername",
      label: "LinkedIn",
      icon: Linkedin,
    },
    {
      href: "mailto:your.email@example.com",
      label: "Email",
      icon: Mail,
    },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-6">
        {/* Social Links - Centered */}
        <div className="flex flex-col items-center space-y-6">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
            Connect
          </h4>
          <div className="flex gap-4">
            {footerLinks.social.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Open to freelance opportunities and collaborations.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} Portfolio. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
