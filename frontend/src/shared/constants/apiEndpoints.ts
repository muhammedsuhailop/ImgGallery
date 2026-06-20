export const ApiEndpoints = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  GET_CURRENT_USER: "/auth/me",
  REFRESH_TOKEN: "/auth/refresh-token",

  // Images 
  IMAGES: "/images",
  ALBUM: (batchId: string) => `/images/${batchId}`,
  IMAGE_ITEM: (batchId: string, imageId: string) =>
    `/images/${batchId}/images/${imageId}`,
  ALBUM_IMAGES: (batchId: string) => `/images/${batchId}/images`,
  REARRANGE_IMAGES: (batchId: string) => `/images/${batchId}/rearrange`,
} as const;
