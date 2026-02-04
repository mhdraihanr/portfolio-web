/**
 * Certificate Type Definitions
 *
 * Types for certificate/certification data used in the portfolio.
 * Can be extended to fetch from database later if needed.
 */

export interface Certificate {
  id: string | number;
  title: string;
  provider: string;
  issueDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  description?: string;
}

export interface CertificateFormData {
  title: string;
  provider: string;
  issueDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  description?: string;
}
