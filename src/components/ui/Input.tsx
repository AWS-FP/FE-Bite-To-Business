import type { InputHTMLAttributes, ReactNode } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  leadingIcon?: ReactNode
  trailingAction?: ReactNode
}

export default function Input({ id, label, error, leadingIcon, trailingAction, className = '', ...props }: InputProps) {
  const errorId = `${id}-error`
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className={`field-control ${error ? 'field-control--error' : ''}`}>
        {leadingIcon && <span className="field-icon" aria-hidden="true">{leadingIcon}</span>}
        <input id={id} className={className} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props} />
        {trailingAction}
      </div>
      {error && <p className="field-error" id={errorId}>{error}</p>}
    </div>
  )
}
