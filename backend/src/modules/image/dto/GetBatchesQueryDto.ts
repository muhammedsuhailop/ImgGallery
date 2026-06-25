export type SortField = "createdAt" | "updatedAt" | "title" | "order";
export type SortOrder = "asc" | "desc";
export type VisibilityFilter = "public" | "private" | "all";

export interface GetBatchesQueryDto {
  page: number;
  limit: number;
  sortBy: SortField;
  sortOrder: SortOrder;
  visibility: VisibilityFilter;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
