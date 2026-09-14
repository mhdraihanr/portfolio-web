"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Upload, Trash2 } from "lucide-react";
import { Button } from "./button";
import { Spinner } from "./spinner";

export interface UploadedImage {
  url: string;
  fileId: string;
}

interface ImageUploaderProps {
  onUploadComplete: (images: UploadedImage[]) => void;
  onDelete?: (image: UploadedImage, index: number) => void;
  multiple?: boolean;
  maxFiles?: number;
  currentImages?: UploadedImage[];
  disabled?: boolean;
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: "uploading" | "success" | "error";
  url?: string;
  fileId?: string;
  error?: string;
}

export function ImageUploader({
  onUploadComplete,
  onDelete,
  multiple = false,
  maxFiles = 5,
  currentImages = [],
  disabled = false,
}: ImageUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [missingIndexes, setMissingIndexes] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // The list can be reordered or replaced by the parent form, so stale indexes
  // would flag the wrong thumbnails.
  useEffect(() => {
    setMissingIndexes([]);
  }, [currentImages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check max files limit
    const totalFiles = currentImages.length + files.length;
    if (multiple && totalFiles > maxFiles) {
      alert(
        `Maximum ${maxFiles} files allowed. You already have ${currentImages.length} file(s).`,
      );
      return;
    }

    setIsUploading(true);
    const uploadedImages: UploadedImage[] = [];

    // Initialize progress for all files
    const initialProgress: UploadProgress[] = files.map((file) => ({
      fileName: file.name,
      progress: 0,
      status: "uploading" as const,
    }));
    setUploadProgress(initialProgress);

    try {
      // Upload each file sequentially
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          const formData = new FormData();
          formData.append("file", file);

          // Upload through our own route so the ImageKit private key stays on
          // the server and the bytes are validated before they are stored.
          const xhr = new XMLHttpRequest();
          const uploadPromise = new Promise<UploadedImage>(
            (resolve, reject) => {
              xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                  const percentComplete = Math.round(
                    (event.loaded / event.total) * 100,
                  );
                  setUploadProgress((prev) =>
                    prev.map((item, index) =>
                      index === i
                        ? { ...item, progress: percentComplete }
                        : item,
                    ),
                  );
                }
              });

              xhr.addEventListener("load", () => {
                if (xhr.status === 200) {
                  const response = JSON.parse(xhr.responseText);
                  resolve({ url: response.url, fileId: response.fileId });
                } else {
                  const message =
                    (() => {
                      try {
                        return JSON.parse(xhr.responseText).error;
                      } catch {
                        return null;
                      }
                    })() ?? `Upload failed (${xhr.status})`;
                  reject(new Error(message));
                }
              });

              xhr.addEventListener("error", () => {
                reject(new Error("Network error during upload"));
              });

              xhr.open("POST", "/api/imagekit-upload");
              xhr.send(formData);
            },
          );

          const uploadedImage = await uploadPromise;
          uploadedImages.push(uploadedImage);

          // Update progress as success
          setUploadProgress((prev) =>
            prev.map((item, index) =>
              index === i
                ? {
                    ...item,
                    progress: 100,
                    status: "success",
                    url: uploadedImage.url,
                    fileId: uploadedImage.fileId,
                  }
                : item,
            ),
          );
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          setUploadProgress((prev) =>
            prev.map((item, index) =>
              index === i
                ? {
                    ...item,
                    status: "error",
                    error:
                      error instanceof Error ? error.message : "Upload failed",
                  }
                : item,
            ),
          );
        }
      }

      // Call callback with successful uploads
      if (uploadedImages.length > 0) {
        onUploadComplete(uploadedImages);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      // Clear progress after 2 seconds
      setTimeout(() => {
        setUploadProgress([]);
      }, 2000);
    }
  };

  const handleDelete = async (image: UploadedImage, index: number) => {
    if (deletingIndex !== null) return;

    setDeletingIndex(index);

    try {
      // Delete from ImageKit
      const response = await fetch("/api/imagekit-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileId: image.fileId }),
      });

      if (!response.ok) {
        // The server distinguishes "already gone" from real failures, and that
        // detail is the only way to tell why the delete was refused. Falling
        // back to a generic line would hide it again.
        const serverMessage = await response
          .json()
          .then((body: { error?: string }) => body.error)
          .catch(() => null);

        throw new Error(
          serverMessage || `Delete failed (HTTP ${response.status})`,
        );
      }

      // Call parent callback to update state
      onDelete?.(image, index);
    } catch (error) {
      console.error("Delete error:", error);
      alert(
        error instanceof Error
          ? `Gagal menghapus gambar: ${error.message}`
          : "Failed to delete image. Please try again.",
      );
    } finally {
      setDeletingIndex(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className="hidden"
        />
        <Button
          type="button"
          onClick={handleButtonClick}
          disabled={disabled || isUploading}
          variant="outline"
          className="w-full"
        >
          {isUploading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {multiple ? "Upload Images" : "Upload Image"}
            </>
          )}
        </Button>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {multiple
            ? `Max ${maxFiles} files. Current: ${currentImages.length}/${maxFiles}`
            : "Upload a single image"}
        </p>
      </div>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="space-y-2">
          {uploadProgress.map((progress, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate flex-1 mr-2">
                  {progress.fileName}
                </span>
                {progress.status === "uploading" && (
                  <span className="text-gray-500">{progress.progress}%</span>
                )}
                {progress.status === "success" && (
                  <span className="text-green-600 dark:text-green-400">✓</span>
                )}
                {progress.status === "error" && (
                  <span className="text-red-600 dark:text-red-400">✕</span>
                )}
              </div>
              {progress.status === "uploading" && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
              )}
              {progress.status === "error" && progress.error && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {progress.error}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Current Images Preview */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {currentImages.map((image, index) => {
            const isMissing = missingIndexes.includes(index);

            return (
              <div key={index} className="relative group">
                <Image
                  src={image.url}
                  alt={`Upload ${index + 1}`}
                  width={160}
                  height={128}
                  unoptimized
                  onError={() =>
                    setMissingIndexes((prev) =>
                      prev.includes(index) ? prev : [...prev, index],
                    )
                  }
                  className={`w-full h-32 object-cover rounded-lg border ${
                    isMissing
                      ? "border-red-400 dark:border-red-500/70 opacity-40"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {/* An already-removed file still has a database row, so the
                    broken image is the only visible hint that it needs
                    deleting. */}
                {isMissing && (
                  <span className="absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded bg-red-500 text-white">
                    File hilang di ImageKit
                  </span>
                )}
                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleDelete(image, index)}
                  disabled={deletingIndex !== null || disabled}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
                  title="Delete image"
                >
                  {deletingIndex === index ? (
                    <Spinner size="sm" className="w-4 h-4" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
