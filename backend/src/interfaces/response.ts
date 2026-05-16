import { ErrorCodes } from './errorCodes'

export type SuccessResponse<T> = T

export interface ApiResponse<T> {
  data?: SuccessResponse<T>
  error?: ErrorResponse
}

export interface ErrorResponse {
  code: ErrorCodes
  message: string
  details?: Array<{ field: string; message: string }>
}
