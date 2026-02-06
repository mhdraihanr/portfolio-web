"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { updateSkill } from "@/lib/supabase/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { DeviconPicker } from "@/components/admin/devicon-picker";
import { skillSchema, type SkillFormData } from "@/lib/validations/skill";
import { SKILL_CATEGORIES } from "@/types/skill";
import type { Skill, SkillUpdate as SkillUpdateType } from "@/types/skill";

export default function EditSkillPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [skill, setSkill] = useState<Skill | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
  });

  const iconValue = watch("icon");
  const iconSvgValue = watch("icon_svg");

  useEffect(() => {
    fetchSkill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function fetchSkill() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          toast.error("Error", "Skill not found");
          router.push("/kingpersib/skills");
          return;
        }
        throw error;
      }

      if (!data) {
        toast.error("Error", "Skill not found");
        router.push("/kingpersib/skills");
        return;
      }

      const skillData = data as Skill;
      setSkill(skillData);
      reset({
        name: skillData.name,
        category: skillData.category,
        icon: skillData.icon || "",
        icon_svg: skillData.icon_svg || "",
        order_index: skillData.order_index,
        is_visible: skillData.is_visible,
      });
    } catch (error) {
      console.error("Error fetching skill:", error);
      toast.error("Error", "Failed to load skill");
      router.push("/kingpersib/skills");
    } finally {
      setIsLoading(false);
    }
  }

  const handleIconSelect = (data: { icon: string; icon_svg: string }) => {
    setValue("icon", data.icon);
    setValue("icon_svg", data.icon_svg);
  };

  const onSubmit = async (data: SkillFormData) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();

      const updateData: SkillUpdateType = {
        name: data.name.trim(),
        category: data.category,
        icon: data.icon?.trim() || null,
        icon_svg: data.icon_svg?.trim() || null,
        order_index: data.order_index,
        is_visible: data.is_visible,
      };

      const { error } = await updateSkill(supabase, params.id, updateData);

      if (error) throw error;

      toast.success("Success", "Skill updated successfully");
      router.push("/kingpersib/skills");
    } catch (error) {
      console.error("Error updating skill:", error);
      toast.error("Error", "Failed to update skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", params.id);

      if (error) throw error;

      toast.success("Success", "Skill deleted successfully");
      router.push("/kingpersib/skills");
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Error", "Failed to delete skill");
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
          <Link href="/kingpersib/skills">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Skills
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Edit Skill
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Update skill details
              </p>
            </div>
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
              disabled={isSubmitting || isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Skill
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Skill Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" required>
                  Skill Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., React, TypeScript, Docker"
                  {...register("name")}
                  error={errors.name?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" required>
                  Category
                </Label>
                <select
                  id="category"
                  {...register("category")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {SKILL_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Icon Selection */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Icon
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Search and select an icon from Devicon, or manually enter icon
              details below
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Devicon Icon Picker</Label>
                <DeviconPicker
                  value={iconValue}
                  valueSvg={iconSvgValue}
                  onSelect={handleIconSelect}
                />
              </div>

              {/* Manual Override Fields */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <p className="text-xs text-gray-400 mb-3">
                  Or manually set icon values (auto-filled by picker above):
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon Class (Devicon)</Label>
                    <Input
                      id="icon"
                      placeholder="e.g., devicon-react-original colored"
                      {...register("icon")}
                      error={errors.icon?.message}
                      helperText="Devicon font class name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="icon_svg">Icon SVG URL</Label>
                    <Input
                      id="icon_svg"
                      placeholder="https://cdn.jsdelivr.net/.../icon.svg"
                      {...register("icon_svg")}
                      error={errors.icon_svg?.message}
                      helperText="CDN URL for the SVG icon"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              {(iconValue || iconSvgValue) && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <Label>Preview</Label>
                  <div className="flex items-center gap-4 mt-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    {iconSvgValue ? (
                      <img
                        src={iconSvgValue}
                        alt="Icon preview"
                        className="w-10 h-10 dark:invert"
                      />
                    ) : iconValue ? (
                      <i className={`${iconValue} text-4xl`}></i>
                    ) : null}
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {iconValue && (
                        <p>
                          <span className="font-medium">Class:</span>{" "}
                          {iconValue}
                        </p>
                      )}
                      {iconSvgValue && (
                        <p className="truncate max-w-md">
                          <span className="font-medium">SVG:</span>{" "}
                          {iconSvgValue}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Display Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Display Settings
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="order_index">Display Order</Label>
                <Input
                  id="order_index"
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register("order_index", { valueAsNumber: true })}
                  error={errors.order_index?.message}
                  helperText="Lower numbers appear first within each category"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="is_visible">Visibility</Label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <input
                    id="is_visible"
                    type="checkbox"
                    {...register("is_visible")}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Show this skill on the homepage
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pb-8">
            <Link href="/kingpersib/skills" className="w-full sm:w-auto">
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
                "Update Skill"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        title="Delete Skill"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete <strong>{skill?.name}</strong>? This
            action cannot be undone.
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
