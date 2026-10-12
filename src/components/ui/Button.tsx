import type { ButtonHTMLAttributes } from 'react'

export default function Button({ className = '', type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`button ${className}`} type={type} {...props} />
}
