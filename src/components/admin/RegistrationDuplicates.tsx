import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Pagination from '@/components/common/Pagination';
import { getRegistrationDuplicates } from '@/services/admin/registrationService';

const PAGE_SIZE = 10;

const statusTone: Record<string, string> = {
    SENT: 'border-[#9fd3b0] bg-[#e7f5ec] text-store-green',
    PENDING: 'border-[#f0c75e] bg-[#fff6dc] text-[#8a5a00]',
    SKIPPED: 'border-black/20 bg-store-cream text-store-ink',
    FAILED: 'border-[#f2b8b0] bg-[#fdecea] text-[#b42318]',
};

/**
 * Registrations that reused an email/phone of an existing account. The public form shows them a
 * normal receipt (so nobody can probe which accounts exist); they appear here flagged as duplicates
 * and the system emails them a rejection automatically.
 */
export default function RegistrationDuplicates() {
    const { t, i18n } = useTranslation('admin');
    const [page, setPage] = useState(0);
    const query = useQuery({
        queryKey: ['admin-registration-duplicates', page],
        queryFn: ({ signal }) => getRegistrationDuplicates(page, PAGE_SIZE, signal),
    });
    const locale = i18n.resolvedLanguage === 'en' ? 'en-US' : 'vi-VN';

    return (
        <section
            className="mt-6 min-w-0 rounded-[3px] border border-black bg-white"
            aria-labelledby="registration-duplicates-title"
        >
            <div className="px-6 pt-6">
                <h2
                    id="registration-duplicates-title"
                    className="flex flex-wrap items-center gap-[9px] font-subheading text-[18px] leading-[27px] font-bold"
                >
                    {t('duplicates.title')}
                    {query.data && (
                        <span className="rounded-[2px] border border-black bg-[#fdecea] px-[7px] py-0.5 text-[11px] leading-[17px] font-semibold">
                            {query.data.totalElements}
                        </span>
                    )}
                </h2>
                <p className="mt-1 text-[13px] leading-6 text-store-muted">{t('duplicates.description')}</p>
            </div>

            {query.isPending && <p className="px-6 py-6 text-[13px]">{t('duplicates.loading')}</p>}
            {query.isError && (
                <p role="alert" className="px-6 py-6 text-[13px] text-red-700">
                    {t('duplicates.error')}
                </p>
            )}
            {query.isSuccess && query.data.content.length === 0 && (
                <p className="px-6 py-6 text-[13px] text-store-muted">{t('duplicates.empty')}</p>
            )}
            {query.isSuccess && query.data.content.length > 0 && (
                <div className="mt-4 overflow-x-auto border-t border-black">
                    <table className="w-full min-w-[760px] border-collapse text-left text-[13px]">
                        <thead className="bg-store-cream text-[12px] font-bold">
                            <tr>
                                <th className="px-4 py-3">{t('duplicates.columns.time')}</th>
                                <th className="px-4 py-3">{t('duplicates.columns.name')}</th>
                                <th className="px-4 py-3">{t('duplicates.columns.email')}</th>
                                <th className="px-4 py-3">{t('duplicates.columns.phone')}</th>
                                <th className="px-4 py-3">{t('duplicates.columns.duplicate')}</th>
                                <th className="px-4 py-3">{t('duplicates.columns.mail')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {query.data.content.map((row) => (
                                <tr key={row.id} className="border-t border-black/10 align-top">
                                    <td className="whitespace-nowrap px-4 py-3">
                                        {new Date(row.createdAt).toLocaleString(locale)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {`${row.lastName ?? ''} ${row.firstName ?? ''}`.trim() || '—'}
                                    </td>
                                    <td className="break-all px-4 py-3">{row.email}</td>
                                    <td className="whitespace-nowrap px-4 py-3">{row.phone ?? '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex rounded-full border border-[#f2b8b0] bg-[#fdecea] px-2.5 py-0.5 text-[12px] font-bold text-[#b42318]">
                                            {t(`duplicates.field.${row.duplicateField}`)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex rounded-full border px-2.5 py-0.5 text-[12px] font-bold ${statusTone[row.emailStatus] ?? ''}`}
                                        >
                                            {t(`duplicates.mail.${row.emailStatus}`)}
                                        </span>
                                        {row.emailSentAt && (
                                            <span className="mt-1 block text-[11px] text-store-muted">
                                                {new Date(row.emailSentAt).toLocaleString(locale)}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {query.isSuccess && query.data.totalPages > 1 && (
                <Pagination page={page} totalPages={query.data.totalPages} onPageChange={setPage} />
            )}
        </section>
    );
}
