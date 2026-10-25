// Các biến VITE_* được đưa vào trình duyệt; chỉ chứa cấu hình công khai.
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8080',
}
