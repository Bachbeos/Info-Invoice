import React, { useState, useEffect } from "react";
import "./login.scss";
import { useProviders } from "../../../hooks/useProviders";
import { useLogin } from "../../../hooks/useLogin";
import type { AuthRequest } from "../../../types/auth";
import authService from "../../../services/auth";

const initial_form: AuthRequest = {
  providerId: 0,
  url: "",
  maDvcs: "",
  tenantId: "",
  username: "",
  password: "",
};

export default function Login() {
  const [form, setForm] = useState<AuthRequest>(initial_form);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("vi");

  const languages = [
    { code: "vi", label: "🇻🇳 Tiếng Việt" },
    { code: "en", label: "🇺🇸 English" },
    { code: "ko", label: "🇰🇷 한국어" },
  ];

  const {
    providers,
    isLoading: providersLoading,
    error: providersError,
  } = useProviders();

  const { login, isLoading: loginLoading } = useLogin();

  const isSubmitDisabled = loginLoading || providersLoading;
  const selectedProviderId = form.providerId || providers[0]?.id || 0;

  useEffect(() => {
    const fetchProviderConfig = async () => {
      try {
        const res = await authService.getProviderConfigs(
          form.username,
          selectedProviderId,
        );
        if (Array.isArray(res) && res.length > 0) {
          setForm((prev) => ({
            ...prev,
            url: res[0].url || prev.url,
            maDvcs: res[0].maDvcs || prev.maDvcs,
          }));
        }
      } catch (err) {
        console.error("Lỗi khi tải URL:", err);
      }
    };

    const timeoutId = setTimeout(() => {
      if (form.username && selectedProviderId) {
        fetchProviderConfig();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [form.username, selectedProviderId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: id === "providerId" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ ...form, providerId: selectedProviderId });
  };

  return (
    <div className="auth-wrapper">
      <div className="container">
        <div className="card login-card shadow-lg border-0">
          <div className="row g-0">
            <div className="col-lg-5 left-panel d-none d-lg-flex">
              <div className="z-1">
                <h3 className="fw-bold">DAEWOO</h3>
                <p className="opacity-75">HỆ THỐNG QUẢN LÝ MARKETING</p>
              </div>
              <div className="z-1">
                {/* <i className="ri-double-quotes-l display-4 text-warning opacity-50"></i> */}
                <p className="fs-5 fst-italic"></p>
              </div>
              <div className="bg-overlay"></div>
            </div>

            <div className="col-lg-7 bg-white p-4 p-md-5">
              <div className="text-center mb-4">
                <h4 className="text-primary fw-bold">
                  Đăng nhập hệ thống HDDT
                </h4>
                <p className="text-muted small">전자세금계산서 시스템 로그인</p>
              </div>

              <div className="info-box">
                <strong>Thông tin kết nối (연결 정보):</strong>
                <br />
                Thông tin này sau khi ký hợp đồng sử dụng HDDT sẽ được nhà cung
                cấp gửi cho khách hàng.
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="providerId">
                      Nhà cung cấp
                    </label>
                    <select
                      id="providerId"
                      className="form-select"
                      value={selectedProviderId}
                      onChange={handleChange}
                      disabled={isSubmitDisabled}
                    >
                      {providersLoading && (
                        <option value={0}>Đang tải...</option>
                      )}
                      {providersError && (
                        <option value={0}>Lỗi tải dữ liệu</option>
                      )}
                      {providers.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="url">
                      Domain HDDT
                    </label>
                    <input
                      id="url"
                      className="form-control"
                      placeholder="https://..."
                      value={form.url}
                      onChange={handleChange}
                      disabled={isSubmitDisabled}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="maDvcs">
                      MST / Mã DVCS
                    </label>
                    <input
                      id="maDvcs"
                      className="form-control"
                      placeholder="Nhập MST / Mã DVCS"
                      value={form.maDvcs}
                      onChange={handleChange}
                      disabled={isSubmitDisabled}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="tenantId">
                      EHoaDon
                    </label>
                    <input
                      id="tenantId"
                      className="form-control"
                      placeholder="Nếu có"
                      value={form.tenantId}
                      onChange={handleChange}
                      disabled={isSubmitDisabled}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="username">
                      Tài khoản
                    </label>
                    <input
                      id="username"
                      className="form-control"
                      value={form.username}
                      onChange={handleChange}
                      disabled={isSubmitDisabled}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label" htmlFor="password">
                      Mật khẩu
                    </label>
                    <div className="position-relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="form-control pe-5"
                        value={form.password}
                        onChange={handleChange}
                        required
                        disabled={isSubmitDisabled}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                        aria-label={
                          showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                        }
                      >
                        <i
                          className={
                            showPassword ? "ri-eye-off-line" : "ri-eye-line"
                          }
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label d-block">Xác thực OTP</label>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="otp"
                      id="otpEmail"
                      value="email"
                    />
                    <label className="form-check-label" htmlFor="otpEmail">
                      Email
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="otp"
                      id="otpSms"
                      value="sms"
                    />
                    <label className="form-check-label" htmlFor="otpSms">
                      SMS
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-bold shadow-sm"
                  disabled={isSubmitDisabled}
                >
                  {loginLoading ? "Đang xử lý..." : "ĐĂNG NHẬP (로그인)"}
                </button>
              </form>

              <div className="row g-2 mt-4">
                {languages.map((language) => (
                  <div className="col-4" key={language.code}>
                    <button
                      type="button"
                      className={`lang-box ${selectedLanguage === language.code ? "active" : ""}`}
                      onClick={() => setSelectedLanguage(language.code)}
                    >
                      {language.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
