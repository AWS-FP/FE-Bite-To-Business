export interface BackendHealth {
    status: 'UP';
    service: string;
    roundTripMs: number;
    checkedAt: string;
}

export interface MonitoringPoint {
    time: string;
    value: number;
}

export interface SystemMonitoring {
    from: string;
    to: string;
    periodSeconds: number;
    cloudStatus: 'AVAILABLE' | 'PARTIAL' | 'UNAVAILABLE';
    metrics: { id: string; unit: string; points: MonitoringPoint[] }[];
    ai: {
        time: string;
        requests: number;
        failed: number;
        inputTokens: number;
        outputTokens: number;
    }[];
    recentAiLogs: {
        time: string;
        model: string;
        status: string;
        durationMs: number | null;
        inputTokens: number | null;
        outputTokens: number | null;
        errorCode: string | null;
    }[];
}
