"use client";

import { CertificateCard } from "@/components/ui/certificate-card";
import type { Certificate } from "@/types/certificate";
import LogoLoop from "@/components/LogoLoop";
import { Award } from "lucide-react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

// Sample certificate data - replace with real data or fetch from database
const certificates: Certificate[] = [
  {
    id: 1,
    title: "Belajar Dasar Structured Query Language (SQL)",
    provider: "Dicoding Academy",
    issueDate: "2024",
    credentialUrl: "https://www.dicoding.com/certificates/QLZ9VY6OMX5D",
    description:
      "Pembelajaran terkait dasar-dasar SQL untuk manajemen basis data",
  },
  {
    id: 2,
    title: "Belajar Dasar Pemrograman JavaScript",
    provider: "Dicoding Academy",
    issueDate: "2024",
    credentialUrl: "https://www.dicoding.com/certificates/53XEYO66RPRN",
    description: "Pembelajaran terkait dasar-dasar menggunakan JavaScript",
  },
  {
    id: 3,
    title: "Cloud Practitioner Essentials",
    provider: "Dicoding Academy",
    issueDate: "2023",
    credentialUrl: "https://www.dicoding.com/certificates/QLZ9QW792Z5D",
    description: "Pembelajaran terkait  dasar komputasi awan dan layanan AWS",
  },
];

export function Certificates() {
  // Transform certificates into LogoLoop format
  const certificateNodes = certificates.map((cert) => ({
    node: <CertificateCard certificate={cert} />,
    title: cert.title,
    ariaLabel: `${cert.title} from ${cert.provider}`,
  }));

  return (
    <section
      id="certificates"
      className="pt-12 pb-20 bg-white dark:bg-gray-950"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <ScrollReveal className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Certifications</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Professional Certificates
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Continuously learning and staying up-to-date with the latest
              technologies and industry best practices.
            </p>
          </ScrollReveal>

          {/* Certificates Infinite Scroll */}
          <ScrollReveal delay={0.2} duration={0.6}>
            <div className="relative overflow-hidden [--logoloop-fadeColor:rgb(255_255_255)] dark:[--logoloop-fadeColor:rgb(3_7_18)]">
              <LogoLoop
                logos={certificateNodes}
                speed={50}
                direction="left"
                logoHeight={100}
                gap={32}
                hoverSpeed={0}
                scaleOnHover
                fadeOut
                ariaLabel="Professional certifications"
              />
            </div>
          </ScrollReveal>

          {/* Optional: Add note */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-500 mt-8">
            Hover over a certificate to pause and view details
          </p>
        </div>
      </div>
    </section>
  );
}
