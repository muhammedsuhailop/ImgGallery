export interface RearrangeEntry {
  imageId: string;
  order: number;
}

export interface RearrangeImagesDto {
  orderedImages: RearrangeEntry[];
}
