import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import InvoiceService from "../services/invoice";
import type { InvoiceItem, InvoiceListData } from "../types/invoice";

const DEFAULT_PAGE_SIZE = 10;

const getSafeTotalPages = (data: InvoiceListData): number => {
    if (data.totalPages && data.totalPages > 0) return data.totalPages;
    if (!data.total || !data.pageSize) return 1;
    return Math.max(1, Math.ceil(data.total / data.pageSize));
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

    const getInvoices = useCallback(async (currentPage: number) => {
        setIsLoading(true);
        try {
            const response = await InvoiceService.getInvoiceList({ page: currentPage, pageSize });
            const data = response.data;

            if (response.code !== 200) {
                toast.error(response.message || "Không tải được danh sách hóa đơn");
                setItems([]);
                setTotal(0);
                setTotalPages(1);
                return;
            }

            setItems(data?.items || []);
            setTotal(data?.total || 0);
            setTotalPages(data ? getSafeTotalPages(data) : 1);
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
        getInvoices(page);
    }, [page, getInvoices]);

    return {
        items,
        isLoading,
        page,
        pageSize,
        totalPages,
        total,
        setPage,
        refresh: () => getInvoices(page),
    };
}