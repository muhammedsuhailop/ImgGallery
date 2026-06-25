import type { JSX } from "react";
import { RotateCcw } from "lucide-react";
import type {
  SortByField,
  SortOrder,
  VisibilityFilter,
  AlbumQueryParams,
} from "../types/image.types";

interface AlbumFiltersProps {
  filters: AlbumQueryParams;
  onChange: (updatedFilters: Partial<AlbumQueryParams>) => void;
}

const defaultFilters: Partial<AlbumQueryParams> = {
  visibility: "all",
  sortBy: "order",
  sortOrder: "asc",
  page: 1,
};

export function AlbumFilters({
  filters,
  onChange,
}: AlbumFiltersProps): JSX.Element {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between rounded-md border bg-card px-3 py-2">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Visibility</span>
          <select
            value={filters.visibility ?? "all"}
            onChange={(e) =>
              onChange({
                visibility: e.target.value as VisibilityFilter,
                page: 1,
              })
            }
            className="h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Sort</span>
          <select
            value={filters.sortBy ?? "order"}
            onChange={(e) =>
              onChange({
                sortBy: e.target.value as SortByField,
              })
            }
            className="h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="order">Order</option>
            <option value="title">Title</option>
            <option value="createdAt">Created</option>
            <option value="updatedAt">Updated</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Order</span>
          <select
            value={filters.sortOrder ?? "asc"}
            onChange={(e) =>
              onChange({
                sortOrder: e.target.value as SortOrder,
              })
            }
            className="h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="asc">↑ Asc</option>
            <option value="desc">↓ Desc</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Items</span>
        <select
          value={filters.limit ?? 16}
          onChange={(e) =>
            onChange({
              limit: Number(e.target.value),
              page: 1,
            })
          }
          className="h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value={8}>8</option>
          <option value={16}>16</option>
          <option value={32}>32</option>
          <option value={64}>64</option>
          <option value={80}>80</option>
          <option value={100}>100</option>
        </select>
      </div>

      <button
        type="button"
        onClick={() => onChange(defaultFilters)}
        className="flex h-8 items-center gap-1 rounded-md border border-input px-3 text-sm hover:bg-muted"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset
      </button>
    </div>
  );
}
