import { useEffect, useRef, useState } from 'react';
import type { Map, Marker } from '@vietmap/vietmap-gl-js/dist/vietmap-gl';
import { loadVietMap } from '@/services/shipper/vietmapService';
import { useCurrentPosition } from '@/hooks/shipper/useCurrentPosition';
import { deliveryMapCities } from '@/utils/deliveryMapCities';
import '@vietmap/vietmap-gl-js/dist/vietmap-gl.css';
import './DeliveryMap.css';

const apiKey = import.meta.env.VITE_VIETMAP_TILEMAP_KEY?.trim() ?? '';

const ROUTE_SOURCE = 'delivery-route';

export default function DeliveryMap({
    latitude,
    longitude,
    city,
    showRouteFromCurrentPosition = false,
}: {
    latitude?: number | null;
    longitude?: number | null;
    city?: string | null;
    // Hiện vị trí hiện tại của nhân viên và đường nối tới điểm giao.
    showRouteFromCurrentPosition?: boolean;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<Map | null>(null);
    const currentMarkerRef = useRef<Marker | null>(null);
    const { position, denied } = useCurrentPosition(showRouteFromCurrentPosition);
    const [selectedCity, setSelectedCity] = useState<'hcm' | 'hanoi'>(city === 'hanoi' ? 'hanoi' : 'hcm');
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [attempt, setAttempt] = useState(0);
    const branch = deliveryMapCities[selectedCity];
    const hasPoint = latitude != null && longitude != null
        && longitude >= branch.bounds[0][0] && longitude <= branch.bounds[1][0]
        && latitude >= branch.bounds[0][1] && latitude <= branch.bounds[1][1];

    useEffect(() => {
        if (!apiKey || !containerRef.current) return;

        let cancelled = false;
        let failed = false;
        let map: Map | undefined;
        let observer: ResizeObserver | undefined;
        let timeout: ReturnType<typeof setTimeout> | undefined;

        async function loadMap() {
            try {
                const vietmap = await loadVietMap();
                if (cancelled || !containerRef.current) return;

                map = new vietmap.Map({
                    container: containerRef.current,
                    style: `https://maps.vietmap.vn/maps/styles/tm/style.json?apikey=${encodeURIComponent(apiKey)}`,
                    center: hasPoint ? [longitude, latitude] : branch.origin,
                    zoom: 13,
                    minZoom: 9,
                    maxZoom: 19,
                    maxBounds: branch.bounds,
                    attributionControl: { customAttribution: '© VIETMAP' },
                    locale: {
                        'NavigationControl.ZoomIn': 'Phóng to',
                        'NavigationControl.ZoomOut': 'Thu nhỏ',
                        'NavigationControl.ResetBearing': 'Hướng Bắc',
                        'FullscreenControl.Enter': 'Toàn màn hình',
                        'FullscreenControl.Exit': 'Thoát toàn màn hình',
                        'GeolocateControl.FindMyLocation': 'Vị trí của tôi',
                        'GeolocateControl.LocationNotAvailable': 'Không lấy được vị trí',
                    },
                });

                map.on('error', () => {
                    failed = true;
                    clearTimeout(timeout);
                    if (!cancelled) setStatus('error');
                });
                map.once('load', () => {
                    clearTimeout(timeout);
                    if (cancelled || failed || !map) return;
                    // Đường nối vị trí hiện tại tới điểm giao; dữ liệu được cập nhật khi vị trí thay đổi.
                    map.addSource(ROUTE_SOURCE, {
                        type: 'geojson',
                        data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } },
                    });
                    map.addLayer({
                        id: ROUTE_SOURCE,
                        type: 'line',
                        source: ROUTE_SOURCE,
                        layout: { 'line-cap': 'round', 'line-join': 'round' },
                        paint: { 'line-color': '#2563eb', 'line-width': 4, 'line-dasharray': [1.5, 1.5] },
                    });
                    currentMarkerRef.current = new vietmap.Marker({ color: '#2563eb' });
                    mapRef.current = map;
                    setStatus('ready');
                });

                map.addControl(new vietmap.NavigationControl(), 'top-right');
                if (hasPoint) {
                    new vietmap.Marker().setLngLat([longitude, latitude]).addTo(map);
                }
                map.doubleClickZoom.disable();
                map.on('dblclick', () => {
                    if (containerRef.current && !document.fullscreenElement) void containerRef.current.requestFullscreen();
                });
                map.addControl(new vietmap.FullscreenControl(), 'top-right');
                map.addControl(
                    new vietmap.GeolocateControl({
                        positionOptions: { enableHighAccuracy: true },
                        trackUserLocation: true,
                    }),
                    'top-right',
                );

                observer = new ResizeObserver(() => map?.resize());
                observer.observe(containerRef.current);
                timeout = setTimeout(() => {
                    failed = true;
                    if (!cancelled) setStatus('error');
                }, 20000);
            } catch {
                if (!cancelled) setStatus('error');
            }
        }

        void loadMap();
        return () => {
            cancelled = true;
            clearTimeout(timeout);
            observer?.disconnect();
            currentMarkerRef.current?.remove();
            currentMarkerRef.current = null;
            mapRef.current = null;
            map?.remove();
        };
    }, [attempt, latitude, longitude, branch, hasPoint]);

    // Cập nhật marker vị trí hiện tại và đường nối mỗi khi vị trí thay đổi.
    useEffect(() => {
        const map = mapRef.current;
        const marker = currentMarkerRef.current;
        if (!showRouteFromCurrentPosition || status !== 'ready' || !map || !marker || !position) return;
        const here: [number, number] = [position.longitude, position.latitude];
        marker.setLngLat(here).addTo(map);
        const source = map.getSource(ROUTE_SOURCE) as { setData?: (data: unknown) => void } | undefined;
        if (hasPoint && source?.setData) {
            const target: [number, number] = [longitude, latitude];
            source.setData({
                type: 'Feature',
                properties: {},
                geometry: { type: 'LineString', coordinates: [here, target] },
            });
            map.fitBounds(
                [
                    [Math.min(here[0], target[0]), Math.min(here[1], target[1])],
                    [Math.max(here[0], target[0]), Math.max(here[1], target[1])],
                ],
                { padding: 60, maxZoom: 16, duration: 600 },
            );
        }
    }, [position, status, showRouteFromCurrentPosition, hasPoint, latitude, longitude]);

    function retry() {
        setStatus('loading');
        setAttempt(attempt + 1);
    }

    return (
        <section className="dl-panel dl-map-panel" aria-label="Bản đồ giao hàng">
            <div className="dl-panel-heading">
                <div>
                    <h2>Bản đồ giao hàng</h2>
                    <p>Kéo bản đồ, phóng to hoặc xem vị trí của bạn.</p>
                </div>
                {!city && <select aria-label="Chọn thành phố" value={selectedCity} onChange={(event) => setSelectedCity(event.target.value as 'hcm' | 'hanoi')}>
                    <option value="hcm">TP. Hồ Chí Minh</option>
                    <option value="hanoi">Hà Nội</option>
                </select>}
            </div>
            <div className="dl-map-frame" aria-busy={!!apiKey && status === 'loading'}>
                <div ref={containerRef} className="dl-map-canvas" aria-label="Bản đồ VietMap" />
                {!apiKey && (
                    <div className="dl-map-message" role="alert">
                        <p>Chưa có cấu hình bản đồ VietMap.</p>
                    </div>
                )}
                {apiKey && status === 'loading' && (
                    <div className="dl-map-message" role="status">
                        <p>Đang tải bản đồ VietMap…</p>
                    </div>
                )}
                {apiKey && status === 'error' && (
                    <div className="dl-map-message" role="alert">
                        <p>Không tải được bản đồ VietMap. Kiểm tra kết nối và thử lại.</p>
                        <button type="button" className="dl-btn" onClick={retry}>
                            Thử lại
                        </button>
                    </div>
                )}
            </div>
            <p className="dl-map-note">Nhấp đúp vào bản đồ để xem toàn màn hình. Nhấn Esc để thoát.</p>
            {city && !hasPoint && <p className="dl-map-note">Chưa có tọa độ giao hàng hợp lệ trong khu vực bản đồ.</p>}
            {showRouteFromCurrentPosition && denied && (
                <p className="dl-map-note">Bạn chưa cho phép truy cập vị trí nên chưa vẽ được đường tới điểm giao.</p>
            )}
            {showRouteFromCurrentPosition && position && hasPoint && (
                <p className="dl-map-note">Chấm xanh dương là vị trí hiện tại của bạn; đường nét đứt nối tới điểm giao hàng.</p>
            )}
        </section>
    );
}
