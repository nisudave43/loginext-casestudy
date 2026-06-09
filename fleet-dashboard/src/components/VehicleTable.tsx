import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ChevronDown } from "lucide-react";

type Column = {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
};

type Props = {
  title: string;
  count: number;
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  isLoading?: boolean;

  // ✅ NEW
  rowsPerPage?: number;
  onRowsPerPageChange?: (value: number) => void;
};

const VehicleTable: React.FC<Props> = ({
  title,
  count,
  columns,
  data,
  onRowClick,
  isLoading,
  rowsPerPage,
  onRowsPerPageChange,
}) => {
  const skeletonRows = Array.from({ length: rowsPerPage || 10 });

  return (
    <div className="flex-grow min-w-0 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-[15px]">
          {title}{" "}
          <span className="text-gray-500 font-normal text-[13px]">
            ({count})
          </span>
        </span>

        <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-[14px] font-semi-bold text-green-600">
          Live
        </span>
      </div>

      {/* Table */}
      <div className="border bg-white rounded overflow-auto max-h-[700px]">
        <table className="table table-hover table-sm align-middle mb-0 w-full text-[13px]">
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    width: col.width,
                    minWidth: col.width,
                    ...col.style,
                  }}
                  className="text-gray-500 font-semibold whitespace-nowrap text-[12px]"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading
              ? skeletonRows.map((_, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
                      <td key={col.key}>
                        <Skeleton height={14} width="80%" />
                      </td>
                    ))}
                  </tr>
                ))
              : data.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        style={{
                          width: col.width,
                          minWidth: col.width,
                        }}
                      >
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* ✅ FOOTER (ROWS PER PAGE DROPDOWN) */}
      <div className="flex justify-end items-center gap-2 mt-2">
  <span className="text-[14px] text-gray-500">Rows per page</span>
  <div className="relative inline-flex items-center">
    <select
      value={rowsPerPage || 10}
      onChange={(e) => onRowsPerPageChange?.(Number(e.target.value))}
      className="appearance-none text-sm pl-2.5 pr-7 py-1.0 border border-gray-300 rounded-md bg-white text-gray-900 cursor-pointer outline-none text-[14px]"
    >
      {[5, 10, 15, 20, 25].map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
    <ChevronDown
      className="pointer-events-none absolute right-2 text-gray-400"
      size={20}
      // strokeWidth={1.5}
    />
  </div>
</div>
    </div>
  );
};

export default VehicleTable;