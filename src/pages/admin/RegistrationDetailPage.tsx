import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import AdminButton from '@/components/admin/AdminButton';
import AdminIcon from '@/components/admin/AdminIcon';
import AdminModal from '@/components/admin/AdminModal';
import RegistrationDetails from '@/components/admin/RegistrationDetails';
import { RegistrationError, RegistrationLoading } from '@/components/admin/RegistrationFeedback';
import RegistrationReviewDialog from '@/components/admin/RegistrationReviewDialog';
import { useRegistration, useRegistrationActions } from '@/hooks/admin/useRegistrations';
import { registrationCode } from '@/utils/admin/registration';

export default function RegistrationDetailPage() {
    const { requestId = '' } = useParams();
    const { t } = useTranslation('admin');
    const navigate = useNavigate();
    const location = useLocation();
    const registrationQuery = useRegistration(requestId);
    const { reviewMutation, resendMutation } = useRegistrationActions(requestId);
    const [reviewDecision, setReviewDecision] = useState<'APPROVE' | 'REJECT' | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [currentTime, setCurrentTime] = useState(() => Date.now());
    const resendingRef = useRef(false);
    const registration = registrationQuery.data;
    const isProcessing = reviewMutation.isPending || resendMutation.isPending;
    const secondsUntilResend = registration?.otpResendAvailableAt
        ? Math.max(
              0,
              Math.ceil(
                  (new Date(registration.otpResendAvailableAt).getTime() - currentTime) / 1000,
              ),
          )
        : 0;

    useEffect(() => {
        if (!registration?.otpResendAvailableAt) return;

        const timer = window.setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => window.clearInterval(timer);
    }, [registration?.otpResendAvailableAt]);

    function handleClose() {
        if (isProcessing) return;

        if (location.state?.fromRegistrations) {
            navigate(-1);
        } else {
            navigate(
                { pathname: ROUTES.ADMIN_REGISTRATIONS, search: location.search },
                { replace: true },
            );
        }
    }

    function handleOpenReview(decision: 'APPROVE' | 'REJECT') {
        reviewMutation.reset();
        setSuccessMessage('');
        setReviewDecision(decision);
    }

    async function handleConfirmReview(note: string) {
        if (!reviewDecision) return;

        const result = await reviewMutation.mutateAsync({
            decision: reviewDecision,
            note: note || null,
        });

        if (result.registration.status === 'REJECTED') {
            setSuccessMessage(
                result.rejectionEmailSent ? 'notices.rejected' : 'notices.rejectionEmailFailed',
            );
        } else if (result.otpSent) {
            setSuccessMessage('notices.approved');
        } else {
            setSuccessMessage('');
        }

        setReviewDecision(null);
    }

    async function handleResendOtp() {
        if (resendingRef.current || isProcessing || secondsUntilResend > 0) return;

        resendingRef.current = true;
        setSuccessMessage('');

        try {
            await resendMutation.mutateAsync();
            setCurrentTime(Date.now());
            setSuccessMessage('notices.otpSent');
        } catch {
            // Lỗi từ API được hiển thị bên trong hồ sơ.
        } finally {
            resendingRef.current = false;
        }
    }

    return (
        <>
            <AdminModal
                drawer
                labelledBy="registration-detail-title"
                onDismiss={handleClose}
                busy={isProcessing}
            >
                <header className="flex shrink-0 items-start justify-between gap-3 border-b border-black px-[27px] py-[23px] max-[600px]:px-5">
                    <div className="min-w-0">
                        <p className="text-[11px] leading-[16.5px] font-bold tracking-[1px] uppercase">
                            {t('detail.eyebrow', { id: registrationCode(requestId) })}
                        </p>
                        <h2
                            id="registration-detail-title"
                            className="pt-[5px] font-body text-[25px] leading-[37.5px] font-bold tracking-[-0.5px]"
                        >
                            {t('detail.title')}
                        </h2>
                        <p className="pt-[7px] text-[13px] leading-[22px]">
                            {t('detail.description')}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isProcessing}
                        aria-label={t('actions.close')}
                        className="grid size-[38px] shrink-0 place-items-center rounded-[3px] border border-black bg-white p-[10px]"
                    >
                        <AdminIcon name="close" />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-[27px] pt-[25px] pb-[30px] max-[600px]:px-5">
                    {registrationQuery.isPending && <RegistrationLoading />}

                    {!registrationQuery.isPending && !registration && (
                        <RegistrationError
                            error={registrationQuery.error}
                            onRetry={() => {
                                void registrationQuery.refetch();
                            }}
                        />
                    )}

                    {registration && (
                        <RegistrationDetails registration={registration}>
                            {/* Đã duyệt nhưng chưa gửi được OTP: giữ trạng thái duyệt và cho phép gửi lại. */}
                            {registration.status === 'APPROVED' &&
                                !registration.activatedAt &&
                                !registration.otpSentAt && (
                                    <div
                                        className="mt-[22px] flex items-start gap-[9px] rounded-[3px] border border-black bg-[#fffaee] p-[14px]"
                                        role="status"
                                    >
                                        <span className="pt-0.5">
                                            <AdminIcon name="warning" />
                                        </span>
                                        <div>
                                            <strong className="block text-[13px] leading-[23px]">
                                                {t('notices.otpFailedTitle')}
                                            </strong>
                                            <p className="pt-1 text-[13px] leading-[23px]">
                                                {t('notices.otpFailedDescription')}
                                            </p>
                                        </div>
                                    </div>
                                )}

                            {successMessage && (
                                <p
                                    role={
                                        successMessage === 'notices.rejectionEmailFailed'
                                            ? 'alert'
                                            : 'status'
                                    }
                                    className={`mt-[22px]! rounded-[3px] border border-black p-[14px] text-[13px] leading-6 ${successMessage === 'notices.rejectionEmailFailed' ? 'bg-[#fff8e8]' : 'bg-[#eaf4ed]'}`}
                                >
                                    {t(successMessage)}
                                </p>
                            )}

                            {(resendMutation.error ||
                                (reviewMutation.error &&
                                    (!reviewDecision || registration.status !== 'PENDING')) ||
                                registrationQuery.isRefetchError) && (
                                <div className="mt-4">
                                    <RegistrationError
                                        error={
                                            resendMutation.error ||
                                            reviewMutation.error ||
                                            registrationQuery.error
                                        }
                                    />
                                </div>
                            )}
                        </RegistrationDetails>
                    )}
                </div>

                <footer className="flex shrink-0 flex-wrap items-center justify-end gap-[10px] border-t border-black bg-white px-[27px] py-[17px] max-[600px]:px-5">
                    {/* Hồ sơ chờ duyệt */}
                    {registration?.status === 'PENDING' && (
                        <>
                            <span className="mr-auto flex items-center gap-[5px] text-[11px] leading-[16.5px] max-[600px]:w-full">
                                <AdminIcon name="once" />
                                {t('detail.onceOnly')}
                            </span>
                            <AdminButton
                                tone="subtleDanger"
                                icon="reject"
                                onClick={() => handleOpenReview('REJECT')}
                                disabled={isProcessing}
                            >
                                {t('actions.reject')}
                            </AdminButton>
                            <AdminButton
                                tone="primary"
                                icon="send"
                                onClick={() => handleOpenReview('APPROVE')}
                                disabled={isProcessing}
                            >
                                {t('actions.approve')}
                            </AdminButton>
                        </>
                    )}

                    {/* Hồ sơ đã xử lý hoặc chưa tải được */}
                    {registration?.status !== 'PENDING' && (
                        <>
                            <AdminButton onClick={handleClose} disabled={isProcessing}>
                                {t('actions.closeProfile')}
                            </AdminButton>
                            {registration?.status === 'APPROVED' && !registration.activatedAt && (
                                <AdminButton
                                    tone="primary"
                                    icon="send"
                                    busy={resendMutation.isPending}
                                    disabled={isProcessing || secondsUntilResend > 0}
                                    onClick={handleResendOtp}
                                >
                                    {secondsUntilResend > 0
                                        ? t('actions.resendCooldown', {
                                              seconds: secondsUntilResend,
                                          })
                                        : t('actions.resend')}
                                </AdminButton>
                            )}
                        </>
                    )}
                </footer>
            </AdminModal>

            {reviewDecision && registration?.status === 'PENDING' && (
                <RegistrationReviewDialog
                    key={reviewDecision}
                    registration={registration}
                    decision={reviewDecision}
                    busy={reviewMutation.isPending}
                    error={reviewMutation.error}
                    onDismiss={() => setReviewDecision(null)}
                    onConfirm={handleConfirmReview}
                />
            )}
        </>
    );
}
