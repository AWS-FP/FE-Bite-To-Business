import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import AdminButton from '@/components/admin/AdminButton';
import StaffCreateForm from '@/components/admin/StaffCreateForm';
import StaffError from '@/components/admin/StaffError';
import StaffIcon from '@/components/admin/StaffIcon';
import RegistrationPagination from '@/components/admin/RegistrationPagination';
import { useStaff } from '@/hooks/admin/useStaff';
import { useAuthStore } from '@/store/admin/authStore';
import type { StaffAccount } from '@/types/admin/staff';
import { registrationDate } from '@/utils/admin/registration';
import './StaffPage.css';

export default function StaffPage() {
    const { t, i18n } = useTranslation('admin');
    const [searchParams, setSearchParams] = useSearchParams();
    const [creating, setCreating] = useState(false);
    const [createdEmail, setCreatedEmail] = useState('');
    const queryClient = useQueryClient();
    const session = useAuthStore((state) => state.session);
    const sessionVersion = useAuthStore((state) => state.sessionVersion);
    const selectedRole = searchParams.get('role');
    const role =
        selectedRole === 'ECOMMERCE_EXECUTIVE' ||
        selectedRole === 'LOGISTICS_STAFF' ||
        selectedRole === 'DELIVERY_STAFF'
            ? selectedRole
            : undefined;
    const pageNumber = Number(searchParams.get('page') || 0);
    const page = Number.isSafeInteger(pageNumber) && pageNumber >= 0 ? pageNumber : 0;
    const keyword = (searchParams.get('keyword') || '').slice(0, 254);
    const staffQuery = useStaff({ page, size: 6, role, keyword: keyword || undefined });

    useEffect(() => {
        document.title = `${t('navigation.staff')} | Bite to Business`;
    }, [t]);

    useEffect(() => {
        if (staffQuery.data && page > 0 && page >= staffQuery.data.totalPages) {
            setSearchParams(
                (previous) => {
                    const next = new URLSearchParams(previous);
                    next.set('page', String(Math.max(0, staffQuery.data.totalPages - 1)));
                    return next;
                },
                { replace: true },
            );
        }
    }, [staffQuery.data, page, setSearchParams]);

    function changeFilter(name: string, value: string) {
        setSearchParams((previous) => {
            const next = new URLSearchParams(previous);
            if (value) next.set(name, value);
            else next.delete(name);
            if (name !== 'page') next.delete('page');
            return next;
        });
    }

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        changeFilter('keyword', String(form.get('keyword') || '').trim());
    }

    function handleCreated(staff: StaffAccount) {
        setCreating(false);
        setCreatedEmail(staff.email);
        setSearchParams({});
        void queryClient.invalidateQueries({
            queryKey: ['admin', session?.user.id, sessionVersion, 'staff'],
        });
    }

    return (
        <div className="staff-page">
            <header className="staff-page-intro">
                <div>
                    <p className="staff-section-label">
                        <span>02</span>
                        {t('staff.eyebrow')}
                    </p>
                    <h1>{t('navigation.staff')}</h1>
                    <p className="staff-page-description">{t('staff.description')}</p>
                </div>
                <AdminButton
                    tone="primary"
                    className="staff-open-create"
                    onClick={() => setCreating(true)}
                >
                    <StaffIcon name="plus" />
                    {t('staff.create')}
                </AdminButton>
            </header>
            {createdEmail && (
                <div role="status" className="staff-success">
                    {t('staff.created', { email: createdEmail })}
                </div>
            )}
            <section
                className="staff-panel"
                aria-label={t('staff.tableLabel')}
                aria-busy={staffQuery.isFetching}
            >
                <header className="staff-panel-heading">
                    <div>
                        <h2>{t('staff.listTitle')}</h2>
                        <span className="staff-count">
                            {staffQuery.data && !staffQuery.isError
                                ? t('staff.accountCount', { count: staffQuery.data.totalElements })
                                : '—'}
                        </span>
                    </div>
                    <p className="staff-department-summary">
                        <StaffIcon name="staff" />
                        {t('staff.departmentCount')}
                    </p>
                </header>
                <div className="staff-filters">
                    <form onSubmit={handleSearch} className="staff-search">
                        <label htmlFor="staff-search">{t('staff.searchLabel')}</label>
                        <div className="staff-control">
                            <button
                                type="submit"
                                className="staff-search-submit"
                                aria-label={t('staff.searchSubmit')}
                            >
                                <StaffIcon name="search" />
                            </button>
                            <input
                                key={keyword}
                                id="staff-search"
                                name="keyword"
                                type="search"
                                defaultValue={keyword}
                                maxLength={254}
                                placeholder={t('staff.search')}
                            />
                        </div>
                    </form>
                    <div className="staff-role-filter">
                        <label htmlFor="staff-role-filter">{t('staff.fields.role')}</label>
                        <div className="staff-control staff-select-control">
                            <StaffIcon name="filter" />
                            <select
                                id="staff-role-filter"
                                value={role || ''}
                                onChange={(event) => changeFilter('role', event.target.value)}
                            >
                                <option value="">{t('staff.allRoles')}</option>
                                <option value="ECOMMERCE_EXECUTIVE">
                                    {t('staff.departments.ECOMMERCE_EXECUTIVE')}
                                </option>
                                <option value="LOGISTICS_STAFF">
                                    {t('staff.departments.LOGISTICS_STAFF')}
                                </option>
                                <option value="DELIVERY_STAFF">
                                    {t('staff.departments.DELIVERY_STAFF')}
                                </option>
                            </select>
                            <StaffIcon name="down" />
                        </div>
                    </div>
                    <AdminButton
                        onClick={() => void staffQuery.refetch()}
                        disabled={staffQuery.isFetching}
                        className="staff-refresh"
                        aria-label={t('staff.refreshLabel')}
                    >
                        <StaffIcon
                            name="refresh"
                            className={
                                staffQuery.isFetching
                                    ? 'animate-spin motion-reduce:animate-none'
                                    : ''
                            }
                        />
                        {t('staff.refresh')}
                    </AdminButton>
                </div>
                {staffQuery.isPending && (
                    <div role="status" className="staff-list-message">
                        {t('staff.loading')}
                    </div>
                )}
                {staffQuery.isError && (
                    <div className="staff-list-message">
                        <StaffError
                            error={staffQuery.error}
                            onRetry={() => void staffQuery.refetch()}
                        />
                    </div>
                )}
                {staffQuery.data && !staffQuery.isError && (
                    <>
                        <div
                            className="staff-table-scroll"
                            role="region"
                            aria-label={t('staff.tableLabel')}
                            tabIndex={0}
                        >
                            <table className="staff-table" aria-label={t('staff.tableLabel')}>
                                <colgroup>
                                    <col />
                                    <col />
                                    <col />
                                    <col />
                                    <col />
                                    <col />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th scope="col">{t('staff.fields.name')}</th>
                                        <th scope="col">Gmail</th>
                                        <th scope="col">{t('staff.fields.phone')}</th>
                                        <th scope="col">{t('staff.fields.role')}</th>
                                        <th scope="col">{t('staff.fields.status')}</th>
                                        <th scope="col">{t('staff.fields.createdAt')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {staffQuery.data.content.map((staff) => (
                                        <tr key={staff.id}>
                                            <td>
                                                <div className="staff-identity">
                                                    <span
                                                        className="staff-avatar"
                                                        aria-hidden="true"
                                                    >
                                                        {`${staff.lastName.charAt(0)}${staff.firstName.trim().split(/\s+/).at(-1)?.charAt(0) || ''}`.toUpperCase()}
                                                    </span>
                                                    <div>
                                                        <strong>
                                                            {staff.lastName} {staff.firstName}
                                                        </strong>
                                                        <span
                                                            className="staff-account-id"
                                                            title={staff.id}
                                                        >
                                                            {staff.id.slice(0, 8).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{staff.email}</td>
                                            <td>{staff.phone.replace(/^\+84/, '0')}</td>
                                            <td>
                                                <span
                                                    className="staff-role-badge"
                                                    data-role={staff.role}
                                                >
                                                    {t(`staff.departments.${staff.role}`)}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className="staff-status-badge"
                                                    data-banned={staff.banned}
                                                >
                                                    <span aria-hidden="true">●</span>
                                                    {t(
                                                        staff.banned
                                                            ? 'staff.banned'
                                                            : 'staff.active',
                                                    )}
                                                </span>
                                            </td>
                                            <td>
                                                {registrationDate(
                                                    staff.createdAt,
                                                    i18n.resolvedLanguage || 'vi',
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {staffQuery.data.content.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="staff-list-message">
                                                {t(
                                                    keyword || role
                                                        ? 'staff.emptyFiltered'
                                                        : 'staff.empty',
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <RegistrationPagination
                            ariaLabel={t('staff.pagination')}
                            resultsLabel="staff.results"
                            previousIcon={<StaffIcon name="previous" />}
                            nextIcon={<StaffIcon name="next" />}
                            page={page}
                            size={staffQuery.data.size}
                            total={staffQuery.data.totalElements}
                            totalPages={staffQuery.data.totalPages}
                            onPage={(nextPage) => changeFilter('page', String(nextPage))}
                        />
                    </>
                )}
            </section>
            <footer className="staff-page-footer">
                <p>© {new Date().getFullYear()} Bite to Business</p>
                <p>{t('staff.footer')}</p>
            </footer>
            {creating && (
                <StaffCreateForm onClose={() => setCreating(false)} onCreated={handleCreated} />
            )}
        </div>
    );
}
