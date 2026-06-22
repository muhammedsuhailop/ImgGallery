import { useEffect, useState, type JSX } from "react";
import { Check, X } from "lucide-react";
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
    <div className="flex w-full flex-col gap-1">
      <div className="flex items-center gap-1">
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
          onPointerDown={(e) => e.stopPropagation()}
          hasError={Boolean(error)}
          maxLength={100}
          autoFocus
          className="h-8 flex-1 text-sm"
        />
        <Button
          size="sm"
          variant="ghost"
          title="Save Title"
          onClick={handleSave}
          isLoading={isSaving}
          onPointerDown={(e) => e.stopPropagation()}
          className="h-10 w-10 px-0 text-green-600 hover:text-green-700"
        >
          {!isSaving && <Check className="h-4 w-4" />}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          title="Cancel"
          onClick={onCancel}
          onPointerDown={(e) => e.stopPropagation()}
          className="h-10 w-10 px-0 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
