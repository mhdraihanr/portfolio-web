"use client";

import { useState } from "react";
import { Plus, X, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { DeviconPicker } from "@/components/admin/devicon-picker";
import type { Technology } from "@/types/project";

interface TechnologyInputProps {
  value: Technology[];
  onChange: (technologies: Technology[]) => void;
  error?: string;
}

export function TechnologyInput({
  value,
  onChange,
  error,
}: TechnologyInputProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempTech, setTempTech] = useState<Technology>({
    name: "",
    icon: null,
    icon_svg: null,
  });

  const handleAddNew = () => {
    setEditingIndex(null);
    setTempTech({ name: "", icon: null, icon_svg: null });
    setIsPickerOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setTempTech(value[index]);
    setIsPickerOpen(true);
  };

  const handleSelect = (data: { icon: string; icon_svg: string }) => {
    const newTech: Technology = {
      name: tempTech.name || extractNameFromIcon(data.icon),
      icon: data.icon || null,
      icon_svg: data.icon_svg || null,
    };

    if (editingIndex !== null) {
      // Update existing
      const updated = [...value];
      updated[editingIndex] = newTech;
      onChange(updated);
    } else {
      // Add new
      onChange([...value, newTech]);
    }

    setIsPickerOpen(false);
    setTempTech({ name: "", icon: null, icon_svg: null });
    setEditingIndex(null);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const extractNameFromIcon = (icon: string): string => {
    // Extract name from devicon class (e.g., "devicon-react-original colored" -> "React")
    const match = icon.match(/devicon-([a-z0-9]+)-/i);
    if (match && match[1]) {
      return match[1].charAt(0).toUpperCase() + match[1].slice(1);
    }
    return "Technology";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Technologies Used</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddNew}
          className="h-8"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Technology
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Technology List */}
      {value.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {value.map((tech, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
            >
              {/* Icon Preview */}
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                {tech.icon_svg ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tech.icon_svg}
                    alt={tech.name}
                    className="w-6 h-6 object-contain"
                  />
                ) : tech.icon ? (
                  <i className={`${tech.icon} text-2xl`}></i>
                ) : (
                  <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded" />
                )}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {tech.name}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(index)}
                  className="h-7 w-7 p-0"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No technologies added yet. Click &quot;Add Technology&quot; to get
            started.
          </p>
        </div>
      )}

      {/* Devicon Picker Modal */}
      <Modal
        isOpen={isPickerOpen}
        onClose={() => {
          setIsPickerOpen(false);
          setTempTech({ name: "", icon: null, icon_svg: null });
          setEditingIndex(null);
        }}
        title={editingIndex !== null ? "Edit Technology" : "Add Technology"}
        size="lg"
      >
        <DeviconPicker
          value={tempTech.icon || undefined}
          valueSvg={tempTech.icon_svg || undefined}
          onSelect={handleSelect}
        />
      </Modal>
    </div>
  );
}
