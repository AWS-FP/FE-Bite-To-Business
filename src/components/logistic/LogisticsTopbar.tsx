import { ChevronDown, LogOut, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { useAuthStore } from '../../store/admin/authStore';
import { useLogistics } from './LogisticsModel.tsx';
import { LogisticsMenuButton } from './LogisticsSidebar.tsx';

export default function LogisticsTopbar({ onOpenMenu }: { onOpenMenu: () => void }) {
    const { language, setLanguage, resetDemo } = useLogistics();
    const navigate = useNavigate();
    const clearSession = useAuthStore(x => x.clearSession);
    const session = useAuthStore(x => x.session);
    const userLabel = session ? `${session.user.lastName} ${session.user.firstName}` : 'Trần Đức Minh';
    return <header className="lg-topbar">
        <div className="lg-topbar-title"><LogisticsMenuButton onClick={onOpenMenu}/><div className="lg-topbar-stamp"><small>BTB</small><strong>01</strong></div><div><div className="lg-topbar-eyebrow">{language==='vi'?'KHÔNG GIAN QUẢN TRỊ!':'OPERATIONS WORKSPACE!'}</div><div className="lg-topbar-script">{language==='vi'?'Góc điều hành.':'Operations hub.'}</div><div className="lg-topbar-breadcrumb">Logistics Staff <span>›</span> {language==='vi'?'Sổ cái tồn kho thời gian thực':'Real-time inventory'}</div></div></div>
        <div className="lg-topbar-actions"><div className="lg-lang-wrap"><div className="lg-lang-label">{language==='vi'?'NGÔN NGỮ':'LANGUAGE'}</div><div className="lg-language" aria-label="Language"><button type="button" aria-pressed={language==='vi'} className={language==='vi'?'selected':''} onClick={()=>setLanguage('vi')}>VI {language==='vi'?'✓':''}</button><button type="button" aria-pressed={language==='en'} className={language==='en'?'selected':''} onClick={()=>setLanguage('en')}>EN</button></div></div>
            <details className="lg-user-dropdown"><summary><span className="lg-user-circle">TM</span><span className="lg-user-text"><strong>{userLabel}</strong><small>Logistics Staff</small></span><ChevronDown size={15}/></summary><div className="lg-user-menu"><button type="button" onClick={()=>{resetDemo();}}> <RotateCcw size={15}/> Reset demo data</button><button type="button" onClick={()=>{clearSession(); navigate(ROUTES.LOGIN);}}><LogOut size={15}/> {language==='vi'?'Đăng xuất':'Sign out'}</button></div></details>
            <button type="button" className="lg-logout" onClick={()=>{clearSession();navigate(ROUTES.LOGIN);}}><LogOut size={16}/><span>{language==='vi'?'Đăng xuất':'Sign out'}</span></button>
        </div>
    </header>;
}
