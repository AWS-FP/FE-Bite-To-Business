import { ROUTES } from '../../../app/router/routes'

// Các nhãn điều hướng theo thiết kế, không phải dữ liệu sản phẩm giả từ API.
export const freshCategoryKeys = ['meat', 'seafood', 'eggs', 'vegetables', 'fruit', 'vegetarian']
export const dryCategoryKeys = ['grains', 'noodles', 'nuts', 'dairy', 'seasoning', 'prepared', 'bakery']

// Catalog chưa có UI. Truyền từ khóa qua URL để trang đó có thể đọc khi được triển khai.
export function getCatalogSearchPath(keyword: string) {
  const searchParams = new URLSearchParams()
  searchParams.set('q', keyword)
  return `${ROUTES.CATALOG}?${searchParams.toString()}`
}
