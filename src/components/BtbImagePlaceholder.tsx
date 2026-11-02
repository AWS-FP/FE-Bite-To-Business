import type { CSSProperties } from 'react';

type BtbImagePlaceholderProps = {
  label?: string;
  className?: string;
  style?: CSSProperties;
};

/** UI-only: hình ảnh sẽ được gắn vào khi hoàn thiện website. */
export default function BtbImagePlaceholder({
  label = 'Ảnh sẽ bổ sung',
  className = '',
  style,
}: BtbImagePlaceholderProps) {
  return (
    <div className={`btb-image-placeholder ${className}`.trim()} style={style} role="img" aria-label={label}>
      <img src="/images/ui/image-placeholder.svg" alt="" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
