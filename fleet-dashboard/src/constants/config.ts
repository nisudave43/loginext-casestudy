export const ROW_PER_PAGE = [5, 10, 15, 20, 25];

export const DEFAULT_ROW_LIMIT = 25;

export const WEB_SOCKET_URL = "wss://case-study-26cf.onrender.com/api/vehicles";

/* ─────────────────────────────────────────────
   Status Configuration Map
   - Maps API status → UI label + badge color
───────────────────────────────────────────── */
export const STATUS_MAP = {
  delivered: {
    label: "DELIVERED",
    color: "bg-emerald-100 text-emerald-800",
  },
  in_transit: {
    label: "IN TRANSIT",
    color: "bg-blue-100 text-blue-800",
  },
  idle: {
    label: "IDLE",
    color: "bg-gray-100 text-gray-700",
  },
  offline: {
    label: "OFFLINE",
    color: "bg-red-100 text-red-700",
  },
};