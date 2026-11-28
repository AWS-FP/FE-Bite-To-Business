import { useId } from 'react';
import ExecutiveTranslationSuggestion from '@/components/e-commerce/ExecutiveTranslationSuggestion';
import { executiveUi } from '@/constants/e-commerce/executiveUi';
import type { TranslationField, TranslationLanguage } from '@/types/logistic/translation';

type Props = { label: string; value: string; source: string; sourceLanguage: TranslationLanguage; field: TranslationField; limit: number; session: string; onChange: (value: string) => void; multiline?: boolean; required?: boolean; disabled?: boolean };

export default function ExecutiveTranslatedField({ label, value, source, sourceLanguage, field, limit, session, onChange, multiline, required, disabled }: Props) {
    const id = useId();
    return <div className="min-w-0 space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-1">
            <label htmlFor={id} className="text-xs font-bold leading-7">{label}</label>
            <div className="min-w-0 max-w-full">
                <ExecutiveTranslationSuggestion key={JSON.stringify([session, source, value, sourceLanguage, field, disabled])} source={source} target={value} language={sourceLanguage} field={field} limit={limit} disabled={disabled} onAccept={onChange} />
            </div>
        </div>
        {multiline ? <textarea id={id} rows={3} maxLength={limit} className={`${executiveUi.input} !h-auto py-3`} value={value} onChange={e => onChange(e.target.value)} required={required} /> : <input id={id} className={executiveUi.input} value={value} maxLength={limit} required={required} onChange={e => onChange(e.target.value)} />}
    </div>;
}
