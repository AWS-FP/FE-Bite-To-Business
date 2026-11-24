import type { HomeCategory } from '@/types/customer/home';

const ICONS: { match: RegExp; file: string }[] = [
    { match: /bakery|dessert|cake|bánh|banh/, file: 'cake' },
    { match: /noodle|pasta|mì|mi sợi|nui/, file: 'spaghetti' },
    { match: /fish|seafood|hải sản|hai san|cá|ca va/, file: 'lobster' },
    { match: /spice|sauce|condiment|seasoning|oil|gia vị|dầu ăn|nước sốt/, file: 'sauce-ketchup' },
    { match: /rice|grain|flour|gạo|ngũ cốc|bột/, file: 'wheat-barley' },
    { match: /vegetable|mushroom|rau|nấm/, file: 'vegetables-carrot' },
    { match: /fruit|trái cây|hoa quả/, file: 'fruits-fruit' },
    { match: /meat|poultry|thịt|gia cầm/, file: 'meat-on-bone' },
    { match: /egg|trứng/, file: 'egg' },
    { match: /bean|nut|đậu|hạt/, file: 'beans' },
    { match: /dairy|milk|sữa|phô mai/, file: 'milk-carton' },
    { match: /tofu|vegetarian|chay/, file: 'tofu' },
    { match: /canned|processed|đóng hộp|chế biến/, file: 'can-soda' },
    { match: /beverage|drink|đồ uống|nước giải khát/, file: 'drink-soda' },
];
function categoryIconUrl(category: Pick<HomeCategory, 'nameEn' | 'nameVi' | 'code' | 'imageSvg'>): string | null {
    const label = `${category.nameEn} ${category.nameVi} ${category.code}`.toLowerCase();
    const icon = ICONS.find((candidate) => candidate.match.test(label));
    return icon ? `/icons/${icon.file}-svgrepo-com.svg` : (category.imageSvg?.trim() || null);
}
export default function CategoryIcon({ category, className = 'h-6 w-6' }: {
    category: Pick<HomeCategory, 'nameEn' | 'nameVi' | 'code' | 'imageSvg'>;
    className?: string;
}) {
    const url = categoryIconUrl(category);
    return url ? <img src={url} alt="" aria-hidden="true" className={`${className} shrink-0 object-contain`} /> : null;
}
