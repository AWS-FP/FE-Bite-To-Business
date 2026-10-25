const dimensions = {
  next: [13, 13],
  previous: [13, 13],
  eye: [12, 12],
  waiting: [11, 11],
  activated: [11, 11],
  search: [15, 15],
  refresh: [16, 16],
  rejected: [17, 17],
  approved: [17, 17],
  pending: [17, 17],
  total: [17, 17],
  trend: [11, 11],
  filter: [13, 13],
  dropdown: [10, 6],
  sort: [12, 12],
  household: [14, 14],
  business: [14, 14],
  lock: [11, 11],
  send: [15, 15],
  info: [16, 16],
  'approve-large': [22, 22],
  close: [16, 16],
  mail: [17, 19],
  reject: [15, 15],
  'reject-large': [22, 22],
  history: [17, 17],
  invoice: [17, 17],
  company: [17, 17],
  contact: [17, 17],
  warning: [16, 16],
  once: [13, 13],
  'otp-failed': [11, 11],
} as const

export type AdminIconName = keyof typeof dimensions

export default function AdminIcon({
  name,
  className = '',
}: {
  name: AdminIconName
  className?: string
}) {
  const [width, height] = dimensions[name]
  return (
    <img
      src={`/images/admin/registrations/${name}.svg`}
      alt=""
      width={width}
      height={height}
      className={`block shrink-0 ${className}`}
    />
  )
}
