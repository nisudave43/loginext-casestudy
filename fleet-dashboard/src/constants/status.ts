export const STATUS_MAP = {
  delivered: {
    className: "bg-green-100 text-green-800",
    label: "Delivered",
  },
  enroute: {
    className: "bg-yellow-100 text-yellow-800",
    label: "En Route",
  },
  idle: {
    className: "bg-gray-100 text-gray-800",
    label: "Idle",
  },
} as const;

export type Status = keyof typeof STATUS_MAP;