import axios from 'axios';
import { http } from '@/services/axiosClient';
import type { ApiResponse } from '@/types/api';
import type { CountryOption, DistributorOption } from '@/types/logistic/productSource';

/** Danh sách nhà phân phối (bảng distributors) cho dropdown của form tạo sản phẩm. */
export async function getDistributors(signal?: AbortSignal): Promise<DistributorOption[]> {
    const response = await http.get<ApiResponse<DistributorOption[]>>('/api/logistics/products/distributors', {
        signal,
    });
    return response.data.data;
}

/**
 * Danh sách quốc gia lấy mã ISO alpha-2 từ API công khai của flagcdn (không cần API key, cho phép gọi
 * từ trình duyệt). Tên tiếng Việt/tiếng Anh do trình duyệt (Intl.DisplayNames) dịch theo mã.
 * REST Countries không dùng được: bản v3.1 đã ngừng, bản v5 bắt buộc API key.
 */
export async function getCountries(signal?: AbortSignal): Promise<CountryOption[]> {
    const response = await axios.get<Record<string, string>>('https://flagcdn.com/en/codes.json', {
        signal,
        timeout: 10000,
    });
    const vi = new Intl.DisplayNames(['vi'], { type: 'region' });
    const en = new Intl.DisplayNames(['en'], { type: 'region' });
    // File có cả mã bang của Mỹ (us-al…); chỉ giữ mã quốc gia 2 chữ cái, bỏ mã tổ chức Liên Hợp Quốc.
    return Object.keys(response.data)
        .filter((code) => /^[a-z]{2}$/.test(code) && code !== 'un')
        .map((code) => code.toUpperCase())
        .map((cca2) => {
            const nameVi = vi.of(cca2) ?? cca2;
            const nameEn = en.of(cca2) ?? cca2;
            return {
                code: cca2,
                nameVi,
                nameEn,
                value: nameVi === nameEn ? nameVi : `${nameVi} (${nameEn})`,
            };
        })
        .map((country) => (country.code === 'VN' ? { ...country, value: 'Việt Nam' } : country))
        .sort((a, b) => a.nameVi.localeCompare(b.nameVi, 'vi'));
}
