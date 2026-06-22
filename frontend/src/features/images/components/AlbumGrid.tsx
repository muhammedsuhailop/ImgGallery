import { memo, type JSX } from "react";
import { AlbumCard } from "./AlbumCard";
import type { Album } from "@/features/images/types/image.types";

export interface AlbumGridProps {
  albums: Album[];
}

function AlbumGridComponent({ albums }: AlbumGridProps): JSX.Element {
  if (albums.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">
        No albums yet. Upload your first album to get started.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {albums.map((album) => (
        <AlbumCard key={album.batchId} album={album} />
      ))}
    </div>
  );
}

export const AlbumGrid = memo(AlbumGridComponent);