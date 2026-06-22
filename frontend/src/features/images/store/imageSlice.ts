import { createSlice } from "@reduxjs/toolkit";
import type { ImageState } from "@/features/images/types/image.types";
import {
  addImagesToAlbumThunk,
  createAlbumThunk,
  deleteAlbumThunk,
  deleteImageThunk,
  fetchAlbumThunk,
  fetchAlbumsThunk,
  rearrangeImagesThunk,
  updateAlbumTitleThunk,
  updateImageThunk,
} from "./imageThunks";

const initialState: ImageState = {
  albums: [],
  currentAlbum: null,
  isLoadingAlbums: false,
  isLoadingAlbum: false,
  isCreatingAlbum: false,
  isUpdatingImage: false,
  isDeletingImage: false,
  isDeletingAlbum: false,
  isUpdatingAlbumTitle: false,
  isAddingImages: false,
  isRearrangingImages:false,
  error: null,
};

const imageSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    clearImagesError: (state) => {
      state.error = null;
    },
    clearCurrentAlbum: (state) => {
      state.currentAlbum = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbumsThunk.pending, (state) => {
        state.isLoadingAlbums = true;
        state.error = null;
      })
      .addCase(fetchAlbumsThunk.fulfilled, (state, action) => {
        state.isLoadingAlbums = false;
        state.albums = action.payload;
      })
      .addCase(fetchAlbumsThunk.rejected, (state, action) => {
        state.isLoadingAlbums = false;
        state.error = action.payload ?? "Failed to load albums.";
      })
      .addCase(fetchAlbumThunk.pending, (state) => {
        state.isLoadingAlbum = true;
        state.error = null;
      })
      .addCase(fetchAlbumThunk.fulfilled, (state, action) => {
        state.isLoadingAlbum = false;
        state.currentAlbum = action.payload;
      })
      .addCase(fetchAlbumThunk.rejected, (state, action) => {
        state.isLoadingAlbum = false;
        state.error = action.payload ?? "Failed to load album.";
      })
      .addCase(createAlbumThunk.pending, (state) => {
        state.isCreatingAlbum = true;
        state.error = null;
      })
      .addCase(createAlbumThunk.fulfilled, (state, action) => {
        state.isCreatingAlbum = false;
        if (action.payload) {
          state.albums = [action.payload, ...state.albums];
        }
      })
      .addCase(createAlbumThunk.rejected, (state, action) => {
        state.isCreatingAlbum = false;
        state.error = action.payload ?? "Failed to create album.";
      })
      .addCase(updateImageThunk.pending, (state) => {
        state.isUpdatingImage = true;
        state.error = null;
      })
      .addCase(updateImageThunk.fulfilled, (state, action) => {
        state.isUpdatingImage = false;
        const album = action.payload;
        if (album) {
          state.currentAlbum = album;
          state.albums = state.albums.map((a) =>
            a.batchId === album.batchId ? album : a,
          );
        }
      })
      .addCase(updateImageThunk.rejected, (state, action) => {
        state.isUpdatingImage = false;
        state.error = action.payload ?? "Failed to update image.";
      })
      .addCase(deleteImageThunk.pending, (state) => {
        state.isDeletingImage = true;
        state.error = null;
      })
      .addCase(deleteImageThunk.fulfilled, (state, action) => {
        state.isDeletingImage = false;
        const { batchId, imageId } = action.payload;
        if (state.currentAlbum?.batchId === batchId) {
          state.currentAlbum = {
            ...state.currentAlbum,
            images: state.currentAlbum.images.filter(
              (img) => img.imageId !== imageId,
            ),
          };
        }
        state.albums = state.albums.map((a) =>
          a.batchId === batchId
            ? {
                ...a,
                images: a.images.filter((img) => img.imageId !== imageId),
              }
            : a,
        );
      })
      .addCase(deleteImageThunk.rejected, (state, action) => {
        state.isDeletingImage = false;
        state.error = action.payload ?? "Failed to delete image.";
      })
      .addCase(deleteAlbumThunk.pending, (state) => {
        state.isDeletingAlbum = true;
        state.error = null;
      })
      .addCase(deleteAlbumThunk.fulfilled, (state, action) => {
        state.isDeletingAlbum = false;
        state.albums = state.albums.filter((a) => a.batchId !== action.payload);
        if (state.currentAlbum?.batchId === action.payload) {
          state.currentAlbum = null;
        }
      })
      .addCase(deleteAlbumThunk.rejected, (state, action) => {
        state.isDeletingAlbum = false;
        state.error = action.payload ?? "Failed to delete album.";
      })
      .addCase(updateAlbumTitleThunk.pending, (state) => {
        state.isUpdatingAlbumTitle = true;
        state.error = null;
      })
      .addCase(updateAlbumTitleThunk.fulfilled, (state, action) => {
        state.isUpdatingAlbumTitle = false;
        const { batchId, title } = action.payload;
        if (state.currentAlbum?.batchId === batchId) {
          state.currentAlbum = { ...state.currentAlbum, title };
        }
        state.albums = state.albums.map((a) =>
          a.batchId === batchId ? { ...a, title } : a,
        );
      })
      .addCase(updateAlbumTitleThunk.rejected, (state, action) => {
        state.isUpdatingAlbumTitle = false;
        state.error = action.payload ?? "Failed to update album title.";
      })
      .addCase(addImagesToAlbumThunk.pending, (state) => {
        state.isAddingImages = true;
        state.error = null;
      })
      .addCase(addImagesToAlbumThunk.fulfilled, (state, action) => {
        state.isAddingImages = false;
        const album = action.payload;
        if (album) {
          state.currentAlbum = album;
          state.albums = state.albums.map((a) =>
            a.batchId === album.batchId ? album : a,
          );
        }
      })
      .addCase(addImagesToAlbumThunk.rejected, (state, action) => {
        state.isAddingImages = false;
        state.error = action.payload ?? "Failed to add images.";
      })
      .addCase(rearrangeImagesThunk.pending, (state) => {
        state.isRearrangingImages = true;
        state.error = null;
      })
      .addCase(rearrangeImagesThunk.fulfilled, (state, action) => {
        state.isRearrangingImages = false;
        const album = action.payload;
        if (album) {
          state.currentAlbum = album;
          state.albums = state.albums.map((a) =>
            a.batchId === album.batchId ? album : a,
          );
        }
      })
      .addCase(rearrangeImagesThunk.rejected, (state, action) => {
        state.isRearrangingImages = false;
        state.error = action.payload ?? "Failed to rearrange images.";
      });
  },
});

export const { clearImagesError, clearCurrentAlbum } = imageSlice.actions;
export const imageReducer = imageSlice.reducer;
