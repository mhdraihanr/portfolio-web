"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Briefcase,
  Clock,
  Search,
  LayoutGrid,
  Table as TableIcon,
  MapPin,
  GripVertical,
  ArrowUpDown,
  Check,
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { triggerRevalidate } from "@/lib/revalidate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { formatDateShort, cn } from "@/lib/utils";
import type { WorkExperience } from "@/types/experience";

type ViewMode = "grid" | "table";

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<
    WorkExperience[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isReordering, setIsReordering] = useState(false);
  const [draggedExpId, setDraggedExpId] = useState<string | null>(null);
  const [dragOverExpId, setDragOverExpId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchExperiences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredExperiences(experiences);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredExperiences(
        experiences.filter(
          (e) =>
            e.company.toLowerCase().includes(query) ||
            e.position.toLowerCase().includes(query) ||
            e.description.toLowerCase().includes(query),
        ),
      );
    }
  }, [searchQuery, experiences]);

  async function fetchExperiences() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("work_experience")
        .select("*")
        .order("order_index", { ascending: true })
        .order("start_date", { ascending: false });

      if (error) throw error;
      setExperiences(data || []);
      setFilteredExperiences(data || []);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      toast.error("Error", "Failed to load work experience");
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
        .from("work_experience")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      toast.success("Success", "Experience deleted successfully");

      await fetchExperiences();
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast.error("Error", "Failed to delete experience");
    } finally {
      setDeleting(false);
    }
  }

  // Drag and drop reordering
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedExpId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverExpId !== id) {
      setDragOverExpId(id);
    }
  };

  const handleDragEnd = () => {
    setDraggedExpId(null);
    setDragOverExpId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetExp: WorkExperience) => {
    e.preventDefault();
    if (!draggedExpId || draggedExpId === targetExp.id) {
      setDraggedExpId(null);
      setDragOverExpId(null);
      return;
    }

    const currentIdx = experiences.findIndex((e) => e.id === draggedExpId);
    const targetIdx = experiences.findIndex((e) => e.id === targetExp.id);
    if (currentIdx === -1 || targetIdx === -1) {
      setDraggedExpId(null);
      setDragOverExpId(null);
      return;
    }

    // Reorder array
    const updated = Array.from(experiences);
    const [moved] = updated.splice(currentIdx, 1);
    updated.splice(targetIdx, 0, moved);

    // Re-index to ensure strictly unique, consecutive order_index (0..N)
    const reindexed = updated.map((item, idx) => ({
      ...item,
      order_index: idx,
    }));

    // Real-time optimistic update
    setExperiences(reindexed);
    setFilteredExperiences(reindexed);
    setDraggedExpId(null);
    setDragOverExpId(null);

    // Persist to Supabase
    try {
      const supabase = createClient();
      await Promise.all(
        reindexed.map((exp) =>
          supabase
            .from("work_experience")
            .update({ order_index: exp.order_index })
            .eq("id", exp.id),
        ),
      );
      await triggerRevalidate("homepage-experience", "/");
      toast.success("Order Updated", "Experiences reordered successfully");
    } catch (err) {
      console.error("Failed to reorder experiences:", err);
      toast.error("Error", "Failed to save order");
      fetchExperiences();
    }
  };

  function formatDateRange(
    startDate: string,
    endDate: string | null,
    isCurrent: boolean,
  ): string {
    const start = formatDateShort(startDate);
    if (isCurrent) {
      return `${start} - Present`;
    }
    const end = endDate ? formatDateShort(endDate) : "Present";
    return `${start} - ${end}`;
  }

  function calculateDuration(
    startDate: string,
    endDate: string | null,
    isCurrent: boolean,
  ): string {
    const start = new Date(startDate);
    const end = isCurrent || !endDate ? new Date() : new Date(endDate);
    const months = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30),
    );
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0 && remainingMonths > 0) {
      return `${years}y ${remainingMonths}m`;
    } else if (years > 0) {
      return `${years}y`;
    } else {
      return `${months}m`;
    }
  }

  const currentCount = experiences.filter((e) => e.is_current).length;

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
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Work Experience
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your professional work history. Drag items to reorder.
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
                  await triggerRevalidate("homepage-experience", "/");
                  toast.success("Cache Cleared", "Homepage cache revalidated");
                }}
              >
                Refresh Cache
              </Button>
              <Link href="/studio/experience/new">
                <Button className="w-full sm:w-auto">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                Total
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {experiences.length}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                Current
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {currentCount}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                Past
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {experiences.length - currentCount}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">
                Showing
              </p>
              <p className="text-2xl font-bold text-primary dark:text-primary-400 mt-1">
                {filteredExperiences.length}
              </p>
            </Card>
          </div>

          {/* Reorder Mode Banner */}
          {isReordering && (
            <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2.5 text-primary text-sm font-medium animate-fade-in">
              <GripVertical className="w-5 h-5 animate-pulse shrink-0" />
              <span>
                <strong>Mode Reorder Aktif:</strong> Geser kartu atau baris
                untuk mengatur urutan riwayat pengalaman. Perubahan tampil
                secara real-time dan otomatis tersimpan. Klik{" "}
                <strong>Done</strong> jika sudah selesai.
              </span>
            </div>
          )}

          {/* Search and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by company, position, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
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

        {/* Experience List */}
        {filteredExperiences.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-gray-400 dark:text-gray-500">
              {searchQuery ? (
                <>
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No results found</p>
                  <p className="text-sm mt-1">
                    Try a different search term or clear the search
                  </p>
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
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No work experience yet</p>
                  <p className="text-sm mt-1">
                    Get started by adding your first work experience
                  </p>
                  <Link href="/studio/experience/new">
                    <Button className="mt-4">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Your First Experience
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </Card>
        ) : viewMode === "grid" ? (
          /* Grid View - Timeline Style */
          <div className="space-y-6">
            {filteredExperiences.map((experience, index) => (
              <Card
                key={experience.id}
                draggable={isReordering}
                onDragStart={(e) =>
                  isReordering && handleDragStart(e, experience.id)
                }
                onDragOver={(e) =>
                  isReordering && handleDragOver(e, experience.id)
                }
                onDragEnd={handleDragEnd}
                onDrop={(e) => isReordering && handleDrop(e, experience)}
                className={cn(
                  "p-6 transition-all relative",
                  isReordering
                    ? "cursor-grab active:cursor-grabbing border-2 border-dashed border-primary/40 hover:border-primary shadow-sm"
                    : "hover:shadow-lg",
                  draggedExpId === experience.id && "opacity-30 scale-[0.98]",
                  dragOverExpId === experience.id &&
                    "ring-2 ring-primary border-primary bg-primary/5",
                )}
              >
                {/* Timeline Indicator */}
                {index < filteredExperiences.length - 1 && (
                  <div className="absolute left-8 top-20 bottom-0 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block" />
                )}

                <div className="flex items-start gap-6">
                  {/* Icon or Logo */}
                  <div className="shrink-0">
                    {experience.logo_url ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <Image
                          src={experience.logo_url}
                          alt={`${experience.company} logo`}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          experience.is_current
                            ? "bg-green-100 dark:bg-green-900/30"
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        <Briefcase
                          className={`w-6 h-6 ${
                            experience.is_current
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        />
                      </div>
                    )}{" "}
                    {experience.employment_type && (
                      <Badge variant="secondary" className="shrink-0">
                        {experience.employment_type}
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {experience.position}
                          </h3>
                          {experience.is_current && (
                            <Badge variant="success" className="shrink-0">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                          <Briefcase className="w-4 h-4" />
                          <span className="font-medium">
                            {experience.company}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>
                              {formatDateRange(
                                experience.start_date,
                                experience.end_date,
                                experience.is_current,
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {calculateDuration(
                                experience.start_date,
                                experience.end_date,
                                experience.is_current,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isReordering ? (
                          <div className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-primary/10 text-primary text-xs font-semibold select-none border border-primary/20">
                            <GripVertical className="w-4 h-4" />
                            <span>Geser Urutan</span>
                          </div>
                        ) : (
                          <>
                            <Link
                              href={`/studio/experience/${experience.id}/edit`}
                            >
                              <Button variant="outline" size="sm" title="Edit">
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteId(experience.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                      {experience.description}
                    </p>

                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1 font-mono">
                        <GripVertical className="w-3.5 h-3.5 text-gray-400" />
                        Display Order: #{experience.order_index}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Table View */
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredExperiences.map((experience) => (
                    <tr
                      key={experience.id}
                      draggable={isReordering}
                      onDragStart={(e) =>
                        isReordering && handleDragStart(e, experience.id)
                      }
                      onDragOver={(e) =>
                        isReordering && handleDragOver(e, experience.id)
                      }
                      onDragEnd={handleDragEnd}
                      onDrop={(e) => isReordering && handleDrop(e, experience)}
                      className={cn(
                        "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                        isReordering && "cursor-grab active:cursor-grabbing",
                        draggedExpId === experience.id && "opacity-40",
                        dragOverExpId === experience.id &&
                          "bg-primary/5 dark:bg-primary/10 border-t-2 border-primary",
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {experience.position}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">
                            {experience.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white font-medium">
                          {experience.company}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {experience.employment_type ? (
                          <Badge variant="secondary" className="text-xs">
                            {experience.employment_type}
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDateRange(
                            experience.start_date,
                            experience.end_date,
                            experience.is_current,
                          )}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {calculateDuration(
                            experience.start_date,
                            experience.end_date,
                            experience.is_current,
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {experience.is_current ? (
                          <Badge variant="success">Current</Badge>
                        ) : (
                          <Badge variant="outline">Past</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {experience.order_index}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isReordering ? (
                          <div className="flex items-center justify-end gap-1.5 text-primary text-xs font-semibold">
                            <GripVertical className="w-4 h-4" />
                            <span>Geser</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/studio/experience/${experience.id}/edit`}
                            >
                              <Button variant="outline" size="sm" title="Edit">
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteId(experience.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
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
        title="Delete Experience"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this work experience? This action
            cannot be undone.
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
