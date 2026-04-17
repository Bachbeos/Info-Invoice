/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table as CustomTable,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

export interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  isLoading?: boolean;
}

export default function Table({ columns, data, isLoading }: TableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <CustomTable>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {isLoading ? (
              <TableRow>
                <td colSpan={columns.length} className="px-5 py-10 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full border-t-brand-500 animate-spin"></div>
                    Đang tải dữ liệu...
                  </div>
                </td>
              </TableRow>
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={item.id || index}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400"
                    >
                      {col.render
                        ? col.render(item[col.key], item)
                        : item[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td
                  colSpan={columns.length}
                  className="px-5 py-10 text-center text-gray-500 dark:text-gray-400"
                >
                  Không tìm thấy dữ liệu
                </td>
              </TableRow>
            )}
          </TableBody>
        </CustomTable>
      </div>
    </div>
  );
}
