import { useCallback, useEffect, useState, type JSX } from "react";
import { Plus } from "lucide-react";
import { useAppDispatch } from "@/app/store/hooks";
import { useImages } from "@/features/images/hooks/useImages";
import {
  createAlbumThunk,
  fetchAlbumsThunk,
} from "@/features/images/store/imageThunks";
import { clearImagesError } from "@/features/images/store/imageSlice";
import { AlbumGrid } from "@/features/images/components/AlbumGrid";
import { UploadAlbumModal } from "@/features/images/components/UploadAlbumModal";
import { AlbumFilters } from "@/features/images/components/AlbumFilters";
import { Button } from "@/shared/components/ui/Button";
import { Spinner } from "@/shared/components/feedback/Spinner";
import type {
  CreateAlbumInput,
  AlbumQueryParams,
} from "@/features/images/types/image.types";
import { Pagination } from "@/shared/components/ui/Pagination";

export function ImagesPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { albums, isLoadingAlbums, isCreatingAlbum, error, paginationMeta } =
    useImages();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [filters, setFilters] = useState<AlbumQueryParams>({
    page: 1,
    limit: 16,
    sortBy: "order",
    sortOrder: "asc",
    visibility: "all",
  });

  useEffect(() => {
    void dispatch(fetchAlbumsThunk(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    return () => {
      dispatch(clearImagesError());
    };
  }, [dispatch]);

  const handleFilterChange = useCallback(
    (updatedFilters: Partial<AlbumQueryParams>) => {
      setFilters((prev) => ({
        ...prev,
        ...updatedFilters,
      }));
    },
    [],
  );

  const handleCreateAlbum = useCallback(
    async (data: CreateAlbumInput): Promise<void> => {
      const result = await dispatch(createAlbumThunk(data));
      if (createAlbumThunk.fulfilled.match(result)) {
        setUploadOpen(false);
        setSuccessMessage("Album created successfully.");
        void dispatch(fetchAlbumsThunk(filters));
        window.setTimeout(() => setSuccessMessage(null), 3000);
      }
    },
    [dispatch, filters],
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            My Albums
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse and manage your image albums.
          </p>
        </div>
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setUploadOpen(true)}
        >
          Upload Album
        </Button>
      </header>

      <AlbumFilters filters={filters} onChange={handleFilterChange} />

      {successMessage ? (
        <div className="mb-4 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-foreground">
          {successMessage}
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      {isLoadingAlbums && albums.length === 0 ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <AlbumGrid albums={albums} />

          <Pagination
            currentPage={filters.page ?? 1}
            totalPages={paginationMeta?.totalPages ?? 1}
            onPageChange={(newPage) => handleFilterChange({ page: newPage })}
          />
        </>
      )}

      <UploadAlbumModal
        open={uploadOpen}
        isSubmitting={isCreatingAlbum}
        serverError={uploadOpen ? error : null}
        onClose={() => setUploadOpen(false)}
        onSubmit={handleCreateAlbum}
      />
    </div>
  );
}
