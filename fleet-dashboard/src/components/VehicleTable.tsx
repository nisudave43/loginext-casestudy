import React from "react";
import {ROW_PER_PAGE} from "../constants/config";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ChevronDown } from "lucide-react";

/* ─────────────────────────────────────────────
   Table Column Definition
   - Supports custom render or direct key mapping
───────────────────────────────────────────── */
type Column = {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
};

/* ─────────────────────────────────────────────
   Table Props
───────────────────────────────────────────── */
type Props = {
  title: string;
  count: number;
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  isLoading?: boolean;

  // pagination control (UI only, not backend pagination here)
  rowsPerPage?: number;
  onRowsPerPageChange?: (value: number) => void;
};

/* ─────────────────────────────────────────────
   Vehicle Table Component
   - Displays fleet list in tabular format
   - Supports loading skeleton state
   - Supports row click interaction
───────────────────────────────────────────── */
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
  const skeletonRows = Array.from({
    length: rowsPerPage || 10,
  });

  return (
    <div className="flex min-w-0 flex-grow flex-col">
      
      {/* ───────────────── Header ───────────────── */}
      <div className="mb-2 flex items-center justify-between">
        
        {/* Title + Count */}
        <span className="text-[15px] font-semibold">
          {`${title} (${count})`} 
        </span>

        {/* Live indicator */}
        <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-[14px] font-semibold text-green-600">
          Live
        </span>
      </div>

      {/* ───────────────── Table ───────────────── */}
      <div className="max-h-[700px] overflow-x-auto overflow-y-auto rounded border bg-white">
        <table className="table table-hover table-sm mb-0 w-full align-middle text-[13px]">

          {/* ── Table Header ── */}
          <thead className="sticky top-0 z-10 bg-gray-100">
            <tr className="h-[35px]">
              {columns.map((col) => (
                <th
                  key={col?.key}
                  className="whitespace-nowrap text-[12px] font-semibold text-gray-500 !bg-gray-200"
                  style={{
                    width: col?.width,
                    minWidth: col?.width,
                    ...col.style,
                  }}
                >
                  {col?.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* ── Table Body ── */}
          <tbody>
            {/* Loading State */}
            {isLoading
              ? skeletonRows.map((_, i) => (
                  <tr key={i}>
                    {columns?.map((col) => (
                      <td key={col?.key}>
                        <Skeleton height={14} width="80%" />
                      </td>
                    ))}
                  </tr>
                ))

              /* Data State */
             : data?.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-[13px] text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span style={{ fontSize: 28 }}>🚛</span>
                    <span>No vehicles found</span>
                  </div>
                </td>
              </tr>
            ) : (
              /* Data State */
              data?.map((row) => (
                <tr
                  key={row?.id}
                  onClick={() => onRowClick?.(row)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {columns.map((col) => (
                    <td
                      key={col?.key}
                      style={{
                        width: col?.width,
                        minWidth: col?.width,
                      }}
                    >
                      {col?.render ? col?.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ───────────────── Footer (Pagination Control) ───────────────── */}
      <div className="mt-2 flex items-center justify-end gap-2">
        <span className="text-[14px] text-gray-500">
          Rows per page
        </span>

        <div className="relative inline-flex items-center">
          <select
            value={rowsPerPage || 10}
            onChange={(e) =>
              onRowsPerPageChange?.(Number(e.target.value))
            }
            className="cursor-pointer appearance-none rounded-md border border-gray-300 bg-white px-6 py-1 text-[14px] text-gray-900 outline-none"
          >
            {ROW_PER_PAGE?.map((size: number) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          {/* dropdown icon */}
          <ChevronDown
            className="pointer-events-none absolute right-2 text-gray-400"
            size={18}
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleTable;