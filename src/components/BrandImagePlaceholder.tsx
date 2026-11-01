interface BrandImagePlaceholderProps {
  label: string;
  variant?: 'hero' | 'product' | 'brand';
  className?: string;
}

/** Chỉ hiển thị khung chờ; cố ý không gọi URL ảnh thật. */
export default function BrandImagePlaceholder({
  label,
  variant = 'product',
  className = '',
}: BrandImagePlaceholderProps) {
  return (
    <div className={`btb-brand-placeholder btb-brand-placeholder--${variant} ${className}`} role="img" aria-label={`Vị trí hình ảnh: ${label}`}>
      <img src="/images/ui/brand/image-placeholder.svg" alt="" aria-hidden="true" width={34} height={34} />
      <span>{label}</span>
    </div>
  );
}