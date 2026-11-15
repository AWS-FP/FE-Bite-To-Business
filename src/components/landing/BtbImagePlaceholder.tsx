import type { CSSProperties } from 'react';
import EditorialPhoto, { type EditorialPhotoKey } from './EditorialPhoto';

type Props = {
    label?: string;
    photo?: EditorialPhotoKey;
    className?: string;
    style?: CSSProperties;
};

/** Giữ API component cũ để LandingCarousel/LandingSegments không đổi logic. */
export default function BtbImagePlaceholder({
    label = 'Ảnh nguyên liệu minh họa',
    photo = 'market',
    className = '',
    style,
}: Props) {
    return (
        <EditorialPhoto
            photo={photo}
            alt={label}
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-cover ${className}`.trim()}
            style={style}
        />
    );
}
