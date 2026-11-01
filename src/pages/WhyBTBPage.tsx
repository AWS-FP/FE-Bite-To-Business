import BTBInfoLayout from '@/components/BTBInfoLayout';
import BTBWhyChoose from '@/components/BTBWhyChoose';

export default function WhyBTBPage() {
    return (
        <BTBInfoLayout
            eyebrow="VÌ SAO CHỌN BITE TO BUSINESS?"
            title="Vì sao chọn BTB?"
            description="Một nơi để tìm hàng, so sánh thông tin và xây dựng cách mua sắm phù hợp với nhu cầu của từng người dùng."
        >
            <BTBWhyChoose />
        </BTBInfoLayout>
    );
}