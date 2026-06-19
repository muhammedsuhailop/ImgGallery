import { api } from "@/shared/api/axios";
import type { ApiResponse } from "@/shared/api/apiTypes";
import type {
  AddImagesToAlbumInput,
  Album,
  AlbumPayload,
  AlbumsPayload,
  CreateAlbumInput,
  DeleteImageInput,
  UpdateAlbumTitleInput,
  UpdateImageInput,
} from "@/features/images/types/image.types";

class ImageService {
  async getAlbums(): Promise<ApiResponse<AlbumsPayload | Album[]>> {
    const response =
      await api.get<ApiResponse<AlbumsPayload | Album[]>>("/images");
    return response.data;
  }

  async getAlbum(batchId: string): Promise<ApiResponse<AlbumPayload | Album>> {
    const response = await api.get<ApiResponse<AlbumPayload | Album>>(
      `/images/${batchId}`,
    );
    return response.data;
  }

  async createAlbum(
    data: CreateAlbumInput,
  ): Promise<ApiResponse<AlbumPayload | Album>> {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("visibility", data.visibility);
    data.files.forEach((file) => {
      formData.append("images", file);
    });
    data.titles.forEach((title) => {
      formData.append("titles", title);
    });

    const response = await api.post<ApiResponse<AlbumPayload | Album>>(
      "/images",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  }

  async updateImage(
    input: UpdateImageInput,
  ): Promise<ApiResponse<AlbumPayload | Album>> {
    const { batchId, imageId, title, file } = input;
    const hasFile = file instanceof File;

    let body: FormData | { title: string };
    let headers: Record<string, string> | undefined;

    if (hasFile) {
      const formData = new FormData();
      if (typeof title === "string") {
        formData.append("title", title);
      }
      formData.append("image", file);
      body = formData;
      headers = { "Content-Type": "multipart/form-data" };
    } else {
      body = { title: title ?? "" };
    }

    const response = await api.patch<ApiResponse<AlbumPayload | Album>>(
      `/images/${batchId}/images/${imageId}`,
      body,
      headers ? { headers } : undefined,
    );
    return response.data;
  }

  async deleteImage(input: DeleteImageInput): Promise<ApiResponse<undefined>> {
    const response = await api.delete<ApiResponse<undefined>>(
      `/images/${input.batchId}/images/${input.imageId}`,
    );
    return response.data;
  }

  async deleteAlbum(batchId: string): Promise<ApiResponse<undefined>> {
    const response = await api.delete<ApiResponse<undefined>>(
      `/images/${batchId}`,
    );
    return response.data;
  }

  async updateAlbumTitle(
    input: UpdateAlbumTitleInput,
  ): Promise<ApiResponse<AlbumPayload | Album>> {
    const response = await api.patch<ApiResponse<AlbumPayload | Album>>(
      `/images/${input.batchId}`,
      { title: input.title },
    );
    return response.data;
  }

  async addImagesToAlbum(
    input: AddImagesToAlbumInput,
  ): Promise<ApiResponse<AlbumPayload | Album>> {
    const formData = new FormData();
    input.files.forEach((file) => formData.append("images[]", file));
    input.titles.forEach((title) => formData.append("titles[]", title));

    const response = await api.post<ApiResponse<AlbumPayload | Album>>(
      `/images/${input.batchId}/images`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  }
}

export const imageService = new ImageService();

export function extractAlbums(
  payload:
    | ApiResponse<AlbumsPayload | Album[]>
    | AlbumsPayload
    | Album[]
    | undefined,
): Album[] {
  if (!payload) return [];

  if (
    typeof payload === "object" &&
    "data" in payload &&
    payload.data !== undefined
  ) {
    const unboxed = payload.data;
    if (Array.isArray(unboxed)) return unboxed;
    return unboxed.batches ?? unboxed.albums ?? [];
  }

  if (Array.isArray(payload)) return payload;

  if (typeof payload === "object") {
    return (
      (payload as AlbumsPayload).batches ??
      (payload as AlbumsPayload).albums ??
      []
    );
  }

  return [];
}

export function extractAlbum(
  payload: ApiResponse<AlbumPayload | Album> | AlbumPayload | Album | undefined,
): Album | null {
  if (!payload) return null;

  if (
    typeof payload === "object" &&
    "data" in payload &&
    payload.data !== undefined
  ) {
    const unboxed = payload.data;
    if ("album" in unboxed && unboxed.album) return unboxed.album;
    if ("batch" in unboxed && unboxed.batch) return unboxed.batch;
    if ("batchId" in unboxed) return unboxed as Album;
    return null;
  }

  if (typeof payload === "object") {
    if ("album" in payload && payload.album) return payload.album;
    if ("batch" in payload && payload.batch) return payload.batch;
    if ("batchId" in payload) return payload as Album;
  }

  return null;
}
