export interface ImageItemResponse {
  imageId: string;
  url: string;
  title: string;
  order: number;
}

export interface ImageBatchResponse {
  batchId: string;
  title: string; 
  order: number;
  visibility: "public" | "private";
  images: ImageItemResponse[];
  createdAt: Date;
  updatedAt: Date;
}
