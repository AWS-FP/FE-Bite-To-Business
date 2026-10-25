import axios from 'axios'
import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../app/router/routes'
import type { ApiErrorResponse } from '../../../types/api'
import { DEFAULT_REGISTRATION, REGISTRATION_STEP_FIELDS } from '../constants/registration'
import { register as sendRegistration } from '../service/authApi'
import type { RegisterRequest } from '../types/auth.types'
import { getAuthError, type AuthError } from '../utils/authError'
import { normalizePhone } from '../utils/authValidation'
import { clearActivationSession } from '../utils/activationSession'

export default function useRegisterForm() {
  const navigate = useNavigate()
  const form = useForm<RegisterRequest>({
    defaultValues: DEFAULT_REGISTRATION,
    mode: 'onTouched',
    // Giữ các ô của bước trước khi component của bước đó được ẩn đi.
    shouldUnregister: false,
  })
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<AuthError | null>(null)
  const submittingRef = useRef(false)

  function goBack() {
    if (submittingRef.current) return
    setServerError(null)
    setStep(step - 1)
  }

  function editStep(nextStep: number) {
    if (submittingRef.current) return
    setServerError(null)
    setStep(nextStep)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current) return
    submittingRef.current = true
    setServerError(null)

    try {
      const valid = await form.trigger(REGISTRATION_STEP_FIELDS[step - 1], { shouldFocus: true })
      if (!valid) return

      if (step < 3) {
        setStep(step + 1)
        return
      }

      // Kiểm tra lại toàn bộ trước khi gửi, kể cả các bước đã đi qua.
      const allValid = await form.trigger()
      if (!allValid) {
        for (let index = 0; index < REGISTRATION_STEP_FIELDS.length; index++) {
          const fields = REGISTRATION_STEP_FIELDS[index]
          if (fields.some((field) => form.getFieldState(field).invalid)) {
            setStep(index + 1)
            break
          }
        }
        return
      }

      const values = form.getValues()
      const request: RegisterRequest = {
        ...values,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        phone: normalizePhone(values.phone),
        businessName: values.businessName.trim(),
        province: values.province.trim(),
        district: null,
        ward: values.ward.trim(),
        deliveryAddress: values.deliveryAddress.trim(),
        deliveryNote: values.deliveryNote?.trim() || null,
        invoicePurchaser: values.invoicePurchaser?.trim() || null,
        invoiceTaxCode: values.invoiceTaxCode?.trim() || null,
        invoiceEmail: values.invoiceEmail?.trim().toLowerCase() || null,
        invoiceAddress: null,
      }
      if (!values.invoiceSameAsDelivery) {
        request.invoiceAddress = values.invoiceAddress?.trim() || null
      }

      setIsSubmitting(true)
      await sendRegistration(request)
      // Chi mo buoc OTP sau khi backend xac nhan da nhan ho so.
      clearActivationSession()
      navigate(ROUTES.VERIFY_OTP, {
        replace: true,
        state: { email: request.email, registrationSubmitted: true },
      })
    } catch (error) {
      setServerError(getAuthError(error))

      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const fieldErrors = error.response?.data?.errors
        let firstErrorStep = 3
        if (Array.isArray(fieldErrors)) {
          for (const fieldError of fieldErrors) {
            for (let index = 0; index < REGISTRATION_STEP_FIELDS.length; index++) {
              const field = REGISTRATION_STEP_FIELDS[index].find(
                (name) => name === fieldError.field,
              )
              if (field) {
                form.setError(field, { type: 'server', message: 'errors.serverField' })
                firstErrorStep = Math.min(firstErrorStep, index + 1)
              }
            }
          }
          setStep(firstErrorStep)
        }
        if (error.response?.data?.code === 'EMAIL_ALREADY_EXISTS') {
          form.setError('email', { type: 'server', message: 'errors.emailExists' })
          setStep(1)
        }
        if (error.response?.data?.code === 'PHONE_ALREADY_EXISTS') {
          form.setError('phone', { type: 'server', message: 'errors.phoneExists' })
          setStep(1)
        }
      }
    } finally {
      submittingRef.current = false
      setIsSubmitting(false)
    }
  }

  return { form, step, goBack, editStep, handleSubmit, isSubmitting, serverError }
}
