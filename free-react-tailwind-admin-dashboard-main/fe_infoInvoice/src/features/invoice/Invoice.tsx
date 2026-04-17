import { useCallback, useEffect, useMemo, useState } from "react";
import ActionTable from "../../components/tables/ActionTable";
import Pagination from "../../components/pagination/Pagination";
import Table, { Column } from "../../components/tables/Table";
import Badge from "../../components/ui/badge/Badge";
import { ApiError } from "../../libs/apiClients";
import { showToast } from "../../utils/common";
import InvoiceService from "./services/invoice.service";
import type { InvoiceItem } from "./types/invoice.type";

type InvoiceStatus = "Active" | "Pending" | "Error";

interface InvoiceTableRow {
  id: number;
  transactionId: string;
  invRef: string;
  createdAt: string;
  totalAmount: number;
  exchCd: string;
  status: InvoiceStatus;
}

const mapInvoiceTypeToStatus = (invoiceType: number): InvoiceStatus => {
  if (invoiceType === 1) return "Active";
  if (invoiceType === 0) return "Pending";
  return "Error";
};

const mapInvoiceItemToRow = (item: InvoiceItem): InvoiceTableRow => ({
  id: item.id,
  transactionId: item.transactionId,
  invRef: item.invRef,
  createdAt: item.createdAt,
  totalAmount: item.invTotalAmount,
  exchCd: item.exchCd,
  status: mapInvoiceTypeToStatus(item.invoiceType),
});

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<InvoiceTableRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  const fetchInvoiceList = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await InvoiceService.getInvoiceList({
        page,
        pageSize,
      });

      setInvoices(response.data.items.map(mapInvoiceItemToRow));
      setTotal(response.data.total);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Không thể tải danh sách hóa đơn";
      showToast(message, "error");
      setInvoices([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchInvoiceList();
  }, [fetchInvoiceList]);

  const handleDelete = useCallback(
    async (id: number) => {
      const confirmDelete = window.confirm(
        "Bạn có chắc chắn muốn xóa hóa đơn này không?",
      );
      if (!confirmDelete) return;

      try {
        await InvoiceService.delete(id);
        showToast("Xóa hóa đơn thành công", "success");
        await fetchInvoiceList();
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : "Xóa hóa đơn thất bại";
        showToast(message, "error");
      }
    },
    [fetchInvoiceList],
  );

  const totalPages = useMemo(() => {
    if (pageSize <= 0) return 1;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [pageSize, total]);

  const columns: Column[] = [
    {
      key: "transactionId",
      label: "Mã giao dịch",
    },
    {
      key: "invRef",
      label: "Số hóa đơn",
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      render: (createdAt: string) =>
        createdAt ? new Date(createdAt).toLocaleDateString("vi-VN") : "-",
    },
    {
      key: "totalAmount",
      label: "Tổng tiền",
      render: (amount: number, item: InvoiceTableRow) =>
        `${amount.toLocaleString("vi-VN")} ${item.exchCd}`,
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (status: InvoiceStatus) => (
        <Badge
          size="sm"
          color={
            status === "Active"
              ? "success"
              : status === "Pending"
                ? "warning"
                : "error"
          }
        >
          {status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Thao tác",
      render: (_value, item: InvoiceTableRow) => (
        <ActionTable
          onView={() => showToast(`Hóa đơn ${item.invRef}`, "success")}
          onUpdate={() => showToast(`Hóa đơn ${item.invRef}`, "success")}
          onDelete={() => handleDelete(item.id)}
        />
      ),
    },
  ];

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="px-6 py-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Danh sách hóa đơn
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Quản lý và theo dõi các hóa đơn hiện có
          </p>
        </div>

        <div className="p-0 sm:p-4">
          <Table columns={columns} data={invoices} isLoading={isLoading} />

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalResults={total}
            resultsPerPage={pageSize}
          />
        </div>
      </div>
    </>
  );
}
