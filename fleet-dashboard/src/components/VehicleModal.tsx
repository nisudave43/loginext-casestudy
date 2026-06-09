import { useEffect } from 'react';
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
import { STATUS_MAP } from '../constants/config';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";



/* ─────────────────────────────────────────────
   Progress Bar (Battery / Fuel)
───────────────────────────────────────────── */
function ProgressBar({
  value,
  color,
}: {
  value: number;
  color: string;
}) {
  const barColor =
    color === "red"
      ? "bg-red-500"
      : color === "amber"
      ? "bg-amber-400"
      : "bg-blue-500";

  return (
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        className={`h-full rounded-full ${barColor}`}
        style={{
          width: `${Math.min(100, Math.max(0, value || 0))}%`,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Reusable Info Card
   - Used for all vehicle attributes
───────────────────────────────────────────── */
function InfoCard({
  icon: Icon,
  label,
  children,
}: {
  icon: any;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border-l-4 border-blue-400 bg-blue-50 p-3 pl-4">
      {/* Label */}
      <div className="mb-1.5 flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-wide text-gray-500">
        <Icon size={13} />
        {label}
      </div>

      {/* Value */}
      <div className="text-left text-md font-bold">
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Vehicle Modal Props
───────────────────────────────────────────── */
interface VehicleModalProps {
  vehicle: any;
  onClose: () => void;
  isLoading?: boolean;
}

/* ─────────────────────────────────────────────
   Vehicle Detail Modal
   - Shows full vehicle information
   - Supports loading skeleton state
───────────────────────────────────────────── */
const VehicleModal = ({
  vehicle,
  onClose,
  isLoading,
}: VehicleModalProps) => {
  const isLoadingState = isLoading || !vehicle;

  
  useEffect(() => {
    document.body.style.overflow = "hidden"; // disable scroll when modal opens

    return () => {
      document.body.style.overflow = ""; // restore on close
    };
  }, []);
  
  // prevent crash early
  if (!vehicle) return null;


  /* ── Normalize API → UI model ── */
  const v = {
    id: vehicle?.vehicleNumber ?? vehicle.id ?? '',
    driver: vehicle?.driverName || '',
    phone: vehicle?.driverPhone || '',
    status: vehicle?.status || '',
    dest: vehicle?.destination || '',
    coords: vehicle?.currentLocation
      ? `${vehicle?.currentLocation?.lat}, ${vehicle?.currentLocation?.lng}`
      : "-",
    speed: vehicle?.speed ?? 0,
    battery: vehicle?.batteryLevel ?? 0,
    fuel: vehicle?.fuelLevel ?? 0,
    lastUpdated: vehicle?.lastUpdated
      ? new Date(vehicle.lastUpdated).toLocaleString()
      : "-",
  };

  /* ── Status UI mapping ── */
  const statusInfo =
    STATUS_MAP[v?.status as keyof typeof STATUS_MAP] ?? {
      label: v?.status?.toUpperCase(),
      color: "bg-gray-100 text-gray-700",
    };

  /* ── Dynamic colors ── */
  const fuelColor = v?.fuel < 25 ? "red" : v?.fuel < 50 ? "amber" : "blue";
  const battColor =
    v?.battery < 25 ? "red" : v?.battery < 50 ? "amber" : "blue";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 h-[90svh] sm:h-auto w-[550px] overflow-hidden rounded-2xl bg-white shadow-xl">
        
        {/* ── Header ── */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          
          <div className="flex flex-col gap-1">
            {/* Vehicle ID */}
            <div className="flex items-center gap-2.5">
              <Truck size={20} className="text-gray-400" />

              {isLoadingState ? (
                <Skeleton width={120} height={18} />
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  {v?.id}
                </span>
              )}
            </div>

            {/* Driver + Status */}
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <User size={12} />

              {isLoadingState ? (
                <Skeleton width={160} height={12} />
              ) : (
                <>
                  <span>{v?.driver}</span>
                  <span>•</span>
                  <span>{statusInfo?.label}</span>
                </>
              )}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-[10px] p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Body Grid ── */}
        <div className="grid grid-cols-2 gap-3 p-4">

          {/* Status */}
          <InfoCard icon={CheckCircle} label="Status">
            {isLoadingState ? (
              <Skeleton width={100} height={20} />
            ) : (
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-sm font-medium ${statusInfo.color}`}
              >
                ✓ {statusInfo?.label}
              </span>
            )}
          </InfoCard>

          {/* Speed */}
          <InfoCard icon={Gauge} label="Current speed">
            {isLoadingState ? (
              <Skeleton width={60} height={20} />
            ) : (
              <p className="text-xl font-medium">{v?.speed}</p>
            )}
          </InfoCard>

          {/* Driver */}
          <InfoCard icon={User} label="Driver">
            {isLoadingState ? (
              <Skeleton width={120} height={16} />
            ) : (
              v.driver
            )}
          </InfoCard>

          {/* Phone */}
          <InfoCard icon={Phone} label="Phone">
            {isLoadingState ? (
              <Skeleton width={120} height={16} />
            ) : (
              v.phone
            )}
          </InfoCard>

          {/* Destination */}
          <InfoCard icon={MapPin} label="Destination">
            {isLoadingState ? (
              <Skeleton width={140} height={16} />
            ) : (
              v.dest
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
              <p className="whitespace-pre-line text-sm">
                {v?.coords.replace(", ", ",\n")}
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
                <p className="text-lg font-medium">{v?.battery}%</p>
                <ProgressBar value={v?.battery} color={battColor} />
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
                <p className="text-lg font-medium">{v?.fuel}%</p>
                <ProgressBar value={v?.fuel} color={fuelColor} />
              </>
            )}
          </InfoCard>

          {/* Last Updated */}
          <div className="col-span-2">
            <InfoCard icon={Clock} label="Last updated">
              {isLoadingState ? (
                <Skeleton width={140} height={16} />
              ) : (
                v?.lastUpdated
              )}
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleModal;