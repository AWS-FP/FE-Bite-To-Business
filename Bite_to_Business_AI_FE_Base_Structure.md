# Cấu trúc Frontend Bite to Business

**Stack:** React + TypeScript + Vite; i18next/react-i18next cho VI/EN.  
**Trạng thái:** FE hiện chỉ giữ cấu hình và cây thư mục để triển khai sau. Đã gỡ code UI đăng nhập, form, component, CSS và route hiển thị; `App` trả về `null` nên trang chạy trắng. Các file page/component chưa triển khai là placeholder trống. Giữ setup React/Vite/TypeScript, thư viện đã cài và i18next/react-i18next với dữ liệu dịch trống. A2UI là giao thức UI động đã chọn; system prompt và khóa model nằm ở Backend.

```text
Generate-UI-FE/src/
├── app/
│   ├── config/
│   ├── layouts/              # App shell, header, navigation, chat entry
│   ├── providers/
│   └── router/
├── a2ui/
│   ├── actions/              # Handler gọi API nghiệp vụ đã allowlist
│   ├── catalog/              # Catalog FE và mapping component
│   ├── renderer/             # Render A2UI surface trong vùng nội dung
│   ├── transport/            # Nhận/parse response hoặc stream
│   ├── types/
│   └── validation/
├── components/
│   ├── feedback/
│   ├── navigation/
│   └── ui/
├── assets/
├── features/
│   ├── auth/
│   ├── profile/
│   ├── catalog/
│   ├── product/
│   ├── pricing/
│   ├── dashboard/            # Đã có
│   ├── promotion/            # Xem sale; màn hình quản lý cho E-commerce
│   ├── review/
│   ├── favorite/
│   ├── quote/
│   ├── order/
│   ├── delivery/             # Theo dõi cho Customer và giao hàng cho Staff
│   ├── inventory/            # Logistics Staff
│   ├── admin/
│   ├── document/             # Đã có; phạm vi nghiệp vụ chưa chốt
│   ├── supplier/             # Đã có từ scaffold; chưa dùng như marketplace
│   ├── conversation/         # Chat/prompt UI
│   └── generate-ui/          # Yêu cầu AI và surface được tạo
├── hooks/
├── i18n/
│   └── locales/
│       ├── vi/
│       └── en/
├── lib/
├── pwa/
├── stores/
├── styles/
└── types/
```

## Ranh giới UI và nghiệp vụ

- `app/layouts` giữ App Shell ổn định. Nội dung chính có thể là trang React thường hoặc A2UI surface được render trong `a2ui/renderer`.
- `a2ui/catalog` mô tả component/props/actions được phép; `a2ui/renderer` ánh xạ chúng sang React components đã viết sẵn. AI chỉ chọn và kết hợp component trong catalog, không gửi JSX/HTML/CSS tùy ý.
- `a2ui/actions` chỉ nhận action allowlist như thêm sản phẩm vào Quote hoặc điều hướng tới trang Quote. Handler gọi API; Backend kiểm tra quyền, giá, tồn và lưu thay đổi.
- `features/` chứa API client, hooks, components, pages, types theo nghiệp vụ. Dữ liệu hiển thị lấy từ API authoritative, không tin giá/tồn do model tự sinh.
- Trong từng feature, dùng folder `service/` cho các hàm giao tiếp backend (ví dụ `features/catalog/service/catalogApi.ts`); không đặt folder con tên `api/`. `lib/api/` giữ nguyên vì đó là HTTP client và tiện ích dùng chung toàn ứng dụng.
- `i18n/locales/vi` và `i18n/locales/en` chứa chuỗi dịch giao diện. Nội dung sản phẩm/poster song ngữ do nghiệp vụ quản lý.
- Cấu hình system prompt không đặt tại Frontend. Không để AI thực hiện thanh toán hoặc thay đổi trạng thái nghiệp vụ trực tiếp.

Các folder `supplier/` và `document/` đã tồn tại từ scaffold trước; được giữ nguyên hiện trạng, nhưng chưa xem là chức năng marketplace hay nghiệp vụ đã chốt. Không xóa source có sẵn trong lần bổ sung cấu trúc này.

## Tổ chức theo nghiệp vụ và role

`features/` được chia theo nghiệp vụ, không chia thành `customer/`, `ecommerce/`, `logistics/` rồi nhân bản cùng một chức năng vào nhiều nơi. Một nghiệp vụ có thể được nhiều role dùng: Customer xem promotion còn E-commerce Executive quản lý nó; Customer theo dõi delivery còn Delivery Staff cập nhật trạng thái giao. Role guard và route được cấu hình trong `app/router/`, layout chung theo Customer/Staff/Admin đặt trong `app/layouts/`; quyền phía Backend vẫn là nguồn quyết định cuối cùng.
