import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store/store";
import type { Album } from "@/features/images/types/image.types";

const selectImagesState = (state: RootState) => state.images;

export const selectAlbums = createSelector(
  selectImagesState,
  (s): Album[] => s.albums,
);

export const selectCurrentAlbum = createSelector(
  selectImagesState,
  (s): Album | null => s.currentAlbum,
);

export const selectImagesLoading = createSelector(
  selectImagesState,
  (s): boolean =>
    s.isLoadingAlbums ||
    s.isLoadingAlbum ||
    s.isCreatingAlbum ||
    s.isUpdatingImage ||
    s.isDeletingImage ||
    s.isDeletingAlbum ||
    s.isUpdatingAlbumTitle ||
    s.isAddingImages,
);

export const selectImagesError = createSelector(
  selectImagesState,
  (s): string | null => s.error,
);

export const selectIsLoadingAlbums = createSelector(
  selectImagesState,
  (s): boolean => s.isLoadingAlbums,
);
export const selectIsLoadingAlbum = createSelector(
  selectImagesState,
  (s): boolean => s.isLoadingAlbum,
);
export const selectIsCreatingAlbum = createSelector(
  selectImagesState,
  (s): boolean => s.isCreatingAlbum,
);
export const selectIsUpdatingImage = createSelector(
  selectImagesState,
  (s): boolean => s.isUpdatingImage,
);
export const selectIsDeletingImage = createSelector(
  selectImagesState,
  (s): boolean => s.isDeletingImage,
);
export const selectIsDeletingAlbum = createSelector(
  selectImagesState,
  (s): boolean => s.isDeletingAlbum,
);
export const selectIsUpdatingAlbumTitle = createSelector(
  selectImagesState,
  (s): boolean => s.isUpdatingAlbumTitle,
);
export const selectIsAddingImages = createSelector(
  selectImagesState,
  (s): boolean => s.isAddingImages,
);
