export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors: string[] | null;
  timestamp: string;
}

export interface ErrorResponse {
  status: number;
  message: string;
  errors: string[];
  details?: string;
  timestamp: string;
}

export interface ValidationProblemDetails {
  type: string;
  title: string;
  status: number;
  errors: Record<string, string[]>;
  traceId?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedQuery {
  page?: number;
  pageSize?: number;
}
