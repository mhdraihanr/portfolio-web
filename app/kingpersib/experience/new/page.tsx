"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { insertWorkExperience } from "@/lib/supabase/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import {
  experienceSchema,
  type ExperienceFormData,
} from "@/lib/validations/experience";
import { EMPLOYMENT_TYPES } from "@/types/experience";

export default function NewExperiencePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: "",
      position: "",
      description: "",
      start_date: "",
      end_date: "",
      is_current: false,
      order_index: 0,
      logo_url: "",
      employment_type: "",
    },
  });

  const isCurrent = watch("is_current");

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

      // Insert experience
      const { error } = await insertWorkExperience(supabase, {
        company: data.company,
        position: data.position,
        description: data.description,
        start_date: data.start_date,
        end_date: data.is_current ? null : data.end_date || null,
        logo_url: data.logo_url || null,
        employment_type: data.employment_type || null,
        is_current: data.is_current,
        order_index: data.order_index,
      });

      if (error) throw error;

      toast.success("Success", "Work experience created successfully");

      router.push("/kingpersib/experience");
    } catch (error) {
      console.error("Error creating experience:", error);
      toast.error("Error", "Failed to create work experience");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Add Work Experience
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Add a new work experience to your portfolio
          </p>
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
              Additional Information
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="logo_url">Company Logo URL</Label>
                <Input
                  id="logo_url"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  {...register("logo_url")}
                  error={errors.logo_url?.message}
                  helperText="URL to company logo (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employment_type">Employment Type</Label>
                <select
                  id="employment_type"
                  {...register("employment_type")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select employment type</option>
                  {EMPLOYMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.employment_type && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.employment_type.message}
                  </p>
                )}
              </div>

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
                  Creating...
                </>
              ) : (
                "Create Experience"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
