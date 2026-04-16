/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../../icons";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Checkbox from "../../../components/form/input/Checkbox";
import Button from "../../../components/ui/button/Button";
import Select from "../../../components/form/Select";
import { AuthRequest, ProviderResponse } from "../types/auth.type";
import { setToken, showToast } from "../../../utils/common";
import AuthService from "../services/auth.service";

export default function SignInForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [providersLoading, setProvidersLoading] = useState(true);
  const [providers, setProviders] = useState<ProviderResponse[]>([]);
  const [formData, setFormData] = useState<AuthRequest>({
    providerId: 6,
    url: "",
    maDvcs: "",
    tenantId: "",
    username: "",
    password: "",
  });

  const getProviders = async () => {
    setProvidersLoading(true);

    const data = await AuthService.getProviders();
    setProviders(data);

    if (data.length > 0) {
      setFormData(prev => ({ ...prev, providerId: data[0].id }));
    } else {
      showToast("Lỗi nhà cung cấp thất bại", "error")
    }

    setProvidersLoading(false);
    setIsLoading(false);
  }

  useEffect(() => {
    getProviders();
  }, [])

  const fetchProviderUrl = async (signal: AbortSignal) => {
    try {
      const configs = await AuthService.getProviderConfigs(
        formData.providerId,
        signal
      );

      const url =
        Array.isArray(configs) && configs.length > 0
          ? (configs[0].url ?? "")
          : "";

      setFormData(prev => ({ ...prev, url }));
    } catch (error: any) {
      if (error.name === "AbortError") return;

      setFormData(prev => ({ ...prev, url: "" }));
    }
  };


  useEffect(() => {
    if (!formData.providerId) return;

    const controller = new AbortController();

    fetchProviderUrl(controller.signal);

    return () => controller.abort();
  }, [formData.providerId]);

  const providerOptions = providers.map((provider) => ({
    label: provider.name,
    value: String(provider.id),
  }));

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      showToast("Vui lòng điền đầy đủ thông tin bắt buộc", "error")
      return;
    }

    setIsLoading(true);
    const response = await AuthService.login(formData);

    if (response.code === 200) {
      setToken(response.data.accessToken)
      showToast("Đăng nhập thành công", "success");
      navigate('/invoice')
    } else {
      showToast("Đăng nhập thất bại, vui lòng kiểm tra lại thông tin đăng nhập", "error");
    }

    setIsLoading(false);
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Đăng nhập
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nhập thông tin để đăng nhập vào hệ thống
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label>
                      Tên đăng nhập <span className="text-error-500">*</span>{" "}
                    </Label>
                    <Input name="username" value={formData.username} onChange={handleInputChange} placeholder="Nhập" />
                  </div>
                  <div>
                    <Label>
                      Mật khẩu <span className="text-error-500">*</span>{" "}
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Nhập"
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        )}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label>Mã số thuế người dùng</Label>
                    <Input type="text" name="maDvcs" value={formData.maDvcs} onChange={handleInputChange} placeholder="Nhập mã số thuế người dùng" />
                  </div>
                  <div>
                    <Label>Ehoadon</Label>
                    <Input type="text" name="tenantId" value={formData.tenantId} onChange={handleInputChange} placeholder="Nếu có" />
                  </div>
                  <div>
                    <Label>Chọn nhà cung cấp</Label>
                    <Select
                      options={providerOptions}
                      placeholder={isLoading ? "Đang tải..." : "Chọn nhà cung cấp"}
                      value={String(formData.providerId)}
                      onChange={(value) => setFormData(prev => ({ ...prev, providerId: Number(value) }))}
                      className="dark:bg-dark-900"
                    />
                  </div>
                  <div>
                    <Label>
                      Domain nhà cung cấp
                    </Label>
                    <Input name="url" value={formData.url} onChange={handleInputChange} placeholder="" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Giữ đăng nhập
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" disabled={isLoading || providersLoading}>
                    {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Bạn chưa có tài khoản? {""}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Đăng ký
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
