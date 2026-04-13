import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import AuthService from "../services/auth";
import { useProviders } from "../hooks/useProvider";
import type { LoginFormValues } from "../types/auth";
import { setToken } from "../../../utils/token";
import { showToast } from "../../../utils/common";

const DEFAULT_VALUES: LoginFormValues = {
    providerId: 0,
    url: "",
    maDvcs: "",
    tenantId: "",
    username: "",
    password: "",
};

export function useLogin() {
    const navigate = useNavigate();

    const {
        providers,
        isLoading: providersLoading,
        error: providersError,
    } = useProviders();

    const form = useForm<LoginFormValues>({
        defaultValues: DEFAULT_VALUES,
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { isSubmitting, errors },
    } = form;

    // Lấy providerId hiện tại — fallback về provider đầu tiên nếu chưa chọn
    const providerId = useWatch({
        control: form.control,
        name: "providerId",
        defaultValue: DEFAULT_VALUES.providerId,
    });
    const selectedProviderId = providerId || providers[0]?.id || 0;

    useEffect(() => {
        if (!selectedProviderId) {
            setValue("url", "");
            return;
        }

        let cancelled = false;

        const fetchProviderUrl = async () => {
            try {
                const configs = await AuthService.getProviderConfigs(selectedProviderId);
                if (cancelled) return;

                const url =
                    Array.isArray(configs) && configs.length > 0
                        ? (configs[0].url ?? "")
                        : "";

                setValue("url", url);
            } catch {
                if (!cancelled) setValue("url", "");
            }
        };

        fetchProviderUrl();
        return () => { cancelled = true; };
    }, [selectedProviderId, setValue]);

    const onSubmit = handleSubmit(async (values: LoginFormValues) => {
        try {
            const response = await AuthService.login({
                ...values,
                providerId: selectedProviderId,
                url: values.url ?? "",
            });

            if (response.code === 200) {
                setToken(response.data.accessToken);
                showToast("Đăng nhập thành công vào hệ thống", "success");
                navigate("/public-invoice");
            }
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Có lỗi xảy ra, vui lòng thử lại!";
            showToast(message, "error");
        }
    });

    return {
        form,
        register,
        errors,
        onSubmit,
        isSubmitting,
        providers,
        providersLoading,
        providersError,
        selectedProviderId,
        isDisabled: isSubmitting || providersLoading,
    };
}
