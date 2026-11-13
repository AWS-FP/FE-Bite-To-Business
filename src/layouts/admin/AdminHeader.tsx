import { useTranslation } from 'react-i18next';
import type { AuthUser } from '@/types/admin/auth';
import WorkspaceHeader from '../WorkspaceHeader';

interface AdminHeaderProps {
    user: AuthUser | null;
    sectionNumber: string;
    onLogout: () => void;
}

export default function AdminHeader(props: AdminHeaderProps) {
    const { t } = useTranslation('admin');

    return (
        <WorkspaceHeader
            {...props}
            workspaceLabel={t('workspace')}
            title={t('header.title')}
            roleLabel={t('header.role')}
        />
    );
}
