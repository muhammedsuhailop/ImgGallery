import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type JSX,
} from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { addImagesSchema } from "@/features/images/schemas/createAlbumSchema";

export interface UploadImagesSubmitData {
  files: File[];
  titles: string[];
}

export interface UploadImagesModalProps {
  open: boolean;
  isSubmitting: boolean;
  serverError: string | null;
  onClose: () => void;
  onSubmit: (data: UploadImagesSubmitData) => void | Promise<void>;
}

interface ImageEntry {
  id: string;
  file: File;
  previewUrl: string;
  title: string;
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function UploadImagesModal({
  open,
  isSubmitting,
  serverError,
  onClose,
  onSubmit,
}: UploadImagesModalProps): JSX.Element | null {
  const [entries, setEntries] = useState<ImageEntry[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      entries.forEach((e) => URL.revokeObjectURL(e.previewUrl));
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const parsed = addImagesSchema.safeParse({
      images: entries.map((entry) => ({
        file: entry.file,
        title: entry.title,
      })),
    });
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
      files: parsed.data.images.map((i) => i.file),
      titles: parsed.data.images.map((i) => i.title),
    });
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-images-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2
            id="upload-images-title"
            className="text-lg font-semibold text-foreground"
          >
            Add Images
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
              <ul className="flex flex-col gap-3">
                {entries.map((entry, idx) => {
                  const titleErr = errors[`images.${idx}.title`];
                  return (
                    <li
                      key={entry.id}
                      className="flex flex-col gap-3 rounded-md border border-border bg-background p-3 sm:flex-row sm:items-start"
                    >
                      <img
                        src={entry.previewUrl}
                        alt={entry.title}
                        className="h-20 w-20 flex-shrink-0 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <Input
                          value={entry.title}
                          onChange={(e) =>
                            handleTitleChange(entry.id, e.target.value)
                          }
                          hasError={Boolean(titleErr)}
                          placeholder="Title"
                          maxLength={100}
                        />
                        {titleErr ? (
                          <p
                            className="mt-1 text-xs text-destructive"
                            role="alert"
                          >
                            {titleErr}
                          </p>
                        ) : null}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => handleRemove(entry.id)}
                      >
                        Remove
                      </Button>
                    </li>
                  );
                })}
              </ul>
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
            <Button type="submit" isLoading={isSubmitting}>
              Upload Images
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
