import { ReactNode } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
  isLoading?: boolean;
}

const StatCard = ({ value, label, icon, isLoading }: StatCardProps) => {
  return (
    <div className="rounded-lg border border-gray-200 p-2 text-center">
      
      {/* Value */}
      <div className="text-lg font-semibold text-gray-900">
        {isLoading ? (
          <Skeleton width={40} height={20} />
        ) : (
          value
        )}
      </div>

      {/* Label row (icon ALWAYS visible space preserved) */}
      <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mt-1 min-h-[16px]">
        
        {/* Icon placeholder always rendered */}
        <span className="flex items-center justify-center w-3.5 h-3.5">
          {isLoading ? null : icon}
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