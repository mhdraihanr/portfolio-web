import { getCertificates } from "@/lib/supabase/public-data";
import { LazyCertificatesClient } from "./lazy-certificates-client";

export async function Certificates() {
  const certificates = await getCertificates();
  return <LazyCertificatesClient certificates={certificates} />;
}
