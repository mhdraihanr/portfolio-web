"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/supabase/helpers";
import { triggerRevalidate } from "@/lib/revalidate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { Textarea } from "@/components/ui/textarea";
import {
  ImageUploader,
  type UploadedImage,
} from "@/components/ui/image-uploader";
import { profileSchema, type ProfileFormData } from "@/lib/validations/profile";
import type { Profile } from "@/types/profile";

export default function ProfilePage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState<UploadedImage | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      tagline: "",
      hero_title: "",
      hero_tagline: "",
      about_text: "",
      photo_url: "",
      cv_url: "",
    },
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("profile")
          .select("*")
          .eq("id", 1)
          .maybeSingle();

        if (error) throw error;

        const profile = data as Profile | null;
        if (profile) {
          reset({
            full_name: profile.full_name,
            tagline: profile.tagline,
            hero_title: profile.hero_title,
            hero_tagline: profile.hero_tagline,
            about_text: profile.about_text,
            photo_url: profile.photo_url || "",
            cv_url: profile.cv_url || "",
          });
          if (profile.photo_url) {
            setPhoto({ url: profile.photo_url, fileId: "" });
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Error", "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();

      const { error } = await updateProfile(supabase, {
        full_name: data.full_name.trim(),
        tagline: data.tagline.trim(),
        hero_title: data.hero_title.trim(),
        hero_tagline: data.hero_tagline.trim(),
        about_text: data.about_text.trim(),
        photo_url: photo?.url || data.photo_url?.trim() || null,
        cv_url: data.cv_url?.trim() || null,
      });

      if (error) throw error;

      await triggerRevalidate("homepage-profile", "/");
      toast.success("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error", "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
              <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Profile Settings
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your name, photo, CV link, and section texts
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Identity */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Identity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="full_name"
                label="Full Name"
                placeholder="Your full name"
                error={errors.full_name?.message}
                {...register("full_name")}
              />
              <Input
                id="tagline"
                label="Tagline"
                placeholder="e.g. Fullstack Developer"
                error={errors.tagline?.message}
                {...register("tagline")}
              />
            </div>
          </Card>

          {/* Photo & CV */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Photo & CV
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Profile Photo
                </label>
                <ImageUploader
                  multiple={false}
                  maxFiles={1}
                  currentImages={photo ? [photo] : []}
                  onUploadComplete={(images) => {
                    if (images.length > 0) {
                      setPhoto(images[0]);
                    }
                  }}
                  onDelete={() => setPhoto(null)}
                />
              </div>
              <Input
                id="cv_url"
                label="CV URL"
                placeholder="https://drive.google.com/..."
                helperText="Link to your CV (Google Drive, Notion, etc.)"
                error={errors.cv_url?.message}
                {...register("cv_url")}
              />
            </div>
          </Card>

          {/* Hero Section Texts */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Hero Section
            </h2>
            <div className="space-y-6">
              <Input
                id="hero_title"
                label="Hero Title"
                placeholder="Fullstack Developer turning ideas into working products."
                error={errors.hero_title?.message}
                {...register("hero_title")}
              />
              <Textarea
                id="hero_tagline"
                label="Hero Tagline"
                placeholder="Short description shown next to the CV button"
                error={errors.hero_tagline?.message}
                {...register("hero_tagline")}
              />
            </div>
          </Card>

          {/* About Section Text */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              About Section
            </h2>
            <Textarea
              id="about_text"
              label="About Text"
              placeholder="Paragraph shown in the About section"
              error={errors.about_text?.message}
              {...register("about_text")}
            />
          </Card>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              leftIcon={
                isSubmitting ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )
              }
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
