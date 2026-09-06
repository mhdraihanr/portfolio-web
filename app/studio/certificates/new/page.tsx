"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { insertCertificate } from "@/lib/supabase/helpers";
import { triggerRevalidate } from "@/lib/revalidate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { Textarea } from "@/components/ui/textarea";
import {
  certificateSchema,
  type CertificateFormData,
} from "@/lib/validations/certificate";

export default function NewCertificatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      title: "",
      provider: "",
      issue_date: "",
      credential_id: "",
      credential_url: "",
      description: "",
      image: "",
      sort_order: 0,
    },
  });

  useEffect(() => {
    async function fetchNextOrder() {
      try {
        const supabase = createClient();
        const { count } = await supabase
          .from("certificates")
          .select("*", { count: "exact", head: true });
        if (typeof count === "number") {
          setValue("sort_order", count);
        }
      } catch (err) {
        console.error("Failed to fetch next sort_order for certificate:", err);
      }
    }
    fetchNextOrder();
  }, [setValue]);

  const onSubmit = async (data: CertificateFormData) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();

      const { error } = await insertCertificate(supabase, {
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
      toast.success("Success", "Certificate created successfully");
      router.push("/studio/certificates");
    } catch (error) {
      console.error("Error creating certificate:", error);
      toast.error("Error", "Failed to create certificate");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Add New Certificate
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Add a new professional certificate to your portfolio
          </p>
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
                  Creating...
                </>
              ) : (
                "Create Certificate"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
