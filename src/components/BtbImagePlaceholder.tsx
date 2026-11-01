
import type { CSSProperties } from 'react';

type BtbImagePlaceholderProps = {
  label?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Placeholder dùng chung cho Landing Page.
 * UI-only: chưa sử dụng hình ảnh sản phẩm thật.
 */
export default function BtbImagePlaceholder({
  label = 'Ảnh sẽ bổ sung',
  className = '',
  style,
}: BtbImagePlaceholderProps) {
  return (
    <div
      className={`btb-image-placeholder ${className}`.trim()}
      style={style}
      role="img"
      aria-label={label}
    >
      <img
        src="/images/ui/image-placeholder.svg"
        alt=""
        aria-hidden="true"
      />

      <span>{label}</span>
    </div>
  );
}
