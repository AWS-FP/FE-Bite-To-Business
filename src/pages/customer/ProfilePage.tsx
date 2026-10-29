import StorefrontLayout from '../../layouts/StorefrontLayout';
import { ProfileProvider } from '../../components/customer/profile/ProfileModel';
import ProfileBreadcrumb from '../../components/customer/profile/ProfileBreadcrumb';
import ProfileHeading from '../../components/customer/profile/ProfileHeading';
import ProfileSidebar from '../../components/customer/profile/ProfileSidebar';
import RepresentativeSection from '../../components/customer/profile/RepresentativeSection';
import BillingSection from '../../components/customer/profile/BillingSection';
import DeliverySection from '../../components/customer/profile/DeliverySection';
import SourcingAndSecurity from '../../components/customer/profile/SourcingAndSecurity';
import ProfileActions from '../../components/customer/profile/ProfileActions';
import ProfileModals from '../../components/customer/profile/ProfileModals';

export default function ProfilePage() {
    return (
        <ProfileProvider>
            <StorefrontLayout
                rootClassName="min-h-screen bg-[#11382A] font-sans text-[#1E342B]"
                mainClassName="mx-auto max-w-[1320px] px-4 pb-16 pt-6 sm:px-6"
                afterMain={<ProfileModals />}
            >
                <ProfileBreadcrumb />
                <ProfileHeading />
                <div className="mt-6 rounded-[30px] bg-[#71877B] p-4 sm:p-6 lg:p-8">
                    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
                        <ProfileSidebar />
                        <div className="min-w-0 space-y-5">
                            <RepresentativeSection />
                            <BillingSection />
                            <DeliverySection />
                            <SourcingAndSecurity />
                            <ProfileActions />
                        </div>
                    </div>
                </div>
            </StorefrontLayout>
        </ProfileProvider>
    );
}
