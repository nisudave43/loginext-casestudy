import {
  Truck,
  Route,
  Clock3,
  Filter,
  BarChart3,
  CheckCircle2,
  Wifi,
} from "lucide-react";
import { FILTER_BTNS, type FilterKey } from "../constants/filter";
import StatCard from "./StatCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/* ─────────────────────────────────────────────
   Fleet Stats Type
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
   Props
───────────────────────────────────────────── */
interface FiltersProps {
  filter: FilterKey;
  setFilter: (filter: FilterKey) => void;
  stats?: FleetStats;
  isLoading: boolean;
}


/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
const Filters = ({ filter, setFilter, stats, isLoading }: FiltersProps) => {
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
      {/* Live status */}
      <div className="flex items-center justify-center rounded-md border-2 border-gray-200 p-1.5 gap-1.5 text-sm text-green-600">
        <Wifi className="h-4 w-4 text-green-600" />
        <span className="font-sm">Live Updates Active</span>
      </div>

      {/* Filters */}
      <div>
        <p className="mb-2 flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest text-gray-800">
          <Filter className="h-3.5 w-3.5" />
          Filter by Status
        </p>

        <div className="grid grid-cols-2 gap-3">
          {FILTER_BTNS.map((btn) => {
            const isActive = filter === btn.key;

            const count = isLoading ? 0 : (stats as any)?.[btn.key] ?? 0;

            return isLoading ? (
              <div
                key={btn.key}
                className="rounded-md border-2 border-gray-200 p-2"
              >
                <Skeleton height={14} width="80%" />
              </div>
            ) : (
              <button
                key={btn.key}
                type="button"
                onClick={() => setFilter(btn.key)}
                className={`flex items-center gap-1.5 rounded-md border-2 p-2 !text-sm leading-tight transition-all ${
                  isActive
                    ? "border-blue-400 text-blue-500"
                    : "border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-500"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${btn.dotClass}`} />

                <span className="truncate max-w-[80px]">{btn.label}</span>

                <span className={isActive ? "text-blue-500" : "text-gray-500"}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Fleet Statistics */}
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
    </div>
  );
};

export default Filters;