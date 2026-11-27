import Skeleton from '@/components/common/Skeleton';
import { useEffect, useRef, useState } from 'react';
import type { Map, Marker } from '@vietmap/vietmap-gl-js/dist/vietmap-gl';
import { loadVietMap } from '@/services/shipper/vietmapService';
import { useDeliveryRoute } from '@/hooks/shipper/useDeliveryRoute';
import { deliveryMapCities } from '@/utils/deliveryMapCities';
import '@vietmap/vietmap-gl-js/dist/vietmap-gl.css';
import './DeliveryMap.css';

const apiKey = import.meta.env.VITE_VIETMAP_TILEMAP_KEY?.trim() ?? '';

const ROUTE_SOURCE = 'delivery-route';

export default function DeliveryMap({
    latitude,
    longitude,
    city,
    packageId,
}: {
    latitude?: number | null;
    longitude?: number | null;
    city?: string | null;
    // Package đã nhận; dùng để hỏi BE đường đi thật tới điểm giao.
    packageId?: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<Map | null>(null);
    const currentMarkerRef = useRef<Marker | null>(null);
    const { route, failed: routeFailed } = useDeliveryRoute(packageId);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [attempt, setAttempt] = useState(0);
    // Chỉ phục vụ TP. Hồ Chí Minh.
    const branch = deliveryMapCities.hcm;
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
                    // Đường đi từ Bitexco tới điểm giao.
                    map.addSource(ROUTE_SOURCE, {
                        type: 'geojson',
                        data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } },
                    });
                    map.addLayer({
                        id: ROUTE_SOURCE,
                        type: 'line',
                        source: ROUTE_SOURCE,
                        layout: { 'line-cap': 'round', 'line-join': 'round' },
                        paint: { 'line-color': '#2563eb', 'line-width': 5, 'line-opacity': 0.85 },
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

    // Hiển thị điểm xuất phát và đường đi từ Bitexco tới địa chỉ giao hàng.
    useEffect(() => {
        const map = mapRef.current;
        const marker = currentMarkerRef.current;
        if (!packageId || status !== 'ready' || !map || !marker) return;
        const here = branch.origin;
        marker.setLngLat(here).addTo(map);
        const source = map.getSource(ROUTE_SOURCE) as { setData?: (data: unknown) => void } | undefined;
        if (hasPoint && source?.setData) {
            const target: [number, number] = [longitude, latitude];
            // Đường thật theo VietMap; chưa có (đang tải hoặc lỗi) thì chưa vẽ để không gây hiểu nhầm.
            const line = route?.coordinates.length ? [here, ...route.coordinates, target] : [];
            source.setData({
                type: 'Feature',
                properties: {},
                geometry: { type: 'LineString', coordinates: line },
            });
            const points = line.length ? line : [here, target];
            const lngs = points.map((point) => point[0]);
            const lats = points.map((point) => point[1]);
            map.fitBounds(
                [
                    [Math.min(...lngs), Math.min(...lats)],
                    [Math.max(...lngs), Math.max(...lats)],
                ],
                { padding: 60, maxZoom: 16, duration: 600 },
            );
        }
    }, [branch, packageId, route, status, hasPoint, latitude, longitude]);

    function retry() {
        setStatus('loading');
        setAttempt(attempt + 1);
    }

    return (
        <section className="dl-panel dl-map-panel" aria-label="Bản đồ giao hàng">
            <div className="dl-panel-heading">
                <div>
                    <h2>Bản đồ giao hàng</h2>
                    <p>Đường đi từ Bitexco đến địa chỉ giao hàng.</p>
                </div>
            </div>
            <div className="dl-map-frame" aria-busy={!!apiKey && status === 'loading'}>
                <div ref={containerRef} className="dl-map-canvas" aria-label="Bản đồ VietMap" />
                {!apiKey && (
                    <div className="dl-map-message" role="alert">
                        <p>Chưa có cấu hình bản đồ VietMap.</p>
                    </div>
                )}
                {apiKey && status === 'loading' && (
                    <Skeleton className="absolute! inset-0 h-full w-full"/>
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
            {packageId && route && hasPoint && (
                <p className="dl-map-note">
                    Từ Bitexco đến điểm giao: <strong>{(route.distanceMetres / 1000).toFixed(1)} km</strong>, đi xe máy khoảng{' '}
                    <strong>{Math.max(1, Math.round(route.durationMs / 60000))} phút</strong>.
                </p>
            )}
            {packageId && hasPoint && !route && (
                <p className="dl-map-note">{routeFailed ? 'Không tìm được đường đi từ Bitexco. Vui lòng tải lại trang để thử lại.' : 'Đang tìm đường đi tới điểm giao…'}</p>
            )}
        </section>
    );
}
