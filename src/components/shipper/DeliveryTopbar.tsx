import { LogOut } from 'lucide-react';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import WorkspaceAccountMenu from '@/components/common/WorkspaceAccountMenu';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { useAuthStore } from '../../store/admin/authStore';
import { useDelivery } from './DeliveryModel.tsx';
import { DeliveryMenuButton } from './DeliverySidebar.tsx';

export default function DeliveryTopbar({ onOpenMenu }: { onOpenMenu: () => void }) {
    const { language } = useDelivery();
    const navigate = useNavigate();
    const session = useAuthStore((state) => state.session);
    const clearSession = useAuthStore((state) => state.clearSession);

    function signOut() {
        clearSession();
        navigate(ROUTES.LOGIN, { replace: true });
    }
    return (
        <header className="dl-topbar">
            <div className="dl-topbar-identity">
                <DeliveryMenuButton onClick={onOpenMenu} />
                <div className="dl-stamp">
                    <small>BTB</small>
                    <strong>01</strong>
                </div>
                <div className="dl-topbar-titles">
                    <p className="dl-eyebrow">
                        {language === 'vi' ? 'KHÔNG GIAN QUẢN TRỊ!' : 'OPERATIONS WORKSPACE!'}
                    </p>
                    <div className="dl-script">
                        {language === 'vi' ? 'Góc điều hành.' : 'Operations hub.'}
                    </div>
                </div>
            </div>
            <div className="dl-topbar-actions">
                <LanguageSwitcher />
                <WorkspaceAccountMenu
                    user={session?.user ?? null}
                    roleLabel={language === 'vi' ? 'Shipper' : 'Delivery Staff'}
                />
                <button type="button" className="dl-signout" onClick={signOut}>
                    <LogOut size={16} />
                    <span>{language === 'vi' ? 'Đăng xuất' : 'Sign out'}</span>
                </button>
            </div>
        </header>
    );
}
