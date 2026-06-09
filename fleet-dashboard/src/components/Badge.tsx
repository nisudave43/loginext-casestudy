import { STATUS_MAP } from "../constants/status";

interface StatusBadgeProps {
  status?: string;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const config =
    STATUS_MAP[status as keyof typeof STATUS_MAP] ?? STATUS_MAP.idle;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export default StatusBadge;