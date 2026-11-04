import { useEffect, useRef, useState } from 'react';
import type { Map } from '@vietmap/vietmap-gl-js/dist/vietmap-gl';
import { loadVietMap } from '@/services/shipper/vietmapService';
import '@vietmap/vietmap-gl-js/dist/vietmap-gl.css';
import './DeliveryMap.css';

const apiKey = import.meta.env.VITE_VIETMAP_TILEMAP_KEY?.trim() ?? '';

export default function DeliveryMap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [attempt, setAttempt] = useState(0);

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
                    center: [106.7009, 10.7769],
                    zoom: 12,
                    maxZoom: 20,
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
                    if (!cancelled && !failed) setStatus('ready');
                });

                map.addControl(new vietmap.NavigationControl(), 'top-right');
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
            map?.remove();
        };
    }, [attempt]);

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
                <span className="dl-panel-tag">VietMap</span>
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
            <p className="dl-map-note">Chưa có vị trí các điểm giao trên bản đồ.</p>
        </section>
    );
}
