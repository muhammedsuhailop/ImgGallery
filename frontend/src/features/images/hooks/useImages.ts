import { useAppSelector } from "@/app/store/hooks";
import {
  selectAlbums,
  selectCurrentAlbum,
  selectImagesError,
  selectIsAddingImages,
  selectIsCreatingAlbum,
  selectIsDeletingAlbum,
  selectIsDeletingImage,
  selectIsLoadingAlbum,
  selectIsLoadingAlbums,
  selectIsUpdatingAlbumTitle,
  selectIsUpdatingImage,
} from "@/features/images/store/imageSelectors";
import type { Album } from "@/features/images/types/image.types";

export interface UseImagesResult {
  albums: Album[];
  currentAlbum: Album | null;
  isLoadingAlbums: boolean;
  isLoadingAlbum: boolean;
  isCreatingAlbum: boolean;
  isUpdatingImage: boolean;
  isDeletingImage: boolean;
  isDeletingAlbum: boolean;
  isUpdatingAlbumTitle: boolean;
  isAddingImages: boolean;
  error: string | null;
}

export function useImages(): UseImagesResult {
  return {
    albums: useAppSelector(selectAlbums),
    currentAlbum: useAppSelector(selectCurrentAlbum),
    isLoadingAlbums: useAppSelector(selectIsLoadingAlbums),
    isLoadingAlbum: useAppSelector(selectIsLoadingAlbum),
    isCreatingAlbum: useAppSelector(selectIsCreatingAlbum),
    isUpdatingImage: useAppSelector(selectIsUpdatingImage),
    isDeletingImage: useAppSelector(selectIsDeletingImage),
    isDeletingAlbum: useAppSelector(selectIsDeletingAlbum),
    isUpdatingAlbumTitle: useAppSelector(selectIsUpdatingAlbumTitle),
    isAddingImages: useAppSelector(selectIsAddingImages),
    error: useAppSelector(selectImagesError),
  };
}
