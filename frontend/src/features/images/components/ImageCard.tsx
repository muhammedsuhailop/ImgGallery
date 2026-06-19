import { memo, useCallback, useRef, useState, type JSX } from "react";
import { Pencil, RefreshCw, Trash2 } from "lucide-react";
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
}

function ImageCardComponent({
  image,
  isUpdating,
  isDeleting,
  onUpdateTitle,
  onReplaceFile,
  onDelete,
}: ImageCardProps): JSX.Element {
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="aspect-square w-full overflow-hidden bg-muted">
        <img
          src={image.url}
          alt={image.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        {editing ? (
          <ImageTitleEditor
            title={image.title}
            isSaving={isUpdating}
            onSave={handleSaveTitle}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <>
            <h3 className="truncate text-sm font-semibold text-foreground">
              {image.title || "Untitled"}
            </h3>
            <div className="mt-auto flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<Pencil className="h-3.5 w-3.5" />}
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                onClick={() => fileInputRef.current?.click()}
                isLoading={isUpdating}
              >
                Replace
              </Button>
              <Button
                size="sm"
                variant="danger"
                leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                Delete
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export const ImageCard = memo(ImageCardComponent);
