import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { RegistrationResponse } from '../types/registration.types'
import { customerName } from '../utils/registration'
import AdminButton from './AdminButton'
import AdminIcon from './AdminIcon'
import AdminModal from './AdminModal'
import { RegistrationError } from './RegistrationFeedback'

interface RegistrationReviewDialogProps {
  registration: RegistrationResponse
  decision: 'APPROVE' | 'REJECT'
  busy: boolean
  error: unknown
  onDismiss: () => void
  onConfirm: (note: string) => Promise<unknown>
}

export default function RegistrationReviewDialog({
  registration,
  decision,
  busy,
  error,
  onDismiss,
  onConfirm,
}: RegistrationReviewDialogProps) {
  const { t } = useTranslation('admin')
  const [note, setNote] = useState('')
  const submittingRef = useRef(false)
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (submittingRef.current || busy || (decision === 'REJECT' && !note.trim())) return
    submittingRef.current = true
    try {
      await onConfirm(note.trim())
    } catch {
      /* Mutation error is rendered below. */
    } finally {
      submittingRef.current = false
    }
  }

  return (
    <AdminModal labelledBy="registration-review-title" onDismiss={onDismiss} busy={busy}>
      <div className="flex shrink-0 items-start justify-between px-[25px] pt-[25px]">
        <span
          className={`grid size-[46px] place-items-center rounded-full border border-black ${decision === 'APPROVE' ? 'bg-[#d9eea3]' : 'bg-[#ffb4ba]'}`}
        >
          <AdminIcon name={decision === 'APPROVE' ? 'approve-large' : 'reject-large'} />
        </span>
        <button
          type="button"
          onClick={onDismiss}
          disabled={busy}
          aria-label={t('actions.close')}
          className="grid size-[38px] place-items-center rounded-[3px] border border-black bg-white p-[10px]"
        >
          <AdminIcon name="close" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
        <div className="min-h-0 overflow-y-auto px-[25px] pt-[21px] pb-[25px]">
          <h2
            id="registration-review-title"
            className="font-body text-[23px] leading-[34.5px] font-bold tracking-[-0.5px]"
          >
            {decision === 'APPROVE' ? t('review.approveTitle') : t('review.rejectTitle')}
          </h2>
          <p className="pt-3 text-[14px] leading-[25.2px]">
            {decision === 'APPROVE'
              ? t('review.approveDescription')
              : t('review.rejectDescription', { name: customerName(registration.customer) })}
          </p>
          {decision === 'APPROVE' ? (
            <>
              <div className="mt-[18px] flex items-center gap-[10px] rounded-[3px] border border-black bg-[#fff8e8] p-[14px]">
                <AdminIcon name="mail" />
                <div className="min-w-0">
                  <p className="pb-1 text-[12px] leading-[18px]">{t('review.recipient')}</p>
                  <strong className="block text-[14px] leading-[21px] wrap-anywhere">
                    {registration.customer.email}
                  </strong>
                </div>
              </div>
              <div className="mt-[18px] mb-[21px] flex items-start gap-[9px] rounded-[3px] border border-black bg-[#fff8e8] p-[14px]">
                <span className="pt-0.5">
                  <AdminIcon name="info" />
                </span>
                <p className="text-[13px] leading-[23.4px]">{t('review.activationNote')}</p>
              </div>
            </>
          ) : (
            <label className="mt-[18px] block pb-[18px] font-body">
              <span className="block pb-2 text-[14px] leading-[21px] font-semibold">
                {t('review.reason')} *
              </span>
              <textarea
                autoFocus
                required
                maxLength={2000}
                disabled={busy}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder={t('review.reasonPlaceholder')}
                className="block min-h-[120px] w-full resize-y rounded-[3px] border border-black bg-white p-3 font-body text-[13px] leading-[22px] outline-none focus:shadow-[0_0_0_3px_#ffe14d]"
              />
              <span className="block pt-[6px] text-right text-[12px] leading-[18px]">
                {t('review.characterCount', { count: note.length })}
              </span>
            </label>
          )}
          {!!error && (
            <div className="mt-3">
              <RegistrationError error={error} />
            </div>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-[9px] border-t border-black px-[25px] py-[17px]">
          <AdminButton onClick={onDismiss} disabled={busy}>
            {t('actions.cancel')}
          </AdminButton>

          {decision === 'APPROVE' && (
            <AdminButton type="submit" tone="primary" icon="send" busy={busy}>
              {busy ? t('actions.processing') : t('actions.approve')}
            </AdminButton>
          )}
          {decision === 'REJECT' && (
            <AdminButton
              type="submit"
              tone="danger"
              icon="reject"
              busy={busy}
              disabled={!note.trim()}
            >
              {busy ? t('actions.processing') : t('actions.confirmReject')}
            </AdminButton>
          )}
        </div>
      </form>
    </AdminModal>
  )
}
