export interface BaseResponse<T> {
  meta: {
    message: string
    statusCode: number
  }
  data: T
}
