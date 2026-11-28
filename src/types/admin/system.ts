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

export interface ApiDiagnosticRow {
    method: string;
    route: string;
    httpStatus: number | null;
    source: 'ALB' | 'BACKEND' | null;
    requests: number;
    averageMs: number | null;
    p95Ms: number | null;
    lastSeen: string;
}

export interface ApiDiagnostics {
    from: string;
    to: string;
    status: 'AVAILABLE' | 'LOADING' | 'UNCONFIGURED' | 'UNAVAILABLE';
    errors: ApiDiagnosticRow[];
    slowest: ApiDiagnosticRow[];
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
        id: string;
        time: string;
        model: string;
        status: string;
        durationMs: number | null;
        inputTokens: number | null;
        outputTokens: number | null;
        errorCode: string | null;
    }[];
}

export interface ApplicationLogs { from: string; to: string; status: 'AVAILABLE' | 'LOADING' | 'UNCONFIGURED' | 'UNAVAILABLE'; entries: { time: string; message: string }[] }
