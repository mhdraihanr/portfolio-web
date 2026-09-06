"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Certificate } from "@/types/certificate";

const CertificatesClient = dynamic(
  () => import("./certificates-client").then((mod) => mod.CertificatesClient),
  {
    ssr: false,
    loading: () => <CertificatesPlaceholder />,
  },
);

function CertificatesPlaceholder() {
  return (
    <div
      className="min-h-[420px] bg-white dark:bg-gray-950"
      aria-hidden="true"
    />
  );
}

interface LazyCertificatesClientProps {
  certificates: Certificate[];
}

export function LazyCertificatesClient({ certificates }: LazyCertificatesClientProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || shouldRender) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div ref={ref} style={{ minHeight: "420px" }}>
      {shouldRender ? <CertificatesClient certificates={certificates} /> : <CertificatesPlaceholder />}
    </div>
  );
}
