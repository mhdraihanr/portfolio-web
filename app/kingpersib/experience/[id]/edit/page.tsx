"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { updateWorkExperience } from "@/lib/supabase/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import {
  experienceSchema,
  type ExperienceFormData,
} from "@/lib/validations/experience";
import type { WorkExperience, WorkExperienceUpdate } from "@/types/experience";

export default function EditExperiencePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [experience, setExperience] = useState<WorkExperience | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
  });

  const isCurrent = watch("is_current");

  useEffect(() => {
    fetchExperience();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function fetchExperience() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("work_experience")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          toast.error("Error", "Work experience not found");
          router.push("/kingpersib/experience");
          return;
        }
        throw error;
      }

      if (!data) {
        toast.error("Error", "Work experience not found");
        router.push("/kingpersib/experience");
        return;
      }

      const experienceData = data as WorkExperience;
      setExperience(experienceData);
      reset({
        company: experienceData.company,
        position: experienceData.position,
        description: experienceData.description,
        start_date: experienceData.start_date,
        end_date: experienceData.end_date || "",
        is_current: experienceData.is_current,
        order_index: experienceData.order_index,
      });
    } catch (error) {
      console.error("Error fetching experience:", error);
      toast.error("Error", "Failed to load work experience");
      router.push("/kingpersib/experience");
    } finally {
      setIsLoading(false);
    }
  }

  // Clear end_date when is_current is checked
  const handleCurrentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setValue("is_current", checked);
    if (checked) {
      setValue("end_date", "");
    }
  };

  const onSubmit = async (data: ExperienceFormData) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();

      // Update experience
      const updateData: WorkExperienceUpdate = {
        company: data.company,
        position: data.position,
        description: data.description,
        start_date: data.start_date,
        end_date: data.is_current ? null : data.end_date || null,
        is_current: data.is_current,
        order_index: data.order_index,
      };

      const { error } = await updateWorkExperience(
        supabase,
        params.id,
        updateData,
      );

      if (error) throw error;

      toast.success("Success", "Work experience updated successfully");

      router.push("/kingpersib/experience");
    } catch (error) {
      console.error("Error updating experience:", error);
      toast.error("Error", "Failed to update work experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("work_experience")
        .delete()
        .eq("id", params.id);

      if (error) throw error;

      toast.success("Success", "Work experience deleted successfully");

      router.push("/kingpersib/experience");
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast.error("Error", "Failed to delete work experience");
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
          <Link href="/kingpersib/experience">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Experience
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Edit Work Experience
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Update work experience details
              </p>
            </div>
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
              disabled={isSubmitting || isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Experience
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Company & Position
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company" required>
                  Company Name
                </Label>
                <Input
                  id="company"
                  placeholder="Acme Corporation"
                  {...register("company")}
                  error={errors.company?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" required>
                  Position / Job Title
                </Label>
                <Input
                  id="position"
                  placeholder="Senior Software Engineer"
                  {...register("position")}
                  error={errors.position?.message}
                />
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Job Description
            </h2>
            <div className="space-y-2">
              <Label htmlFor="description" required>
                Responsibilities & Achievements
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your responsibilities, achievements, and key projects..."
                rows={8}
                {...register("description")}
                error={errors.description?.message}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Include your main responsibilities, notable achievements, and
                technologies used
              </p>
            </div>
          </Card>

          {/* Employment Period */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Employment Period
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start_date" required>
                    Start Date
                  </Label>
                  <Input
                    id="start_date"
                    type="date"
                    {...register("start_date")}
                    error={errors.start_date?.message}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date" required={!isCurrent}>
                    End Date
                  </Label>
                  <Input
                    id="end_date"
                    type="date"
                    disabled={isCurrent}
                    {...register("end_date")}
                    error={errors.end_date?.message}
                    helperText={
                      isCurrent ? "Currently working here" : undefined
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="is_current">Current Position</Label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <input
                    id="is_current"
                    type="checkbox"
                    {...register("is_current")}
                    onChange={handleCurrentChange}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {isCurrent
                      ? "✓ I currently work here"
                      : "Check if this is your current position"}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Display Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Display Settings
            </h2>
            <div className="space-y-2">
              <Label htmlFor="order_index">Display Order</Label>
              <Input
                id="order_index"
                type="number"
                min="0"
                placeholder="0"
                {...register("order_index", { valueAsNumber: true })}
                error={errors.order_index?.message}
                helperText="Lower numbers appear first in the timeline"
              />
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pb-8">
            <Link href="/kingpersib/experience" className="w-full sm:w-auto">
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
                "Update Experience"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        title="Delete Work Experience"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete{" "}
            <strong>
              {experience?.position} at {experience?.company}
            </strong>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
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
