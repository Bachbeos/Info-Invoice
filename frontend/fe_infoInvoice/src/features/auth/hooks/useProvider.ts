import { useState, useEffect } from "react";
import AuthService from "../services/auth";
import type { ProviderResponse } from "../types/auth.type";

interface UseProvidersResult {
    providers: ProviderResponse[];
    isLoading: boolean;
    error: string | null;
}

export function useProviders(): UseProvidersResult {
    const [providers, setProviders] = useState<ProviderResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchProviders = async () => {
            try {
                setError(null);
                const data = await AuthService.getProviders();
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
