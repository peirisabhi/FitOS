/**
 * Envelope every mock (and eventually real) API response conforms to.
 * Repositories unwrap this; services/hooks never see the envelope.
 */
export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
}

export interface ApiErrorBody {
  message: string;
  code: string;
  fieldErrors?: Record<string, string[]>;
}

export class ApiError extends Error {
  code: string;
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(message: string, code: string, status: number, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}
