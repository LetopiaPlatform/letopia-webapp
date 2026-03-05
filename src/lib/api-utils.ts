import type { AxiosError, AxiosResponse } from 'axios';
import { isAxiosError } from 'axios';
import type { ApiResponse } from '@/types/api.types';
import { ERROR_MESSAGES } from './constants';

/**
 * Unwraps a successful ApiResponse<T> → T.
 * Throws if the response indicates failure.
 */
export function extractData<T>(response: AxiosResponse<ApiResponse<T>>): T {
  const body = response.data;

  if (!body.success || body.data == null) {
    throw new Error(body.message || ERROR_MESSAGES.REQUEST_FAILED);
  }

  return body.data;
}

/**
 * Extracts a single user-friendly error message from any error.
 * Handles: network errors, timeouts, ErrorResponse, ValidationProblemDetails.
 */
export function getErrorMessage(error: unknown): string {
  if (!isAxiosError(error)) {
    return ERROR_MESSAGES.DEFAULT;
  }

  // No response — network or timeout
  if (!error.response) {
    return error.code === 'ECONNABORTED' ? ERROR_MESSAGES.TIMEOUT : ERROR_MESSAGES.NETWORK;
  }

  const body = error.response.data as Record<string, unknown> | undefined;
  if (!body) return ERROR_MESSAGES.DEFAULT;

  // ErrorResponse format: { message, errors: string[] }
  if (Array.isArray(body.errors) && body.errors.length > 0) {
    return body.errors[0] as string;
  }

  // ValidationProblemDetails: { title, errors: { Field: string[] } }
  if (body.errors && !Array.isArray(body.errors)) {
    const fieldErrors = Object.values(body.errors as Record<string, string[]>);
    if (fieldErrors.length > 0 && fieldErrors[0].length > 0) {
      return fieldErrors[0][0];
    }
  }

  // ErrorResponse.message or ApiResponse.message
  if (typeof body.message === 'string' && body.message) {
    return body.message;
  }

  // ValidationProblemDetails.title
  if (typeof body.title === 'string' && body.title) {
    return body.title;
  }

  return ERROR_MESSAGES.DEFAULT;
}

/**
 * Extracts all field-level validation errors for form display.
 * Returns a map of { fieldName: "first error" } for React Hook Form's setError().
 * Works with both ErrorResponse (flat) and ValidationProblemDetails (keyed).
 */
export function getFieldErrors(error: unknown): Record<string, string> | null {
  if (!isAxiosError(error) || !error.response) return null;

  const body = error.response.data as Record<string, unknown> | undefined;
  if (!body?.errors) return null;

  // ValidationProblemDetails: { errors: { Email: ["..."], Password: ["..."] } }
  if (!Array.isArray(body.errors)) {
    const fieldErrors: Record<string, string> = {};
    for (const [field, messages] of Object.entries(body.errors as Record<string, string[]>)) {
      if (messages.length > 0) {
        // Convert PascalCase field name to camelCase (Email → email)
        const key = field.charAt(0).toLowerCase() + field.slice(1);
        fieldErrors[key] = messages[0];
      }
    }
    return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
  }

  return null;
}

/**
 * Returns true if the error is a validation error (400).
 */
export function isValidationError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 400;
}

export function getErrorStatus(error: unknown): number | null {
  return (error as AxiosError)?.response?.status ?? null;
}
