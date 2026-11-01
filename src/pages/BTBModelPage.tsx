import BTBInfoLayout from '@/components/BTBInfoLayout';
import BTBModelOverview from '@/components/BTBModelOverview';

export default function BTBModelPage() {
  return (
    <BTBInfoLayout
      eyebrow="MÔ HÌNH NỀN TẢNG"
      title="Mô hình Bite to Business"
      description="Tìm hiểu các bên tham gia và quy trình của BTB: từ nguồn cung, danh mục và báo giá đến đặt hàng và quản lý tài khoản."
    >
      <BTBModelOverview />
    </BTBInfoLayout>
  );
}