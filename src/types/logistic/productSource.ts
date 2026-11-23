export interface DistributorOption {
    id: string;
    name: string;
}

export interface CountryOption {
    code: string;
    nameVi: string;
    nameEn: string;
    // Giá trị lưu vào products.origin, cùng định dạng dữ liệu hiện có, ví dụ "Thái Lan (Thailand)".
    value: string;
}
