import { useExecutiveConfirmation } from '@/hooks/e-commerce/useExecutiveConfirmation';
import Skeleton from '@/components/common/Skeleton';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, ImagePlus, Pencil, UploadCloud } from 'lucide-react';
import { executiveUi } from '@/constants/e-commerce/executiveUi';
import { useExecutiveText } from '@/hooks/e-commerce/useExecutiveText';
import { ExecutiveFeedback, ExecutiveSelect } from '@/components/e-commerce/ExecutiveControls';
import {
    ExecutiveEmpty,
    ExecutiveError,
    ExecutiveHeading,
    ExecutivePanel,
} from '@/components/e-commerce/ExecutiveUI';
import PromotionImageCropper from '@/components/e-commerce/PromotionImageCropper';
import { executiveApi } from '@/services/e-commerce/executiveAdminService';
import { executiveErrorMessage } from '@/services/e-commerce/executiveError';
import type { Promotion } from '@/types/e-commerce/executiveAdmin';

const MAX_BYTES = 5 * 1024 * 1024;

/** Cloudinary accepts JPG/PNG/WebP; convert AVIF before opening it in the crop editor. */
async function preparePoster(file: File): Promise<File> {
    if (file.type !== 'image/avif') return file;
    const bitmap = await createImageBitmap(file);
    try {
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Cannot decode image');
        context.drawImage(bitmap, 0, 0);
        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, 'image/jpeg', 0.86),
        );
        if (!blob || blob.size > MAX_BYTES) throw new Error('Cannot convert image');
        return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
    } finally {
        bitmap.close();
    }
}

/** Load every page, so the client-side search also works when there are 100+ campaigns. */
async function loadCampaigns(): Promise<Promotion[]> {
    const first = await executiveApi.promotions(undefined, 0, 100);
    const all = [...first.items];
    const totalPages = Math.max(1, first.totalPages);
    // Limit concurrency to five pages rather than flooding the BE with requests.
    for (let page = 1; page < totalPages; page += 5) {
        const pages = await Promise.all(
            Array.from({ length: Math.min(5, totalPages - page) }, (_, index) =>
                executiveApi.promotions(undefined, page + index, 100),
            ),
        );
        for (const result of pages) all.push(...result.items);
    }
    return all;
}

export default function EcommercePosterPage() {
    const confirm = useExecutiveConfirmation();
    const tr = useExecutiveText();
    const qc = useQueryClient();
    const [promotionId, setPromotionId] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState('');
    const [sourcePreview, setSourcePreview] = useState('');
    const [sourceName, setSourceName] = useState('');
    const [cropping, setCropping] = useState(false);
    const [message, setMessage] = useState('');
    const [failed, setFailed] = useState(false);
    const urls = useRef<{ original: string | null; cropped: string | null }>({
        original: null,
        cropped: null,
    });
    const pickerId = useRef(0);

    const promos = useQuery({
        queryKey: ['ecom', 'images-promotions'],
        queryFn: loadCampaigns,
    });
    const promotion = promos.data?.find((campaign) => campaign.id === promotionId);

    useEffect(() => {
        const storedUrls = urls.current;
        return () => {
            if (storedUrls.original) URL.revokeObjectURL(storedUrls.original);
            if (storedUrls.cropped) URL.revokeObjectURL(storedUrls.cropped);
        };
    }, []);

    function clearCrop() {
        if (urls.current.original) URL.revokeObjectURL(urls.current.original);
        if (urls.current.cropped) URL.revokeObjectURL(urls.current.cropped);
        urls.current.original = null;
        urls.current.cropped = null;
        setSourcePreview('');
        setSourceName('');
        setPreview('');
        setFile(null);
        setCropping(false);
    }

    const upload = useMutation({
        mutationFn: async () => {
            if (!file || !promotion)
                throw new Error('Choose a campaign and apply the image crop first');
            const result = await executiveApi.uploadPromotionImage(file);
            return executiveApi.updatePromotion(promotion.id, {
                nameVi: promotion.nameVi,
                nameEn: promotion.nameEn,
                contentVi: promotion.contentVi,
                contentEn: promotion.contentEn,
                startsAt: promotion.startsAt,
                endsAt: promotion.endsAt,
                imageUrl: result.imageUrl,
                promotionType: promotion.promotionType ?? 'STANDARD',
            });
        },
        onSuccess: () => {
            setMessage(
                tr(
                    'Đã tải ảnh đã cắt lên và gắn vào chiến dịch.',
                    'Cropped image uploaded and attached to campaign.',
                ),
            );
            setFailed(false);
            clearCrop();
            void qc.invalidateQueries({ queryKey: ['ecom', 'images-promotions'] });
            void qc.invalidateQueries({ queryKey: ['ecom', 'promotions'] });
        },
        onError: (error) => {
            setFailed(true);
            setMessage(
                executiveErrorMessage(
                    error,
                    tr(
                        'Không thể lưu ảnh. Vui lòng thử lại hoặc kiểm tra cấu hình tải ảnh.',
                        'Could not save the image. Retry or check image upload configuration.',
                    ),
                ),
            );
        },
    });

    async function chooseFile(next: File | undefined) {
        if (!next) return;
        if (
            !['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(next.type) ||
            next.size > MAX_BYTES
        ) {
            setFailed(true);
            setMessage(
                tr(
                    'Chỉ nhận JPG, PNG, WebP, AVIF tối đa 5 MB.',
                    'JPG, PNG, WebP or AVIF up to 5 MB only.',
                ),
            );
            return;
        }
        const sequence = ++pickerId.current;
        try {
            const selected = await preparePoster(next);
            if (sequence !== pickerId.current) return;
            clearCrop();
            const url = URL.createObjectURL(selected);
            urls.current.original = url;
            setSourceName(next.name);
            setSourcePreview(url);
            setCropping(true);
            setMessage('');
            setFailed(false);
        } catch {
            setFailed(true);
            setMessage(
                tr(
                    'Không đọc được ảnh này. Hãy chọn JPG, PNG hoặc WebP.',
                    'This image cannot be decoded. Choose JPG, PNG or WebP.',
                ),
            );
        }
    }

    function applyCrop(result: File) {
        if (urls.current.cropped) URL.revokeObjectURL(urls.current.cropped);
        const url = URL.createObjectURL(result);
        urls.current.cropped = url;
        setFile(result);
        setPreview(url);
        setCropping(false);
        setFailed(false);
        setMessage('');
    }

    return (
        <div className="space-y-6">
            <ExecutiveHeading
                number="06"
                eyebrow="MARKETING / MEDIA"
                title={tr('Ảnh khuyến mãi', 'Promotion images')}
                description={tr(
                    'Chọn chiến dịch, cắt đúng vùng banner hoặc poster rồi tải ảnh lên.',
                    'Find a campaign, choose an exact banner or poster crop, then upload.',
                )}
            />
            <ExecutiveFeedback message={message} error={failed} />
            <div className="grid gap-5 xl:grid-cols-[minmax(340px,0.9fr)_1.2fr]">
                <ExecutivePanel title={tr('Tải ảnh quảng cáo', 'Upload campaign image')}>
                    <div className="space-y-5 p-5">
                        <ExecutiveSelect
                            label={tr('Chọn chiến dịch', 'Select a campaign')}
                            value={promotionId}
                            onValueChange={setPromotionId}
                            disabled={promos.isPending || upload.isPending}
                            searchable
                            searchPlaceholder={tr(
                                'Tìm theo tên hoặc trạng thái...',
                                'Search by name or status...',
                            )}
                            emptyMessage={tr(
                                'Không tìm thấy chiến dịch phù hợp.',
                                'No matching campaigns found.',
                            )}
                        >
                            <option value="">
                                {tr('Chọn chiến dịch...', 'Choose campaign...')}
                            </option>
                            {promos.data
                                ?.filter((campaign) => campaign.status !== 'ARCHIVED')
                                .map((campaign) => (
                                    <option
                                        key={campaign.id}
                                        value={campaign.id}
                                        data-search={`${campaign.nameVi} ${campaign.nameEn} ${campaign.status}`}
                                    >
                                        {`${tr(campaign.nameVi, campaign.nameEn)} · ${campaign.status}`}
                                    </option>
                                ))}
                        </ExecutiveSelect>
                        {promos.isPending && (
                            <Skeleton className="h-3 w-2/3" />
                        )}
                        {promos.isError && (
                            <ExecutiveError
                                message={tr(
                                    'Không lấy được danh sách chiến dịch.',
                                    'Could not load campaigns.',
                                )}
                            />
                        )}
                        <label
                            className={`flex min-h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#9cbfa7] bg-[#f5faf3] px-5 py-8 text-center transition ${upload.isPending ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-[#eaf5ea]'}`}
                        >
                            <ImagePlus size={38} className="text-[#4c9367]" />
                            <strong className="mt-3 text-sm">
                                {file
                                    ? file.name
                                    : tr('Chọn ảnh để cắt', 'Select an image to crop')}
                            </strong>
                            <span className="mt-2 text-xs text-[#6d8975]">
                                JPG · PNG · WebP · AVIF · 5 MB
                            </span>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/avif"
                                disabled={upload.isPending}
                                className="sr-only"
                                onChange={(event) => {
                                    void chooseFile(event.currentTarget.files?.[0]);
                                    event.currentTarget.value = '';
                                }}
                            />
                        </label>
                        {sourcePreview && (
                            <button
                                type="button"
                                disabled={upload.isPending}
                                onClick={() => setCropping(true)}
                                className={`${executiveUi.secondary} w-full`}
                            >
                                <Pencil size={16} />
                                {tr('Chỉnh lại vùng cắt', 'Adjust crop again')}
                            </button>
                        )}
                        {sourcePreview && !file && (
                            <p className="text-xs text-[#97680b]">
                                {tr(
                                    'Hãy áp dụng vùng cắt để bật nút tải ảnh.',
                                    'Apply the crop before uploading.',
                                )}
                            </p>
                        )}
                        <p className="text-xs leading-5 text-[#667d6b]">
                            {tr(
                                'Lưu ý: thay ảnh sẽ đưa chiến dịch đã xuất bản về bản nháp để xét duyệt lại.',
                                'Note: replacing an image returns a published campaign to DRAFT for review.',
                            )}
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                void confirm(tr(
                                            'Tải ảnh đã cắt và cập nhật chiến dịch?',
                                            'Upload cropped image and update campaign?',
                                        ), () => upload.mutateAsync());
                            }}
                            disabled={!file || !promotion || upload.isPending || promos.isPending}
                            className={`${executiveUi.button} w-full`}
                        >
                            <UploadCloud size={17} />
                            {upload.isPending
                                ? tr('Đang tải ảnh...', 'Uploading...')
                                : tr('Tải ảnh đã cắt lên chiến dịch', 'Upload cropped image')}
                        </button>
                    </div>
                </ExecutivePanel>
                <ExecutivePanel
                    title={tr('Xem trước ảnh', 'Image preview')}
                    caption={
                        promotion
                            ? tr(promotion.nameVi, promotion.nameEn)
                            : tr(
                                  'Chọn chiến dịch để hiển thị ảnh hiện tại.',
                                  'Select a campaign to view its image.',
                              )
                    }
                >
                    <div className="flex min-h-[350px] items-center justify-center bg-[#eef4e9] p-6">
                        {preview || promotion?.imageUrl ? (
                            <img
                                src={preview || promotion?.imageUrl || ''}
                                alt={tr('Ảnh banner xem trước', 'Banner preview')}
                                className="max-h-[420px] w-full rounded-2xl object-contain shadow-lg"
                            />
                        ) : (
                            <ExecutiveEmpty
                                icon={<ImagePlus />}
                                title={tr('Chưa có ảnh', 'No image selected')}
                                description={tr(
                                    'Chọn ảnh để cắt và xem trước trước khi lưu.',
                                    'Select and crop an image to preview it before saving.',
                                )}
                            />
                        )}
                    </div>
                    {preview && (
                        <div className="flex items-center gap-2 border-t px-5 py-4 text-xs font-semibold text-[#377b52]">
                            <CheckCircle2 size={16} />
                            {tr(
                                'Đây là ảnh sau khi cắt, đúng ảnh sẽ được tải lên.',
                                'This is the cropped image that will be uploaded.',
                            )}
                        </div>
                    )}
                    {promotion?.imageUrl && !preview && (
                        <div className="flex items-center gap-2 border-t px-5 py-4 text-xs font-semibold text-[#377b52]">
                            <CheckCircle2 size={16} />
                            {tr('Ảnh hiện tại của chiến dịch', 'Current campaign image')}
                        </div>
                    )}
                </ExecutivePanel>
            </div>
            {cropping && sourcePreview && (
                <PromotionImageCropper
                    src={sourcePreview}
                    originalName={sourceName}
                    onApply={applyCrop}
                    onCancel={() => setCropping(false)}
                />
            )}
        </div>
    );
}
