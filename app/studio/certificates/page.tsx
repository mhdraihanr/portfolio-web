"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Award,
  Search,
  ExternalLink,
  GripVertical,
  ArrowUpDown,
  Check,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { triggerRevalidate } from "@/lib/revalidate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Certificate } from "@/types/certificate";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filtered, setFiltered] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isReordering, setIsReordering] = useState(false);
  const [draggedCertId, setDraggedCertId] = useState<string | null>(null);
  const [dragOverCertId, setDragOverCertId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCertificates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFiltered(certificates);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFiltered(
      certificates.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.provider.toLowerCase().includes(q),
      ),
    );
  }, [searchQuery, certificates]);

  async function fetchCertificates() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setCertificates((data as Certificate[]) || []);
      setFiltered((data as Certificate[]) || []);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      toast.error("Error", "Failed to load certificates");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;

    setDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      await triggerRevalidate("homepage-certificates", "/");
      toast.success("Success", "Certificate deleted successfully");
      await fetchCertificates();
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast.error("Error", "Failed to delete certificate");
    } finally {
      setDeleting(false);
    }
  }

  // Drag and drop reordering
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedCertId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverCertId !== id) {
      setDragOverCertId(id);
    }
  };

  const handleDragEnd = () => {
    setDraggedCertId(null);
    setDragOverCertId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetCert: Certificate) => {
    e.preventDefault();
    if (!draggedCertId || draggedCertId === targetCert.id) {
      setDraggedCertId(null);
      setDragOverCertId(null);
      return;
    }

    const currentIdx = certificates.findIndex((c) => c.id === draggedCertId);
    const targetIdx = certificates.findIndex((c) => c.id === targetCert.id);
    if (currentIdx === -1 || targetIdx === -1) {
      setDraggedCertId(null);
      setDragOverCertId(null);
      return;
    }

    const updated = Array.from(certificates);
    const [moved] = updated.splice(currentIdx, 1);
    updated.splice(targetIdx, 0, moved);

    // Re-index to ensure strictly unique, consecutive sort_order (0..N)
    const reindexed = updated.map((item, idx) => ({
      ...item,
      sort_order: idx,
    }));

    // Real-time optimistic update
    setCertificates(reindexed);
    setFiltered(reindexed);
    setDraggedCertId(null);
    setDragOverCertId(null);

    try {
      const supabase = createClient();
      await Promise.all(
        reindexed.map((cert) =>
          supabase
            .from("certificates")
            .update({ sort_order: cert.sort_order })
            .eq("id", cert.id),
        ),
      );
      await triggerRevalidate("homepage-certificates", "/");
      toast.success("Order Updated", "Certificates reordered successfully");
    } catch (err) {
      console.error("Failed to reorder certificates:", err);
      toast.error("Error", "Failed to save order");
      fetchCertificates();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Certificates Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your professional certificates. Drag cards to reorder.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto flex-wrap">
              <Button
                variant={isReordering ? "primary" : "outline"}
                className={cn(
                  "w-full sm:w-auto",
                  isReordering &&
                    "bg-primary text-primary-foreground font-semibold shadow-md",
                )}
                onClick={() => {
                  if (isReordering) {
                    setIsReordering(false);
                  } else {
                    setIsReordering(true);
                    setSearchQuery("");
                  }
                }}
              >
                {isReordering ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Done
                  </>
                ) : (
                  <>
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Reorder
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={async () => {
                  await triggerRevalidate("homepage-certificates", "/");
                  toast.success("Cache Cleared", "Homepage cache revalidated");
                }}
              >
                Refresh Cache
              </Button>
              <Link href="/studio/certificates/new">
                <Button className="w-full sm:w-auto">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Certificate
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                Total
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {certificates.length}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                Providers
              </p>
              <p className="text-2xl font-bold text-primary mt-1">
                {new Set(certificates.map((c) => c.provider)).size}
              </p>
            </Card>
          </div>

          {/* Reorder Mode Banner */}
          {isReordering && (
            <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2.5 text-primary text-sm font-medium animate-fade-in">
              <GripVertical className="w-5 h-5 animate-pulse shrink-0" />
              <span>
                <strong>Mode Reorder Aktif:</strong> Geser kartu untuk mengatur
                urutan sertifikat. Perubahan tampil secara real-time dan
                otomatis tersimpan. Klik <strong>Done</strong> jika sudah
                selesai.
              </span>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search certificates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-gray-400 dark:text-gray-500">
              {searchQuery ? (
                <>
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No results found</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                </>
              ) : (
                <>
                  <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No certificates yet</p>
                  <p className="text-sm mt-1">
                    Get started by adding your first certificate
                  </p>
                  <Link href="/studio/certificates/new">
                    <Button className="mt-4">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Your First Certificate
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((cert) => (
              <Card
                key={cert.id}
                draggable={isReordering}
                onDragStart={(e) => isReordering && handleDragStart(e, cert.id)}
                onDragOver={(e) => isReordering && handleDragOver(e, cert.id)}
                onDragEnd={handleDragEnd}
                onDrop={(e) => isReordering && handleDrop(e, cert)}
                className={cn(
                  "p-5 transition-all relative flex flex-col",
                  isReordering
                    ? "cursor-grab active:cursor-grabbing border-2 border-dashed border-primary/40 hover:border-primary shadow-sm"
                    : "hover:shadow-lg",
                  draggedCertId === cert.id && "opacity-30 scale-[0.98]",
                  dragOverCertId === cert.id &&
                    "ring-2 ring-primary border-primary bg-primary/5",
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 shrink-0">
                      <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {cert.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {cert.provider}
                      </p>
                    </div>
                  </div>
                </div>

                {cert.issue_date && (
                  <Badge variant="outline" className="text-xs mb-2">
                    {cert.issue_date}
                  </Badge>
                )}

                {cert.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                    {cert.description}
                  </p>
                )}

                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mb-3"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Credential
                  </a>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
                    <GripVertical className="w-3.5 h-3.5 text-gray-400" />
                    Order: {cert.sort_order}
                  </span>
                  {isReordering ? (
                    <div className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-primary/10 text-primary text-xs font-semibold select-none border border-primary/20">
                      <GripVertical className="w-4 h-4" />
                      <span>Geser Urutan</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Link href={`/studio/certificates/${cert.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(cert.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => !deleting && setDeleteId(null)}
        title="Delete Certificate"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this certificate? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
