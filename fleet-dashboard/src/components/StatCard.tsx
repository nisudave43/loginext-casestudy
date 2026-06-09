import { ReactNode } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/* ─────────────────────────────────────────────
   Stat Card Props
   - Reusable KPI/stat display component
───────────────────────────────────────────── */
interface StatCardProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
  isLoading?: boolean;
}

/* ─────────────────────────────────────────────
   StatCard Component
   - Displays metric value + label + optional icon
   - Supports skeleton loading state
───────────────────────────────────────────── */
const StatCard = ({
  value,
  label,
  icon,
  isLoading,
}: StatCardProps) => {
  return (
    <div className="rounded-lg border border-gray-200 p-2 text-center">
      
      {/* ── Value Section ── */}
      <div className="text-lg font-semibold text-gray-900">
        {isLoading ? (
          <Skeleton width={40} height={20} />
        ) : (
          value
        )}
      </div>

      {/* ── Label + Icon Section ── */}
      <div className="mt-1 flex min-h-[16px] items-center justify-center gap-1 text-xs text-gray-500">
        
        {/* Icon container (keeps layout stable even during loading) */}
        <span className="flex h-3.5 w-3.5 items-center justify-center">
          {!isLoading && icon}
        </span>

        {/* Label */}
        {isLoading ? (
          <Skeleton width={70} height={12} />
        ) : (
          <span>{label}</span>
        )}
      </div>
    </div>
  );
};

export default StatCard;