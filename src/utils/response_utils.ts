import type { BaseResponse } from '../models/response/base_response'

export function generateResponse<T> (data: T, message: string, statusCode: number): BaseResponse<T> {
  return {
    meta: {
      message,
      statusCode
    },
    data
  }
}

export function generateErrorResponse (message: string, errorCode: number): { message: string, errorCode: number, data: null } {
  return {
    message,
    errorCode,
    data: null
  }
}
