export enum ImageMessages {
  UPLOAD_SUCCESS = "Images uploaded successfully",
  BATCHES_RETRIEVED = "Batches retrieved",
  BATCH_RETRIEVED = "Batch retrieved",
  BATCH_UPDATED = "Batch updated",
  IMAGE_UPDATED = "Image updated",
  IMAGES_REARRANGED = "Images rearranged",
  BATCHES_REARRANGED = "Batches rearranged",
  IMAGE_DELETED = "Image deleted",
  BATCH_DELETED = "Batch deleted",
}

export enum ImageErrors {
  IMAGE_REQUIRED = "At least one image is required",
  TITLE_MISMATCH = "Each image must have a corresponding title",
  BATCH_NOT_FOUND = "Batch not found",
  ACCESS_DENIED = "Access denied",
  BATCH_NOT_FOUND_OR_DENIED = "Batch not found or access denied",
  IMAGE_NOT_FOUND = "Image not found in this batch",
  UPDATE_BATCH_FAILED = "Failed to update batch",
  UPDATE_IMAGE_FAILED = "Failed to update image",
  REARRANGE_IMAGES_FAILED = "Failed to rearrange images",
  DELETE_IMAGE_FAILED = "Failed to delete image",
}

export enum StorageErrors {
  UPLOAD_FAILED = "Image upload failed",
}
