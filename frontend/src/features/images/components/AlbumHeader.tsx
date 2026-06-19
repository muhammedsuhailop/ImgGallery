import type { JSX } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { AlbumTitleEditor } from "./AlbumTitleEditor";
import type { Album } from "@/features/images/types/image.types";

export interface AlbumHeaderProps {
  album: Album;
  isSavingTitle: boolean;
  isDeleting: boolean;
  onBack: () => void;
  onSaveTitle: (title: string) => void | Promise<void>;
  onAddImages: () => void;
  onDeleteAlbum: () => void;
}

export function AlbumHeader({
  album,
  isSavingTitle,
  isDeleting,
  onBack,
  onSaveTitle,
  onAddImages,
  onDeleteAlbum,
}: AlbumHeaderProps): JSX.Element {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to albums
      </button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <AlbumTitleEditor
            title={album.title}
            isSaving={isSavingTitle}
            onSave={onSaveTitle}
          />
          <p className="mt-1 text-sm text-muted-foreground">
            {album.images.length}{" "}
            {album.images.length === 1 ? "Image" : "Images"} ·{" "}
            <span className="capitalize">{album.visibility}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="md"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={onAddImages}
          >
            Add Images
          </Button>
          <Button
            size="md"
            variant="danger"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={onDeleteAlbum}
            isLoading={isDeleting}
          >
            Delete Album
          </Button>
        </div>
      </div>
    </div>
  );
}
