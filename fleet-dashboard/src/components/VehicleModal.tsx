import {
  X,
  Truck,
  CheckCircle,
  Gauge,
  User,
  Phone,
  MapPin,
  Navigation,
  Zap,
  Fuel,
  Clock,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const STATUS_MAP = {
  delivered: { label: "DELIVERED", color: "bg-emerald-100 text-emerald-800" },
  in_transit: { label: "IN TRANSIT", color: "bg-blue-100 text-blue-800" },
  idle: { label: "IDLE", color: "bg-gray-100 text-gray-700" },
  offline: { label: "OFFLINE", color: "bg-red-100 text-red-700" },
};

function ProgressBar({ value, color }: { value: number; color: string }) {
  const barColor =
    color === "red"
      ? "bg-red-500"
      : color === "amber"
      ? "bg-amber-400"
      : "bg-blue-500";

  return (
    <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden mt-2">
      <div
        className={`h-full rounded-full ${barColor}`}
        style={{ width: `${Math.min(100, Math.max(0, value || 0))}%` }}
      />
    </div>
  );
}

function InfoCard({ icon: Icon, label, children }) {
  return (
    <div className="relative bg-blue-50 rounded-xl p-3 pl-4 border-l-4 border-blue-400">
      <div className="flex items-center gap-1.5 text-[12px] font-medium tracking-wide text-gray-500 uppercase mb-1.5">
        <Icon size={13} aria-hidden="true" />
        {label}
      </div>

      <div className="text-left font-bold text-md">{children}</div>
    </div>
  );
}

const VehicleModal = ({ vehicle, onClose, isLoading }: { vehicle: any; onClose: () => void, isLoading?: boolean }) => {

  const isLoadingState = isLoading || !vehicle;

  console.log('vehicle inside',vehicle)
  if (!vehicle) return null;

  // ✅ MAP API DATA → UI MODEL
  const v = {
    id: vehicle.vehicleNumber ?? vehicle.id,
    driver: vehicle.driverName,
    phone: vehicle.driverPhone,
    status: vehicle.status,
    dest: vehicle.destination,
    coords: vehicle.currentLocation
      ? `${vehicle.currentLocation.lat}, ${vehicle.currentLocation.lng}`
      : "-",
    speed: vehicle.speed ?? 0,
    battery: vehicle.batteryLevel ?? 0,
    fuel: vehicle.fuelLevel ?? 0,
    lastUpdated: vehicle.lastUpdated
      ? new Date(vehicle.lastUpdated).toLocaleString()
      : "-",
  };

  const statusInfo = STATUS_MAP[v.status as keyof typeof STATUS_MAP] ?? {
    label: v.status?.toUpperCase(),
    color: "bg-gray-100 text-gray-700",
  };

  const fuelColor = v.fuel < 25 ? "red" : v.fuel < 50 ? "amber" : "blue";
  const battColor = v.battery < 25 ? "red" : v.battery < 50 ? "amber" : "blue";

 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />

    {/* Modal */}
    <div className="relative bg-white rounded-2xl shadow-xl w-[550px] z-10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <Truck size={20} className="text-gray-400" />

            {isLoadingState ? (
              <Skeleton width={120} height={18} />
            ) : (
              <span className="text-xl font-bold text-gray-900">{v.id}</span>
            )}
          </div>

          <div className="text-xs text-gray-600 flex items-center gap-1">
            <User size={12} />

            {isLoadingState ? (
              <Skeleton width={160} height={12} />
            ) : (
              <>
                <span>{v.driver}</span>
                <span>•</span>
                <span>{statusInfo.label}</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors rounded-[10px]"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {/* Status */}
        <InfoCard icon={CheckCircle} label="Status">
          {isLoadingState ? (
            <Skeleton width={100} height={20} />
          ) : (
            <span
              className={`inline-block text-sm font-medium px-2.5 py-0.5 rounded-full ${statusInfo.color}`}
            >
              ✓ {statusInfo.label}
            </span>
          )}
        </InfoCard>

        {/* Speed */}
        <InfoCard icon={Gauge} label="Current speed">
          {isLoadingState ? (
            <Skeleton width={60} height={20} />
          ) : (
            <p className="text-xl font-medium text-gray-900">{v.speed}</p>
          )}
        </InfoCard>

        {/* Driver */}
        <InfoCard icon={User} label="Driver">
          {isLoadingState ? (
            <Skeleton width={120} height={16} />
          ) : (
            <p className="text-sm font-medium text-gray-900">{v.driver}</p>
          )}
        </InfoCard>

        {/* Phone */}
        <InfoCard icon={Phone} label="Phone">
          {isLoadingState ? (
            <Skeleton width={120} height={16} />
          ) : (
            <p className="text-sm font-medium text-gray-900">{v.phone}</p>
          )}
        </InfoCard>

        {/* Destination */}
        <InfoCard icon={MapPin} label="Destination">
          {isLoadingState ? (
            <Skeleton width={140} height={16} />
          ) : (
            <p className="text-sm font-medium text-gray-900">{v.dest}</p>
          )}
        </InfoCard>

        {/* Location */}
        <InfoCard icon={Navigation} label="Location">
          {isLoadingState ? (
            <>
              <Skeleton width={160} height={12} />
              <Skeleton width={120} height={12} className="mt-1" />
            </>
          ) : (
            <p className="text-sm font-medium leading-snug whitespace-pre-line text-gray-900">
              {v.coords.replace(", ", ",\n")}
            </p>
          )}
        </InfoCard>

        {/* Battery */}
        <InfoCard icon={Zap} label="Battery level">
          {isLoadingState ? (
            <>
              <Skeleton width={60} height={18} />
              <Skeleton height={6} className="mt-2" />
            </>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-900">
                {v.battery}%
              </p>
              <ProgressBar value={v.battery} color={battColor} />
            </>
          )}
        </InfoCard>

        {/* Fuel */}
        <InfoCard icon={Fuel} label="Fuel level">
          {isLoadingState ? (
            <>
              <Skeleton width={60} height={18} />
              <Skeleton height={6} className="mt-2" />
            </>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-900">{v.fuel}%</p>
              <ProgressBar value={v.fuel} color={fuelColor} />
            </>
          )}
        </InfoCard>

        {/* Last Updated */}
        <div className="col-span-2">
          <InfoCard icon={Clock} label="Last updated">
            {isLoadingState ? (
              <Skeleton width={140} height={16} />
            ) : (
              <p className="text-sm font-medium text-gray-900">
                {v.lastUpdated}
              </p>
            )}
          </InfoCard>
        </div>
      </div>
    </div>
  </div>
);
};

export default VehicleModal;