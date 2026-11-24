import { useTranslation } from 'react-i18next';
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
    label,
    photo = 'market',
    className = '',
    style,
}: Props) {
    const { t } = useTranslation('storefront');
    return (
        <EditorialPhoto
            photo={photo}
            alt={label ?? t('landing.carousel.ingredientsAlt')}
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-cover ${className}`.trim()}
            style={style}
        />
    );
}