import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type JSX,
} from "react";
import { X, GripVertical } from "lucide-react";
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
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { FormField } from "@/shared/components/ui/FormField";
import { createAlbumSchema } from "@/features/images/schemas/createAlbumSchema";
import type {
  CreateAlbumInput,
  Visibility,
} from "@/features/images/types/image.types";

export interface UploadAlbumModalProps {
  open: boolean;
  isSubmitting: boolean;
  serverError: string | null;
  onClose: () => void;
  onSubmit: (data: CreateAlbumInput) => void | Promise<void>;
}

interface ImageEntry {
  id: string;
  file: File;
  previewUrl: string;
  title: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface SortableImageEntryProps {
  entry: ImageEntry;
  titleErr?: string;
  sizeErr?: string;
  onTitleChange: (id: string, value: string) => void;
  onRemove: (id: string) => void;
}

function SortableImageEntryItem({
  entry,
  titleErr,
  sizeErr,
  onTitleChange,
  onRemove,
}: SortableImageEntryProps): JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex flex-col gap-3 rounded-md border bg-background p-3 sm:flex-row sm:items-start ${
        sizeErr ? "border-destructive/50 bg-destructive/5" : "border-border"
      }`}
    >
      {/* Drag Handle Element */}
      <div
        {...attributes}
        {...listeners}
        className="mt-2 flex cursor-grab items-center justify-center text-muted-foreground hover:text-foreground active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      <img
        src={entry.previewUrl}
        alt={entry.title}
        className="h-20 w-20 flex-shrink-0 rounded-md object-cover"
      />
      <div className="flex-1">
        <Input
          value={entry.title}
          onChange={(e) => onTitleChange(entry.id, e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          hasError={Boolean(titleErr || sizeErr)}
          placeholder="Title"
          maxLength={100}
        />
        {titleErr ? (
          <p className="mt-1 text-xs text-destructive" role="alert">
            {titleErr}
          </p>
        ) : null}
        {sizeErr ? (
          <p className="mt-1 text-xs text-destructive font-medium" role="alert">
            {sizeErr}
          </p>
        ) : null}
      </div>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={() => onRemove(entry.id)}
      >
        Remove
      </Button>
    </li>
  );
}

export function UploadAlbumModal({
  open,
  isSubmitting,
  serverError,
  onClose,
  onSubmit,
}: UploadAlbumModalProps): JSX.Element | null {
  const [title, setTitle] = useState<string>("");
  const [visibility, setVisibility] = useState<Visibility>("private");
  const [entries, setEntries] = useState<ImageEntry[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasSizeError = entries.some((e) => e.file.size > MAX_FILE_SIZE);

  // Set up DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (!open) {
      entries.forEach((e) => URL.revokeObjectURL(e.previewUrl));
      setTitle("");
      setVisibility("private");
      setEntries([]);
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    return () => {
      entries.forEach((e) => URL.revokeObjectURL(e.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiles = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const next: ImageEntry[] = files.map((file) => ({
      id: makeId(),
      file,
      previewUrl: URL.createObjectURL(file),
      title: file.name.replace(/\.[^.]+$/, ""),
    }));
    setEntries((prev) => [...prev, ...next]);
    e.target.value = "";
  }, []);

  const handleRemove = useCallback((id: string): void => {
    setEntries((prev) => {
      const target = prev.find((e) => e.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((e) => e.id !== id);
    });
  }, []);

  const handleTitleChange = useCallback((id: string, value: string): void => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, title: value } : e)),
    );
  }, []);

  // Handle Drag Reordering
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setEntries((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (hasSizeError) return;

    const payload = {
      title,
      visibility,
      images: entries.map((entry) => ({
        file: entry.file,
        title: entry.title,
      })),
    };
    const parsed = createAlbumSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path.join(".") || "form";
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    await onSubmit({
      title: parsed.data.title,
      visibility: parsed.data.visibility,
      files: parsed.data.images.map((i) => i.file),
      titles: parsed.data.images.map((i) => i.title),
    });
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-album-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2
            id="upload-album-title"
            className="text-lg font-semibold text-foreground"
          >
            Upload Album
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-4 overflow-y-auto p-6"
          noValidate
        >
          <FormField
            id="album-title"
            label="Album Title"
            required
            error={errors.title}
          >
            <Input
              id="album-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              hasError={Boolean(errors.title)}
              placeholder="My Pets"
              maxLength={100}
            />
          </FormField>

          <FormField
            id="album-visibility"
            label="Visibility"
            required
            error={errors.visibility}
          >
            <div className="flex gap-4">
              {(["private", "public"] as const).map((v) => (
                <label
                  key={v}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={v}
                    checked={visibility === v}
                    onChange={() => setVisibility(v)}
                  />
                  <span className="capitalize">{v}</span>
                </label>
              ))}
            </div>
          </FormField>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Images <span className="text-destructive">*</span>
              </span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                Add Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFiles}
              />
            </div>
            {errors.images ? (
              <p className="mb-2 text-xs text-destructive" role="alert">
                {errors.images}
              </p>
            ) : null}

            {entries.length === 0 ? (
              <div className="rounded-md border border-dashed border-border bg-background/50 p-6 text-center text-sm text-muted-foreground">
                No images selected.
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={entries.map((e) => e.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <ul className="flex flex-col gap-3">
                    {entries.map((entry, idx) => {
                      const sizeErr =
                        entry.file.size > MAX_FILE_SIZE
                          ? "Image size exceeds the 5MB limit."
                          : undefined;
                      return (
                        <SortableImageEntryItem
                          key={entry.id}
                          entry={entry}
                          titleErr={errors[`images.${idx}.title`]}
                          sizeErr={sizeErr}
                          onTitleChange={handleTitleChange}
                          onRemove={handleRemove}
                        />
                      );
                    })}
                  </ul>
                </SortableContext>
              </DndContext>
            )}
          </div>

          {serverError ? (
            <div
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {serverError}
            </div>
          ) : null}

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={hasSizeError}
            >
              Create Album
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
