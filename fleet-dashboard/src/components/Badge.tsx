import { STATUS_MAP } from "../constants/status";

interface StatusBadgeProps {
  status?: string;
}

/**
 * StatusBadge
 * Displays a styled badge based on vehicle/status type
 */
function StatusBadge({ status }: StatusBadgeProps) {
  /**
   * Resolve config safely from STATUS_MAP
   * Fallback to "idle" if status is missing or invalid
   */
  const config =
    (status && STATUS_MAP[status as keyof typeof STATUS_MAP]) ||
    STATUS_MAP.idle;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export default StatusBadge;