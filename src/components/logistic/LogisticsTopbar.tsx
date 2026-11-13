import { LogOut } from 'lucide-react';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import WorkspaceAccountMenu from '@/components/common/WorkspaceAccountMenu';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { useAuthStore } from '../../store/admin/authStore';
import { useLogistics } from './LogisticsModel.tsx';
import { LogisticsMenuButton } from './LogisticsSidebar.tsx';

export default function LogisticsTopbar({ onOpenMenu }: { onOpenMenu: () => void }) {
    const { language } = useLogistics();
    const navigate = useNavigate();
    const clearSession = useAuthStore((x) => x.clearSession);
    const session = useAuthStore((x) => x.session);
    return (
        <header className="lg-topbar">
            <div className="lg-topbar-title">
                <LogisticsMenuButton onClick={onOpenMenu} />
                <div className="lg-topbar-stamp">
                    <small>BTB</small>
                    <strong>01</strong>
                </div>
                <div>
                    <div className="lg-topbar-eyebrow">
                        {language === 'vi' ? 'KHÔNG GIAN QUẢN TRỊ!' : 'OPERATIONS WORKSPACE!'}
                    </div>
                    <div className="lg-topbar-script">
                        {language === 'vi' ? 'Góc điều hành.' : 'Operations hub.'}
                    </div>
                </div>
            </div>
            <div className="lg-topbar-actions">
                <LanguageSwitcher />
                <WorkspaceAccountMenu
                    user={session?.user ?? null}
                    roleLabel={language === 'vi' ? 'Nhân viên Logistics' : 'Logistics Staff'}
                />
                <button
                    type="button"
                    className="lg-logout"
                    onClick={() => {
                        clearSession();
                        navigate(ROUTES.LOGIN);
                    }}
                >
                    <LogOut size={16} />
                    <span>{language === 'vi' ? 'Đăng xuất' : 'Sign out'}</span>
                </button>
            </div>
        </header>
    );
}
