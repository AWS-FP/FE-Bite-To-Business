// Khung thành công từ ResponseObject<T> của Spring Boot.
export interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

export interface ValidationError {
  field: string
  code: string
  message: string
}

// Khung lỗi từ GlobalExceptionHandler; form có thể đọc errors để báo lỗi từng ô.
export interface ApiErrorResponse {
  status: number
  code: string
  message: string
  path: string
  errors: ValidationError[]
  timestamp: string
}
