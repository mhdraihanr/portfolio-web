"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { updateCertificate } from "@/lib/supabase/helpers";
import { triggerRevalidate } from "@/lib/revalidate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import {
  certificateSchema,
  type CertificateFormData,
} from "@/lib/validations/certificate";
import type { Certificate } from "@/types/certificate";

export default function EditCertificatePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
  });

  useEffect(() => {
    fetchCertificate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function fetchCertificate() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          toast.error("Error", "Certificate not found");
          router.push("/studio/certificates");
          return;
        }
        throw error;
      }

      if (!data) {
        toast.error("Error", "Certificate not found");
        router.push("/studio/certificates");
        return;
      }

      const cert = data as Certificate;
      setCertificate(cert);
      reset({
        title: cert.title,
        provider: cert.provider,
        issue_date: cert.issue_date || "",
        credential_id: cert.credential_id || "",
        credential_url: cert.credential_url || "",
        description: cert.description || "",
        image: cert.image || "",
        sort_order: cert.sort_order,
      });
    } catch (error) {
      console.error("Error fetching certificate:", error);
      toast.error("Error", "Failed to load certificate");
      router.push("/studio/certificates");
    } finally {
      setIsLoading(false);
    }
  }

  const onSubmit = async (data: CertificateFormData) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();

      const { error } = await updateCertificate(supabase, params.id, {
        title: data.title.trim(),
        provider: data.provider.trim(),
        issue_date: data.issue_date?.trim() || null,
        credential_id: data.credential_id?.trim() || null,
        credential_url: data.credential_url?.trim() || null,
        description: data.description?.trim() || null,
        image: data.image?.trim() || null,
        sort_order: data.sort_order,
      });

      if (error) throw error;

      await triggerRevalidate("homepage-certificates", "/");
      toast.success("Success", "Certificate updated successfully");
      router.push("/studio/certificates");
    } catch (error) {
      console.error("Error updating certificate:", error);
      toast.error("Error", "Failed to update certificate");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", params.id);

      if (error) throw error;

      await triggerRevalidate("homepage-certificates", "/");
      toast.success("Success", "Certificate deleted successfully");
      router.push("/studio/certificates");
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast.error("Error", "Failed to delete certificate");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/studio/certificates">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Certificates
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Edit Certificate
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Update certificate details
              </p>
            </div>
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
              disabled={isSubmitting || isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Certificate
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Certificate Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" required>
                  Certificate Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., AWS Cloud Practitioner"
                  {...register("title")}
                  error={errors.title?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider" required>
                  Provider / Issuer
                </Label>
                <Input
                  id="provider"
                  placeholder="e.g., Dicoding Academy, AWS"
                  {...register("provider")}
                  error={errors.provider?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issue_date">Issue Date</Label>
                <Input
                  id="issue_date"
                  placeholder="e.g., 2024, Jan 2024"
                  {...register("issue_date")}
                  error={errors.issue_date?.message}
                  helperText="Free text — year, month/year, or full date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credential_id">Credential ID</Label>
                <Input
                  id="credential_id"
                  placeholder="e.g., ABC123XYZ"
                  {...register("credential_id")}
                  error={errors.credential_id?.message}
                />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="credential_url">Credential URL</Label>
              <Input
                id="credential_url"
                placeholder="https://www.dicoding.com/certificates/..."
                {...register("credential_url")}
                error={errors.credential_url?.message}
                helperText="Link to verify the certificate"
              />
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of what this certificate covers..."
                {...register("description")}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>
          </Card>

          {/* Display Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Display Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  placeholder="https://..."
                  {...register("image")}
                  error={errors.image?.message}
                  helperText="Optional certificate image/logo URL"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sort_order">Display Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register("sort_order", { valueAsNumber: true })}
                  error={errors.sort_order?.message}
                  helperText="Lower numbers appear first"
                />
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pb-8">
            <Link href="/studio/certificates" className="w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className="w-full"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Updating...
                </>
              ) : (
                "Update Certificate"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        title="Delete Certificate"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete{" "}
            <strong>{certificate?.title}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
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
