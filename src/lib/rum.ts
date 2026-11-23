import { AwsRum, type AwsRumConfig } from 'aws-rum-web';

export function startRum() {
    if (!import.meta.env.PROD) {
        return;
    }

    try {
        const config: AwsRumConfig = {
            sessionSampleRate: 1,
            identityPoolId: 'ap-southeast-1:31de0910-ac7c-49fc-abab-3bacd5b54786',
            endpoint: 'https://dataplane.rum.ap-southeast-1.amazonaws.com',
            // performance: tốc độ tải trang; errors: lỗi JavaScript;
            // http: mọi lệnh gọi API backend (đường dẫn, mã trạng thái, thời gian), không ghi body hay header.
            telemetries: [
                'performance',
                'errors',
                ['http', {
                    recordAllRequests: true,
                    urlsToInclude: [/^https:\/\/api\.bite2business\.cloud\//],
                }],
            ],
            allowCookies: false,
            enableXRay: false,
            signing: true,
        };

        new AwsRum(
            '8e484d83-98f2-4d2a-8d79-a832b2880d3f',
            '1.0.0',
            'ap-southeast-1',
            config,
        );
    } catch (error) {
        console.warn('Không khởi tạo được CloudWatch RUM:', error);
    }
}