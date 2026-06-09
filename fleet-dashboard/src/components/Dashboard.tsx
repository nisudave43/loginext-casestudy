import React, { useState } from "react";

import StatusBadge from "../components/Badge";
import Heading from "../components/Heading";
import Filters from "../components/Filters";
import { STATUS_MAP } from "../constants/status";
import VehicleTable from "./VehicleTable";
import VehicleModal from "../components/VehicleModal";
import { useQuery, useMutation } from "@tanstack/react-query";
import getStatistics from "../apis/getStatistics";
import getVehicleList from "../apis/getVehicleList";
import getVehicleDetail from "../apis/getVehicleDetail";



/* ── Dashboard ────────────────────────────────────────────────── */

export default function FleetDashboard() {
  const [selectedVehicleId, setVehicleId] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [tableFilter, setTableFilter]= useState({
    "limit": 10,
    "status": "total"
  });
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ["vehicles", "statistics"],
    queryFn: getStatistics,
  });

  const { data: vehicles = [], isLoading: isVehiclesLoading } = useQuery({
  queryKey: ["vehicles", tableFilter], // 👈 KEY CHANGE
   queryFn: () => getVehicleList(tableFilter),
});


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
    isLoading={isVehiclesLoading}
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