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

    //Cleanup function
    return () => {
      cancelled = true;
    };
  }, []);

  return { providers, isLoading, error };
}
