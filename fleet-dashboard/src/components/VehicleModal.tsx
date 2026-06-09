import { X, Truck, CheckCircle, Gauge, User, Phone, MapPin, Navigation, Zap, Fuel, Clock } from "lucide-react";

const STATUS_MAP = {
  delivered: { label: "DELIVERED", color: "bg-emerald-100 text-emerald-800" },
  in_transit: { label: "IN TRANSIT", color: "bg-blue-100 text-blue-800" },
  idle: { label: "IDLE", color: "bg-gray-100 text-gray-700" },
  offline: { label: "OFFLINE", color: "bg-red-100 text-red-700" },
};

function ProgressBar({ value, color }) {
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
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function InfoCard({ icon: Icon, label, children }) {
  return (
    <div className="relative bg-blue-50 rounded-xl p-3 pl-4 border-l-4 border-blue-400">
      
      <div className="flex items-center gap-1.5 text-[12px] font-medium tracking-wide text-gary-400 uppercase mb-1.5">
        <Icon size={13} aria-hidden="true" />
        {label}
      </div>

        <div className="text-left font-bold text-md">
    {children}
        </div>
    </div>
  );
}

const VehicleModal = ({ vehicle, onClose }) => {
  // Default demo vehicle if none provided
  const v = vehicle ?? {
    id: "FL-001",
    driver: "John Smith",
    status: "delivered",
    speed: "0 mph",
    phone: "+12498303604",
    dest: "Residential Complex A",
    coords: "37.757857, -122.434019",
    battery: 20,
    fuel: 44,
    lastUpdated: "19/08/2025, 14:41:17",
  };

  const statusInfo = STATUS_MAP[v.status] ?? {
    label: v.status?.toUpperCase(),
    color: "bg-gray-100 text-gray-700",
  };

  const fuelColor = v.fuel < 25 ? "red" : v.fuel < 50 ? "amber" : "blue";
  const battColor = v.battery < 25 ? "red" : v.battery < 50 ? "amber" : "blue";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative bg-white rounded-2xl shadow-xl w-[550px] z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex flex-col gap-1">
  
  <div className="flex items-center gap-2.5">
    <Truck size={20} className="text-gray-400" aria-hidden="true" className='bg-gray-900"'/>
    <span id="modal-title" className="text-xl font-bold text-gray-900">
      {v.id}
    </span>
  </div>

  <div className="text-xs text-gray-600 flex items-center gap-1">
    <User size={12} aria-hidden="true" />
    <span>{v.driver}</span>
    <span>&bull;</span>
    <span>{statusInfo.label}</span>
  </div>

</div>
<div className="border border-gray-200 rounded-[10px] inline-flex">
  <button
    onClick={onClose}
    aria-label="Close"
    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors rounded-[10px] font-bold"
  >
    <X size={18} strokeWidth={2.5}/>
  </button>
</div>
         
        </div>

        {/* Body */}
        <div className="p-4 grid grid-cols-2 gap-3">
          {/* Status */}
          <InfoCard icon={CheckCircle} label="Status">
            <span
              className={`inline-block text-sm font-medium px-2.5 py-0.5 rounded-full ${statusInfo.color}`}
            >
              ✓ {statusInfo.label}
            </span>
          </InfoCard>

          {/* Speed */}
          <InfoCard icon={Gauge} label="Current speed">
            <p className="text-xl font-medium text-gray-900">{v.speed}</p>
          </InfoCard>

          {/* Driver */}
          <InfoCard icon={User} label="Driver">
            <p className="text-sm font-medium text-gray-900">{v.driver}</p>
          </InfoCard>

          {/* Phone */}
          <InfoCard icon={Phone} label="Phone">
            <p className="text-sm font-medium text-gray-900">{v.phone}</p>
          </InfoCard>

          {/* Destination */}
          <InfoCard icon={MapPin} label="Destination">
            <p className="text-sm font-medium text-gray-900">{v.dest}</p>
          </InfoCard>

          {/* Location */}
          <InfoCard icon={Navigation} label="Location">
            <p className="text-sm font-medium text-gray-900 leading-snug whitespace-pre-line">
              {v.coords.replace(", ", ",\n")}
            </p>
          </InfoCard>

          {/* Battery */}
          <InfoCard icon={Zap} label="Battery level">
            <p className="text-lg font-medium text-gray-900">{v.battery}%</p>
            <ProgressBar value={v.battery} color={battColor} />
          </InfoCard>

          {/* Fuel */}
          <InfoCard icon={Fuel} label="Fuel level">
            <p className="text-lg font-medium text-gray-900">{v.fuel}%</p>
            <ProgressBar value={v.fuel} color={fuelColor} />
          </InfoCard>

          {/* Last Updated — full width */}
          <InfoCard icon={Clock} label="Last updated">
            <p className="text-sm font-medium text-gray-900">{v.lastUpdated}</p>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

export default VehicleModal;