# Bite to Business Frontend

React, TypeScript và Vite. Cấu trúc `src` được tổ chức theo [repo tham khảo](https://github.com/Brotherhood-526/Flood-Rescue-Coordination/tree/main/Frontend): chia theo loại file, bên trong chia theo 5 role; file dùng chung đặt ở ngoài.

## Chạy dự án

```sh
npm ci
npm run dev
```

Cấu hình API trong `.env.local` theo `.env.example`. `VITE_API_BASE_URL` mặc định là `http://localhost:8080`, không thêm `/api` ở cuối.

## Cấu trúc src

```text
src/
├── assets/                 # Asset chung ở ngoài, asset riêng chia theo 5 role
├── components/             # Component chung ở ngoài, component riêng chia theo 5 role
├── constants/              # Hằng số chung và hằng số theo role
├── hooks/                  # Hook chung ở ngoài, hook riêng chia theo 5 role
├── i18n/                   # Cấu hình ngôn ngữ và bản dịch vi/en
├── layouts/                # Header, Footer, MainLayout và layout theo role
├── lib/                    # env, storage, Supabase, a2ui và pwa
├── pages/                  # Trang guest ở ngoài; bên trong chia đúng 5 role
├── router/                 # router.tsx, routes.ts, ProtectedRoute.tsx
├── services/               # API chung ở ngoài, API riêng chia theo 5 role
├── store/                  # Store Zustand chung và store theo role
├── types/                  # Kiểu dữ liệu chung và DTO theo role
├── utils/                  # Hàm tiện ích chung và hàm riêng theo role
├── validations/            # Validation chung và validation theo role
├── App.tsx
├── main.tsx
└── index.css               # Tailwind, màu và font dùng chung
```

- `pages/` ghép các component để tạo màn hình; logic form nằm trong `hooks/`.
- `services/axiosClient.ts` cung cấp `http` có Bearer token/refresh và `publicHttp` cho API công khai.
- `services/locationService.ts` lấy danh sách thành phố/phường xã ở bước đăng ký nhận hàng.
- `store/authStore.ts` lưu phiên đăng nhập trong `sessionStorage`; phiên tạo mật khẩu được quản lý riêng trong `utils/activationSession.ts`.
- Mỗi ngôn ngữ trong `i18n/index.ts` khai báo một lần và chứa đủ các nhóm `translation`, `common`, `admin`, `storefront`.
- File CSS riêng của component đặt cạnh component. Asset dùng bằng URL nằm trong `public/`.

### Cùng một cách chia role cho các lớp code

`assets`, `components`, `constants`, `hooks`, `layouts`, `pages`, `services`, `store`,
`types`, `utils` và `validations` đều có 5 folder:

```text
services/                  # Áp dụng tương tự cho các lớp code trên
├── customer/
├── admin/
│   └── registrationService.ts
├── e-commerce/
├── logistic/
├── shipper/
├── axiosClient.ts
├── authService.ts
├── locationService.ts
└── searchHistoryService.ts
```

File dùng chung đặt trực tiếp trong thư mục của lớp code. Ví dụ `hooks/useAuth.ts`,
`hooks/useSearchHistory.ts`, `components/LanguageSwitcher.tsx`, `types/auth.ts` và
`utils/deliveryAddress.ts` phục vụ nhiều role hoặc luồng guest. Mẫu đăng nhập/đăng ký
và hook của các form này cũng đặt ở ngoài các folder role.

File riêng của admin nằm ở `components/admin`, `hooks/admin`, `layouts/admin`,
`services/admin`, `types/admin` và `utils/admin`. Các lớp có thể chỉ có `.gitkeep`
ở một role khi chưa triển khai chức năng tương ứng.

`router` giữ 3 file `router.tsx`, `routes.ts`, `ProtectedRoute.tsx`. `i18n` chia theo
ngôn ngữ; `lib` giữ các thư viện và cấu hình hạ tầng dùng chung.

### Pages theo role

```text
pages/
├── HomePage.tsx
├── LoginPage.tsx
├── RegisterPage.tsx
├── ActivationPage.tsx
├── ForgotPasswordPage.tsx
├── AuthInformationPage.tsx
├── CatalogPage.tsx
├── ProductDetailPage.tsx
├── QuotesPage.tsx
├── customer/               # Đơn hàng, chi tiết giỏ hàng, hồ sơ, AI và nhập tài liệu
├── admin/                  # Danh sách và chi tiết hồ sơ đăng ký
├── e-commerce/             # Quản lý sản phẩm, khuyến mãi và coupon
├── logistic/               # Kho và yêu cầu sản phẩm
└── shipper/                # Chuyến giao hàng
```

Các trang guest có thể truy cập nằm trực tiếp trong `pages/`. `QuotesPage` là giỏ hàng guest;
`customer/QuoteDetailPage` là chi tiết báo giá cần đăng nhập. Các trang chưa triển khai UI
vẫn dùng `PendingPage` trong router.

Folder `e-commerce` tương ứng role `ECOMMERCE_EXECUTIVE`, `logistic` tương ứng `LOGISTICS_STAFF`,
và `shipper` tương ứng `DELIVERY_STAFF`. Phân quyền của từng route nằm trong `router/router.tsx`.

Dùng alias `@/` cho import giữa các thư mục, ví dụ:

```ts
import useAuth from '@/hooks/useAuth'
import { login } from '@/services/authService'
import type { AuthResponse } from '@/types/auth'
```

Alias được khai báo đồng bộ trong `tsconfig.app.json` và `vite.config.ts`.

## Kiểm tra

```sh
npm run build
npm run lint
```
