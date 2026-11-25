import { useTranslation } from 'react-i18next';
import ConfirmModal from './ConfirmModal';

interface LogoutConfirmationProps {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function LogoutConfirmation({ open, onCancel, onConfirm }: LogoutConfirmationProps) {
    const { i18n } = useTranslation();
    const english = i18n.resolvedLanguage === 'en';
    return <ConfirmModal open={open} title={english ? 'Sign out' : 'Đăng xuất'} message={english ? 'Are you sure you want to sign out?' : 'Bạn có chắc chắn muốn đăng xuất?'} confirmLabel={english ? 'Sign out' : 'Đăng xuất'} cancelLabel={english ? 'Cancel' : 'Hủy'} onCancel={onCancel} onConfirm={onConfirm} />;
}
