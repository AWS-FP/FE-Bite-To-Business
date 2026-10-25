// Thông báo là key i18n để lỗi đang hiển thị cũng đổi được giữa VI và EN.
export const GMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u

export function normalizePhone(value: string) {
  const phone = value.replace(/[\s()-]/g, '')

  if (/^0[35789]\d{8}$/.test(phone)) {
    return `+84${phone.slice(1)}`
  }

  // Chấp nhận chín chữ số còn lại khi người dùng bỏ qua mã vùng +84.
  if (/^[35789]\d{8}$/.test(phone)) {
    return `+84${phone}`
  }

  return phone
}

export const registrationRules = {
  name: {
    validate: (value: string) => {
      if (!value.trim()) return 'errors.required'
      if (!NAME_PATTERN.test(value.trim())) return 'errors.name'
      if (value.trim().length > 100) return 'errors.tooLong'
      return true
    },
  },
  email: {
    validate: (value: string) => {
      if (!value.trim()) return 'errors.required'
      if (!GMAIL_PATTERN.test(value.trim())) return 'errors.gmail'
      if (value.trim().length > 254) return 'errors.tooLong'
      return true
    },
  },
  phone: {
    validate: (value: string) => {
      if (!value.trim()) return 'errors.required'
      if (!/^\+84[35789]\d{8}$/.test(normalizePhone(value))) return 'errors.phone'
      return true
    },
  },
  businessName: {
    validate: (value: string) => {
      if (!value.trim()) return 'errors.required'
      if (value.trim().length > 200) return 'errors.tooLong'
      return true
    },
  },
  location: {
    validate: (value: string) => {
      if (!value.trim()) return 'errors.required'
      if (value.trim().length > 100) return 'errors.tooLong'
      return true
    },
  },
  address: {
    validate: (value: string) => {
      if (!value.trim()) return 'errors.required'
      if (value.trim().length > 1000) return 'errors.tooLong'
      return true
    },
  },
  deliveryNote: {
    validate: (value: string | null | undefined) => {
      if (value?.trim() && value.trim().length > 1000) return 'errors.tooLong'
      return true
    },
  },
  invoiceEmail: {
    validate: (value: string | null | undefined) => {
      if (!value?.trim()) return true
      if (!GMAIL_PATTERN.test(value.trim())) return 'errors.gmail'
      if (value.trim().length > 254) return 'errors.tooLong'
      return true
    },
  },
  taxCode: {
    validate: (value: string | null | undefined) => {
      if (!value?.trim()) return true
      if (!/^\d{10}$/.test(value.trim())) return 'errors.taxCode'
      return true
    },
  },
}
