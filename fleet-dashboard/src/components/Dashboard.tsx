import React, { useState, useEffect } from "react";

import StatusBadge from "../components/Badge";
import Heading from "../components/Heading";
import Filters from "../components/Filters";
import { STATUS_MAP } from "../constants/status";
import VehicleTable from "./VehicleTable";
export const vehicles = [
  { id: "FL-001", driver: "John Smith", status: "delivered", speed: "0 mph", dest: "Residential Complex A", eta: "—", updated: "19/08/2025 14:40", coords: "37.7579, -122.4349", phone: "+12493369604", battery: 30, fuel: 44 },
  { id: "FL-002", driver: "Maria Garcia", status: "delivered", speed: "12 mph", dest: "Federal Downtown", eta: "5 min", updated: "19/08/2025 14:41", coords: "37.7945, -122.4033", phone: "+14153456789", battery: 72, fuel: 61 },
  { id: "FL-003", driver: "David Chen", status: "idle", speed: "0 mph", dest: "University Campus", eta: "—", updated: "19/08/2025 14:39", coords: "37.8624, -122.4695", phone: "+15105551234", battery: 88, fuel: 75 },
  { id: "FL-004", driver: "Sarah Johnson", status: "delivered", speed: "22 mph", dest: "Industrial District", eta: "8 min", updated: "19/08/2025 14:42", coords: "37.8053, -122.4893", phone: "+14153451122", battery: 45, fuel: 52 },
  { id: "FL-005", driver: "Michael Brown", status: "moving", speed: "35 mph", dest: "Warehouse District", eta: "15 min", updated: "19/08/2025 14:43", coords: "37.7968, -122.3305", phone: "+14153452233", battery: 60, fuel: 38 },

  { id: "FL-006", driver: "Lisa Wang", status: "idle", speed: "0 mph", dest: "Sports Stadium", eta: "—", updated: "19/08/2025 14:40", coords: "37.8045, -122.3098", phone: "+14153453344", battery: 91, fuel: 83 },
  { id: "FL-007", driver: "Robert Davis", status: "moving", speed: "28 mph", dest: "Warehouse District", eta: "10 min", updated: "19/08/2025 14:44", coords: "37.7988, -122.3477", phone: "+14153454455", battery: 55, fuel: 67 },
  { id: "FL-008", driver: "Jennifer Wilson", status: "delivered", speed: "0 mph", dest: "Harbor Point", eta: "—", updated: "19/08/2025 14:38", coords: "37.7289, -122.4229", phone: "+14153455566", battery: 33, fuel: 29 },
  { id: "FL-009", driver: "Carlos Rodriguez", status: "moving", speed: "40 mph", dest: "Airport Zone", eta: "20 min", updated: "19/08/2025 14:45", coords: "37.7447, -122.2316", phone: "+14153456677", battery: 78, fuel: 71 },
  { id: "FL-010", driver: "Emily Taylor", status: "delivered", speed: "0 mph", dest: "Distribution Center", eta: "—", updated: "19/08/2025 14:41", coords: "37.8451, -122.4461", phone: "+14153457788", battery: 64, fuel: 58 },

  { id: "FL-011", driver: "Kevin Lee", status: "idle", speed: "0 mph", dest: "Industrial District", eta: "—", updated: "19/08/2025 14:39", coords: "37.8775, -122.5314", phone: "+14153458899", battery: 42, fuel: 48 },
  { id: "FL-012", driver: "Amanda Martinez", status: "moving", speed: "18 mph", dest: "Retail Plaza", eta: "12 min", updated: "19/08/2025 14:42", coords: "37.8092, -122.4229", phone: "+14153459900", battery: 95, fuel: 90 },
  { id: "FL-013", driver: "Daniel Thompson", status: "idle", speed: "0 mph", dest: "Industrial District", eta: "—", updated: "19/08/2025 14:40", coords: "37.6405, -122.5176", phone: "+14153450011", battery: 20, fuel: 15 },
  { id: "FL-014", driver: "Olivia Martin", status: "moving", speed: "25 mph", dest: "Tech Park", eta: "9 min", updated: "19/08/2025 14:46", coords: "37.7749, -122.4194", phone: "+14153450112", battery: 68, fuel: 72 },
  { id: "FL-015", driver: "James Anderson", status: "delivered", speed: "0 mph", dest: "Logistics Hub", eta: "—", updated: "19/08/2025 14:37", coords: "37.7849, -122.4094", phone: "+14153450213", battery: 50, fuel: 60 },

  { id: "FL-016", driver: "Sophia Thomas", status: "moving", speed: "33 mph", dest: "Central Mall", eta: "6 min", updated: "19/08/2025 14:47", coords: "37.7929, -122.3969", phone: "+14153450314", battery: 73, fuel: 80 },
  { id: "FL-017", driver: "William Harris", status: "idle", speed: "0 mph", dest: "Suburban Area", eta: "—", updated: "19/08/2025 14:38", coords: "37.8123, -122.4789", phone: "+14153450415", battery: 39, fuel: 41 },
  { id: "FL-018", driver: "Isabella Clark", status: "moving", speed: "27 mph", dest: "Business District", eta: "11 min", updated: "19/08/2025 14:44", coords: "37.7999, -122.4148", phone: "+14153450516", battery: 82, fuel: 77 },
  { id: "FL-019", driver: "Ethan Lewis", status: "delivered", speed: "0 mph", dest: "Warehouse District", eta: "—", updated: "19/08/2025 14:36", coords: "37.7888, -122.4011", phone: "+14153450617", battery: 58, fuel: 62 },
  { id: "FL-020", driver: "Mia Walker", status: "moving", speed: "30 mph", dest: "Harbor Bay", eta: "7 min", updated: "19/08/2025 14:48", coords: "37.7601, -122.4477", phone: "+14153450718", battery: 90, fuel: 85 },

  { id: "FL-021", driver: "Benjamin Hall", status: "idle", speed: "0 mph", dest: "Industrial Zone", eta: "—", updated: "19/08/2025 14:39", coords: "37.7712, -122.4312", phone: "+14153450819", battery: 46, fuel: 49 },
  { id: "FL-022", driver: "Charlotte Allen", status: "moving", speed: "21 mph", dest: "City Center", eta: "13 min", updated: "19/08/2025 14:45", coords: "37.7812, -122.4112", phone: "+14153450920", battery: 77, fuel: 70 },
  { id: "FL-023", driver: "Henry Young", status: "delivered", speed: "0 mph", dest: "North Dock", eta: "—", updated: "19/08/2025 14:35", coords: "37.7912, -122.4212", phone: "+14153451021", battery: 53, fuel: 57 },
  { id: "FL-024", driver: "Amelia King", status: "moving", speed: "36 mph", dest: "Highway Route", eta: "18 min", updated: "19/08/2025 14:49", coords: "37.8012, -122.4312", phone: "+14153451122", battery: 84, fuel: 79 },
  { id: "FL-025", driver: "Jack Wright", status: "idle", speed: "0 mph", dest: "Depot Station", eta: "—", updated: "19/08/2025 14:40", coords: "37.8112, -122.4412", phone: "+14153451223", battery: 62, fuel: 66 },
];

const FILTER_BTNS = [
  { key: "all",       label: "All",       activeClass: "btn-primary"   },
  { key: "delivered", label: "Delivered", activeClass: "btn-success"   },
  { key: "enroute",   label: "En route",  activeClass: "btn-warning"   },
  { key: "idle",      label: "Idle",      activeClass: "btn-secondary" },
];

function LiveDot() {
  return (
    <span
      className="d-inline-block rounded-circle bg-success me-1"
      style={{ width: 7, height: 7, animation: "livepulse 1.5s infinite" }}
    />
  );
}


function ProgressBar({ value, colorClass }) {
  return (
    <>
      <div className="progress mt-1" style={{ height: 5 }}>
        <div
          className={`progress-bar ${colorClass}`}
          role="progressbar"
          style={{ width: `${value}%` }}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <small className="text-muted">{value}%</small>
    </>
  );
}

/* ── Modal (plain Bootstrap 5 markup, triggered via JS API) ─────── */

function VehicleModal({ vehicle, onClose }) {
  useEffect(() => {
    const el = document.getElementById("vehicleModal");
    if (!el) return;
    // bootstrap global loaded via bundle in index.js
    const modal = window.bootstrap?.Modal.getOrCreateInstance(el);
    if (vehicle) {
      modal?.show();
    } else {
      modal?.hide();
    }
  }, [vehicle]);

  // Keep last vehicle in DOM while modal animates out
  const v = vehicle;

  return (
    <div
      className="modal fade"
      id="vehicleModal"
      tabIndex={-1}
      aria-labelledby="vehicleModalLabel"
      aria-hidden="true"
      onHide={onClose}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header py-2 px-3">
            <h5 className="modal-title" id="vehicleModalLabel" style={{ fontSize: 15 }}>
              <span className="text-primary fw-semibold">{v?.id}</span>
              <span className="text-muted ms-2" style={{ fontSize: 12 }}>
                {v?.id} · {STATUS_MAP[v?.status]?.label}
              </span>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          <div className="modal-body px-3 py-3">
            <div className="row g-3">

              <div className="col-6">
                <div className="text-uppercase text-muted mb-1" style={{ fontSize: 10, letterSpacing: "0.05em" }}>Status</div>
                <div><StatusBadge status={v?.status} /></div>
              </div>
              <div className="col-6">
                <div className="text-uppercase text-muted mb-1" style={{ fontSize: 10, letterSpacing: "0.05em" }}>Current speed</div>
                <div className="fw-semibold" style={{ fontSize: 13 }}>{v?.speed}</div>
              </div>

              <div className="col-6">
                <div className="text-uppercase text-muted mb-1" style={{ fontSize: 10, letterSpacing: "0.05em" }}>Driver</div>
                <div className="fw-semibold" style={{ fontSize: 13 }}>{v?.driver}</div>
              </div>
              <div className="col-6">
                <div className="text-uppercase text-muted mb-1" style={{ fontSize: 10, letterSpacing: "0.05em" }}>Phone</div>
                <div className="fw-semibold text-primary" style={{ fontSize: 13 }}>{v?.phone}</div>
              </div>

              <div className="col-6">
                <div className="text-uppercase text-muted mb-1" style={{ fontSize: 10, letterSpacing: "0.05em" }}>Destination</div>
                <div className="fw-semibold" style={{ fontSize: 13 }}>{v?.dest}</div>
              </div>
              <div className="col-6">
                <div className="text-uppercase text-muted mb-1" style={{ fontSize: 10, letterSpacing: "0.05em" }}>GPS location</div>
                <div className="fw-semibold" style={{ fontSize: 12 }}>{v?.coords}</div>
              </div>

              <div className="col-6">
                <div className="text-uppercase text-muted mb-1" style={{ fontSize: 10, letterSpacing: "0.05em" }}>Battery level</div>
                <ProgressBar value={v?.battery ?? 0} colorClass={v?.battery < 30 ? "bg-danger" : "bg-primary"} />
              </div>
              <div className="col-6">
                <div className="text-uppercase text-muted mb-1" style={{ fontSize: 10, letterSpacing: "0.05em" }}>Fuel level</div>
                <ProgressBar value={v?.fuel ?? 0} colorClass={v?.fuel < 30 ? "bg-danger" : "bg-success"} />
              </div>

              <div className="col-12">
                <div className="text-uppercase text-muted mb-1" style={{ fontSize: 10, letterSpacing: "0.05em" }}>Last update</div>
                <div className="fw-semibold" style={{ fontSize: 13 }}>{v?.updated}</div>
              </div>

            </div>
          </div>

          <div className="modal-footer py-2 px-3 justify-content-start">
            <button type="button" className="btn btn-sm btn-outline-primary">📍 Track on map</button>
            <button type="button" className="btn btn-sm btn-outline-secondary ms-2">📞 Call driver</button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Dashboard ────────────────────────────────────────────────── */

export default function FleetDashboard() {
  const [filter,   setFilter]   = useState("all");
  const [selected, setSelected] = useState(null);

  const counts = {
    all:       vehicles.length,
    delivered: vehicles.filter(v => v.status === "delivered").length,
    enroute:   vehicles.filter(v => v.status === "enroute").length,
    idle:      vehicles.filter(v => v.status === "idle").length,
  };

  const filtered = filter === "all" ? vehicles : vehicles.filter(v => v.status === filter);

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
        filter={filter}
        setFilter={setFilter}
        counts={counts}
      />
    </div>

    {/* DIVIDER */}
    <div className="w-px self-stretch bg-gray-200" />

    {/* RIGHT TABLE AREA (ALLOWS SCROLL, NO SHRINK ISSUE) */}
    <div className="flex-1 min-w-0 mt-2">
      <VehicleTable
        title="Vehicles"
        count={filtered.length}
        data={filtered}
        onRowClick={(v) => setSelected(v)}
        columns={[
          {
            key: "id",
            label: "Vehicle",
            render: (v) => (
              <span className="text-primary fw-semibold">{v.id}</span>
            ),
            width: 100,
          },
          {
            key: "driver",
            label: "Driver",
            width: 140,
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
            width: 180,
          },
          {
            key: "eta",
            label: "ETA",
            width: 120,
          },
          {
            key: "updated",
            label: "Last update",
            width: 160,
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
      />
    </div>
  </div>
</div>

        {/* ── Table panel ── */}
       
      </div>

      <VehicleModal vehicle={selected} onClose={() => setSelected(null)} />
    </>
  );
}