export interface KafkaEvent {
  id: string;
  timestamp: string;
  serviceName: string;
  errorMessage: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "created" | "deduped" | "rate-limited" | "failed";
}

export interface MetricData {
  totalEvents: number;
  incidentsSent: number;
  duplicatesSkipped: number;
  rateLimitSkips: number;
  apiFailures: number;
}

export interface ServiceMetric {
  name: string;
  count: number;
}

export interface LogEntry {
  timestamp: string;
  level: "info" | "warn" | "error";
  message: string;
}

export interface Eventstable {
  eventsResponse: {
    total: number;
    page: number;
    limit: number;
    data: Event[];
  } | null;
}
