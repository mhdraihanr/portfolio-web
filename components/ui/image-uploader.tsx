"use client";

import { useState, useRef } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // Get auth parameters
      const authResponse = await fetch("/api/imagekit-auth");
      if (!authResponse.ok) {
        throw new Error("Failed to get authentication parameters");
      }
      const authParams = await authResponse.json();

      // Upload each file sequentially
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("fileName", file.name);
          formData.append("folder", "/portfolio");
          formData.append("publicKey", authParams.publicKey);
          formData.append("signature", authParams.signature);
          formData.append("expire", authParams.expire);
          formData.append("token", authParams.token);

          // Upload to ImageKit
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
                  reject(new Error(`Upload failed: ${xhr.statusText}`));
                }
              });

              xhr.addEventListener("error", () => {
                reject(new Error("Network error during upload"));
              });

              xhr.open(
                "POST",
                "https://upload.imagekit.io/api/v1/files/upload",
              );
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
              index === i ? { ...item, status: "error" } : item,
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
        throw new Error("Failed to delete image");
      }

      // Call parent callback to update state
      onDelete?.(image, index);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete image. Please try again.");
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
            </div>
          ))}
        </div>
      )}

      {/* Current Images Preview */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {currentImages.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.url}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                }}
              />
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
          ))}
        </div>
      )}
    </div>
  );
}
