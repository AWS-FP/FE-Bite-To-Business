# Thiết kế Đăng nhập và Đăng ký — MD Foods V2

Ngày cập nhật: 11/10/2026. Page Figma: `01 · Authentication` trong file Generate-UI của team.

Đây là thiết kế Figma và prototype chuyển bước. React hiện chưa được cập nhật theo V2; form đăng ký/API xác thực chưa được triển khai trong công việc này.

## Màn hình

| Màn hình | Desktop | Mobile |
| --- | --- | --- |
| Đăng nhập | [Mở Figma](https://www.figma.com/design/slN9sK1TVVTINvDzn1sA81/Generate-UI?node-id=15-360) | [Mở Figma](https://www.figma.com/design/slN9sK1TVVTINvDzn1sA81/Generate-UI?node-id=15-524) |
| Đăng ký — Liên hệ | [Mở Figma](https://www.figma.com/design/slN9sK1TVVTINvDzn1sA81/Generate-UI?node-id=31-2261) | [Mở Figma](https://www.figma.com/design/slN9sK1TVVTINvDzn1sA81/Generate-UI?node-id=31-2397) |
| Đăng ký — Giao hàng | [Mở Figma](https://www.figma.com/design/slN9sK1TVVTINvDzn1sA81/Generate-UI?node-id=31-2499) | [Mở Figma](https://www.figma.com/design/slN9sK1TVVTINvDzn1sA81/Generate-UI?node-id=31-2654) |
| Đăng ký — Hóa đơn | [Mở Figma](https://www.figma.com/design/slN9sK1TVVTINvDzn1sA81/Generate-UI?node-id=31-2775) | [Mở Figma](https://www.figma.com/design/slN9sK1TVVTINvDzn1sA81/Generate-UI?node-id=31-2915) |
| Đã gửi, chờ duyệt | [Mở Figma](https://www.figma.com/design/slN9sK1TVVTINvDzn1sA81/Generate-UI?node-id=31-3021) | [Mở Figma](https://www.figma.com/design/slN9sK1TVVTINvDzn1sA81/Generate-UI?node-id=31-3073) |

## Hướng thiết kế

Giữ nhận diện MD Foods: Inter, xanh lá đậm, nền sáng, viền nhẹ và khoảng cách rõ giữa các nhóm. Desktop Login dùng ảnh món ăn thật với lớp chữ độc lập; mobile ưu tiên form. Register dùng ảnh nguồn hàng ở sidebar desktop và bỏ sidebar trên mobile để dành không gian cho thông tin cần nhập.

Tham khảo cấu trúc form email gọn của [Instacart Login](https://www.instacart.com/login) và form Kamereo chủ dự án cung cấp trong hội thoại. Không thêm social login vì nghiệp vụ MD Foods hiện dùng Gmail/password và duyệt hồ sơ.

Text, icon, bố cục và form là các layer chỉnh sửa được. Chỉ ảnh thực phẩm là raster, không dùng screenshot toàn trang làm thiết kế. Button/Input/Select/Checkbox dùng Simple Design System; Brand/Language dùng component MD Foods hiện có. Customer type và step indicator là các component dùng lại. Các màu, khoảng cách và typography được nối với variables/styles.

## Nội dung form và nghiệp vụ

1. **Liên hệ:** họ, tên, Gmail, số điện thoại Việt Nam; chọn Cá nhân/Hộ gia đình hoặc Doanh nghiệp/Hợp tác xã.
2. **Giao hàng:** tên doanh nghiệp/người đại diện, tỉnh/thành, quận/huyện, phường/xã và địa chỉ chi tiết. Đây là địa chỉ mặc định; Customer vẫn tạo package nhận hàng khác khi lập Quote.
3. **Hóa đơn:** người mua hàng, mã số thuế, Gmail nhận hóa đơn, địa chỉ xuất hóa đơn và tùy chọn dùng địa chỉ nhận hàng. Thiết kế để các trường hóa đơn không bắt buộc theo schema `user_profiles` hiện tại; nếu nhập MST, kiểm tra đúng 10 chữ số. Khi triển khai, checkbox kiểm soát dùng địa chỉ bước 2 hoặc nhập riêng.
4. **Gửi hồ sơ:** gửi một lần để Admin xét duyệt; chưa tạo password. Sau khi được duyệt, Customer nhận OTP qua Gmail, xác minh và tự tạo password, rồi đăng nhập. Màn hình chờ duyệt chỉ mô phỏng trạng thái này trong prototype.

Gmail/SĐT/tên/MST vẫn cần validation frontend và backend khi viết chức năng thực tế. Prototype chưa thực hiện validation hoặc gửi email; placeholder minh họa không phải hồ sơ đã gửi.

## Prototype và kiểm tra

- Đã nối Đăng ký từ Login, Tiếp tục/Quay lại giữa ba bước và Gửi yêu cầu tới màn hình chờ duyệt cho cả desktop/mobile.
- Đã loại bỏ interaction mặc định của button thư viện dẫn sang node demo của library; các liên kết chuyển bước trỏ tới frame MD Foods.
- Prototype là walkthrough; chưa mô phỏng nhập liệu thực, chọn Customer type, dropdown địa chỉ, đổi locale, đăng nhập hoặc backend submit.
- Các frame hiện dùng nội dung tiếng Việt và có selector VI/EN. Bộ frame tiếng Anh đầy đủ chưa được thiết kế trong bước này.
- Đã xem ảnh render của 10 frame, sửa các container ngang bị co chiều cao, kiểm tra font Inter, nội dung không bị che và root không tràn ở các kích thước thiết kế.
- Ảnh kiểm tra ở [previews](previews). State và node IDs ở [auth-v2-state.json](auth-v2-state.json); script dựng ở [auth-v2-figma.js](auth-v2-figma.js).

## Tài nguyên ảnh

- Login: ảnh salad của Anna Pelzer, [Unsplash](https://unsplash.com/photos/bowl-of-vegetable-salads-IGfIGP5ONV0); bản lưu tại `assets/auth-salad-anna-pelzer.jpg`.
- Register: ảnh kệ rau củ của nrd, [Unsplash](https://unsplash.com/photos/assorted-vegetables-D6Tu_L3chLE); bản lưu tại `assets/auth-produce-nrd.jpg`.
- [Unsplash License](https://unsplash.com/license). Ảnh dùng để trình bày thực phẩm trong thiết kế, không chứng minh đây là sản phẩm hoặc kho thực tế của MD Foods.
