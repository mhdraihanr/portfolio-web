import type { Certificate } from "@/types/certificate";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { Card } from "./card";
import { Badge } from "./badge";

export interface CertificateCardProps {
  certificate: Certificate;
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  return (
    <Card className="h-[340px] min-w-[280px] max-w-[320px] flex flex-col hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
      {/* Certificate Icon/Image */}
      <div className="p-6 pb-4 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg">
        {certificate.image ? (
          <Image
            src={certificate.image}
            alt={certificate.title}
            width={64}
            height={64}
            className="h-16 w-16 object-contain"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Certificate Info */}
      <div className="p-6 pt-4 flex-1 flex flex-col gap-3">
        {/* Title */}
        <h3 className="font-semibold text-base leading-tight text-foreground line-clamp-2">
          {certificate.title}
        </h3>

        {/* Provider */}
        <p className="text-sm text-muted-foreground font-medium">
          {certificate.provider}
        </p>

        {/* Issue Date (if available) */}
        {certificate.issueDate && (
          <Badge variant="outline" className="text-xs w-fit">
            {certificate.issueDate}
          </Badge>
        )}

        {/* Description (if available) */}
        {certificate.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {certificate.description}
          </p>
        )}

        {/* View Details Button */}
        {certificate.credentialUrl && (
          <a
            href={certificate.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            <span>View Details</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        )}
      </div>
    </Card>
  );
}
