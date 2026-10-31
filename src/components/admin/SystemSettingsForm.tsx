import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Save, RotateCcw, PlugZap, Trash2, Info } from 'lucide-react';
import AdminButton from './AdminButton';
import {
    systemDraftDefaults,
    systemDraftSchema,
    type SystemConfigDraft,
} from '@/validations/admin/systemSchema';

const savedDraftSchema = z.object({
    settings: systemDraftSchema,
    savedAt: z.string().datetime(),
});

function readSavedDraft(storageKey: string) {
    try {
        const stored = sessionStorage.getItem(storageKey);
        if (!stored) return null;
        const result = savedDraftSchema.safeParse(JSON.parse(stored));
        return result.success ? result.data : null;
    } catch {
        return null;
    }
}

export default function SystemSettingsForm({ storageKey }: { storageKey: string }) {
    const { t, i18n } = useTranslation('admin');
    const [savedDraft, setSavedDraft] = useState(() => readSavedDraft(storageKey));
    const [notice, setNotice] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<SystemConfigDraft>({
        resolver: zodResolver(systemDraftSchema),
        defaultValues: savedDraft?.settings ?? systemDraftDefaults,
    });

    function saveDraft(settings: SystemConfigDraft) {
        try {
            const draft = { settings, savedAt: new Date().toISOString() };
            sessionStorage.setItem(storageKey, JSON.stringify(draft));
            setSavedDraft(draft);
            reset(settings);
            setNotice('system.settings.saved');
        } catch {
            setNotice('system.settings.storageError');
        }
    }

    function discardChanges() {
        reset(savedDraft?.settings ?? systemDraftDefaults);
        setNotice(null);
    }

    function clearDraft() {
        try {
            sessionStorage.removeItem(storageKey);
            setSavedDraft(null);
            reset(systemDraftDefaults);
            setNotice('system.settings.deleted');
        } catch {
            setNotice('system.settings.storageError');
        }
    }

    return (
        <div className="system-settings-layout">
            <form onSubmit={handleSubmit(saveDraft)} noValidate className="system-panel">
                <header className="system-panel-heading">
                    <div>
                        <h2>{t('system.settings.title')}</h2>
                        <p>{t('system.settings.description')}</p>
                    </div>
                    <span className="system-badge system-badge-yellow">
                        {t('system.settings.draft')}
                    </span>
                </header>
                <div className="system-form-body">
                    <div className="system-notice">
                        <Info size={19} aria-hidden="true" />
                        <p>{t('system.settings.draftNotice')}</p>
                    </div>
                    {notice && (
                        <p
                            className={`system-message ${notice === 'system.settings.storageError' ? 'system-message-error' : ''}`}
                            role={notice === 'system.settings.storageError' ? 'alert' : 'status'}
                        >
                            {t(notice)}
                        </p>
                    )}
                    <h3 className="system-section-label">{t('system.settings.modelSection')}</h3>
                    <div className="system-form-grid">
                        <label>
                            {t('system.settings.primaryModel')}
                            <input
                                {...register('primaryModel')}
                                maxLength={256}
                                placeholder={t('system.settings.modelPlaceholder')}
                                aria-invalid={!!errors.primaryModel}
                                aria-describedby="system-primary-model-hint"
                            />
                            <small
                                id="system-primary-model-hint"
                                className={errors.primaryModel ? 'system-field-error' : ''}
                            >
                                {errors.primaryModel
                                    ? t(
                                          errors.primaryModel.message ||
                                              'system.validation.modelRequired',
                                      )
                                    : t('system.settings.modelHint')}
                            </small>
                        </label>
                        <label className="system-field-full">
                            {t('system.settings.fallbackModel')}
                            <input
                                {...register('fallbackModel')}
                                maxLength={256}
                                placeholder={t('system.settings.optional')}
                                aria-invalid={!!errors.fallbackModel}
                                aria-describedby="system-fallback-model-hint"
                            />
                            {errors.fallbackModel && (
                                <small
                                    id="system-fallback-model-hint"
                                    className="system-field-error"
                                >
                                    {t(
                                        errors.fallbackModel.message ||
                                            'system.validation.differentModel',
                                    )}
                                </small>
                            )}
                        </label>
                    </div>

                    <h3 className="system-section-label">{t('system.settings.limitsSection')}</h3>
                    <div className="system-form-grid system-form-grid-three">
                        <label>
                            {t('system.settings.maxTokens')}
                            <input
                                type="number"
                                min={1}
                                max={1_000_000}
                                step={1}
                                {...register('maxTokens', { valueAsNumber: true })}
                                aria-invalid={!!errors.maxTokens}
                            />
                            {errors.maxTokens && (
                                <small className="system-field-error">
                                    {t('system.validation.tokens')}
                                </small>
                            )}
                        </label>
                        <label>
                            {t('system.settings.timeout')}
                            <input
                                type="number"
                                min={5}
                                max={120}
                                step={1}
                                {...register('timeoutSeconds', { valueAsNumber: true })}
                                aria-invalid={!!errors.timeoutSeconds}
                            />
                            {errors.timeoutSeconds && (
                                <small className="system-field-error">
                                    {t('system.validation.timeout')}
                                </small>
                            )}
                        </label>
                        <label>
                            {t('system.settings.retries')}
                            <input
                                type="number"
                                min={0}
                                max={3}
                                step={1}
                                {...register('retries', { valueAsNumber: true })}
                                aria-invalid={!!errors.retries}
                            />
                            {errors.retries && (
                                <small className="system-field-error">
                                    {t('system.validation.retries')}
                                </small>
                            )}
                        </label>
                    </div>

                    <h3 className="system-section-label">{t('system.settings.alertsSection')}</h3>
                    <div className="system-form-grid">
                        <label>
                            {t('system.settings.errorThreshold')}
                            <input
                                type="number"
                                min={0}
                                max={100}
                                step="0.1"
                                {...register('errorThreshold', { valueAsNumber: true })}
                                aria-invalid={!!errors.errorThreshold}
                            />
                            <small className={errors.errorThreshold ? 'system-field-error' : ''}>
                                {t(
                                    errors.errorThreshold
                                        ? 'system.validation.percent'
                                        : 'system.settings.errorHint',
                                )}
                            </small>
                        </label>
                        <label>
                            {t('system.settings.budgetThreshold')}
                            <input
                                type="number"
                                min={0}
                                max={100}
                                step="0.1"
                                {...register('budgetThreshold', { valueAsNumber: true })}
                                aria-invalid={!!errors.budgetThreshold}
                            />
                            <small className={errors.budgetThreshold ? 'system-field-error' : ''}>
                                {t(
                                    errors.budgetThreshold
                                        ? 'system.validation.percent'
                                        : 'system.settings.budgetHint',
                                )}
                            </small>
                        </label>
                    </div>

                    <fieldset className="system-feature-settings">
                        <legend className="system-section-label">
                            {t('system.settings.featuresSection')}
                        </legend>
                        <label>
                            <input type="checkbox" {...register('chatEnabled')} />
                            <span>
                                {t('system.settings.chat')}
                                <small>{t('system.settings.chatHint')}</small>
                            </span>
                        </label>
                        <label>
                            <input type="checkbox" {...register('recommendationsEnabled')} />
                            <span>
                                {t('system.settings.recommendations')}
                                <small>{t('system.settings.recommendationsHint')}</small>
                            </span>
                        </label>
                        <label>
                            <input type="checkbox" {...register('generativeUiEnabled')} />
                            <span>
                                {t('system.settings.generativeUi')}
                                <small>{t('system.settings.generativeUiHint')}</small>
                            </span>
                        </label>
                    </fieldset>
                </div>
                <footer className="system-form-footer">
                    <AdminButton onClick={discardChanges} disabled={!isDirty}>
                        <RotateCcw size={16} />
                        {t('system.settings.cancel')}
                    </AdminButton>
                    <AdminButton type="submit" tone="primary" disabled={!isDirty}>
                        <Save size={16} />
                        {t('system.settings.saveDraft')}
                    </AdminButton>
                </footer>
            </form>

            <aside className="system-settings-aside">
                <section className="system-panel system-note-card">
                    <span className="system-section-label">{t('system.settings.connection')}</span>
                    <PlugZap size={30} strokeWidth={1.5} aria-hidden="true" />
                    <h2>{t('system.settings.notConnected')}</h2>
                    <p>{t('system.settings.connectionHint')}</p>
                    <AdminButton disabled title={t('system.settings.connectionHint')}>
                        {t('system.settings.checkConnection')}
                    </AdminButton>
                </section>
                <section className="system-panel system-note-card">
                    <h2>{t('system.settings.savedDraft')}</h2>
                    <p>
                        {savedDraft
                            ? new Intl.DateTimeFormat(
                                  i18n.resolvedLanguage === 'en' ? 'en-GB' : 'vi-VN',
                                  {
                                      dateStyle: 'medium',
                                      timeStyle: 'short',
                                      timeZone: 'Asia/Ho_Chi_Minh',
                                  },
                              ).format(new Date(savedDraft.savedAt))
                            : t('system.settings.noDraft')}
                    </p>
                    <p>{t('system.settings.modelLimitsHint')}</p>
                    <AdminButton onClick={clearDraft} disabled={!savedDraft} tone="subtleDanger">
                        <Trash2 size={16} />
                        {t('system.settings.deleteDraft')}
                    </AdminButton>
                </section>
            </aside>
        </div>
    );
}
