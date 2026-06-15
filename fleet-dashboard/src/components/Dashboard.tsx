import { useState, useEffect, useRef } from "react";

import { WEB_SOCKET_URL, DEFAULT_ROW_LIMIT } from "../constants/config";
import StatusBadge from "../components/Badge";
import Heading from "../components/Heading";
import Filters from "../components/Filters";
import VehicleTable from "./VehicleTable";
import VehicleModal from "../components/VehicleModal";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import getStatistics from "../apis/getStatistics";
import getVehicleList from "../apis/getVehicleList";
import getVehicleDetail from "../apis/getVehicleDetail";

/* ─────────────────────────────────────────────────────────────
   Fleet Dashboard
   - Displays vehicle list
   - Shows fleet statistics
   - Handles real-time WebSocket updates
   - Fetches vehicle details on row click
───────────────────────────────────────────────────────────── */

export default function FleetDashboard() {
  const queryClient = useQueryClient();

  /* ── WebSocket reference (keeps instance across renders) ── */
  const wsRef = useRef<WebSocket | null>(null);

  /* ── Selected vehicle state (for modal) ── */
  const [selectedVehicleId, setVehicleId] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  /* ── WebSocket last update timestamp ── */
  const [lastWsTimestamp, setLastWsTimestamp] = useState<string | null>(null);

  /* ── Table filter state (status + pagination limit) ── */
  const [tableFilter, setTableFilter] = useState({
    limit: DEFAULT_ROW_LIMIT,
    status: "total",
  });

  /* ─────────────────────────────────────────────────────────────
     Fetch: Fleet Statistics
  ───────────────────────────────────────────────────────────── */
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["vehicles", "statistics"],
    queryFn: getStatistics,
  });

  /* ─────────────────────────────────────────────────────────────
     Fetch: Vehicle List (depends on filter)
  ───────────────────────────────────────────────────────────── */
  const vehicleQueryKey = [
    "vehicles",
    tableFilter?.status,
    tableFilter?.limit,
  ];

  const {
    data: vehicles = [],
    isLoading: isVehiclesLoading,
    isSuccess: isVehiclesSuccess,
    isFetching: isVehiclesFetching,
  } = useQuery({
    queryKey: vehicleQueryKey,
    queryFn: () => getVehicleList(tableFilter),
  });
  /* ─────────────────────────────────────────────────────────────
     WebSocket Integration
     - Handles real-time vehicle updates
     - Updates React Query cache directly
  ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!isVehiclesSuccess) return;

    let ws: WebSocket | null = null;

    const connect = () => {
      ws = new WebSocket(WEB_SOCKET_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event?.data);

        if (message?.timestamp) {
          setLastWsTimestamp(message?.timestamp);
        }

        const type = message?.type?.toLowerCase();

       if (type === "vehicle_update") {
          const updates: any[] = message?.data ?? [];

          queryClient.setQueryData(vehicleQueryKey, (old: any[] = []) =>
            old.map((v) => {
              const updated = updates.find((u) => u?.vehicleNumber === v.vehicleNumber);
              return updated ? { ...v, ...updated } : v;
            })
          );

          if (tableFilter?.limit < 25) {
            const currentData = (queryClient.getQueryData(vehicleQueryKey) as any[]) || [];
            const allExist = updates.every((u) =>
              currentData.some((v) => v?.vehicleNumber === u?.vehicleNumber)
            );
            if (!allExist) queryClient.invalidateQueries({ queryKey: vehicleQueryKey });
          }
        }

        if (type === "vehicle_create") {
  const newVehicle = message?.data;

  queryClient.setQueryData(vehicleQueryKey, (old: any[] = []) =>
    [...old, newVehicle]
  );

  if (tableFilter?.limit < 25) {
    queryClient.invalidateQueries({ queryKey: vehicleQueryKey });
  }
        }

        if (type === "vehicle_delete") {
          const deleted = message?.data;

          queryClient.setQueryData(vehicleQueryKey, (old: any[] = []) =>
            old.filter((v) => v?.vehicleNumber !== deleted?.vehicleNumber)
          );

          if (tableFilter?.limit < 25) {
            queryClient.invalidateQueries({ queryKey: vehicleQueryKey });
          }
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected, reconnecting in 3s...");
        setTimeout(connect, 3000);
      };
    };

    connect(); // connect once on mount

    return () => {
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
    };
  }, [isVehiclesSuccess]);

  /* ─────────────────────────────────────────────────────────────
     Transform API Data → Table Format
  ───────────────────────────────────────────────────────────── */
  const tableData = vehicles?.map((v: any) => ({
    id: v?.vehicleNumber || '',
    driver: v?.driverName || '',
    status: v?.status || '',
    speed: `${v?.speed || 0} mph`,
    dest: v?.destination || '',

    eta: v?.estimatedArrival
      ? new Date(v?.estimatedArrival)?.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—",

    updated: new Date(v?.lastUpdated)?.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),

    coords: `${v?.currentLocation?.lat?.toFixed(4)}, ${v?.currentLocation?.lng?.toFixed(4)}`,

    raw: v,
  }));

  /* ─────────────────────────────────────────────────────────────
     Fetch Vehicle Detail (on row click)
  ───────────────────────────────────────────────────────────── */
  const { mutate: fetchVehicle, isPending: isFetchingVehicle } =
    useMutation({
      mutationFn: async (id: string) => {
        if (!id) throw new Error("Vehicle id is required");
        return getVehicleDetail({ id });
      },

      onMutate: (id) => {
        setVehicleId(id);
        setSelectedVehicle(null);
      },

      onSuccess: (response) => {
        setSelectedVehicle(response);
      },

      onError: (error) => {
        console.error("Error fetching vehicle detail:", error);
      },
    });

  /* ─────────────────────────────────────────────────────────────
     UI Render
  ───────────────────────────────────────────────────────────── */
  return (
    <>
      <div className="d-flex gap-3 p-2 mt-2 lg:p-4 bg-white min-vh-100">
        <div className="w-full">
          <Heading />

          <div className="flex flex-col lg:flex-row gap-4 w-full">
            {/* ── Filters Panel ── */}
            <div className="w-full lg:w-[35%] mt-4 shrink-0">
              <Filters
                stats={
                  stats ?? {
                    total: 0,
                    idle: 0,
                    en_route: 0,
                    delivered: 0,
                    average_speed: 0,
                    timestamp: "",
                  }
                }
                filter={tableFilter?.status}
                setFilter={(status) =>
                  setTableFilter((prev) => ({
                    ...prev,
                    status,
                  }))
                }
                isLoading={isStatsLoading}
                lastWsTimestamp={lastWsTimestamp}
              />
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px self-stretch bg-gray-200" />

            {/* ── Table Panel ── */}
            <div className="flex-1 min-w-0 mt-2">
              <VehicleTable
                title="Vehicles"
                data={tableData}
                count={tableData?.length || 0}
                isLoading={isVehiclesLoading || isVehiclesFetching}
                rowsPerPage={tableFilter?.limit}
                onRowsPerPageChange={(limit) =>
                  setTableFilter((prev) => ({
                    ...prev,
                    limit,
                  }))
                }
                onRowClick={(v) => {
                  fetchVehicle(v?.raw?.id);
                  setVehicleId(v?.raw?.id);
                }}
                columns={[
                  {
                    key: "id",
                    label: "Vehicle",
                    width: 120,
                    render: (v) => (
                      <span className="text-primary fw-semibold underline ml-1">
                        {v?.id}
                      </span>
                    ),
                  },
                  {
                    key: "driver",
                    label: "Driver",
                    width: 160,
                  },
                  {
                    key: "status",
                    label: "Status",
                    width: 120,
                    render: (v) => (
                      <StatusBadge status={v.status} />
                    ),
                  },
                  {
                    key: "speed",
                    label: "Speed",
                    width: 100,
                     render: (v) => (
                       <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-bold bg-gray-100 text-gray-800`}
                      >
                        {v?.speed}
                      </span>
                    ),
                  },
                  {
                    key: "dest",
                    label: "Destination",
                    width: 200,
                  },
                  {
                    key: "eta",
                    label: "ETA",
                    width: 120,
                  },
                  {
                    key: "updated",
                    label: "Last update",
                    width: 180,
                    render: (v) => (
                      <span
                        className="text-muted text-[12px]"
                      >
                        {v?.updated}
                      </span>
                    ),
                  },
                  {
                    key: "coords",
                    label: "Location",
                    width: 180,
                    render: (v) => (
                      <span className="text-[12px]">
                        {v?.coords}
                      </span>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Vehicle Detail Modal ── */}
      {selectedVehicleId && (
        <VehicleModal
          vehicle={selectedVehicle}
          isLoading={isFetchingVehicle}
          onClose={() => {
            setVehicleId(null);
            setSelectedVehicle(null);
          }}
        />
      )}
    </>
  );
}