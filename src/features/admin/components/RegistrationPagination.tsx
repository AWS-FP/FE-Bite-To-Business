import { useTranslation } from 'react-i18next'
import AdminIcon from './AdminIcon'

interface RegistrationPaginationProps {
  page: number
  size: number
  total: number
  totalPages: number
  onPage: (page: number) => void
}

export default function RegistrationPagination({
  page,
  size,
  total,
  totalPages,
  onPage,
}: RegistrationPaginationProps) {
  const { t } = useTranslation('admin')
  const pageNumbers: number[] = []

  // Danh sách ngắn hiện đủ số trang. Danh sách dài hiện trang đầu, cuối và các trang gần vị trí hiện tại.
  if (totalPages <= 7) {
    for (let pageNumber = 0; pageNumber < totalPages; pageNumber++) {
      pageNumbers.push(pageNumber)
    }
  } else {
    pageNumbers.push(0)
    for (
      let pageNumber = Math.max(1, page - 1);
      pageNumber <= Math.min(totalPages - 2, page + 1);
      pageNumber++
    ) {
      pageNumbers.push(pageNumber)
    }
    pageNumbers.push(totalPages - 1)
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black px-[22px] py-[17px] text-[12px]">
      <p>
        {t('list.results', {
          from: total > 0 ? page * size + 1 : 0,
          to: Math.min((page + 1) * size, total),
          total,
        })}
      </p>

      <nav aria-label={t('list.pagination')} className="flex items-center gap-[5px]">
        <button
          type="button"
          className="grid size-[33px] place-items-center rounded-[2px] border border-black bg-white p-0 text-[12px] disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => onPage(page - 1)}
          disabled={page <= 0}
          aria-label={t('actions.previous')}
        >
          <AdminIcon name="previous" />
        </button>

        {pageNumbers.map((pageNumber, index) => (
          <span key={pageNumber} className="flex items-center gap-[5px]">
            {index > 0 && pageNumber - pageNumbers[index - 1] > 1 && (
              <span aria-hidden="true">…</span>
            )}
            <button
              type="button"
              className="grid size-[33px] place-items-center rounded-[2px] border border-black bg-white p-0 text-[12px] aria-[current=page]:bg-[#ffe14d] aria-[current=page]:font-extrabold disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => onPage(pageNumber)}
              aria-label={t('actions.page', { page: pageNumber + 1 })}
              aria-current={pageNumber === page ? 'page' : undefined}
            >
              {pageNumber + 1}
            </button>
          </span>
        ))}

        <button
          type="button"
          className="grid size-[33px] place-items-center rounded-[2px] border border-black bg-white p-0 text-[12px] disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => onPage(page + 1)}
          disabled={page + 1 >= totalPages}
          aria-label={t('actions.next')}
        >
          <AdminIcon name="next" />
        </button>
      </nav>
    </div>
  )
}
