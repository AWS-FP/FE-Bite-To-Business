# Trang Đăng nhập — MD Foods

**Cập nhật Figma V2:** Login đã được thiết kế lại và bổ sung Register desktop/mobile. Xem [thiết kế Authentication V2](design/AUTH_DESIGN_V2_VI.md). Phần React và ảnh FE mô tả bên dưới vẫn là bản V1, chưa đồng bộ theo Figma V2.

Route: `/login`. Chạy `npm run dev` rồi mở `http://localhost:5173/login`.

- Figma desktop: https://www.figma.com/design/slN9sK1TVVTINvDzn1sA81/Generate-UI?node-id=15-360
- Figma mobile: https://www.figma.com/design/slN9sK1TVVTINvDzn1sA81/Generate-UI?node-id=15-524
- Page Figma: `01 · Authentication`. Các frame dùng text, vector SVG và component chỉnh sửa được. Input/Button dùng Simple Design System; Brand/Language Switcher là component của MD Foods.

UI hỗ trợ VI/EN bằng i18next/react-i18next, lưu lựa chọn ngôn ngữ, validation Gmail/mật khẩu, hiện/ẩn mật khẩu và điều hướng. Minh họa thực phẩm là SVG do dự án tạo; Inter được lưu tại `public/fonts`, kèm giấy phép OFL.

`LoginForm` nhận callback `onSubmit` để nối xác thực sau. Hiện trang chưa truyền callback: submit dữ liệu hợp lệ hiển thị thông báo chưa khả dụng, không tạo phiên/JWT hoặc giả đăng nhập thành công. Backend/Supabase Auth chưa tích hợp ở màn hình này. `/register` và `/forgot-password` hiện là màn thông tin tạm, chưa có form thực hiện nghiệp vụ.

Kiểm tra: build, ESLint, validation, hiện/ẩn mật khẩu, đổi VI/EN và giữ lựa chọn sau reload, điều hướng, font local và responsive tại 320/390/768/1024/1440 px. Ảnh FE tại `previews/login-desktop.png` và `previews/login-mobile.png`.

Bản Figma được dựng trực tiếp bằng Plugin API; không sử dụng bản capture web. Phần mở trình duyệt cho capture bị bộ xét duyệt tự động từ chối (`blocked by policy`).
