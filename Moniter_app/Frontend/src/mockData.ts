import { KafkaEvent, MetricData, ServiceMetric, LogEntry } from './types';
import { format, subMinutes, subSeconds } from 'date-fns';

// Generate random timestamp within the last hour
const randomRecentTimestamp = () => {
  const now = new Date();
  const randomMinutesAgo = Math.floor(Math.random() * 60);
  const randomSecondsAgo = Math.floor(Math.random() * 60);
  const date = subMinutes(subSeconds(now, randomSecondsAgo), randomMinutesAgo);
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
};

// Generate random timestamp within the last 5 minutes for logs
const randomVeryRecentTimestamp = () => {
  const now = new Date();
  const randomMinutesAgo = Math.floor(Math.random() * 5);
  const randomSecondsAgo = Math.floor(Math.random() * 60);
  const date = subMinutes(subSeconds(now, randomSecondsAgo), randomMinutesAgo);
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
};

const services = ['auth', 'payment', 'search', 'user', 'notification', 'inventory', 'shipping'];
const errorMessages = [
  'Connection timeout',
  'Database query failed',
  'Authentication failed',
  'Invalid request parameters',
  'Service unavailable',
  'Rate limit exceeded',
  'Internal server error',
  'Dependency failure',
  'Resource not found',
  'Permission denied'
];
const severities = ['critical', 'high', 'medium', 'low'];
const statuses = ['created', 'deduped', 'rate-limited', 'failed'];
const logLevels = ['info', 'warn', 'error'];

export const generateMockEvents = (count: number): KafkaEvent[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `evt-${Date.now()}-${i}`,
    timestamp: randomRecentTimestamp(),
    serviceName: services[Math.floor(Math.random() * services.length)],
    errorMessage: errorMessages[Math.floor(Math.random() * errorMessages.length)],
    severity: severities[Math.floor(Math.random() * severities.length)] as 'critical' | 'high' | 'medium' | 'low',
    status: statuses[Math.floor(Math.random() * statuses.length)] as 'created' | 'deduped' | 'rate-limited' | 'failed'
  }));
};

export const generateMetrics = (): MetricData => {
  const totalEvents = Math.floor(Math.random() * 1000) + 500;
  const incidentsSent = Math.floor(totalEvents * 0.7);
  const duplicatesSkipped = Math.floor(totalEvents * 0.15);
  const rateLimitSkips = Math.floor(totalEvents * 0.1);
  const apiFailures = Math.floor(totalEvents * 0.05);
  
  return {
    totalEvents,
    incidentsSent,
    duplicatesSkipped,
    rateLimitSkips,
    apiFailures
  };
};

export const generateServiceMetrics = (): ServiceMetric[] => {
  return services.map(name => ({
    name,
    count: Math.floor(Math.random() * 30)
  }));
};

export const generateLogs = (count: number): LogEntry[] => {
  const logMessages = [
    'Processing Kafka message',
    'Sending incident to ServiceNow',
    'Duplicate event detected',
    'Rate limit triggered for service',
    'ServiceNow API call failed',
    'Event processing completed',
    'Consumer group rebalancing',
    'Connection to Kafka established',
    'Received batch of messages',
    'Committing offsets'
  ];

  return Array.from({ length: count }, () => ({
    timestamp: randomVeryRecentTimestamp(),
    level: logLevels[Math.floor(Math.random() * logLevels.length)] as 'info' | 'warn' | 'error',
    message: logMessages[Math.floor(Math.random() * logMessages.length)]
  }));
};