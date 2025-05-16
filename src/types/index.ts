export interface SuccessResponse<T> {
  success: true; // No point, for the sake of completeness
  message: string;
  data: T;
}

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export type PaginatedSuccessResponse<T> = SuccessResponse<T> & {
  pagination: Pagination;
};

export type PaginatedResponse<T> = Promise<{
  data: T;
  nextCursor: number | null;
}>;
