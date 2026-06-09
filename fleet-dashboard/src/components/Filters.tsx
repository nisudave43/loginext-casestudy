import { Truck, Route, Wrench, Clock3, Filter, BarChart3, Clock, CheckCircle2, Wifi } from "lucide-react";
import { FILTER_BTNS, type FilterKey } from "../constants/filter";
import StatCard from "./StatCard";

interface FiltersProps {
  filter: FilterKey;
  setFilter: (filter: FilterKey) => void;
  counts: Record<string, number>;
}


const Filters = ({ filter, setFilter, counts }: FiltersProps) => {
  return (
    <div className="space-y-4">
<div className="flex items-center justify-center rounded-md border-2 border-gray-200 p-1.5 gap-1.5 text-sm text-green-600">
  <Wifi className="h-4 w-4 text-green-600" />

  <span className="font-sm">
    Live Updates Active
  </span>
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

    return (
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

        <span className="truncate max-w-[80px]">
          {btn.label}
        </span>

        <span className={isActive ? "text-blue-500" : "text-gray-500"}>
          ({counts[btn.key] ?? 0})
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
            value={25}
            label="Total Vehicles"
            icon={<Truck size={12} />}
          />

          <StatCard
            value={3}
            label="En Route"
            icon={<Route size={12} />}
          />

          <StatCard
            value={1}
            label="In Service"
            icon={<Wrench size={12} />}
          />

          <StatCard
            value="14:40"
            label="Avg ETA"
            icon={<Clock3 size={12} />}
          />
        </div>
<p className="mt-3 flex items-center justify-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-[11px] text-gray-600">
  <Clock className="h-3 w-3 text-gray-500" />
  Updated 2m ago · next in ~3 mins
</p>
      </div>
    </div>
  );
};

export default Filters;