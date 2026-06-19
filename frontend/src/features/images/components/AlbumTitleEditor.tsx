import { useEffect, useState, type JSX } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { updateAlbumTitleSchema } from "@/features/images/schemas/updateImageSchema";

export interface AlbumTitleEditorProps {
  title: string;
  isSaving: boolean;
  onSave: (title: string) => void | Promise<void>;
}

export function AlbumTitleEditor({
  title,
  isSaving,
  onSave,
}: AlbumTitleEditorProps): JSX.Element {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<string>(title);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(title);
  }, [title]);

  const handleSave = async (): Promise<void> => {
    const result = updateAlbumTitleSchema.safeParse({ title: value });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid title");
      return;
    }
    setError(null);
    await onSave(result.data.title);
    setEditing(false);
  };

  const handleCancel = (): void => {
    setValue(title);
    setError(null);
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label="Edit album title"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          hasError={Boolean(error)}
          maxLength={100}
          autoFocus
          className="sm:max-w-md"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} isLoading={isSaving}>
            Save
          </Button>
          <Button size="sm" variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
