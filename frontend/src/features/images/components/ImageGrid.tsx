import { memo, type JSX } from "react";
import { ImageCard } from "./ImageCard";
import type { Image } from "@/features/images/types/image.types";

export interface ImageGridProps {
  images: Image[];
  isUpdating: boolean;
  isDeleting: boolean;
  onUpdateTitle: (imageId: string, title: string) => void | Promise<void>;
  onReplaceFile: (imageId: string, file: File) => void | Promise<void>;
  onDelete: (imageId: string) => void | Promise<void>;
}

function ImageGridComponent({
  images,
  isUpdating,
  isDeleting,
  onUpdateTitle,
  onReplaceFile,
  onDelete,
}: ImageGridProps): JSX.Element {
  if (images.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">
        This album has no images yet.
      </div>
    );
  }

  // Determine grid columns dynamically based on item count up to a maximum of 4
  const count = images.length;
  let gridColsClass = "grid-cols-1";

  if (count === 2) {
    gridColsClass = "grid-cols-1 sm:grid-cols-2";
  } else if (count === 3) {
    gridColsClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  } else if (count >= 4) {
    gridColsClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
  }

  return (
    <div className={`grid gap-4 ${gridColsClass}`}>
      {images.map((image) => (
        <ImageCard
          key={image.imageId}
          image={image}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          onUpdateTitle={onUpdateTitle}
          onReplaceFile={onReplaceFile}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export const ImageGrid = memo(ImageGridComponent);
