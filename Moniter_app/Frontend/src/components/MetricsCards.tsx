import React from "react";
import { AlertCircle, Check, X, Clock, Zap } from "lucide-react";
import { MetricData } from "../types";

interface MetricsCardsProps {
  metrics: MetricData | null; // allow null or undefined
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  // Add fallback in case metrics is null or fields are missing
  const safeMetrics = {
    totalEvents: metrics?.total_events ?? 0,
    incidentsSent: metrics?.incidents_sent ?? 0,
    duplicatesSkipped: metrics?.duplicates_skipped ?? 0,
    rateLimitSkips: metrics?.rate_limit_skips ?? 0,
    apiFailures: metrics?.api_failures ?? 0,
  };

  const cards = [
    {
      title: "Total Events",
      value: safeMetrics.totalEvents,
      icon: <Zap size={24} className="text-blue-500" />,
      color: "bg-blue-50 border-blue-200",
    },
    {
      title: "Incidents Sent",
      value: safeMetrics.incidentsSent,
      icon: <Check size={24} className="text-green-500" />,
      color: "bg-green-50 border-green-200",
    },
    {
      title: "Duplicates Skipped",
      value: safeMetrics.duplicatesSkipped,
      icon: <Clock size={24} className="text-amber-500" />,
      color: "bg-amber-50 border-amber-200",
    },
    {
      title: "Rate Limit Skips",
      value: safeMetrics.rateLimitSkips,
      icon: <AlertCircle size={24} className="text-orange-500" />,
      color: "bg-orange-50 border-orange-200",
    },
    {
      title: "API Failures",
      value: safeMetrics.apiFailures,
      icon: <X size={24} className="text-red-500" />,
      color: "bg-red-50 border-red-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.color} border rounded-lg p-4 shadow-sm flex flex-col items-center justify-center`}
        >
          <div className="flex items-center justify-center mb-2">
            {card.icon}
          </div>
          <h3 className="text-gray-700 font-medium text-sm">{card.title}</h3>
          <p className="text-2xl font-bold">{card.value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;
