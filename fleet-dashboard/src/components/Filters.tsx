import {
  Truck,
  Route,
  Clock3,
  Filter,
  BarChart3,
  CheckCircle2,
  Wifi,
} from "lucide-react";

import { FILTER_BTNS } from "../constants/filter";
import StatCard from "./StatCard";
import UpdateStatus from "./UpdateStatus";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/* ─────────────────────────────────────────────
   Fleet Statistics Type
   Represents backend analytics for vehicles
───────────────────────────────────────────── */
interface FleetStats {
  total: number;
  idle: number;
  en_route: number;
  delivered: number;
  average_speed: number;
  timestamp: string;
}

/* ─────────────────────────────────────────────
   Component Props
───────────────────────────────────────────── */
interface FiltersProps {
  filter: string;
  setFilter: (filter: string) => void;
  stats?: FleetStats;
  isLoading: boolean;
  lastWsTimestamp: string | null;
}

/* ─────────────────────────────────────────────
   Filters Panel Component
   - Status filtering
   - Fleet summary stats
   - Live WebSocket indicator
───────────────────────────────────────────── */
const Filters = ({
  filter,
  setFilter,
  stats,
  isLoading,
  lastWsTimestamp,
}: FiltersProps) => {
  /* ── Safe fallback to avoid undefined crashes ── */
  const safeStats: FleetStats = stats ?? {
    total: 0,
    idle: 0,
    en_route: 0,
    delivered: 0,
    average_speed: 0,
    timestamp: "",
  };

  return (
    <div className="space-y-4">
      {/* ── Live connection status ── */}
      <div className="flex items-center justify-center gap-1.5 rounded-md border-2 border-gray-200 p-1.5 text-[14px] text-green-600">
        <Wifi className="h-4 w-4 text-green-600" />
        <span>Live Updates Active</span>
      </div>

      {/* ─────────────────────────────────────
          STATUS FILTER SECTION
      ───────────────────────────────────── */}
      <div>
        <p className="mb-2 flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest text-gray-800">
          <Filter className="h-3.5 w-3.5" />
          Filter by Status
        </p>

        <div className="grid grid-cols-2 gap-3">
          {FILTER_BTNS.map((btn) => {
            const isActive = filter === btn.key;

            // Count from stats dynamically
            const count = isLoading
              ? 0
              : (stats as any)?.[btn.key] ?? 0;

            /* ── Loading skeleton state ── */
            if (isLoading) {
              return (
                <div
                  key={btn.key}
                  className="rounded-md border-2 border-gray-200 p-2"
                >
                  <Skeleton height={14} width="80%" />
                </div>
              );
            }

            /* ── Filter button ── */
            return (
              <button
                key={btn.key}
                type="button"
                onClick={() => setFilter(btn.key)}
                className={`flex items-center gap-1.5 !rounded-md border-2 px-1.5 py-1.5 !text-[14px] leading-tight transition-all !text-bold ${
                  isActive
                    ? "border-blue-400 text-blue-500"
                    : "border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-500"
                }`}
              >
                {/* status indicator dot */}
                <span className={`h-1.5 w-1.5 rounded-full ${btn.dotClass}`} />

                {/* label */}
                <span className="max-w-[80px] truncate">
                  {btn.label}
                </span>

                {/* count */}
                <span
                  className={
                    isActive ? "text-blue-500" : "text-gray-500"
                  }
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────
          DIVIDER
      ───────────────────────────────────── */}
      <div className="border-t border-gray-200" />

      {/* ─────────────────────────────────────
          FLEET STATISTICS SECTION
      ───────────────────────────────────── */}
      <div>
        <p className="mb-2 flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest text-gray-800">
          <BarChart3 className="h-3.5 w-3.5" />
          Fleet Statistics
        </p>

        <div className="grid grid-cols-2 gap-2">
          <StatCard
            isLoading={isLoading}
            value={safeStats.total}
            label="Total Vehicles"
            icon={<Truck size={12} />}
          />

          <StatCard
            isLoading={isLoading}
            value={safeStats.en_route}
            label="En Route"
            icon={<Route size={12} />}
          />

          <StatCard
            isLoading={isLoading}
            value={safeStats.idle}
            label="Idle"
            icon={<Clock3 size={12} />}
          />

          <StatCard
            isLoading={isLoading}
            value={safeStats.delivered}
            label="Delivered"
            icon={<CheckCircle2 size={12} />}
          />
        </div>
      </div>

      {/* ── Last update timestamp (WebSocket) ── */}
      <UpdateStatus
        lastUpdated={lastWsTimestamp ?? new Date().toISOString()}
      />
    </div>
  );
};

export default Filters;