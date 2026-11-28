import { useLayoutEffect, useRef, useState } from 'react';
import { AlertCircle, Languages, Loader2 } from 'lucide-react';
import axios from 'axios';
import { suggestTranslation } from '@/services/logistic/translationService';
import type { TranslationField, TranslationLanguage } from '@/types/logistic/translation';
import { useExecutiveText } from '@/hooks/e-commerce/useExecutiveText';
import ConfirmModal from '@/components/common/ConfirmModal';

type Props = { source: string; target: string; language: TranslationLanguage; field: TranslationField; limit: number; disabled?: boolean; onAccept: (text: string) => void };

// A changed source/target or editor session remounts this component (caller key).
export default function ExecutiveTranslationSuggestion({ source, target, language, field, limit, disabled, onAccept }: Props) {
    const tr = useExecutiveText();
    const text = source.trim();
    const [pending, setPending] = useState(false);
    const [confirmOverwrite, setConfirmOverwrite] = useState(false);
    const [error, setError] = useState('');
    const request = useRef<AbortController | null>(null);
    useLayoutEffect(() => () => { request.current?.abort(); request.current = null; }, []);
    async function translate() {
        if (request.current || !text || text.length > 2000 || disabled) return;
        const controller = new AbortController();
        request.current = controller;
        setPending(true); setError('');
        try {
            const result = (await suggestTranslation(text, language, field, controller.signal, 55_000)).trim();
            if (controller.signal.aborted || request.current !== controller) return;
            if (result.length > limit) {
                setError(tr(`Bản dịch vượt giới hạn ${limit} ký tự. Vui lòng nhập thủ công.`, `Translation exceeds ${limit} characters. Please enter it manually.`));
            } else if (result) onAccept(result);
            else setError(tr('Không nhận được bản dịch.', 'No translation received.'));
        } catch (cause) {
            if (controller.signal.aborted || request.current !== controller) return;
            const failure = axios.isAxiosError(cause) ? cause : null;
            const code = failure?.response?.data?.code;
            const status = failure?.response?.status;
            setError(failure?.code === 'ECONNABORTED' || failure?.code === 'ETIMEDOUT'
                ? tr('Dịch thuật quá thời gian chờ. Vui lòng thử lại.', 'Translation timed out. Please retry.')
                : status === 429 || code === 'AI_TRANSLATION_LIMIT_EXCEEDED' || code === 'AI_RATE_LIMIT_EXCEEDED' || code === 'TOO_MANY_REQUESTS'
                    ? tr('Đã vượt giới hạn dịch. Vui lòng thử lại sau.', 'Translation limit reached. Please retry later.')
                    : status === 401 || status === 403
                        ? tr('Tài khoản không có quyền dịch hoặc phiên đã hết hạn.', 'Translation permission denied or session expired.')
                        : tr('Không lấy được bản dịch. Hãy thử lại hoặc nhập thủ công.', 'Unable to translate. Retry or enter text manually.'));
        } finally {
            if (request.current === controller) { request.current = null; setPending(false); }
        }
    }
    const feedback = text.length > 2000
        ? tr('Dịch hỗ trợ tối đa 2.000 ký tự.', 'Translation supports up to 2,000 characters.')
        : error;
    return <div className="relative inline-flex items-center gap-1">
        <button type="button" className="inline-flex w-36 justify-center items-center gap-1 rounded-md !border !border-[#dce9dc] bg-white px-2 py-1 text-xs font-semibold text-[#1e5e42] enabled:hover:bg-[#e5f0e4] focus-visible:!border-[#276747] focus-visible:!ring-2 focus-visible:!ring-inset focus-visible:!ring-[#c5eacb] disabled:opacity-50" disabled={disabled || pending || confirmOverwrite || !text || text.length > 2000} onClick={() => target.trim() ? setConfirmOverwrite(true) : void translate()} aria-busy={pending} title={feedback || undefined}>
            {pending ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Languages size={14} aria-hidden="true" />}{pending ? tr('Đang dịch…', 'Translating…') : language === 'vi' ? tr('Dịch sang EN', 'Translate to EN') : tr('Dịch sang VI', 'Translate to VI')}
        </button>
        {feedback && <span role="alert" tabIndex={0} title={feedback}
            className="absolute right-full top-1/2 mr-1 -translate-y-1/2 text-rose-700">
            <AlertCircle size={16} aria-hidden="true" /><span className="sr-only">{feedback}</span>
        </span>}
        <ConfirmModal open={confirmOverwrite} workspace
            title={tr('Ghi đè bản dịch?', 'Replace translation?')}
            message={tr('Nội dung hiện tại sẽ được thay thế nếu dịch thành công.', 'The current text will be replaced if translation succeeds.')}
            onCancel={() => setConfirmOverwrite(false)}
            onConfirm={() => { setConfirmOverwrite(false); void translate(); }} />
    </div>;
}
