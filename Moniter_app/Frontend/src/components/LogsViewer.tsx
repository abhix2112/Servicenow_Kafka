import React from "react";
import { LogEntry } from "../types";
import { Info, AlertCircle, AlertTriangle } from "lucide-react";

interface LogsViewerProps {
  logs: LogEntry[];
}

const LogsViewer: React.FC<LogsViewerProps> = ({ logs }) => {
  const getLogIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertTriangle size={16} className="text-red-500" />;
      case "warn":
        return <AlertCircle size={16} className="text-amber-500" />;
      case "info":
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };

  const getLogClass = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-50 border-red-200";
      case "warn":
        return "bg-amber-50 border-amber-200";
      case "info":
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Live Logs</h2>
      </div>
      <div className="p-4 max-h-80 overflow-y-auto">
        {logs.map((log, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded border ${getLogClass(
              log.level
            )} flex items-start`}
          >
            <div className="mr-2 mt-0.5">{getLogIcon(log.level)}</div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-500">
                  {formatTimestamp(log.timestamp)}
                </span>
                <span
                  className={`text-xs font-medium px-1.5 py-0.5 rounded-full capitalize
                  ${
                    log.level === "error"
                      ? "bg-red-100 text-red-800"
                      : log.level === "warn"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {log.level}
                </span>
              </div>
              <p className="text-sm text-gray-700">{log.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogsViewer;
