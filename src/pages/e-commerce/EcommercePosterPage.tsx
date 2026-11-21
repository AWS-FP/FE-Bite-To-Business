import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, ImagePlus, UploadCloud } from 'lucide-react';
import { executiveUi, useExecutiveText } from '@/components/e-commerce/executiveTokens';
import { ExecutiveFeedback, ExecutiveSelect } from '@/components/e-commerce/ExecutiveControls';
import {
    ExecutiveEmpty,
    ExecutiveError,
    ExecutiveHeading,
    ExecutivePanel,
} from '@/components/e-commerce/ExecutiveUI';
import { executiveApi } from '@/services/e-commerce/executiveAdminService';
import { executiveErrorMessage } from '@/services/e-commerce/executiveError';

async function preparePoster(file: File): Promise<File> {
    const header = new Uint8Array(await file.slice(0, 64).arrayBuffer());
    const brands = String.fromCharCode(...header);
    if (brands.slice(4, 8) !== 'ftyp' || !/avif|avis/.test(brands.slice(8))) return file;
    const bitmap = await createImageBitmap(file);
    try {
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('decode');
        ctx.drawImage(bitmap, 0, 0);
        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, 'image/webp', 0.9),
        );
        if (!blob || blob.size > MAX_BYTES) throw new Error('convert');
        return new File(
            [blob],
            file.name.replace(/\.[^.]+$/, '') + (blob.type === 'image/png' ? '.png' : '.webp'),
            { type: blob.type },
        );
    } finally {
        bitmap.close();
    }
}
const MAX_BYTES = 5 * 1024 * 1024;
export default function EcommercePosterPage() {
    const tr = useExecutiveText(),
        qc = useQueryClient();
    const [promotionId, setPromotionId] = useState(''),
        [file, setFile] = useState<File | null>(null),
        [preview, setPreview] = useState(''),
        [message, setMessage] = useState(''),
        [failed, setFailed] = useState(false);
    const objectUrl = useRef<string | null>(null);
    const promos = useQuery({
        queryKey: ['ecom', 'images-promotions'],
        queryFn: () => executiveApi.promotions(undefined, 0, 100),
    });
    const promotion = promos.data?.items.find((p) => p.id === promotionId);
    useEffect(
        () => () => {
            if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
        },
        [],
    );
    const upload = useMutation({
        mutationFn: async () => {
            if (!file || !promotion) throw new Error('Select an image and a promotion');
            const result = await executiveApi.uploadPromotionImage(await preparePoster(file));
            return executiveApi.updatePromotion(promotion.id, {
                nameVi: promotion.nameVi,
                nameEn: promotion.nameEn,
                contentVi: promotion.contentVi,
                contentEn: promotion.contentEn,
                startsAt: promotion.startsAt,
                endsAt: promotion.endsAt,
                imageUrl: result.imageUrl,
            });
        },
        onSuccess: () => {
            setMessage(
                tr(
                    'Ảnh đã được tải lên và gắn vào chiến dịch.',
                    'Image uploaded and attached to the campaign.',
                ),
            );
            setFailed(false);
            setFile(null);
            if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
            objectUrl.current = null;
            setPreview('');
            void qc.invalidateQueries({ queryKey: ['ecom', 'images-promotions'] });
            void qc.invalidateQueries({ queryKey: ['ecom', 'promotions'] });
        },
        onError: (error) => {
            setFailed(true);
            setMessage(
                executiveErrorMessage(
                    error,
                    tr(
                        'Không lưu được ảnh. Hãy thử lại hoặc chọn ảnh JPG, PNG hay WebP tối đa 5 MB.',
                        'Could not save this image. Retry or choose a JPG, PNG or WebP up to 5 MB.',
                    ),
                ),
            );
        },
    });
    function chooseFile(next: File | undefined) {
        if (!next) {
            setFile(null);
            setPreview('');
            return;
        }
        if (
            !['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(next.type) ||
            next.size > MAX_BYTES
        ) {
            setFile(null);
            setPreview('');
            setFailed(true);
            setMessage(
                tr(
                    'Chỉ nhận JPG, PNG, WebP, AVIF tối đa 5 MB.',
                    'JPG, PNG, WebP or AVIF up to 5 MB only.',
                ),
            );
            return;
        }
        if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
        objectUrl.current = URL.createObjectURL(next);
        setPreview(objectUrl.current);
        setFailed(false);
        setMessage('');
        setFile(next);
    }
    return (
        <div className="space-y-6">
            <ExecutiveHeading
                number="06"
                eyebrow="MARKETING / MEDIA"
                title={tr('Ảnh khuyến mãi', 'Promotion images')}
                description={tr(
                    'Tải banner hoặc poster đã thiết kế sẵn, xem trước và liên kết với chiến dịch.',
                    'Upload an existing banner or poster and attach it to a campaign.',
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
                        >
                            <option value="">
                                {tr('Chọn chiến dịch...', 'Choose campaign...')}
                            </option>
                            {promos.data?.items
                                .filter((p) => p.status !== 'ARCHIVED')
                                .map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {`${tr(p.nameVi, p.nameEn)} · ${p.status}`}
                                    </option>
                                ))}
                        </ExecutiveSelect>
                        {promos.isError && (
                            <ExecutiveError
                                message={tr(
                                    'Không lấy được danh sách chiến dịch.',
                                    'Could not load campaigns.',
                                )}
                            />
                        )}
                        <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#9cbfa7] bg-[#f5faf3] px-5 py-8 text-center transition hover:bg-[#eaf5ea]">
                            <ImagePlus size={38} className="text-[#4c9367]" />
                            <strong className="mt-3 text-sm">
                                {file
                                    ? file.name
                                    : tr(
                                          'Chọn ảnh từ máy tính',
                                          'Choose an image from your device',
                                      )}
                            </strong>
                            <span className="mt-2 text-xs text-[#6d8975]">
                                JPG · PNG · WebP · AVIF · 5 MB
                            </span>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/avif"
                                className="sr-only"
                                onChange={(e) => chooseFile(e.currentTarget.files?.[0])}
                            />
                        </label>
                        <p className="text-xs leading-5 text-[#667d6b]">
                            {tr(
                                'Lưu ý: thay ảnh sẽ đưa chiến dịch đã xuất bản về bản nháp để xét duyệt lại.',
                                'Note: replacing an image returns a published campaign to DRAFT for review.',
                            )}
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                if (
                                    window.confirm(
                                        tr(
                                            'Tải ảnh và cập nhật chiến dịch?',
                                            'Upload and update the campaign?',
                                        ),
                                    )
                                )
                                    upload.mutate();
                            }}
                            disabled={!file || !promotion || upload.isPending || promos.isLoading}
                            className={`${executiveUi.button} w-full`}
                        >
                            <UploadCloud size={17} />
                            {upload.isPending
                                ? tr('Đang tải ảnh...', 'Uploading...')
                                : tr('Tải lên & lưu vào chiến dịch', 'Upload and attach')}
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
                                    'Chọn ảnh để xem trước trước khi lưu.',
                                    'Select an image to preview it before saving.',
                                )}
                            />
                        )}
                    </div>
                    {promotion?.imageUrl && !preview && (
                        <div className="flex items-center gap-2 border-t px-5 py-4 text-xs font-semibold text-[#377b52]">
                            <CheckCircle2 size={16} />
                            {tr('Ảnh hiện tại của chiến dịch', 'Current campaign image')}
                        </div>
                    )}
                </ExecutivePanel>
            </div>
        </div>
    );
}
