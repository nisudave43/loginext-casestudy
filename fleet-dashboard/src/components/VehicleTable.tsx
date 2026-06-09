import React from "react";

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
};

const VehicleTable: React.FC<Props> = ({
  title,
  count,
  columns,
  data,
  onRowClick,
}) => {
  return (
    <div className="flex-grow min-w-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-[15px]">
          {title}{" "}
          <span className="text-gray-500 font-normal text-[13px]">
            ({count})
          </span>
        </span>

        
         <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-[14px] font-semi-bold text-success">
  Live
</span>
      </div>

      {/* Scroll Container */}
      <div className="border bg-white rounded overflow-auto max-h-[700px]">
        <table
          className="table table-hover table-sm align-middle mb-0 w-full border-collapse text-[13px]"
        >
          {/* HEADER */}
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-gray-500 font-semibold whitespace-nowrap text-[12px]"
                  style={{
                    width: col.width,
                    minWidth: col.width,
                    ...col.style,
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={row.id}
                onClick={() => {console.log('selection',row);onRowClick?.(row)}}
                className={`
                  cursor-pointer hover:bg-gray-100
                  ${rowIndex === data.length - 1 ? "border-b-0" : ""}
                `}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={col.className}
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
    </div>
  );
};

export default VehicleTable;