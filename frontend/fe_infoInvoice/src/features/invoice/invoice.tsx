import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Table from "../../components/table/table";
import ActionTable from "../../components/table/action-table";
import Pagination from "../../components/pagination/pagination";
import { useInvoiceList } from "./hooks/useInvoiceList";
import InvoiceService from "./services/invoice";
import type { Column } from "../../components/table/table";
import type { IInvoiceDetail, InvoiceItem } from "./types/invoice";
import "./invoice.scss";
import ActionInvoice, { type ActionMode } from "./partials/invoice-action";


type ViewState =
    | { view: "list" }
    | { view: "form"; mode: ActionMode; invoiceDetail?: IInvoiceDetail };


const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value || 0);

const formatDate = (value?: string) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("vi-VN");
};

export default function InvoiceList() {
    const [viewState, setViewState] = useState<ViewState>({ view: "list" });
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const {
        items,
        isLoading,
        page,
        pageSize,
        totalPages,
        total,
        setPage,
        refresh,
    } = useInvoiceList();

    const handleOpenAction = useCallback(async (mode: "replace" | "adjust", item: InvoiceItem) => {
        try {
            const res = await InvoiceService.getInvoiceDetail(item.id);
            if (res.code === 200 && res.data) {
                setViewState({ view: "form", mode, invoiceDetail: res.data });
            } else {
                toast.error(res.message || "Không lấy được chi tiết hóa đơn");
                setViewState({ view: "form", mode });
            }
        } catch {
            toast.error("Không lấy được chi tiết hóa đơn");
            setViewState({ view: "form", mode });
        }
    }, []);

    const handleViewDetail = useCallback(async (item: InvoiceItem) => {
        try {
            const res = await InvoiceService.getInvoiceDetail(item.id);
            if (res.code === 200 && res.data) {
                setViewState({ view: "form", mode: "view", invoiceDetail: res.data });
            } else {
                toast.error(res.message || "Không lấy được chi tiết hóa đơn");
            }
        } catch {
            toast.error("Không lấy được chi tiết hóa đơn");
        }
    }, []);

    const handleDeleteInvoice = useCallback(async (item: InvoiceItem) => {
        if (deletingId === item.id) return;

        const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa hóa đơn #${item.id}?`);
        if (!confirmed) return;

        setDeletingId(item.id);
        try {
            const res = await InvoiceService.delete(item.id);
            if (res?.code === 200) {
                toast.success(res.message || "Xóa hóa đơn thành công");
                refresh();
                return;
            }
            toast.error(res?.message || "Xóa hóa đơn thất bại");
        } catch {
            toast.error("Không thể xóa hóa đơn");
        } finally {
            setDeletingId(null);
        }
    }, [deletingId, refresh]);

    const columns: Column[] = useMemo(
        () => [
            {
                key: "_index",
                label: "Số thứ tự",
                render: (value) => value,
            },
            {
                key: "invoiceNo",
                label: "Số hóa đơn",
                render: (_v, item: InvoiceItem) => item.invRef || "-",
            },
            {
                key: "transactionId",
                label: "Mã giao dịch",
                render: (_v, item: InvoiceItem) => item.transactionId || "-",
            },
            {
                key: "invTotalAmount",
                label: "Tổng tiền",
                render: (_v, item: InvoiceItem) => formatCurrency(item.invTotalAmount),
            },
            {
                key: "createdAt",
                label: "Ngày tạo",
                render: (_v, item: InvoiceItem) => formatDate(item.createdAt),
            },
            {
                key: "action",
                label: "Thao tác",
                render: (_v, item: InvoiceItem) => (
                    <ActionTable
                        onView={() => void handleViewDetail(item)}
                        onReplace={() => void handleOpenAction("replace", item)}
                        onAdjust={() => void handleOpenAction("adjust", item)}
                        onDelete={() => void handleDeleteInvoice(item)}
                        isDraft
                    />
                ),
            },
        ],
        [handleOpenAction, handleDeleteInvoice, handleViewDetail],
    );

    const tableData = useMemo(
        () => items.map((item, index) => ({ ...item, _index: (page - 1) * pageSize + index + 1 })),
        [items, page, pageSize],
    );

    if (viewState.view === "form") {
        return (
            <ActionInvoice
                mode={viewState.mode}
                invoiceDetail={viewState.invoiceDetail}
                onBack={() => {
                    setViewState({ view: "list" });
                    refresh();
                }}
            />
        );
    }

    return (
        <div className="invoice-list">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <div>
                    <h5 className="mb-1">Danh sách hóa đơn</h5>
                    <div className="text-muted small">Tổng cộng: {total} hóa đơn</div>
                </div>

                <div className="d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => setViewState({ view: "form", mode: "issue" })}
                    >
                        <i className="ri-add-line me-1" />
                        Phát hành
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={refresh}
                        disabled={isLoading}
                    >
                        <i className="ri-refresh-line me-1" />
                        Tải lại
                    </button>
                </div>
            </div>

            <Table columns={columns} data={tableData} isLoading={isLoading} />

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}
