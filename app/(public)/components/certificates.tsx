"use client";

import { CertificateCard } from "@/components/ui/certificate-card";
import type { Certificate } from "@/types/certificate";
import LogoLoop from "@/components/LogoLoop";
import { Award } from "lucide-react";

// Sample certificate data - replace with real data or fetch from database
const certificates: Certificate[] = [
  {
    id: 1,
    title: "AWS Certified Solutions Architect",
    provider: "Amazon Web Services",
    issueDate: "2024",
    credentialUrl: "https://www.credly.com/badges/example",
    description: "Expertise in designing and deploying scalable systems on AWS",
  },
  {
    id: 2,
    title: "Google Cloud Professional Developer",
    provider: "Google Cloud",
    issueDate: "2023",
    credentialUrl: "https://www.credential.net/example",
    description: "Proficient in building cloud-native applications on GCP",
  },
  {
    id: 3,
    title: "Certified Kubernetes Administrator",
    provider: "Cloud Native Computing Foundation",
    issueDate: "2023",
    credentialUrl: "https://ti-user-certificates.s3.amazonaws.com/example",
    description: "Expert in container orchestration with Kubernetes",
  },
  {
    id: 4,
    title: "Meta Front-End Developer Professional",
    provider: "Meta (Facebook)",
    issueDate: "2023",
    credentialUrl: "https://www.coursera.org/account/accomplishments/example",
    description: "Advanced skills in modern React and front-end development",
  },
  {
    id: 5,
    title: "Full Stack Web Development Bootcamp",
    provider: "Udemy",
    issueDate: "2022",
    credentialUrl: "https://www.udemy.com/certificate/example",
    description: "Complete full-stack development with MERN stack",
  },
  {
    id: 6,
    title: "TypeScript Advanced Patterns",
    provider: "Frontend Masters",
    issueDate: "2023",
    credentialUrl: "https://frontendmasters.com/certificates/example",
    description: "Master-level TypeScript patterns and best practices",
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
    <section id="certificates" className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-6">
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
          </div>

          {/* Certificates Infinite Scroll */}
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

          {/* Optional: Add note */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-500 mt-8">
            Hover over a certificate to pause and view details
          </p>
        </div>
      </div>
    </section>
  );
}
