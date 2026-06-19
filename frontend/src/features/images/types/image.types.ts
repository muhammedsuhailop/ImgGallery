export type Visibility = "public" | "private";

export interface Image {
  imageId: string;
  url: string;
  title: string;
  order: number;
}

export interface Album {
  batchId: string;
  title: string;
  order: number;
  visibility: Visibility;
  images: Image[];
  createdAt: string;
  updatedAt: string;
}

// export interface AlbumsPayload {
//   albums: Album[];
// }

// export interface AlbumPayload {
//   album: Album;
// }
export interface AlbumsPayload {
  albums?: Album[];
  batches?: Album[]; // Added backend matching key
}

export interface AlbumPayload {
  album?: Album;
  batch?: Album; // Added backend matching key fallback
}

export interface CreateAlbumInput {
  title: string;
  visibility: Visibility;
  files: File[];
  titles: string[];
}

export interface UpdateImageInput {
  batchId: string;
  imageId: string;
  title?: string;
  file?: File;
}

export interface DeleteImageInput {
  batchId: string;
  imageId: string;
}

export interface UpdateAlbumTitleInput {
  batchId: string;
  title: string;
}

export interface AddImagesToAlbumInput {
  batchId: string;
  files: File[];
  titles: string[];
}

export interface ImageState {
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
