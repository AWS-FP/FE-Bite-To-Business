import type { NotificationItemData } from '@/types/customer/homeData';


// 1. Coverflow Slider (6 full-card image posters)
// Product/category/banner data comes from Customer and public catalog APIs.
// The only retained local data below is the existing non-Customer notification demo.

export const INITIAL_NOTIFICATIONS: NotificationItemData[] = [
    {
        id: 'noti-system-v42',
        category: 'system',
        badge: 'ADMIN ANNOUNCEMENT • V4.2',
        badgeBg: 'bg-danger',
        badgeText: 'text-white',
        title: 'System Update: Launching 5-Star Reviews & Auto e-VAT Invoice',
        description:
            'MD Foods has officially released V4.2 with public 5-star reviews, automatic e-VAT invoice issuance, and A2UI improvements. Click to view full release notes.',
        timeAgo: 'Just now',
        unread: true,
        primaryActionLabel: 'View System Update Popup',
        isSystemUpdatePopup: true,
        popupVersion: 'V4.2',
        popupHighlights: [
            {
                title: 'Public 5-Star Product Reviews:',
                detail: 'B2B partners can now submit half-star ratings and upload real kitchen photos directly on the product detail page for full transparency.',
            },
            {
                title: 'Automated e-VAT Invoicing:',
                detail: 'Connected directly with your 10-digit Tax ID (MST) and accounting Gmail to issue electronic VAT invoices automatically once delivery is completed.',
            },
            {
                title: 'Performance & Adaptive UI (A2UI) Upgrade:',
                detail: 'Upgraded quantity selectors, instant category filters, and smart AI shopping assistant bubble.',
            },
        ],
    },
    {
        id: 'noti-quote-884',
        category: 'quote',
        badge: 'QUOTE APPROVED',
        badgeBg: 'bg-surface-green',
        badgeText: 'text-store-ink',
        title: 'Quote #QT-2026-884 has been approved',
        description:
            '100% stock verified for all 5 line items. Please confirm your order within 24 hours to lock inventory reservation.',
        timeAgo: '5 mins ago',
        unread: true,
        primaryActionLabel: 'Confirm Order Now',
        secondaryActionLabel: 'View Details',
    },
    {
        id: 'noti-delivery-512',
        category: 'delivery',
        badge: 'IN_DELIVERY • ETA 18M',
        badgeBg: 'bg-store-yellow',
        badgeText: 'text-store-ink',
        title: 'Cold truck is delivering Order #ORD-2026-512',
        description:
            'Departed from Tan Thuan Cold Hub for 2 drop-off stops. Estimated arrival at District 3 Central Kitchen at 05:30 AM.',
        timeAgo: '22 mins ago',
        unread: true,
        primaryActionLabel: 'Open Vietmap Route',
    },
    {
        id: 'noti-sourcing-anchor',
        category: 'quote',
        badge: 'NEW SOURCING REPLY',
        badgeBg: 'bg-surface-soft',
        badgeText: 'text-store-muted',
        title: 'Added to Catalog: Anchor Unsalted Butter 25kg Block',
        description:
            'Selling Price: 4,250,000đ/carton • Available Stock: 18 cartons ready to order.',
        timeAgo: 'Yesterday',
        unread: false,
    },
];

// 8. Sample Product Detail Datasets (With full 1-star to 5-star reviews for testing filter reload!)
export function formatCurrencyVnd(amount: number): string {
    return `${amount.toLocaleString('vi-VN')}đ`;
}
