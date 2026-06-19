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
  UpdateAlbumTitleInput,
  UpdateImageInput,
} from "@/features/images/types/image.types";
import { getErrorMessage } from "@/utils/getErrorMessage";

export interface ImageThunkApiConfig {
  rejectValue: string;
}

export const fetchAlbumsThunk = createAsyncThunk<
  Album[],
  void,
  ImageThunkApiConfig
>("images/fetchAlbums", async (_, { rejectWithValue }) => {
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
>("images/fetchAlbum", async (batchId, { rejectWithValue }) => {
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
>("images/createAlbum", async (payload, { rejectWithValue, dispatch }) => {
  try {
    const response = await imageService.createAlbum(payload);
    const album = extractAlbum(response.data);
    void dispatch(fetchAlbumsThunk());
    return album;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateImageThunk = createAsyncThunk<
  Album | null,
  UpdateImageInput,
  ImageThunkApiConfig
>("images/updateImage", async (payload, { rejectWithValue, dispatch }) => {
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
});

export const deleteImageThunk = createAsyncThunk<
  DeleteImageInput,
  DeleteImageInput,
  ImageThunkApiConfig
>("images/deleteImage", async (payload, { rejectWithValue }) => {
  try {
    await imageService.deleteImage(payload);
    return payload;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const deleteAlbumThunk = createAsyncThunk<
  string,
  string,
  ImageThunkApiConfig
>("images/deleteAlbum", async (batchId, { rejectWithValue }) => {
  try {
    await imageService.deleteAlbum(batchId);
    return batchId;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const updateAlbumTitleThunk = createAsyncThunk<
  UpdateAlbumTitleInput,
  UpdateAlbumTitleInput,
  ImageThunkApiConfig
>("images/updateAlbumTitle", async (payload, { rejectWithValue }) => {
  try {
    await imageService.updateAlbumTitle(payload);
    return payload;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const addImagesToAlbumThunk = createAsyncThunk<
  Album | null,
  AddImagesToAlbumInput,
  ImageThunkApiConfig
>("images/addImagesToAlbum", async (payload, { rejectWithValue, dispatch }) => {
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
});
