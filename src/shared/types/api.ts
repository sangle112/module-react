export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
