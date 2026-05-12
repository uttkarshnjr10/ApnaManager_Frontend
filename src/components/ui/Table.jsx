// src/components/ui/Table.jsx
import { FaInbox } from 'react-icons/fa';

const TableSkeleton = ({ columns, rows = 5 }) => (
  <tbody>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <tr key={rowIndex} className="animate-pulse border-b border-slate-100">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <td key={colIndex} className="px-5 py-4">
            <div className="h-4 rounded bg-slate-100" />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

const Table = ({ columns, data, loading, onRowClick }) => {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
      <div className="min-w-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {col.Header}
                </th>
              ))}
            </tr>
          </thead>
          {loading ? (
            <TableSkeleton columns={columns.length} />
          ) : safeData.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="mx-auto flex max-w-xs flex-col items-center gap-3 text-slate-400">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                      <FaInbox />
                    </span>
                    <p className="text-sm font-medium text-slate-500">No records found</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="divide-y divide-slate-100 bg-white">
              {safeData.map((row, rowIndex) => (
                <tr
                  key={row._id || rowIndex}
                  className={`transition-colors duration-150 even:bg-slate-50/50 hover:bg-blue-50/40 ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td key={col.accessor} className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {col.Cell ? col.Cell(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default Table;
