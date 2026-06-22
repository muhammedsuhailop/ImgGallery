import { useCallback, useEffect, useState, type JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "@/app/store/hooks";
import { useImages } from "@/features/images/hooks/useImages";
import {
  addImagesToAlbumThunk,
  deleteAlbumThunk,
  deleteImageThunk,
  fetchAlbumThunk,
  updateAlbumTitleThunk,
  updateImageThunk,
  rearrangeImagesThunk,
} from "@/features/images/store/imageThunks";
import {
  clearCurrentAlbum,
  clearImagesError,
} from "@/features/images/store/imageSlice";
import { AlbumHeader } from "@/features/images/components/AlbumHeader";
import { ImageGrid } from "@/features/images/components/ImageGrid";
import {
  UploadImagesModal,
  type UploadImagesSubmitData,
} from "@/features/images/components/UploadImagesModal";
import { PageLoader } from "@/shared/components/feedback/PageLoader";
import type { Image } from "@/features/images/types/image.types";

function moveMultipleImages(
  images: Image[],
  activeIds: string[],
  overId: string,
): Image[] {
  const overIndex = images.findIndex((img) => img.imageId === overId);
  if (overIndex === -1) return images;

  const itemsBeingDragged = images.filter((img) =>
    activeIds.includes(img.imageId),
  );
  const remainingItems = images.filter(
    (img) => !activeIds.includes(img.imageId),
  );

  const newImages = [...remainingItems];
  newImages.splice(overIndex, 0, ...itemsBeingDragged);

  return newImages;
}

export function AlbumDetailsPage(): JSX.Element {
  const { batchId } = useParams<{ batchId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    currentAlbum,
    isLoadingAlbum,
    isUpdatingImage,
    isDeletingImage,
    isDeletingAlbum,
    isUpdatingAlbumTitle,
    isAddingImages,
    error,
  } = useImages();

  const [addOpen, setAddOpen] = useState(false);
  const [localImages, setLocalImages] = useState<Image[]>(
    currentAlbum?.images ?? [],
  );

  useEffect(() => {
    if (batchId) {
      void dispatch(fetchAlbumThunk(batchId));
    }
    return () => {
      dispatch(clearCurrentAlbum());
      dispatch(clearImagesError());
    };
  }, [batchId, dispatch]);

  useEffect(() => {
    if (currentAlbum) {
      setLocalImages(currentAlbum.images);
    }
  }, [currentAlbum]);

  const handleBack = useCallback((): void => {
    navigate("/images");
  }, [navigate]);

  const handleSaveTitle = useCallback(
    async (title: string): Promise<void> => {
      if (!batchId) return;
      await dispatch(updateAlbumTitleThunk({ batchId, title }));
    },
    [batchId, dispatch],
  );

  const handleDeleteAlbum = useCallback(async (): Promise<void> => {
    if (!batchId) return;
    if (!window.confirm("Delete this album and all images?")) return;
    const result = await dispatch(deleteAlbumThunk(batchId));
    if (deleteAlbumThunk.fulfilled.match(result)) {
      navigate("/images");
    }
  }, [batchId, dispatch, navigate]);

  const handleUpdateTitle = useCallback(
    async (imageId: string, title: string): Promise<void> => {
      if (!batchId) return;
      await dispatch(updateImageThunk({ batchId, imageId, title }));
    },
    [batchId, dispatch],
  );

  const handleReplaceFile = useCallback(
    async (imageId: string, file: File): Promise<void> => {
      if (!batchId) return;
      await dispatch(updateImageThunk({ batchId, imageId, file }));
    },
    [batchId, dispatch],
  );

  const handleDeleteImage = useCallback(
    async (imageId: string): Promise<void> => {
      if (!batchId) return;
      setLocalImages((prev) => prev.filter((img) => img.imageId !== imageId));
      await dispatch(deleteImageThunk({ batchId, imageId }));
    },
    [batchId, dispatch],
  );

  const handleAddImages = useCallback(
    async (data: UploadImagesSubmitData): Promise<void> => {
      if (!batchId) return;
      const result = await dispatch(
        addImagesToAlbumThunk({
          batchId,
          files: data.files,
          titles: data.titles,
        }),
      );
      if (addImagesToAlbumThunk.fulfilled.match(result)) {
        setAddOpen(false);
      }
    },
    [batchId, dispatch],
  );

  const handleReorder = useCallback(
    async (activeIds: string[], overId: string): Promise<void> => {
      if (!batchId) return;

      const newArray = moveMultipleImages(localImages, activeIds, overId);

      setLocalImages(newArray);

      const orderedImages = newArray.map((img, index) => ({
        imageId: img.imageId,
        order: index,
      }));

      await dispatch(rearrangeImagesThunk({ batchId, orderedImages }));
    },
    [batchId, localImages, dispatch],
  );

  if (isLoadingAlbum && !currentAlbum) {
    return <PageLoader />;
  }

  if (!currentAlbum) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            {error ?? "Album not found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <AlbumHeader
        album={currentAlbum}
        isSavingTitle={isUpdatingAlbumTitle}
        isDeleting={isDeletingAlbum}
        onBack={handleBack}
        onSaveTitle={handleSaveTitle}
        onAddImages={() => setAddOpen(true)}
        onDeleteAlbum={handleDeleteAlbum}
      />

      {error ? (
        <div
          role="alert"
          className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      <section className="mt-6">
        <ImageGrid
          images={localImages}
          isUpdating={isUpdatingImage}
          isDeleting={isDeletingImage}
          onUpdateTitle={handleUpdateTitle}
          onReplaceFile={handleReplaceFile}
          onDelete={handleDeleteImage}
          onReorder={handleReorder}
        />
      </section>

      <UploadImagesModal
        open={addOpen}
        isSubmitting={isAddingImages}
        serverError={addOpen ? error : null}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAddImages}
      />
    </div>
  );
}
