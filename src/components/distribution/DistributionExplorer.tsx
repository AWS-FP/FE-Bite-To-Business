import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Check, ChevronDown, ChevronRight, Info, Layers3,
    MapPin, Navigation2, Search, SlidersHorizontal, X,
} from 'lucide-react';
import type { DistributionCity } from './distributionData';
import './distributionExplorer.css';

type DemoPoint = {
    id: string;
    cityId: DistributionCity['id'];
    area: string;
    name: string;
    category: string;
    address?: string; // Có dữ liệu thật mới hiển thị địa chỉ.
    x: number;
    y: number;
};

// DỮ LIỆU GIẢ LẬP: tên điểm và vị trí ghim KHÔNG phải cơ sở thực tế của BTB.
const DEMO_POINTS: DemoPoint[] = [
    { id: 'HCM-01', cityId: 'hcm', area: 'Khu trung tâm', name: 'Điểm mẫu BTB 01', category: 'Điểm kết nối', x: 43, y: 53 },
    { id: 'HCM-02', cityId: 'hcm', area: 'Khu trung tâm', name: 'Điểm mẫu BTB 02', category: 'Điểm kết nối', x: 56, y: 66 },
    { id: 'HCM-03', cityId: 'hcm', area: 'Khu phía Đông', name: 'Điểm mẫu BTB 03', category: 'Điểm kết nối', x: 76, y: 35 },
    { id: 'HCM-04', cityId: 'hcm', area: 'Khu phía Tây', name: 'Điểm mẫu BTB 04', category: 'Điểm kết nối', x: 24, y: 40 },
    { id: 'HN-01', cityId: 'hanoi', area: 'Khu trung tâm', name: 'Điểm mẫu BTB 01', category: 'Điểm kết nối', x: 49, y: 47 },
    { id: 'HN-02', cityId: 'hanoi', area: 'Khu phía Tây', name: 'Điểm mẫu BTB 02', category: 'Điểm kết nối', x: 24, y: 62 },
    { id: 'HN-03', cityId: 'hanoi', area: 'Khu phía Bắc', name: 'Điểm mẫu BTB 03', category: 'Điểm kết nối', x: 65, y: 23 },
    { id: 'HN-04', cityId: 'hanoi', area: 'Khu phía Đông', name: 'Điểm mẫu BTB 04', category: 'Điểm kết nối', x: 76, y: 65 },
];

function normalizeSearch(value: string) {
    return value.toLocaleLowerCase('vi-VN')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .trim();
}

type Props = { city: DistributionCity };

export default function DistributionExplorer({ city }: Props) {
    const [area, setArea] = useState('');
    const [pointFilterId, setPointFilterId] = useState('');
    const [selectedId, setSelectedId] = useState('');
    const [search, setSearch] = useState('');
    const [closedAreas, setClosedAreas] = useState<string[]>([]);
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setArea('');
        setPointFilterId('');
        setSelectedId('');
        setSearch('');
        setClosedAreas([]);
    }, [city.id]);

    const cityPoints = useMemo(
        () => DEMO_POINTS.filter((point) => point.cityId === city.id),
        [city.id],
    );
    const areas = useMemo(
        () => Array.from(new Set(cityPoints.map((point) => point.area))),
        [cityPoints],
    );

    const visiblePoints = useMemo(() => {
        const needle = normalizeSearch(search);
        return cityPoints.filter((point) => {
            if (area && point.area !== area) return false;
            if (pointFilterId && point.id !== pointFilterId) return false;
            if (!needle) return true;
            return normalizeSearch(`${point.name} ${point.id} ${point.area} ${point.category} ${point.address ?? ''}`).includes(needle);
        });
    }, [cityPoints, area, pointFilterId, search]);

    const groups = areas
        .map((name) => ({
            name,
            points: visiblePoints.filter((point) => point.area === name),
        }))
        .filter((group) => group.points.length > 0);

    const selectedPoint = cityPoints.find((point) => point.id === selectedId);

    function changeArea(next: string) {
        setArea(next);
        setPointFilterId('');
        setSelectedId('');
        setClosedAreas([]);
    }

    function selectPoint(point: DemoPoint, scrollToMap = false) {
        setSelectedId(point.id);
        if (scrollToMap) mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    return (
        <section className="btb-dx" aria-labelledby="btb-dx-title">
            <div className="btb-dx__heading">
                <div>
                    <span className="btb-dx__kicker">TÌM KIẾM ĐỊA ĐIỂM</span>
                    <h2 id="btb-dx-title">Tra cứu mạng lưới <em>theo khu vực.</em></h2>
                    <p>Chọn khu vực hoặc tìm tên điểm để xem kết quả tương ứng trên sơ đồ.</p>
                </div>
                <span className="btb-dx__demo"><Info size={15} /> GIAO DIỆN DEMO</span>
            </div>

            <div className="btb-dx__filters" aria-label="Bộ lọc điểm phân phối">
                <div className="btb-dx__filter">
                    <span className="btb-dx__field-label">THÀNH PHỐ</span>
                    <div className="btb-dx__readonly" aria-label={`Thành phố hiện tại: ${city.name}`}>
                        <MapPin size={17} /> {city.name}
                    </div>
                </div>
                <div className="btb-dx__filter">
                    <label htmlFor="btb-dx-area">QUẬN / KHU VỰC</label>
                    <div className="btb-dx__select-wrap">
                        <select id="btb-dx-area" value={area} onChange={(e) => changeArea(e.target.value)}>
                            <option value="">Tất cả khu vực</option>
                            {areas.map((name) => <option key={name} value={name}>{name}</option>)}
                        </select>
                        <ChevronDown size={17} aria-hidden="true" />
                    </div>
                </div>
                <div className="btb-dx__filter">
                    <label htmlFor="btb-dx-point">ĐIỂM PHÂN PHỐI</label>
                    <div className="btb-dx__select-wrap">
                        <select id="btb-dx-point" value={pointFilterId} onChange={(e) => { setPointFilterId(e.target.value); setSelectedId(e.target.value); }}>
                            <option value="">Tất cả điểm mẫu</option>
                            {cityPoints.filter((p) => !area || p.area === area).map((p) => (
                                <option key={p.id} value={p.id}>{p.name} · {p.area}</option>
                            ))}
                        </select>
                        <ChevronDown size={17} aria-hidden="true" />
                    </div>
                </div>
            </div>

            <div className="btb-dx__workspace">
                <div className="btb-dx__results">
                    <div className="btb-dx__results-heading">
                        <div>
                            <span className="btb-dx__kicker">DANH SÁCH ĐIỂM</span>
                            <h3>Kết quả tìm kiếm <span>{visiblePoints.length}</span></h3>
                        </div>
                        <SlidersHorizontal size={20} aria-hidden="true" />
                    </div>

                    <div className="btb-dx__search">
                        <Search size={19} aria-hidden="true" />
                        <input
                            type="search"
                            aria-label="Tìm địa chỉ, tên hoặc mã điểm"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPointFilterId(''); setSelectedId(''); }}
                            placeholder="Tìm địa chỉ, tên điểm, khu vực..."
                        />
                        {search && <button type="button" aria-label="Xóa từ khóa" onClick={() => setSearch('')}><X size={17} /></button>}
                    </div>

                    <div className="btb-dx__list">
                        {groups.length === 0 ? (
                            <div className="btb-dx__empty">
                                <Search size={26} />
                                <strong>Chưa tìm thấy điểm phù hợp</strong>
                                <p>Thử một từ khóa khác hoặc bỏ bộ lọc hiện tại.</p>
                            </div>
                        ) : groups.map((group) => {
                            const isOpen = !closedAreas.includes(group.name);
                            return (
                                <div className="btb-dx__group" key={group.name}>
                                    <button
                                        type="button"
                                        className="btb-dx__group-toggle"
                                        aria-expanded={isOpen}
                                        onClick={() => setClosedAreas((prev) => isOpen ? [...prev, group.name] : prev.filter((x) => x !== group.name))}
                                    >
                                        <span><MapPin size={17} /> {group.name} <b>({group.points.length})</b></span>
                                        <ChevronDown className={isOpen ? 'is-open' : ''} size={18} aria-hidden="true" />
                                    </button>
                                    {isOpen && (
                                        <div className="btb-dx__group-body">
                                            {group.points.map((point) => (
                                                <article className={`btb-dx__place${selectedPoint?.id === point.id ? ' is-selected' : ''}`} key={point.id}>
                                                    <div className="btb-dx__place-mark"><MapPin size={19} /></div>
                                                    <div className="btb-dx__place-info">
                                                        <span className="btb-dx__place-code">{point.id} · ĐỊA ĐIỂM MẪU</span>
                                                        <h4>{point.name}</h4>
                                                        <p>{point.area} · {city.shortName}</p>
                                                        <span>{point.address ?? 'Địa chỉ và giờ hoạt động chưa cập nhật'}</span>
                                                        <button type="button" onClick={() => selectPoint(point, true)}>
                                                            Xem trên sơ đồ <ChevronRight size={15} />
                                                        </button>
                                                    </div>
                                                </article>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <p className="btb-dx__results-note"><Info size={15} /> Các điểm trên chỉ minh họa chức năng tra cứu, không phải địa điểm BTB thật.</p>
                </div>

                <div className="btb-dx__map-panel" ref={mapRef}>
                    <div className="btb-dx__map-toolbar">
                        <div><MapPin size={18} /><strong>Sơ đồ {city.shortName}</strong><span>· {visiblePoints.length} điểm mẫu</span></div>
                        <div className="btb-dx__layers">
                            <span className="is-current"><Layers3 size={15} /> Sơ đồ</span>
                            <button type="button" disabled title="Sẽ có khi tích hợp dịch vụ bản đồ thực tế">Vệ tinh</button>
                        </div>
                    </div>
                    <div className="btb-dx__map-canvas" aria-label={`Sơ đồ minh họa địa điểm mẫu tại ${city.name}`}>
                        <svg className="btb-dx__map-lines" viewBox="0 0 900 580" preserveAspectRatio="none" aria-hidden="true">
                            <path className="btb-dx__river" d="M-20 130 C240 80 190 270 410 240 S685 390 930 310" />
                            <path d="M-20 450 C220 270 370 480 900 120" />
                            <path d="M80 -30 L680 650" />
                            <path d="M650 -30 C580 120 210 250 140 640" />
                            <path d="M30 350 C320 360 500 110 930 520" />
                        </svg>
                        <div className="btb-dx__map-area" aria-hidden="true">{city.name}</div>
                        {visiblePoints.map((point) => (
                            <button
                                type="button"
                                key={point.id}
                                aria-label={`Chọn ${point.name} trên sơ đồ`}
                                title={`${point.name} (vị trí minh họa)`}
                                className={`btb-dx__pin${selectedPoint?.id === point.id ? ' is-selected' : ''}`}
                                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                                onClick={() => selectPoint(point)}
                            ><MapPin size={21} fill="currentColor" strokeWidth={1.8} /></button>
                        ))}
                        {selectedPoint && visiblePoints.some((point) => point.id === selectedPoint.id) && (
                            <div className="btb-dx__map-popup">
                                <span><Check size={15} /> ĐANG CHỌN</span>
                                <strong>{selectedPoint.name}</strong>
                                <small>{selectedPoint.area} · Vị trí trên sơ đồ chỉ minh họa</small>
                                <button type="button" onClick={() => setSelectedId('')} aria-label="Bỏ chọn điểm">Bỏ chọn <X size={14} /></button>
                            </div>
                        )}
                        <div className="btb-dx__map-legend"><Navigation2 size={16} /> Vị trí minh họa · Không phải bản đồ thực tế</div>
                    </div>
                    <div className="btb-dx__map-footer"><Info size={16} /> Khi tích hợp Vietmap/Google Maps và dữ liệu Backend, khu vực này sẽ hiển thị địa chỉ, vị trí và chỉ đường thật.</div>
                </div>
            </div>
        </section>
    );
}
