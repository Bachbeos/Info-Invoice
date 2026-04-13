/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table as BsTable } from 'react-bootstrap';

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
        <div className="table-responsive bg-white rounded shadow-sm">
            <BsTable striped hover className="mb-0 align-middle">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} scope="col" className="py-3 px-4 text-secondary fw-bold">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-5">
                                <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                Đang tải dữ liệu...
                            </td>
                        </tr>
                    ) : data.length > 0 ? (
                        data.map((item, index) => (
                            <tr key={item.id || index}>
                                {columns.map((col, colIdx) => (
                                    <td key={col.key} className="py-3 px-4">
                                        {/* Cột đầu tiên có thể dùng scope="row" nếu cần giống hệt mẫu */}
                                        {col.render ? col.render(item[col.key], item) : item[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-5 text-muted">
                                Không tìm thấy dữ liệu
                            </td>
                        </tr>
                    )}
                </tbody>
            </BsTable>
        </div>
    );
}