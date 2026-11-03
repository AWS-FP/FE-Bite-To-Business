
import { ImageIcon } from 'lucide-react';
import { useState } from 'react';

type CheckoutProductImageProps = {
  name: string;
  src?: string | null;
};

export default function CheckoutProductImage({
  name,
  src,
}: CheckoutProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const showImage = Boolean(src) && src !== failedSrc;

  return (
    <div
      className="btb-co-product-image"
      role={showImage ? undefined : 'img'}
      aria-label={
        showImage ? undefined : `Chưa có ảnh sản phẩm ${name}`
      }
    >
      {showImage ? (
        <img
          src={src!}
          alt={name}
          loading="lazy"
          onError={() => setFailedSrc(src!)}
        />
      ) : (
        <ImageIcon
          size={21}
          strokeWidth={1.6}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
