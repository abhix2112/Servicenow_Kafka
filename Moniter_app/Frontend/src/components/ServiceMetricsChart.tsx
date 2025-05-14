import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ServiceMetric } from "../types";

interface ServiceMetricsChartProps {
  serviceMetrics: ServiceMetric[];
}

const ServiceMetricsChart: React.FC<ServiceMetricsChartProps> = ({
  serviceMetrics,
}) => {
  // Sort services by count in descending order
  const sortedMetrics = [...serviceMetrics].sort((a, b) => b.count - a.count);

  const getBarColor = (count: number) => {
    if (count > 20) return "#ef4444"; // red-500
    if (count > 10) return "#f97316"; // orange-500
    if (count > 5) return "#eab308"; // yellow-500
    return "#22c55e"; // green-500
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Events Per Service
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedMetrics}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="service" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffff",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value) => [`${value} events`, "Count"]}
              labelFormatter={(service) => `Service: ${service}`}
            />
            <Bar
              dataKey="count"
              name="Events"
              radius={[4, 4, 0, 0]}
              fill={(entry) => getBarColor(entry.count)}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ServiceMetricsChart;
