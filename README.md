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
├── pages/                  # Trang public ở ngoài; đăng nhập/đăng ký gộp vào admin
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
- `store/admin/authStore.ts` lưu phiên đăng nhập trong `sessionStorage`; phiên tạo mật khẩu được quản lý riêng trong `utils/admin/activationSession.ts`.
- Mỗi ngôn ngữ trong `i18n/index.ts` khai báo một lần và chứa đủ các nhóm `translation`, `common`, `admin`, `storefront`.
- File CSS riêng của component đặt cạnh component. Asset dùng bằng URL nằm trong `public/`.

### Cùng một cách chia role cho các lớp code

`assets`, `components`, `constants`, `hooks`, `layouts`, `pages`, `services`, `store`,
`types`, `utils` và `validations` đều có 5 folder:

```text
services/                  # Áp dụng tương tự cho các lớp code trên
├── customer/
├── admin/
│   ├── authService.ts
│   └── registrationService.ts
├── e-commerce/
├── logistic/
├── shipper/
├── axiosClient.ts
├── locationService.ts
└── searchHistoryService.ts
```

File dùng chung đặt trực tiếp trong thư mục của lớp code. Ví dụ `hooks/useSearchHistory.ts`,
`components/LanguageSwitcher.tsx` và `utils/deliveryAddress.ts` phục vụ nhiều role hoặc luồng guest.
Riêng code xác thực được gộp vào `admin` của từng lớp: component, page, hook, service, store,
type, constant, utility và validation. Không tạo folder `auth` riêng.

File riêng của admin nằm ở `components/admin`, `hooks/admin`, `layouts/admin`,
`services/admin`, `types/admin` và `utils/admin`. Các lớp có thể chỉ có `.gitkeep`
ở một role khi chưa triển khai chức năng tương ứng.

`router` giữ 3 file `router.tsx`, `routes.ts`, `ProtectedRoute.tsx`. `i18n` chia theo
ngôn ngữ; `lib` giữ các thư viện và cấu hình hạ tầng dùng chung.

### Pages theo role

```text
pages/
├── HomePage.tsx
├── CatalogPage.tsx
├── ProductDetailPage.tsx
├── QuotesPage.tsx
├── customer/               # Đơn hàng, chi tiết giỏ hàng, hồ sơ, AI và nhập tài liệu
├── admin/                  # Đăng nhập/đăng ký/kích hoạt và quản trị hồ sơ đăng ký
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ActivationPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── AuthInformationPage.tsx
│   ├── RegistrationsPage.tsx
│   └── RegistrationDetailPage.tsx
├── e-commerce/             # Quản lý sản phẩm, khuyến mãi và coupon
├── logistic/               # Kho và yêu cầu sản phẩm
└── shipper/                # Chuyến giao hàng
```

Các trang public khác nằm trực tiếp trong `pages/`. Các trang xác thực đặt trong `pages/admin`
vẫn cho guest truy cập theo URL và phân quyền trong router. `QuotesPage` là giỏ hàng guest;
`customer/QuoteDetailPage` là chi tiết báo giá cần đăng nhập. Các trang chưa triển khai UI
vẫn dùng `PendingPage` trong router.

Folder `e-commerce` tương ứng role `ECOMMERCE_EXECUTIVE`, `logistic` tương ứng `LOGISTICS_STAFF`,
và `shipper` tương ứng `DELIVERY_STAFF`. Phân quyền của từng route nằm trong `router/router.tsx`.

Dùng alias `@/` cho import giữa các thư mục, ví dụ:

```ts
import useAuth from '@/hooks/admin/useAuth'
import { login } from '@/services/admin/authService'
import type { AuthResponse } from '@/types/admin/auth'
```

Alias được khai báo đồng bộ trong `tsconfig.app.json` và `vite.config.ts`.

## Validation bằng Zod

- `validations/admin/authSchema.ts`: Gmail, đăng nhập, OTP và xác nhận mật khẩu.
- `validations/admin/registrationSchema.ts`: các bước đăng ký, thông tin hóa đơn và địa chỉ theo danh mục API.
- `validations/admin/registrationReviewSchema.ts`: quyết định duyệt/từ chối và lý do của admin.

Form đăng ký dùng `zodResolver` với React Hook Form; các form ngắn dùng `schema.safeParse()`.
Schema chuẩn hóa Gmail, số điện thoại và các ô tùy chọn trước khi gửi API. Mật khẩu và số 0 đầu
của OTP/mã số thuế được giữ nguyên. Thông báo lỗi dùng key i18n để đổi VI/EN cùng giao diện.
`strictNullChecks` được bật để kiểu dữ liệu Zod và form xử lý đúng các trường có thể trống.

## Kiểm tra

```sh
npm run build
npm run lint
```

## Format code

Dùng 4 dấu cách, dấu `{` cùng dòng khai báo và dấu `;` cuối câu lệnh JS/TS.
Cấu hình nằm trong `.prettierrc.json` và `.editorconfig`.

```sh
npm run format
npm run format:check
```
