export interface RearrangeEntry {
  imageId: string;
  order: number;
}

export interface RearrangeImagesDto {
  orderedImages: RearrangeEntry[];
}

export interface RearrangeBatchEntry {
  batchId: string;
  order: number;
}

export interface RearrangeBatchesDto {
  orderedBatches: RearrangeBatchEntry[];
}
