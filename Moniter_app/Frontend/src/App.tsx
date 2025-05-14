import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header";
import MetricsCards from "./components/MetricsCards";
import EventsTable from "./components/EventsTable";
import ServiceMetricsChart from "./components/ServiceMetricsChart";
import LogsViewer from "./components/LogsViewer";
import { KafkaEvent, MetricData, ServiceMetric, LogEntry } from "./types";

const API_BASE_URL = "http://localhost:5000/api";

function App() {
  const [events, setEvents] = useState<{
    total: number;
    page: number;
    limit: number;
    data: KafkaEvent[];
  } | null>(null);

  const [metrics, setMetrics] = useState<MetricData>({
    totalEvents: 0,
    incidentsSent: 0,
    duplicatesSkipped: 0,
    rateLimitSkips: 0,
    apiFailures: 0,
  });

  const [eventsTableData, setEventsTableData] = useState<{
    total: number;
    page: number;
    limit: number;
    data: KafkaEvent[];
  } | null>(null);

  const [serviceMetrics, setServiceMetrics] = useState<ServiceMetric[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [eventsRes, statsRes, serviceEventsRes, logsRes] =
        await Promise.all([
          axios.get(`${API_BASE_URL}/events`),
          axios.get(`${API_BASE_URL}/stats`),
          axios.get(`${API_BASE_URL}/service-events`),
          axios.get(`${API_BASE_URL}/logs`),
        ]);
      console.log("logs:", logsRes.data);
      setEvents(eventsRes.data);
      setMetrics(statsRes.data);
      setServiceMetrics(serviceEventsRes.data);
      setLogs(logsRes.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError("Failed to fetch data from the server");
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onRefresh={fetchData} lastUpdated={lastUpdated} />

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-4 mt-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <main className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <MetricsCards metrics={metrics} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ServiceMetricsChart serviceMetrics={serviceMetrics} />
          <LogsViewer logs={logs} />
        </div>

        <div className="mb-6">
          <EventsTable events={events} />
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>
            Kafka Pipeline Monitor &copy; {new Date().getFullYear()} - Real-time
            Observability Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
