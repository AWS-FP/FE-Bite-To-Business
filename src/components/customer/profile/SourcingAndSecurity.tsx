import SourcingSection from './SourcingSection.tsx';
import SecuritySection from './SecuritySection.tsx';

export default function SourcingAndSecurity() {
    return (
        <div className="grid items-start gap-5 xl:grid-cols-2">
            <SourcingSection />
            <SecuritySection />
        </div>
    );
}
