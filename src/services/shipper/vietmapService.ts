import type * as VietMap from '@vietmap/vietmap-gl-js/dist/vietmap-gl';
import sdkUrl from '@vietmap/vietmap-gl-js/dist/vietmap-gl.js?url';

declare global {
    interface Window {
        vietmapgl?: typeof VietMap;
    }
}

let sdkPromise: Promise<typeof VietMap> | undefined;

export function loadVietMap() {
    if (window.vietmapgl) return Promise.resolve(window.vietmapgl);
    if (sdkPromise) return sdkPromise;

    sdkPromise = new Promise<typeof VietMap>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = sdkUrl;
        script.async = true;

        script.onload = () => {
            if (window.vietmapgl) {
                resolve(window.vietmapgl);
            } else {
                sdkPromise = undefined;
                script.remove();
                reject(new Error('VietMap SDK did not initialize.'));
            }
        };
        script.onerror = () => {
            sdkPromise = undefined;
            script.remove();
            reject(new Error('VietMap SDK could not be loaded.'));
        };

        document.head.append(script);
    });

    return sdkPromise;
}
