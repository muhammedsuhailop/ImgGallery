import { PaginationMeta } from "../dto/GetBatchesQueryDto";
import { ImageBatchResponse } from "./ImageBatchResponse";

export interface ImageBatchListResponse {
  batches: ImageBatchResponse[];
  meta: PaginationMeta;
}

export interface RearrangeBatchesResponse {
  batches: ImageBatchResponse[];
}
