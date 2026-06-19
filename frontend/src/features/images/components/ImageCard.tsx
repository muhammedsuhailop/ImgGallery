import { memo, useCallback, useRef, useState, type JSX } from "react";
import { Download, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import type { Image } from "@/features/images/types/image.types";
import { ImageTitleEditor } from "./ImageTitleEditor";

export interface ImageCardProps {
  image: Image;
  isUpdating: boolean;
  isDeleting: boolean;
  onUpdateTitle: (imageId: string, title: string) => void | Promise<void>;
  onReplaceFile: (imageId: string, file: File) => void | Promise<void>;
  onDelete: (imageId: string) => void | Promise<void>;
  onView: (image: Image) => void;
}

function ImageCardComponent({
  image,
  isUpdating,
  isDeleting,
  onUpdateTitle,
  onReplaceFile,
  onDelete,
  onView,
}: ImageCardProps): JSX.Element {
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      const file = e.target.files?.[0];
      if (file) {
        await onReplaceFile(image.imageId, file);
      }
      e.target.value = "";
    },
    [image.imageId, onReplaceFile],
  );

  const handleDelete = useCallback((): void => {
    if (window.confirm("Delete this image?")) {
      void onDelete(image.imageId);
    }
  }, [image.imageId, onDelete]);

  const handleSaveTitle = useCallback(
    async (title: string): Promise<void> => {
      await onUpdateTitle(image.imageId, title);
      setEditing(false);
    },
    [image.imageId, onUpdateTitle],
  );

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsDownloading(true);
      const response = await fetch(image.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      const safeTitle = image.title
        ? image.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()
        : "image";
      link.download = `${safeTitle}.jpg`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to download image:", error);
      alert("Failed to download image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="group relative flex flex-col gap-2">
      {/* Image Container with Hover Actions */}
      <div
        className="relative aspect-square w-full overflow-hidden bg-muted"
        onClick={() => onView(image)}
      >
        <img
          src={image.url}
          alt={image.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />

        {!editing && (
          <div className="absolute right-2 top-2 z-10 flex gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
            <Button
              size="sm"
              variant="secondary"
              title="Download Image"
              onClick={handleDownload}
              isLoading={isDownloading}
              onPointerDown={(e) => e.stopPropagation()}
              className="h-10 w-10 px-0"
            >
              {!isDownloading && <Download className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              title="Replace Image"
              onClick={() => fileInputRef.current?.click()}
              isLoading={isUpdating}
              onPointerDown={(e) => e.stopPropagation()}
              className="h-10 w-10 px-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              title="Delete Image"
              onClick={handleDelete}
              isLoading={isDeleting}
              onPointerDown={(e) => e.stopPropagation()}
              className="h-10 w-10 px-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Title & Edit Area */}
      <div className="flex min-h-[2rem] flex-col justify-center px-1">
        {editing ? (
          <ImageTitleEditor
            title={image.title}
            isSaving={isUpdating}
            onSave={handleSaveTitle}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-medium text-foreground">
              {image.title || "Untitled"}
            </h3>
            <Button
              size="sm"
              variant="ghost"
              title="Edit Title"
              onClick={() => setEditing(true)}
              onPointerDown={(e) => e.stopPropagation()}
              className="h-10 w-10 flex-shrink-0 px-0 text-muted-foreground hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export const ImageCard = memo(ImageCardComponent);
