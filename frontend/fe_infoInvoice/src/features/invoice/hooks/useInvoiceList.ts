import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import InvoiceService from "../services/invoice";
import type { InvoiceItem, InvoiceListResponse } from "../types/invoice";

const DEFAULT_PAGE_SIZE = 10;

const getSafeTotalPages = (res: InvoiceListResponse): number => {
    if (res.totalPages && res.totalPages > 0) return res.totalPages;
    if (!res.total || !res.pageSize) return 1;
    return Math.max(1, Math.ceil(res.total / res.pageSize));
};

interface UseInvoiceListResult {
    items: InvoiceItem[];
    isLoading: boolean;
    page: number;
    pageSize: number;
    totalPages: number;
    total: number;
    setPage: (page: number) => void;
    refresh: () => void;
}

export function useInvoiceList(): UseInvoiceListResult {
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const pageSize = DEFAULT_PAGE_SIZE;

    const fetchInvoices = useCallback(async (currentPage: number) => {
        setIsLoading(true);
        try {
            const response = await InvoiceService.getInvoiceList({ page: currentPage, pageSize });
            setItems(response.items || []);
            setTotal(response.total || 0);
            setTotalPages(getSafeTotalPages(response));
        } catch {
            toast.error("Không tải được danh sách hóa đơn");
            setItems([]);
            setTotal(0);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    }, [pageSize]);

    useEffect(() => {
        fetchInvoices(page);
    }, [page, fetchInvoices]);

    return {
        items,
        isLoading,
        page,
        pageSize,
        totalPages,
        total,
        setPage,
        refresh: () => fetchInvoices(page),
    };
}
