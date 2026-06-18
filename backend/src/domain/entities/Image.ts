export interface ImageItem {
  id: string;
  url: string;
  publicId: string;
  title: string;
  order: number;
}

export interface ImageBatch {
  id: string;
  userId: string;
  images: ImageItem[];
  title: string;
  order: number;
  visibility: "public" | "private";
  createdAt: Date;
  updatedAt: Date;
}
