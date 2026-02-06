"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Code2,
  Search,
  LayoutGrid,
  Table as TableIcon,
  Eye,
  EyeOff,
  Globe,
  Database,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import type { Skill, SkillCategory } from "@/types/skill";
import { SKILL_CATEGORIES } from "@/types/skill";

type ViewMode = "grid" | "table";

const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  frontend: Globe,
  backend: Database,
  tools: Code2,
  others: Code2,
};

const CATEGORY_COLORS: Record<string, { text: string; bg: string }> = {
  frontend: {
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  backend: {
    text: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  tools: {
    text: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
  },
  others: {
    text: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
  },
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { toast } = useToast();

  useEffect(() => {
    fetchSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let result = skills;

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query),
      );
    }

    // Filter by category
    if (filterCategory !== "all") {
      result = result.filter((s) => s.category === filterCategory);
    }

    setFilteredSkills(result);
  }, [searchQuery, filterCategory, skills]);

  async function fetchSkills() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("category", { ascending: true })
        .order("order_index", { ascending: true });

      if (error) throw error;
      setSkills((data as Skill[]) || []);
      setFilteredSkills((data as Skill[]) || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error("Error", "Failed to load skills");
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
        .from("skills")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      toast.success("Success", "Skill deleted successfully");
      await fetchSkills();
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Error", "Failed to delete skill");
    } finally {
      setDeleting(false);
    }
  }

  // Group skills by category for grid view
  const skillsByCategory = filteredSkills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>,
  );

  const categoryStats = {
    total: skills.length,
    frontend: skills.filter((s) => s.category === "frontend").length,
    backend: skills.filter((s) => s.category === "backend").length,
    tools: skills.filter((s) => s.category === "tools").length,
    others: skills.filter((s) => s.category === "others").length,
    visible: skills.filter((s) => s.is_visible).length,
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
                Skills Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your skills and technologies
              </p>
            </div>
            <Link href="/kingpersib/skills/new">
              <Button className="w-full sm:w-auto">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                Total
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {categoryStats.total}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide">
                Frontend
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {categoryStats.frontend}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-green-600 dark:text-green-400 font-medium uppercase tracking-wide">
                Backend
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {categoryStats.backend}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium uppercase tracking-wide">
                Tools
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                {categoryStats.tools}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                Visible
              </p>
              <p className="text-2xl font-bold text-primary dark:text-primary-400 mt-1">
                {categoryStats.visible}
              </p>
            </Card>
          </div>

          {/* Search, Filter, and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {SKILL_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "primary" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "primary" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <TableIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredSkills.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-gray-400 dark:text-gray-500">
              {searchQuery || filterCategory !== "all" ? (
                <>
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No results found</p>
                  <p className="text-sm mt-1">
                    Try a different search term or category
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setFilterCategory("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </>
              ) : (
                <>
                  <Code2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No skills yet</p>
                  <p className="text-sm mt-1">
                    Get started by adding your first skill
                  </p>
                  <Link href="/kingpersib/skills/new">
                    <Button className="mt-4">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Your First Skill
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </Card>
        ) : viewMode === "grid" ? (
          /* Grid View - Grouped by Category */
          <div className="space-y-8">
            {(
              ["frontend", "backend", "tools", "others"] as SkillCategory[]
            ).map((category) => {
              const categorySkills = skillsByCategory[category];
              if (!categorySkills || categorySkills.length === 0) return null;

              const catLabel =
                SKILL_CATEGORIES.find((c) => c.value === category)?.label ||
                category;
              const CatIcon = CATEGORY_ICONS[category] || Code2;
              const colors = CATEGORY_COLORS[category];

              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`p-1.5 rounded-lg ${colors.bg}`}>
                      <CatIcon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {catLabel}
                    </h2>
                    <Badge variant="outline" className="text-xs">
                      {categorySkills.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categorySkills.map((skill) => (
                      <Card
                        key={skill.id}
                        className="p-4 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Icon */}
                            {skill.icon_svg ? (
                              <img
                                src={skill.icon_svg}
                                alt={skill.name}
                                className="w-8 h-8 shrink-0 dark:invert"
                              />
                            ) : skill.icon ? (
                              <i
                                className={`${skill.icon} text-3xl shrink-0`}
                              ></i>
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded shrink-0" />
                            )}
                            <div className="min-w-0">
                              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                {skill.name}
                              </h3>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Order: {skill.order_index}
                              </span>
                            </div>
                          </div>
                          {/* Visibility */}
                          {skill.is_visible ? (
                            <Eye className="w-4 h-4 text-green-500 shrink-0" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400 shrink-0" />
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Link
                            href={`/kingpersib/skills/${skill.id}/edit`}
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <Pencil className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteId(skill.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Icon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Visible
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredSkills.map((skill) => {
                    const catLabel =
                      SKILL_CATEGORIES.find((c) => c.value === skill.category)
                        ?.label || skill.category;
                    const colors = CATEGORY_COLORS[skill.category];

                    return (
                      <tr
                        key={skill.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          {skill.icon_svg ? (
                            <img
                              src={skill.icon_svg}
                              alt={skill.name}
                              className="w-6 h-6 dark:invert"
                            />
                          ) : skill.icon ? (
                            <i className={`${skill.icon} text-2xl`}></i>
                          ) : (
                            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {skill.name}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="outline"
                            className={`text-xs ${colors.text}`}
                          >
                            {catLabel}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {skill.order_index}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {skill.is_visible ? (
                            <Eye className="w-4 h-4 text-green-500 mx-auto" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400 mx-auto" />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/kingpersib/skills/${skill.id}/edit`}>
                              <Button variant="outline" size="sm" title="Edit">
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteId(skill.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => !deleting && setDeleteId(null)}
        title="Delete Skill"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this skill? This action cannot be
            undone.
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
