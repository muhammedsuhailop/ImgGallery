export interface UploadedImageMeta {
  url: string;
  publicId: string;
  title: string;
}

export interface CreateImageBatchDto {
  userId: string;
  title: string;
  images: UploadedImageMeta[];
  visibility: "public" | "private";
}
