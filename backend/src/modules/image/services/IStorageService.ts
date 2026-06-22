export interface UploadResult {
  url: string;
  publicId: string;
}

export interface IStorageService {
  upload(file: Express.Multer.File): Promise<UploadResult>;
  delete(publicId: string): Promise<void>;
}
