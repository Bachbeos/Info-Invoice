import { useState } from "react";
import "./login.scss";
import { useLogin } from "./hooks/useLogin";

const LANGUAGES = [
    { code: "vi", label: "🇻🇳 Tiếng Việt" },
    { code: "en", label: "🇺🇸 English" },
    { code: "ko", label: "🇰🇷 한국어" },
] as const;

type LanguageCode = (typeof LANGUAGES)[number]["code"];

interface PasswordInputProps {
    disabled: boolean;
    register: ReturnType<typeof useLogin>["register"];
    error?: string;
}

function PasswordInput({ disabled, register, error }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="position-relative">
            <input
                {...register("password", { required: "Vui lòng nhập mật khẩu" })}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                className={`form-control pe-5 ${error ? "is-invalid" : ""}`}
                disabled={disabled}
            />
            <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
                <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"} />
            </button>
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
}

interface LanguageSelectorProps {
    selected: LanguageCode;
    onChange: (code: LanguageCode) => void;
}

function LanguageSelector({ selected, onChange }: LanguageSelectorProps) {
    return (
        <div className="row g-2 mt-4">
            {LANGUAGES.map((lang) => (
                <div className="col-4" key={lang.code}>
                    <button
                        type="button"
                        className={`lang-box ${selected === lang.code ? "active" : ""}`}
                        onClick={() => onChange(lang.code)}
                    >
                        {lang.label}
                    </button>
                </div>
            ))}
        </div>
    );
}

export default function Login() {
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("vi");

    const {
        register,
        errors,
        onSubmit,
        isSubmitting,
        providers,
        providersLoading,
        providersError,
        selectedProviderId,
        isDisabled,
    } = useLogin();

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
                            <div className="bg-overlay" />
                        </div>

                        <div className="col-lg-7 bg-white p-4 p-md-5">
                            <div className="text-center mb-4">
                                <h4 className="text-primary fw-bold">Đăng nhập hệ thống HDDT</h4>
                                <p className="text-muted small">전자세금계산서 시스템 로그인</p>
                            </div>

                            <div className="info-box mb-3">
                                <strong>Thông tin kết nối (연결 정보):</strong>
                                <br />
                                Thông tin này sau khi ký hợp đồng sử dụng HDDT sẽ được nhà cung
                                cấp gửi cho khách hàng.
                            </div>

                            <form onSubmit={onSubmit} noValidate>
                                <div className="row">

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label" htmlFor="username">Tài khoản</label>
                                        <input
                                            {...register("username", { required: "Vui lòng nhập tài khoản" })}
                                            id="username"
                                            className={`form-control ${errors.username ? "is-invalid" : ""}`}
                                            placeholder="Nhập tài khoản"
                                            disabled={isDisabled}
                                        />
                                        {errors.username && (
                                            <div className="invalid-feedback">{errors.username.message}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label" htmlFor="password">Mật khẩu</label>
                                        <PasswordInput
                                            register={register}
                                            disabled={isDisabled}
                                            error={errors.password?.message}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label" htmlFor="maDvcs">Mã số thuế</label>
                                        <input
                                            {...register("maDvcs")}
                                            id="maDvcs"
                                            className="form-control"
                                            placeholder="Nhập mã số thuế của bạn"
                                            disabled={isDisabled}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label" htmlFor="tenantId">EHoaDon</label>
                                        <input
                                            {...register("tenantId")}
                                            id="tenantId"
                                            className="form-control"
                                            placeholder="Nếu có"
                                            disabled={isDisabled}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label" htmlFor="providerId">Nhà cung cấp</label>
                                        <select
                                            {...register("providerId", { valueAsNumber: true })}
                                            id="providerId"
                                            className="form-select"
                                            value={selectedProviderId}
                                            disabled={isDisabled}
                                        >
                                            {providersLoading && <option value={0}>Đang tải...</option>}
                                            {providersError && <option value={0}>Lỗi tải dữ liệu</option>}
                                            {providers.map((p) => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label" htmlFor="url">Domain HDDT</label>
                                        <input
                                            {...register("url")}
                                            id="url"
                                            className="form-control"
                                            placeholder="https://..."
                                            disabled={isDisabled}
                                        />
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
                                        <label className="form-check-label" htmlFor="otpEmail">Email</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="otp"
                                            id="otpSms"
                                            value="sms"
                                        />
                                        <label className="form-check-label" htmlFor="otpSms">SMS</label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-2 fw-bold shadow-sm"
                                    disabled={isDisabled}
                                >
                                    {isSubmitting ? "Đang xử lý..." : "ĐĂNG NHẬP (로그인)"}
                                </button>
                            </form>

                            <LanguageSelector
                                selected={selectedLanguage}
                                onChange={setSelectedLanguage}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
