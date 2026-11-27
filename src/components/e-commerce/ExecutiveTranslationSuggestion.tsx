import { useEffect, useRef, useState } from 'react';
import { Languages } from 'lucide-react';
import axios from 'axios';
import { suggestTranslation } from '@/services/logistic/translationService';
import type { TranslationField, TranslationLanguage } from '@/types/logistic/translation';
import { useExecutiveText } from '@/hooks/e-commerce/useExecutiveText';
import { executiveUi } from '@/constants/e-commerce/executiveUi';

type Props = { source: string; language: TranslationLanguage; field: TranslationField; limit: number; disabled?: boolean; onAccept: (text: string) => void };

// A changed source/target or editor session remounts this component (caller key).
export default function ExecutiveTranslationSuggestion({ source, language, field, limit, disabled, onAccept }: Props) {
    const tr = useExecutiveText();
    const text = source.trim();
    const [pending, setPending] = useState(false);
    const [suggestion, setSuggestion] = useState('');
    const [error, setError] = useState('');
    const request = useRef<AbortController | null>(null);
    useEffect(() => () => { request.current?.abort(); request.current = null; }, []);
    async function translate() {
        if (request.current || !text || text.length > 2000 || disabled) return;
        const controller = new AbortController();
        request.current = controller;
        setPending(true); setSuggestion(''); setError('');
        try {
            const result = (await suggestTranslation(text, language, field, controller.signal, 55_000)).trim();
            if (controller.signal.aborted || request.current !== controller) return;
            if (result) setSuggestion(result);
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
    return <div className="space-y-2">
        <button type="button" className="inline-flex items-center gap-1 rounded-md !border !border-[#dce9dc] bg-white px-2 py-1 text-xs font-semibold text-[#1e5e42] enabled:hover:bg-[#e5f0e4] focus-visible:!border-[#276747] focus-visible:!ring-2 focus-visible:!ring-inset focus-visible:!ring-[#c5eacb] disabled:opacity-50" disabled={disabled || pending || !text || text.length > 2000} onClick={() => void translate()} aria-busy={pending}>
            <Languages size={14} aria-hidden="true" />{pending ? tr('Đang dịch…', 'Translating…') : language === 'vi' ? tr('Dịch sang EN', 'Translate to EN') : tr('Dịch sang VI', 'Translate to VI')}
        </button>
        {text.length > 2000 && <p className="text-xs text-[#765c26]">{tr('Dịch hỗ trợ tối đa 2.000 ký tự.', 'Translation supports up to 2,000 characters.')}</p>}
        {error && <p role="alert" className="text-xs text-rose-700">{error}</p>}
        {suggestion && <div className="space-y-2 rounded-lg border border-[#dce9dc] bg-[#f0f5f1] p-3 text-sm">
            <p className="text-xs font-semibold">{tr('Bản dịch gợi ý', 'Suggested translation')}</p>
            <p className="whitespace-pre-wrap break-words font-normal">{suggestion}</p>
            {suggestion.length > limit ? <p role="alert" className="text-xs text-rose-700">{tr(`Bản dịch vượt giới hạn ${limit} ký tự. Vui lòng nhập thủ công.`, `Translation exceeds ${limit} characters. Please enter it manually.`)}</p> : <button type="button" className={executiveUi.secondary} disabled={disabled} onClick={() => { onAccept(suggestion); setSuggestion(''); }}>{tr('Dùng gợi ý', 'Use suggestion')}</button>}
        </div>}
    </div>;
}
