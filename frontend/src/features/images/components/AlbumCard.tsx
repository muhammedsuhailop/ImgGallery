import { memo, type JSX } from "react";
import { Link } from "react-router-dom";
import { Lock, Globe } from "lucide-react";
import type { Album } from "@/features/images/types/image.types";

export interface AlbumCardProps {
  album: Album;
}

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function AlbumCardComponent({ album }: AlbumCardProps): JSX.Element {
  const cover = album.images[0];
  const isPrivate = album.visibility === "private";

  return (
    <Link
      to={`/images/${album.batchId}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {cover ? (
          <img
            src={cover.url}
            alt={cover.title || album.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No images
          </div>
        )}
        <span
          className={`absolute right-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
            isPrivate
              ? "bg-background/90 text-foreground"
              : "bg-primary/90 text-primary-foreground"
          }`}
        >
          {isPrivate ? (
            <Lock className="h-3 w-3" />
          ) : (
            <Globe className="h-3 w-3" />
          )}
          {isPrivate ? "Private" : "Public"}
        </span>
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h3 className="truncate text-base font-semibold text-foreground">
          {album.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {album.images.length} {album.images.length === 1 ? "Image" : "Images"}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(album.createdAt)}
        </p>
      </div>
    </Link>
  );
}

export const AlbumCard = memo(AlbumCardComponent);
