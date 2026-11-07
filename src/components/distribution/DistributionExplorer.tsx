import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, MapPin, Navigation, Search, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { LngLatBoundsLike, Map, Marker } from '@vietmap/vietmap-gl-js/dist/vietmap-gl';
import { ROUTES } from '@/router/routes';
import { publicHttp } from '@/services/axiosClient';
import { addressToCoordinates, coordinatesToAddress } from '@/services/geocodingService';
import { loadVietMap } from '@/services/shipper/vietmapService';
import '@vietmap/vietmap-gl-js/dist/vietmap-gl.css';

type Suggestion = { refId: string; display: string };
type Estimate = {
    address: string;
    lat: number;
    lng: number;
    distanceMetres: number;
    fee: number;
    coordinates: [number, number][];
};
const branches = {
    hcm: {
        name: 'Bitexco Financial Tower',
        origin: [106.70418, 10.77172] as [number, number],
        bounds: [
            [106 + 22 / 60, 10 + 38 / 60],
            [106 + 56 / 60, 11 + 10 / 60],
        ] as LngLatBoundsLike,
    },
    hanoi: {
        name: 'Grand Terra',
        origin: [105.8295441, 21.0292789] as [number, number],
        bounds: [
            [105 + 44 / 60, 20 + 53 / 60],
            [106 + 2 / 60, 21 + 23 / 60],
        ] as LngLatBoundsLike,
    },
};
const tileKey = import.meta.env.VITE_VIETMAP_TILEMAP_KEY?.trim() ?? '';

export default function DistributionExplorer() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation('storefront');
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<Map | null>(null);
    const markerRef = useRef<Marker | null>(null);
    const originMarkerRef = useRef<Marker | null>(null);
    const requestRef = useRef(0);
    const [city, setCity] = useState<'hcm' | 'hanoi'>('hcm');
    const [mode, setMode] = useState<'search' | 'map'>('search');
    const [point, setPoint] = useState<[number, number] | null>(null);
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [estimate, setEstimate] = useState<Estimate | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mapError, setMapError] = useState(false);
    const [mapReady, setMapReady] = useState(false);

    const selectCoordinates = useCallback(
        async (lat: number, lng: number) => {
            const request = ++requestRef.current;
            setPoint([lng, lat]);
            setEstimate(null);
            setQuery('');
            setSuggestions([]);
            setError('');
            setLoading(true);
            const [addressResult, routeResult] = await Promise.allSettled([
                coordinatesToAddress(lat, lng),
                publicHttp.get<{ data: Estimate }>('/api/delivery-estimate/coordinates', {
                    params: { lat, lng, city },
                }),
            ]);
            if (request !== requestRef.current) return;
            if (addressResult.status === 'fulfilled') setQuery(addressResult.value.address);
            if (routeResult.status === 'fulfilled') setEstimate(routeResult.value.data.data);
            if (addressResult.status === 'rejected') setError('distribution.errors.reverse');
            if (routeResult.status === 'rejected') setError('distribution.errors.route');
            setLoading(false);
        },
        [city],
    );

    useEffect(() => {
        if (!tileKey || !mapContainer.current) return;
        let disposed = false;
        let map: Map | undefined;
        let observer: ResizeObserver | undefined;
        let timeout: number | undefined;
        loadVietMap()
            .then((vietmap) => {
                if (disposed || !mapContainer.current) return;
                map = new vietmap.Map({
                    container: mapContainer.current,
                    style: `https://maps.vietmap.vn/maps/styles/tm/style.json?apikey=${encodeURIComponent(tileKey)}`,
                    center: branches.hcm.origin,
                    zoom: 13,
                    minZoom: 9,
                    maxZoom: 19,
                    maxBounds: branches.hcm.bounds,
                    attributionControl: { customAttribution: '© VIETMAP' },
                });
                mapRef.current = map;
                map.once('load', () => {
                    window.clearTimeout(timeout);
                    if (!disposed) {
                        setMapError(false);
                        setMapReady(true);
                    }
                });
                map.addControl(new vietmap.NavigationControl(), 'top-right');
                originMarkerRef.current = new vietmap.Marker({ color: '#123b2e' })
                    .setLngLat(branches.hcm.origin)
                    .addTo(map);
                observer = new ResizeObserver(() => map?.resize());
                observer.observe(mapContainer.current);
                timeout = window.setTimeout(() => {
                    if (!disposed) setMapError(true);
                }, 20000);
            })
            .catch(() => {
                if (!disposed) setMapError(true);
            });
        return () => {
            disposed = true;
            window.clearTimeout(timeout);
            observer?.disconnect();
            markerRef.current = null;
            originMarkerRef.current = null;
            mapRef.current = null;
            map?.remove();
        };
    }, []);

    useEffect(() => {
        if (!mapReady || !mapRef.current) return;
        originMarkerRef.current?.setLngLat(branches[city].origin);
        mapRef.current.setMaxBounds(null);
        mapRef.current.jumpTo({ center: branches[city].origin, zoom: 13 });
        mapRef.current.setMaxBounds(branches[city].bounds);
    }, [city, mapReady]);

    useEffect(() => {
        if (!mapReady || !mapContainer.current) return;
        const controls = [
            ['.vietmapgl-ctrl-zoom-in', t('distribution.zoomIn')],
            ['.vietmapgl-ctrl-zoom-out', t('distribution.zoomOut')],
            ['.vietmapgl-ctrl-compass', t('distribution.resetBearing')],
        ];
        for (const [selector, label] of controls) {
            const button = mapContainer.current.querySelector<HTMLButtonElement>(selector);
            if (button) {
                button.title = label;
                button.setAttribute('aria-label', label);
            }
        }
        originMarkerRef.current
            ?.getElement()
            .setAttribute('aria-label', t('distribution.originMarker'));
        markerRef.current
            ?.getElement()
            .setAttribute('aria-label', t('distribution.deliveryMarker'));
    }, [mapReady, point, t]);

    useEffect(() => {
        const map = mapRef.current;
        markerRef.current?.remove();
        markerRef.current = null;
        if (!map || !mapReady || !point) return;
        let disposed = false;
        loadVietMap()
            .then((vietmap) => {
                if (disposed) return;
                const marker = new vietmap.Marker({ color: '#ff5a4e', draggable: true })
                    .setLngLat(point)
                    .addTo(map);
                marker.getElement().setAttribute('aria-label', t('distribution.deliveryMarker'));
                markerRef.current = marker;
                marker.on('dragend', () => {
                    const location = marker.getLngLat();
                    setMode('map');
                    void selectCoordinates(location.lat, location.lng);
                });
            })
            .catch(() => setMapError(true));
        return () => {
            disposed = true;
            markerRef.current?.remove();
            markerRef.current = null;
        };
    }, [point, mapReady, selectCoordinates, t]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !mapReady || mode !== 'map') return;
        function onMapClick(event: { lngLat: { lat: number; lng: number } }) {
            void selectCoordinates(event.lngLat.lat, event.lngLat.lng);
        }
        map.getCanvas().style.cursor = 'crosshair';
        map.on('click', onMapClick);
        return () => {
            map.getCanvas().style.cursor = '';
            map.off('click', onMapClick);
        };
    }, [mode, mapReady, selectCoordinates]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !mapReady || !estimate) return;
        let disposed = false;
        loadVietMap()
            .then((vietmap) => {
                if (disposed) return;
                map.addSource('delivery-route', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: { type: 'LineString', coordinates: estimate.coordinates },
                    },
                });
                map.addLayer({
                    id: 'delivery-route',
                    type: 'line',
                    source: 'delivery-route',
                    layout: { 'line-cap': 'round', 'line-join': 'round' },
                    paint: { 'line-color': '#2563eb', 'line-width': 5, 'line-opacity': 0.9 },
                });
                const bounds = new vietmap.LngLatBounds(
                    branches[city].origin,
                    branches[city].origin,
                );
                for (const coordinate of estimate.coordinates) bounds.extend(coordinate);
                bounds.extend([estimate.lng, estimate.lat]);
                map.fitBounds(bounds, { padding: 80, maxZoom: 15 });
            })
            .catch(() => setMapError(true));
        return () => {
            disposed = true;
            if (mapRef.current === map) {
                if (map.getLayer('delivery-route')) map.removeLayer('delivery-route');
                if (map.getSource('delivery-route')) map.removeSource('delivery-route');
            }
        };
    }, [estimate, mapReady, city]);

    useEffect(() => {
        if (mode === 'map' || query.trim().length < 2 || loading || estimate) {
            setSuggestions([]);
            return;
        }
        const controller = new AbortController();
        const timer = window.setTimeout(async () => {
            try {
                const response = await publicHttp.get<{ data: Suggestion[] }>(
                    '/api/delivery-estimate/addresses',
                    {
                        params: { q: query.trim(), city },
                        signal: controller.signal,
                    },
                );
                setSuggestions(response.data.data);
                setError('');
            } catch {
                if (!controller.signal.aborted) setError('distribution.errors.search');
            }
        }, 350);
        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [query, estimate, loading, city, mode]);

    async function selectAddress(suggestion: Suggestion) {
        const request = ++requestRef.current;
        setQuery(suggestion.display);
        setSuggestions([]);
        setLoading(true);
        setError('');
        try {
            const response = await publicHttp.get<{ data: Estimate }>('/api/delivery-estimate', {
                params: { refId: suggestion.refId, city },
            });
            if (request !== requestRef.current) return;
            const result = {
                ...response.data.data,
                address: response.data.data.address || suggestion.display,
            };
            setEstimate(result);
            setPoint([result.lng, result.lat]);
            setQuery(result.address || suggestion.display);
        } catch {
            if (request !== requestRef.current) return;
            setEstimate(null);
            setError('distribution.errors.estimate');
        } finally {
            if (request === requestRef.current) setLoading(false);
        }
    }

    async function searchAddress() {
        if (query.trim().length < 2) return;
        const request = ++requestRef.current;
        setLoading(true);
        setError('');
        try {
            const location = await addressToCoordinates(query.trim(), city);
            if (request !== requestRef.current) return;
            setMode('map');
            await selectCoordinates(location.lat, location.lng);
        } catch {
            if (request !== requestRef.current) return;
            setError('distribution.errors.geocode');
            setLoading(false);
        }
    }

    function useAddress() {
        if (!estimate || !query.trim()) return;
        try {
            sessionStorage.setItem('btb.deliveryAddress', query.trim());
        } catch {
            /* Optional storage. */
        }
        navigate(ROUTES.CHECKOUT, { state: { deliveryAddress: query.trim() } });
    }

    return (
        <section
            className="mt-8 grid grid-cols-[minmax(320px,0.75fr)_minmax(0,1.6fr)] items-stretch gap-6"
            aria-label={t('distribution.estimateTitle')}
        >
            <div className="rounded-2xl border-2 border-store-ink bg-white p-5 text-store-ink">
                <div className="mb-5 flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-store-yellow">
                        <Truck size={22} />
                    </span>
                    <div className="flex min-w-0 flex-col gap-1">
                        <h2 className="m-0 font-subheading text-2xl leading-tight font-bold">
                            {t('distribution.estimateTitle')}
                        </h2>
                    </div>
                </div>
                <label
                    htmlFor="delivery-city"
                    className="font-label text-sm font-bold uppercase text-store-green"
                >
                    {t('distribution.city')}
                </label>
                <select
                    id="delivery-city"
                    value={city}
                    disabled={loading}
                    onChange={(event) => {
                        requestRef.current++;
                        setCity(event.target.value as 'hcm' | 'hanoi');
                        setQuery('');
                        setSuggestions([]);
                        setEstimate(null);
                        setPoint(null);
                        setError('');
                    }}
                    className="mt-1.5 mb-4 w-full rounded-xl border-2 border-store-ink bg-store-cream px-4 py-2.5 font-body text-sm outline-none focus:border-store-green"
                >
                    <option value="hcm">{t('distribution.hcm')}</option>
                    <option value="hanoi">{t('distribution.hanoi')}</option>
                </select>
                <div className="mb-4 flex gap-3 border-b border-store-line pb-4">
                    <MapPin className="mt-1 shrink-0 text-store-green" size={20} />
                    <div>
                        <p className="m-0 font-label text-xs font-bold uppercase text-store-muted">
                            {t('distribution.origin')}
                        </p>
                        <p className="m-0 mt-1 font-bold">{branches[city].name}</p>
                        <p className="m-0 mt-1 text-sm text-store-muted">
                            {t(
                                city === 'hcm'
                                    ? 'distribution.hcmAddress'
                                    : 'distribution.hanoiAddress',
                            )}
                        </p>
                    </div>
                </div>
                <div
                    className="mb-4 flex gap-2"
                    role="group"
                    aria-label={t('distribution.addressMode')}
                >
                    <button
                        type="button"
                        aria-pressed={mode === 'search'}
                        onClick={() => {
                            setMode('search');
                            setSuggestions([]);
                        }}
                        className={`flex-1 rounded-xl border-2 border-store-ink px-3 py-2 text-sm font-bold ${mode === 'search' ? 'bg-store-yellow' : 'bg-white'}`}
                    >
                        {t('distribution.enterAddress')}
                    </button>
                    <button
                        type="button"
                        aria-pressed={mode === 'map'}
                        onClick={() => {
                            setMode('map');
                            setSuggestions([]);
                        }}
                        className={`flex-1 rounded-xl border-2 border-store-ink px-3 py-2 text-sm font-bold ${mode === 'map' ? 'bg-store-yellow' : 'bg-white'}`}
                    >
                        {t('distribution.chooseOnMap')}
                    </button>
                </div>
                {mode === 'map' && (
                    <p className="m-0 mb-3 text-sm text-store-muted">
                        {t('distribution.mapHelp')}
                    </p>
                )}
                <label
                    htmlFor="delivery-address-search"
                    className="font-label text-sm font-bold uppercase text-store-green"
                >
                    {t('distribution.deliveryAddress')}
                </label>
                <div className="relative mt-1.5">
                    <Search
                        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-store-muted"
                        size={20}
                    />
                    <input
                        id="delivery-address-search"
                        value={query}
                        disabled={loading}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            if (mode === 'search') {
                                setEstimate(null);
                                setPoint(null);
                            }
                            setError('');
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && mode === 'search') {
                                event.preventDefault();
                                void searchAddress();
                            }
                        }}
                        placeholder={t('distribution.addressPlaceholder')}
                        autoComplete="off"
                        className="w-full rounded-xl border-2 border-store-ink bg-store-cream py-2.5 pr-4 pl-12 font-body text-sm outline-none focus:border-store-green"
                    />
                    {suggestions.length > 0 && (
                        <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border-2 border-store-ink bg-white p-1 shadow-lg">
                            {suggestions.map((item) => (
                                <li key={item.refId}>
                                    <button
                                        type="button"
                                        onClick={() => void selectAddress(item)}
                                        className="w-full rounded-lg px-3 py-2.5 text-left text-sm hover:bg-surface-green"
                                    >
                                        {item.display}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {loading && (
                    <p className="m-0 mt-2 text-sm text-store-muted" role="status">
                        {t('distribution.calculating')}
                    </p>
                )}
                {error && (
                    <p className="m-0 mt-2 text-sm text-red-700" role="alert">
                        {t(error)}
                    </p>
                )}
                <div className="mt-4 rounded-xl bg-surface-green p-4">
                    <div className="flex justify-between gap-4 text-sm">
                        <span>{t('distribution.distance')}</span>
                        <strong>
                            {estimate ? `${(estimate.distanceMetres / 1000).toFixed(1)} km` : '—'}
                        </strong>
                    </div>
                    <div className="mt-3 flex justify-between gap-4 border-t border-store-green/20 pt-3">
                        <span className="font-bold">{t('distribution.estimatedFee')}</span>
                        <strong className="text-xl text-store-green">
                            {estimate
                                ? estimate.fee === 0
                                    ? t('distribution.free')
                                    : new Intl.NumberFormat(
                                          i18n.resolvedLanguage === 'vi' ? 'vi-VN' : 'en-US',
                                          { style: 'currency', currency: 'VND' },
                                      ).format(estimate.fee)
                                : '—'}
                        </strong>
                    </div>
                </div>
                <p className="m-0 mt-3 text-sm text-store-muted">{t('distribution.feePolicy')}</p>
                <button
                    type="button"
                    disabled={!estimate || !query.trim() || loading}
                    onClick={useAddress}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-store-ink px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {t('distribution.useAddress')} <ArrowRight size={18} />
                </button>
            </div>
            <div className="relative min-h-[620px] overflow-hidden border-2 border-store-ink bg-store-cream">
                <div
                    ref={mapContainer}
                    className="h-full w-full"
                    aria-label={t('distribution.mapLabel')}
                />
                {(!tileKey || mapError) && (
                    <div
                        className="absolute inset-0 grid place-items-center bg-store-cream p-6 text-center text-store-ink"
                        role="alert"
                    >
                        {!tileKey
                            ? t('distribution.mapNotConfigured')
                            : t('distribution.mapUnavailable')}
                    </div>
                )}
                <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-xl border-2 border-store-ink bg-white px-4 py-3 text-store-ink">
                    <Navigation size={18} className="text-store-green" />
                    <span className="text-sm font-bold">
                        {t('distribution.branch', { name: branches[city].name })}
                    </span>
                </div>
            </div>
        </section>
    );
}
