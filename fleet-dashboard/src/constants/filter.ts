export const FILTER_BTNS = [
  {
    key: "total",
    label: "All",
    borderClass: "border-blue-500 text-blue-700",
    dotClass: "bg-blue-500",
  },
  {
    key: "delivered",
    label: "Delivered",
    borderClass: "border-green-500 text-green-700",
    dotClass: "bg-green-500",
  },
  {
    key: "en_route",
    label: "En Route",
    borderClass: "border-amber-500 text-amber-700",
    dotClass: "bg-amber-500",
  },
  {
    key: "idle",
    label: "Idle",
    borderClass: "border-slate-500 text-slate-700",
    dotClass: "bg-slate-500",
  },
] as const;