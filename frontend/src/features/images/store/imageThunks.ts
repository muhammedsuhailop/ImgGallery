import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  extractAlbum,
  extractAlbums,
  imageService,
} from "@/features/images/services/ImageService";
import type {
  AddImagesToAlbumInput,
  Album,
  CreateAlbumInput,
  DeleteImageInput,
  RearrangeImagesInput,
  UpdateAlbumTitleInput,
  UpdateImageInput,
} from "@/features/images/types/image.types";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { ApiEndpoints } from "@/shared/constants/apiEndpoints";

export interface ImageThunkApiConfig {
  rejectValue: string;
}

export const fetchAlbumsThunk = createAsyncThunk<
  Album[],
  void,
  ImageThunkApiConfig
>(`${ApiEndpoints.IMAGES}/fetchAlbums`, async (_, { rejectWithValue }) => {
  try {
    const response = await imageService.getAlbums();
    return extractAlbums(response.data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchAlbumThunk = createAsyncThunk<
  Album,
  string,
  ImageThunkApiConfig
>(`${ApiEndpoints.IMAGES}/fetchAlbum`, async (batchId, { rejectWithValue }) => {
  try {
    const response = await imageService.getAlbum(batchId);
    const album = extractAlbum(response.data);
    if (!album) return rejectWithValue("Album not found.");
    return album;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const createAlbumThunk = createAsyncThunk<
  Album | null,
  CreateAlbumInput,
  ImageThunkApiConfig
>(
  `${ApiEndpoints.IMAGES}/createAlbum`,
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await imageService.createAlbum(payload);
      const album = extractAlbum(response.data);
      void dispatch(fetchAlbumsThunk());
      return album;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateImageThunk = createAsyncThunk<
  Album | null,
  UpdateImageInput,
  ImageThunkApiConfig
>(
  `${ApiEndpoints.IMAGES}/updateImage`,
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await imageService.updateImage(payload);
      const album = extractAlbum(response.data);
      if (album) return album;
      const fresh = await dispatch(fetchAlbumThunk(payload.batchId));
      if (fetchAlbumThunk.fulfilled.match(fresh)) return fresh.payload;
      return null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteImageThunk = createAsyncThunk<
  DeleteImageInput,
  DeleteImageInput,
  ImageThunkApiConfig
>(
  `${ApiEndpoints.IMAGES}/deleteImage`,
  async (payload, { rejectWithValue }) => {
    try {
      await imageService.deleteImage(payload);
      return payload;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteAlbumThunk = createAsyncThunk<
  string,
  string,
  ImageThunkApiConfig
>(
  `${ApiEndpoints.IMAGES}/deleteAlbum`,
  async (batchId, { rejectWithValue }) => {
    try {
      await imageService.deleteAlbum(batchId);
      return batchId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateAlbumTitleThunk = createAsyncThunk<
  UpdateAlbumTitleInput,
  UpdateAlbumTitleInput,
  ImageThunkApiConfig
>(
  `${ApiEndpoints.IMAGES}/updateAlbumTitle`,
  async (payload, { rejectWithValue }) => {
    try {
      await imageService.updateAlbumTitle(payload);
      return payload;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const addImagesToAlbumThunk = createAsyncThunk<
  Album | null,
  AddImagesToAlbumInput,
  ImageThunkApiConfig
>(
  `${ApiEndpoints.IMAGES}/addImagesToAlbum`,
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await imageService.addImagesToAlbum(payload);
      const album = extractAlbum(response.data);
      if (album) return album;
      const fresh = await dispatch(fetchAlbumThunk(payload.batchId));
      if (fetchAlbumThunk.fulfilled.match(fresh)) return fresh.payload;
      return null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const rearrangeImagesThunk = createAsyncThunk<
  Album | null,
  RearrangeImagesInput,
  ImageThunkApiConfig
>(
  `${ApiEndpoints.IMAGES}/rearrangeImages`,
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await imageService.rearrangeImages(payload);
      const album = extractAlbum(response.data);
      if (album) return album;

      const fresh = await dispatch(fetchAlbumThunk(payload.batchId));
      if (fetchAlbumThunk.fulfilled.match(fresh)) return fresh.payload;
      return null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
