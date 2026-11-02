import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../router/routes';

export default function ProfileBreadcrumb() {
    return (
        <nav className="flex items-center gap-2 text-xs text-white/65">
            <Link
                to={ROUTES.HOME}
                className="text-white/85 no-underline visited:text-white/85 hover:text-white"
                style={{ color: '#E6F3EB', textDecoration: 'none' }}
            >
                Home
            </Link>
            <ChevronRight size={13} />
            <span className="text-white/80">Account Management</span>
        </nav>
    );
}
