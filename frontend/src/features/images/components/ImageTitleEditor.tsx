import { useEffect, useState, type JSX } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { updateImageSchema } from "@/features/images/schemas/updateImageSchema";

export interface ImageTitleEditorProps {
  title: string;
  isSaving: boolean;
  onSave: (title: string) => void | Promise<void>;
  onCancel: () => void;
}

export function ImageTitleEditor({
  title,
  isSaving,
  onSave,
  onCancel,
}: ImageTitleEditorProps): JSX.Element {
  const [value, setValue] = useState<string>(title);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(title);
  }, [title]);

  const handleSave = async (): Promise<void> => {
    const result = updateImageSchema.safeParse({ title: value });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid title");
      return;
    }
    setError(null);
    await onSave(result.data.title);
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          e.stopPropagation();

          if (e.key === "Enter") {
            void handleSave();
          } else if (e.key === "Escape") {
            onCancel();
          }
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        hasError={Boolean(error)}
        maxLength={100}
        autoFocus
      />
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} isLoading={isSaving}>
          Save
        </Button>
        <Button size="sm" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
