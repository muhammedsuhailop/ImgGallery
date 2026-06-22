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
  onDeleteAlbum: () => void;
}

export function AlbumHeader({
  album,
  isSavingTitle,
  isDeleting,
  onBack,
  onSaveTitle,
  onDeleteAlbum,
}: AlbumHeaderProps): JSX.Element {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-border pb-6 pt-2">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex w-fit items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to albums
      </button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <AlbumTitleEditor
            title={album.title}
            isSaving={isSavingTitle}
            onSave={onSaveTitle}
          />
          <p className="mt-2 text-sm text-muted-foreground">
            {album.images.length}{" "}
            {album.images.length === 1 ? "Image" : "Images"} ·{" "}
            <span className="capitalize">{album.visibility}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="md"
            variant="danger"
            title="Delete Album"
            onClick={onDeleteAlbum}
            isLoading={isDeleting}
            className="px-3"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
