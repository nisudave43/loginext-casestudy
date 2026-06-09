import { ReactNode } from "react";

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
}

const StatCard = ({ value, label, icon }: StatCardProps) => {
  return (
    <div className="rounded-lg border border-gray-200 p-2 text-center">
      <div className="text-lg font-semibold text-gray-900">
        {value}
      </div>

      <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
        {icon}
        <span>{label}</span>
      </div>
    </div>
  );
};

export default StatCard;