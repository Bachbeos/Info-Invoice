import { useState, useEffect } from "react";
import invoiceService from "../services/InvoiceService";
import type { IProvider } from "../types/invoice";

interface UseProvidersResult {
  providers: IProvider[];
  isLoading: boolean;
  error: string | null;
}

export function useProviders(): UseProvidersResult {
  const [providers, setProviders] = useState<IProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // "cancelled" flag để tránh cập nhật state sau khi component đã unmount
    // Đây là pattern phổ biến khi dùng useEffect với async
    let cancelled = false;

    const fetchProviders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await invoiceService.getProviders();
        if (!cancelled) setProviders(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Không thể tải nhà cung cấp",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchProviders();

    // Cleanup function: chạy khi component unmount hoặc dependency thay đổi
    return () => {
      cancelled = true;
    };
  }, []); // [] = chỉ chạy 1 lần khi mount

  return { providers, isLoading, error };
}
