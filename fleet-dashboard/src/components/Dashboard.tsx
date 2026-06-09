import { useState, useEffect, useRef } from "react";

import StatusBadge from "../components/Badge";
import Heading from "../components/Heading";
import Filters from "../components/Filters";
import VehicleTable from "./VehicleTable";
import VehicleModal from "../components/VehicleModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import getStatistics from "../apis/getStatistics";
import getVehicleList from "../apis/getVehicleList";
import getVehicleDetail from "../apis/getVehicleDetail";



/* ── Dashboard ────────────────────────────────────────────────── */

export default function FleetDashboard() {

  const queryClient = useQueryClient();
const wsRef = useRef<WebSocket | null>(null);

  const [selectedVehicleId, setVehicleId] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [lastWsTimestamp, setLastWsTimestamp] = useState<string | null>(null);
  const [tableFilter, setTableFilter]= useState({
    "limit": 25,
    "status": "total"
  });
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["vehicles", "statistics"],
    queryFn: getStatistics,
  });

  const { data: vehicles = [], isLoading: isVehiclesLoading, isSuccess: isVehiclesSuccess, isFetching: isVehiclesFetching,   } = useQuery({
  queryKey: ["vehicles", tableFilter.status, tableFilter.limit],
   queryFn: () => getVehicleList(tableFilter),
});

const vehicleQueryKey = ["vehicles", tableFilter.status, tableFilter.limit];

useEffect(() => {

  if(!isVehiclesSuccess) return;
  let ws: WebSocket | null = null;
  let intervalId: NodeJS.Timeout;

  const connect = () => {
    ws = new WebSocket("wss://case-study-26cf.onrender.com/api/vehicles");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

   ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log("WS MESSAGE:", message);

   if (message.timestamp) {
    setLastWsTimestamp(message.timestamp);
  }

  if (message.type === "VEHICLE_UPDATE") {
    const updated = message.payload;

    if (tableFilter.limit >= 25) {
      // all vehicles in cache → always update in-place
      queryClient.setQueryData(vehicleQueryKey, (old: any[] = []) =>
        old.map((v) =>
          v.vehicleNumber === updated.vehicleNumber ? { ...v, ...updated } : v
        )
      );
    } else {
      // partial page → check if vehicle is visible
      const currentData = queryClient.getQueryData(vehicleQueryKey) as any[] || [];
      const existsInView = currentData.some(
        (v) => v.vehicleNumber === updated.vehicleNumber
      );

      if (existsInView) {
        queryClient.setQueryData(vehicleQueryKey, (old: any[] = []) =>
          old.map((v) =>
            v.vehicleNumber === updated.vehicleNumber ? { ...v, ...updated } : v
          )
        );
      } else {
        queryClient.invalidateQueries({ queryKey: vehicleQueryKey });
      }
    }
  }

  if (message.type === "VEHICLE_CREATE") {
    const newVehicle = message.payload;
    queryClient.setQueryData(vehicleQueryKey, (old: any[] = []) => [
      newVehicle,
      ...old,
    ]);
  }

  if (message.type === "VEHICLE_DELETE") {
    const id = message.payload.vehicleNumber;
    queryClient.setQueryData(vehicleQueryKey, (old: any[] = []) =>
      old.filter((v) => v.vehicleNumber !== id)
    );
  }
};

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };
  };

  // initial connect
  connect();

  // reconnect every 10 seconds
  intervalId = setInterval(() => {
    console.log("Reconnecting WebSocket...");

    if (ws) {
      ws.close();
    }

    connect();
  }, 10000);

  return () => {
    if (ws) ws.close();
    clearInterval(intervalId);
  };
}, [isVehiclesSuccess]);

console.log('vehicles',isVehiclesLoading, vehicles)

const tableData = vehicles?.map((v: any) => ({
  id: v.vehicleNumber,
  driver: v.driverName,
  status: v.status,
  speed: `${v.speed} km/h`,
  dest: v.destination,
  eta: v.estimatedArrival
    ? new Date(v.estimatedArrival).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—",
  updated: new Date(v.lastUpdated).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  coords: `${v.currentLocation?.lat?.toFixed(4)}, ${v.currentLocation?.lng?.toFixed(4)}`,
  raw: v,
}));
  
const { mutate: fetchVehicle, isPending: isFetchingVehicle } = useMutation({
  mutationFn: async (id: string) => {
    if (!id) {
      throw new Error("Vehicle id is required");
    }

    return getVehicleDetail({ id });
  },

  onMutate: (id) => {
    setVehicleId?.(id);
    setSelectedVehicle?.(null); // optional: reset old data while loading
  },

  onSuccess: (response) => {
    console.log("Vehicle detail:", response);
    setSelectedVehicle?.(response); // optional state update
  },

  onError: (error) => {
    console.error("Error fetching vehicle detail:", error);
  },
});

  return (
    <>
      <style>{`@keyframes livepulse { 0%,100%{opacity:1} 50%{opacity:.35} }`}</style>

      <div className="d-flex gap-3 p-3 bg-white min-vh-100">

        {/* ── Sidebar ── */}
        <div className="w-full">
  <Heading />

  <div className="flex gap-4 w-full">
    
    {/* LEFT FILTER PANEL (FIXED WIDTH, NO SHRINK) */}
    <div className="w-[35%] mt-4 shrink-0">
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
  filter={tableFilter.status}
  setFilter={(status) => {
    setTableFilter((prev) => ({
      ...prev,
      status,
    }))
  }}
  isLoading={isStatsLoading}
  lastWsTimestamp={lastWsTimestamp}
/>
    </div>

    {/* DIVIDER */}
    <div className="w-px self-stretch bg-gray-200" />

    {/* RIGHT TABLE AREA (ALLOWS SCROLL, NO SHRINK ISSUE) */}

    <div className="flex-1 min-w-0 mt-2">
  <VehicleTable
    title="Vehicles"
    data={tableData}
    count={tableData?.length || 0}
    onRowClick={(v) => {
      fetchVehicle(v?.raw?.id);
      setVehicleId(v?.raw?.id)
    }}
    columns={[
      {
        key: "id",
        label: "Vehicle",
        width: 120,
        render: (v) => (
          <span className="text-primary fw-semibold">{v.id}</span>
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
        render: (v) => <StatusBadge status={v.status} />,
      },
      {
        key: "speed",
        label: "Speed",
        width: 100,
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
          <span className="text-muted" style={{ fontSize: 12 }}>
            {v.updated}
          </span>
        ),
      },
      {
        key: "coords",
        label: "Location",
        width: 180,
        render: (v) => (
          <span style={{ fontSize: 12 }}>{v.coords}</span>
        ),
      },
    ]}
    isLoading={isVehiclesLoading || isVehiclesFetching}
    rowsPerPage={tableFilter.limit}
  onRowsPerPageChange={(limit) =>
    setTableFilter((prev) => ({
      ...prev,
      limit,
    }))
  }
  />
</div>
  </div>
</div>

        {/* ── Table panel ── */}
       
      </div>

    {
        selectedVehicleId &&
        <VehicleModal vehicle={selectedVehicle} onClose={() => {
          setVehicleId(null);
          setSelectedVehicle(null);
        }} 
        isLoading={isFetchingVehicle}
        />
    }
      
    </>
  );
}