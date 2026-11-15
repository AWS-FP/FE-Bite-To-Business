import { Plus } from 'lucide-react';
import type { Dispatch, FormEvent, SetStateAction } from 'react';
import type { Quote } from '@/services/customer/quoteService';

export interface PackageDraft {
    name: string;
    recipientName: string;
    recipientPhone: string;
    deliveryDate: string;
    deliveryTimeSlot: string;
    address: string;
    note: string;
    city: 'HCM' | 'HANOI';
}

interface PackageFormProps {
    quote: Quote;
    parcel: PackageDraft;
    setParcel: Dispatch<SetStateAction<PackageDraft>>;
    quantities: Record<string, string>;
    setQuantities: Dispatch<SetStateAction<Record<string, string>>>;
    allocated: (itemId: string) => number;
    busy: boolean;
    createPackage: (event: FormEvent<HTMLFormElement>) => void;
}

const field =
    'w-full rounded-lg border border-store-ink/25 bg-white px-3 py-2.5 text-sm text-store-ink focus:border-store-ink focus:outline-none';
const secondary =
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-store-ink/25 bg-white px-4 py-2 font-bold text-store-ink hover:bg-store-cream';

export default function PackageForm({
    quote,
    parcel,
    setParcel,
    quantities,
    setQuantities,
    allocated,
    busy,
    createPackage,
}: PackageFormProps) {
    return (
        <form
            onSubmit={createPackage}
            className="rounded-2xl border border-store-ink/20 bg-white p-6"
        >
            <h2 className="m-0 font-subheading text-xl font-bold">Thêm gói giao hàng</h2>
            <div className="mt-5 grid grid-cols-2 gap-4">
                <label className="text-sm font-bold">
                    Tên package
                    <input
                        className={`${field} mt-2`}
                        required
                        maxLength={200}
                        value={parcel.name}
                        onChange={(e) => setParcel({ ...parcel, name: e.target.value })}
                        placeholder="Ví dụ: Bếp quận 1"
                    />
                </label>
                <label className="text-sm font-bold">
                    Thành phố
                    <select
                        className={`${field} mt-2`}
                        value={parcel.city}
                        onChange={(e) =>
                            setParcel({
                                ...parcel,
                                city: e.target.value as 'HCM' | 'HANOI',
                            })
                        }
                    >
                        <option value="HCM">TP. Hồ Chí Minh</option>
                        <option value="HANOI">Hà Nội</option>
                    </select>
                </label>
                <label className="text-sm font-bold">
                    Người nhận
                    <input
                        className={`${field} mt-2`}
                        required
                        maxLength={200}
                        value={parcel.recipientName}
                        onChange={(e) =>
                            setParcel({
                                ...parcel,
                                recipientName: e.target.value,
                            })
                        }
                    />
                </label>
                <label className="text-sm font-bold">
                    Số điện thoại
                    <input
                        className={`${field} mt-2`}
                        required
                        maxLength={30}
                        value={parcel.recipientPhone}
                        onChange={(e) =>
                            setParcel({
                                ...parcel,
                                recipientPhone: e.target.value,
                            })
                        }
                    />
                </label>
                <label className="text-sm font-bold">
                    Ngày giao
                    <input
                        type="date"
                        className={`${field} mt-2`}
                        required
                        value={parcel.deliveryDate}
                        onChange={(e) =>
                            setParcel({
                                ...parcel,
                                deliveryDate: e.target.value,
                            })
                        }
                    />
                </label>
                <label className="text-sm font-bold">
                    Khung giờ giao
                    <input
                        className={`${field} mt-2`}
                        required
                        maxLength={100}
                        placeholder="Ví dụ: 08:00 - 11:00"
                        value={parcel.deliveryTimeSlot}
                        onChange={(e) =>
                            setParcel({
                                ...parcel,
                                deliveryTimeSlot: e.target.value,
                            })
                        }
                    />
                </label>
                <label className="col-span-2 text-sm font-bold">
                    Địa chỉ giao hàng
                    <input
                        className={`${field} mt-2`}
                        required
                        maxLength={1000}
                        value={parcel.address}
                        onChange={(e) =>
                            setParcel({
                                ...parcel,
                                address: e.target.value,
                            })
                        }
                        placeholder="Số nhà, đường, phường/xã"
                    />
                </label>
                <label className="col-span-2 text-sm font-bold">
                    Ghi chú giao hàng{' '}
                    <span className="font-normal text-store-muted">(không bắt buộc)</span>
                    <input
                        className={`${field} mt-2`}
                        maxLength={1000}
                        value={parcel.note}
                        onChange={(e) => setParcel({ ...parcel, note: e.target.value })}
                    />
                </label>
            </div>
            <h3 className="mb-3 mt-6 text-base font-bold">Số lượng cho gói này</h3>
            <div className="space-y-3">
                {quote.items.map((item) => (
                    <label
                        key={item.id}
                        className="flex items-center justify-between gap-4 rounded-lg bg-store-cream px-4 py-3 text-sm"
                    >
                        <span>
                            <strong>{item.nameVi}</strong>
                            <span className="ml-2 text-store-muted">
                                Còn {Number(item.quantity) - allocated(item.id)} {item.unitCode}
                            </span>
                        </span>
                        <input
                            type="number"
                            min="0"
                            step="0.001"
                            max={Math.max(0, Number(item.quantity) - allocated(item.id))}
                            className={`${field} max-w-28`}
                            value={quantities[item.id] || ''}
                            onChange={(e) =>
                                setQuantities({
                                    ...quantities,
                                    [item.id]: e.target.value,
                                })
                            }
                            aria-label={`Số lượng ${item.nameVi} cho gói này`}
                        />
                    </label>
                ))}
            </div>
            <p className="mt-4 text-sm text-store-muted">
                Địa chỉ được tìm tọa độ để tính phí; vui lòng kiểm tra lại địa chỉ trước khi lưu.
            </p>
            <button disabled={busy} type="submit" className={secondary}>
                <Plus size={17} /> Thêm gói
            </button>
        </form>
    );
}
