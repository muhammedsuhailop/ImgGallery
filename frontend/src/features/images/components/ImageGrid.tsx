import { memo, useMemo, type JSX } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ImageCard } from "./ImageCard";
import type { Image } from "@/features/images/types/image.types";

export interface ImageGridProps {
  images: Image[];
  isUpdating: boolean;
  isDeleting: boolean;
  onUpdateTitle: (imageId: string, title: string) => void | Promise<void>;
  onReplaceFile: (imageId: string, file: File) => void | Promise<void>;
  onDelete: (imageId: string) => void | Promise<void>;
  onReorder: (activeId: string, overId: string) => void; 
}

// Wrapper to make ImageCard sortable without mutating its source code
function SortableImageWrapper({
  image,
  ...props
}: { image: Image } & Omit<
  React.ComponentProps<typeof ImageCard>,
  "image"
>): JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.imageId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ImageCard image={image} {...props} />
    </div>
  );
}

function ImageGridComponent({
  images,
  isUpdating,
  isDeleting,
  onUpdateTitle,
  onReplaceFile,
  onDelete,
  onReorder,
}: ImageGridProps): JSX.Element {
  // Sensors require movement before dragging starts so button clicks still work
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const imageIds = useMemo(() => images.map((img) => img.imageId), [images]);

  if (images.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">
        This album has no images yet.
      </div>
    );
  }

  const count = images.length;
  let gridColsClass = "grid-cols-1";
  if (count === 2) gridColsClass = "grid-cols-1 sm:grid-cols-2";
  else if (count === 3)
    gridColsClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  else if (count >= 4)
    gridColsClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(active.id as string, over.id as string);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={imageIds} strategy={rectSortingStrategy}>
        <div className={`grid gap-4 ${gridColsClass}`}>
          {images.map((image) => (
            <SortableImageWrapper
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
      </SortableContext>
    </DndContext>
  );
}

export const ImageGrid = memo(ImageGridComponent);
