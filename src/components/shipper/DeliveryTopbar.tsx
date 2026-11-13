import { ChevronDown, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { useAuthStore } from '../../store/admin/authStore';
import { useDelivery } from './DeliveryModel.tsx';
import { DeliveryMenuButton } from './DeliverySidebar.tsx';

export default function DeliveryTopbar({ onOpenMenu }: { onOpenMenu: () => void }) {
    const { language, setLanguage } = useDelivery();
    const location = useLocation();
    const navigate = useNavigate();
    const session = useAuthStore((state) => state.session);
    const clearSession = useAuthStore((state) => state.clearSession);
    const name = session ? `${session.user.lastName} ${session.user.firstName}` : 'Delivery Staff';
    const initials = session ? `${session.user.lastName.charAt(0)}${session.user.firstName.charAt(0)}`.toUpperCase() : 'DS';
    const history = location.pathname === ROUTES.DELIVERY_HISTORY;

    function signOut() { clearSession(); navigate(ROUTES.LOGIN, { replace: true }); }
    return <header className="dl-topbar">
        <div className="dl-topbar-identity">
            <DeliveryMenuButton onClick={onOpenMenu}/>
            <div className="dl-stamp"><small>BTB</small><strong>01</strong></div>
            <div className="dl-topbar-titles"><p className="dl-eyebrow">{language === 'vi' ? 'KHÔNG GIAN QUẢN TRỊ!' : 'OPERATIONS WORKSPACE!'}</p>
                <div className="dl-script">{language === 'vi' ? 'Góc điều hành.' : 'Operations hub.'}</div>
                <p className="dl-breadcrumb">Delivery Staff <span>›</span> {history ? (language === 'vi' ? 'Lịch sử chuyến giao' : 'Delivery history') : (language === 'vi' ? 'Chuyến giao hiện tại' : 'Current trip')}</p>
            </div>
        </div>
        <div className="dl-topbar-actions">
            <div className="dl-language-wrap"><span className="dl-language-label">{language === 'vi' ? 'NGÔN NGỮ' : 'LANGUAGE'}</span>
                <div className="dl-language-controls" aria-label="Language">
                    <button type="button" aria-pressed={language === 'vi'} className={language === 'vi' ? 'active' : ''} onClick={() => setLanguage('vi')}>VI {language === 'vi' ? '✓' : ''}</button>
                    <button type="button" aria-pressed={language === 'en'} className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN {language === 'en' ? '✓' : ''}</button>
                </div>
            </div>
            <details className="dl-account"><summary><span className="dl-user-avatar">{initials}</span><span className="dl-account-name"><b>{name}</b><small>Delivery Staff</small></span><ChevronDown size={15}/></summary>
                <div className="dl-account-menu"><button type="button" onClick={signOut}><LogOut size={14}/> {language === 'vi' ? 'Đăng xuất' : 'Sign out'}</button></div>
            </details>
            <button type="button" className="dl-signout" onClick={signOut}><LogOut size={16}/><span>{language === 'vi' ? 'Đăng xuất' : 'Sign out'}</span></button>
        </div>
    </header>;
}
