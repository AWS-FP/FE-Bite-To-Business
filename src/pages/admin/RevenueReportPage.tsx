import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FinanceReport from '@/components/admin/FinanceReport';
import './SystemMetricsPage.css';

export default function RevenueReportPage() {
    const { t } = useTranslation('admin');
    useEffect(() => {
        document.title = `${t('system.tabs.revenue')} | Bite to Business`;
    }, [t]);

    return <div className="system-page"><FinanceReport /></div>;
}
