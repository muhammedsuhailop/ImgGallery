import { memo, useMemo, useState, useCallback, type JSX } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
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
import { ImageModal } from "./ImageModal";

export interface ImageGridProps {
  images: Image[];
  isUpdating: boolean;
  isDeleting: boolean;
  onUpdateTitle: (imageId: string, title: string) => void | Promise<void>;
  onReplaceFile: (imageId: string, file: File) => void | Promise<void>;
  onDelete: (imageId: string) => void | Promise<void>;
  onReorder: (activeIds: string[], overId: string) => void;
}

function SortableImageWrapper({
  image,
  isSelected,
  onSelectToggle,
  onView,
  ...props
}: {
  image: Image;
  isSelected: boolean;
  onSelectToggle: (id: string) => void;
  onView: (image: Image) => void;
} & Omit<
  React.ComponentProps<typeof ImageCard>,
  "image" | "isSelected" | "onSelectToggle" | "onView"
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
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ImageCard
        image={image}
        isSelected={isSelected}
        onSelectToggle={onSelectToggle}
        onView={onView}
        {...props}
      />
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
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const imageIds = useMemo(() => images.map((img) => img.imageId), [images]);
  const activeImage = useMemo(
    () => images.find((img) => img.imageId === activeDragId),
    [activeDragId, images],
  );

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }, []);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveDragId(active.id as string);

    if (!selectedIds.has(active.id as string)) {
      setSelectedIds(new Set([active.id as string]));
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over } = event;
    setActiveDragId(null);

    if (over && selectedIds.size > 0) {
      const isDroppingOnSelf = selectedIds.has(over.id as string);

      if (!isDroppingOnSelf) {
        onReorder(Array.from(selectedIds), over.id as string);
      }
    }

    setSelectedIds(new Set());
  }

  if (images.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
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

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveDragId(null)}
      >
        <SortableContext items={imageIds} strategy={rectSortingStrategy}>
          <div className={`grid gap-6 ${gridColsClass}`}>
            {images.map((image) => (
              <SortableImageWrapper
                key={image.imageId}
                image={image}
                isSelected={selectedIds.has(image.imageId)}
                onSelectToggle={toggleSelection}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
                onUpdateTitle={onUpdateTitle}
                onReplaceFile={onReplaceFile}
                onDelete={onDelete}
                onView={setSelectedImage}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeDragId && activeImage ? (
            <div className="relative">
              <ImageCard
                image={activeImage}
                isUpdating={false}
                isDeleting={false}
                isSelected={true}
              />
              {selectedIds.size > 1 && (
                <div className="absolute -right-3 -top-3 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-lg">
                  {selectedIds.size}
                </div>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage.url}
          title={selectedImage.title}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}

export const ImageGrid = memo(ImageGridComponent);
