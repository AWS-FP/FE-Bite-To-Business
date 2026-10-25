export function normalizePhone(value: string) {
    const phone = value.replace(/[\s()-]/g, '');

    if (/^0[35789]\d{8}$/.test(phone)) {
        return `+84${phone.slice(1)}`;
    }

    if (/^[35789]\d{8}$/.test(phone)) {
        return `+84${phone}`;
    }

    return phone;
}
