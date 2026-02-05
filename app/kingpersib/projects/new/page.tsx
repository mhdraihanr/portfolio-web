"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { insertProject } from "@/lib/supabase/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { generateSlug } from "@/lib/utils";
import { projectSchema, type ProjectFormData } from "@/lib/validations/project";

export default function NewProjectPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [techInput, setTechInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      problem: "",
      solution: "",
      impact: "",
      technologies: [],
      image_url: "",
      project_url: "",
      github_url: "",
      featured: false,
      order_index: 0,
    },
  });

  const technologies = watch("technologies");
  const featured = watch("featured");

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue("title", newTitle);
    if (newTitle) {
      setValue("slug", generateSlug(newTitle));
    }
  };

  // Add technology
  const handleAddTech = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setValue("technologies", [...technologies, techInput.trim()]);
      setTechInput("");
    }
  };

  // Remove technology
  const handleRemoveTech = (tech: string) => {
    setValue(
      "technologies",
      technologies.filter((t) => t !== tech),
    );
  };

  // Handle Enter key in tech input
  const handleTechKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTech();
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();

      // Check if slug already exists
      const { data: existing } = await supabase
        .from("projects")
        .select("id")
        .eq("slug", data.slug)
        .single();

      if (existing) {
        toast.error("Error", "A project with this slug already exists");
        setIsSubmitting(false);
        return;
      }

      // Insert project
      const { error } = await insertProject(supabase, {
        title: data.title,
        slug: data.slug,
        description: data.description,
        problem: data.problem,
        solution: data.solution,
        impact: data.impact,
        technologies: data.technologies,
        image_url: data.image_url || null,
        project_url: data.project_url || null,
        github_url: data.github_url || null,
        featured: data.featured,
        order_index: data.order_index,
      });

      if (error) throw error;

      toast.success("Success", "Project created successfully");

      router.push("/kingpersib/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Error", "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/kingpersib/projects">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Create New Project
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Add a new project to your portfolio
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" required>
                    Project Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="My Awesome Project"
                    {...register("title")}
                    onChange={handleTitleChange}
                    error={errors.title?.message}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" required>
                    URL Slug
                  </Label>
                  <Input
                    id="slug"
                    placeholder="my-awesome-project"
                    {...register("slug")}
                    error={errors.slug?.message}
                    helperText="Auto-generated from title"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" required>
                  Short Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="A brief overview of your project..."
                  rows={3}
                  {...register("description")}
                  error={errors.description?.message}
                />
              </div>
            </div>
          </Card>

          {/* Project Details */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Project Details
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="problem" required>
                  Problem Statement
                </Label>
                <Textarea
                  id="problem"
                  placeholder="What problem does this project solve?"
                  rows={4}
                  {...register("problem")}
                  error={errors.problem?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="solution" required>
                  Solution
                </Label>
                <Textarea
                  id="solution"
                  placeholder="How did you solve the problem?"
                  rows={4}
                  {...register("solution")}
                  error={errors.solution?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="impact" required>
                  Impact & Results
                </Label>
                <Textarea
                  id="impact"
                  placeholder="What was the outcome or impact?"
                  rows={4}
                  {...register("impact")}
                  error={errors.impact?.message}
                />
              </div>
            </div>
          </Card>

          {/* Technologies */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Technologies
            </h2>
            <div className="space-y-2">
              <Label htmlFor="technologies" required>
                Technologies Used
              </Label>
              <div className="flex gap-2">
                <Input
                  id="technologies"
                  placeholder="e.g., React, TypeScript, Node.js"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleTechKeyDown}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTech}
                  disabled={!techInput.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {errors.technologies && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.technologies.message}
                </p>
              )}
              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {technologies.map((tech, index) => (
                    <Badge key={index} variant="default">
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Links & Media */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Links & Media
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  placeholder="https://..."
                  {...register("image_url")}
                  error={errors.image_url?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_url">Live Project URL</Label>
                <Input
                  id="project_url"
                  type="url"
                  placeholder="https://..."
                  {...register("project_url")}
                  error={errors.project_url?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  type="url"
                  placeholder="https://github.com/..."
                  {...register("github_url")}
                  error={errors.github_url?.message}
                />
              </div>
            </div>
          </Card>

          {/* Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Display Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="order_index">Display Order</Label>
                <Input
                  id="order_index"
                  type="number"
                  min="0"
                  placeholder="0"
                  {...register("order_index", { valueAsNumber: true })}
                  error={errors.order_index?.message}
                  helperText="Lower numbers appear first"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="featured">Featured Project</Label>
                <div className="flex items-center gap-3 h-10">
                  <input
                    id="featured"
                    type="checkbox"
                    {...register("featured")}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {featured
                      ? "This project will be featured"
                      : "Mark as featured project"}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pb-8">
            <Link href="/kingpersib/projects" className="w-full sm:w-auto">
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
                "Create Project"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
