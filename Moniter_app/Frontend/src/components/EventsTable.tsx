import React, { useState } from "react";

// Define the KafkaEvent interface to match your API response
export interface KafkaEvent {
  id: number;
  service: string;
  source: string;
  status: string;
  created_at: string;
}

// Define the response structure
interface EventsResponse {
  total: number;
  page: number;
  limit: number;
  data: KafkaEvent[];
}

interface EventsTableProps {
  events: EventsResponse | null;
}

const EventsTable: React.FC<EventsTableProps> = ({
  events: eventsResponse,
}) => {
  // Ensure safe access to data array
  const events: KafkaEvent[] = eventsResponse?.data || [];

  // State for filtering and sorting
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [serviceFilter, setServiceFilter] = useState<string>("");
  const [sortField, setSortField] = useState<keyof KafkaEvent | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Get unique statuses and services for filter dropdowns
  const uniqueStatuses = Array.from(
    new Set(events.map((event) => event.status))
  );
  const uniqueServices = Array.from(
    new Set(events.map((event) => event.service))
  );

  // Filter events based on selected filters
  const filteredEvents = events.filter((event) => {
    return (
      (statusFilter === "" || event.status === statusFilter) &&
      (serviceFilter === "" || event.service === serviceFilter)
    );
  });

  // Sort events based on selected field and direction
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortField === "created_at") {
      return sortDirection === "asc"
        ? new Date(aValue).getTime() - new Date(bValue).getTime()
        : new Date(bValue).getTime() - new Date(aValue).getTime();
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Handle sorting click
  const handleSort = (field: keyof KafkaEvent) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Show sort indicator
  const getSortIndicator = (field: keyof KafkaEvent) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Events Table</h2>

      {eventsResponse && (
        <div className="mb-4 text-sm">
          <p>
            Total events: {eventsResponse.total} | Page: {eventsResponse.page} |
            Limit: {eventsResponse.limit}
          </p>
        </div>
      )}

      <div className="mb-4 flex gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Status Filter:
          </label>
          <select
            className="border rounded p-1"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Service Filter:
          </label>
          <select
            className="border rounded p-1"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
          >
            <option value="">All Services</option>
            {uniqueServices.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
      </div>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th
                    className="border p-2 cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    ID{getSortIndicator("id")}
                  </th>
                  <th
                    className="border p-2 cursor-pointer"
                    onClick={() => handleSort("service")}
                  >
                    Service{getSortIndicator("service")}
                  </th>
                  <th
                    className="border p-2 cursor-pointer"
                    onClick={() => handleSort("source")}
                  >
                    Source{getSortIndicator("source")}
                  </th>
                  <th
                    className="border p-2 cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    Status{getSortIndicator("status")}
                  </th>
                  <th
                    className="border p-2 cursor-pointer"
                    onClick={() => handleSort("created_at")}
                  >
                    Created At{getSortIndicator("created_at")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="border p-2">{event.id}</td>
                    <td className="border p-2">{event.service}</td>
                    <td className="border p-2">{event.source}</td>
                    <td className="border p-2">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          event.status === "created"
                            ? "bg-green-100"
                            : event.status === "failed"
                            ? "bg-red-100"
                            : event.status === "deduped"
                            ? "bg-blue-100"
                            : event.status === "rate_limited"
                            ? "bg-yellow-100"
                            : ""
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="border p-2">
                      {formatDate(event.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-sm">
            Showing {sortedEvents.length} of {events.length} events
          </p>
        </>
      )}
    </div>
  );
};

export default EventsTable;
