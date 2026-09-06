/**
 * Certificate Type Definitions
 *
 * Types for certificate/certification data backed by Supabase.
 */

import type { Database } from "./database.types";

export type Certificate =
  Database["public"]["Tables"]["certificates"]["Row"];
export type CertificateInsert =
  Database["public"]["Tables"]["certificates"]["Insert"];
export type CertificateUpdate =
  Database["public"]["Tables"]["certificates"]["Update"];

export interface CertificateFormData {
  title: string;
  provider: string;
  issue_date?: string;
  credential_id?: string;
  credential_url?: string;
  image?: string;
  description?: string;
  sort_order: number;
}
