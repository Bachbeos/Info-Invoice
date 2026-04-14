import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import invoiceService from "../services/invoice";
import { ApiError } from "../../../lib/apiClient";
import "./invoice-action.scss";

export type ActionMode = "issue" | "replace" | "adjust" | "view";

interface PublicInvoiceProps {
    mode?: ActionMode;
    invoiceDetail?: {
        id?: number;
        transactionId?: string;
        transactionID?: string;
        invoiceNo?: string;
        invRef?: string;
        poNo?: string;
        paidTp?: string;
        clsfNo?: string;
        spcfNo?: string;
        templateCode?: string;
        hdNo?: number | null;
        createdDate?: string;
        exchCd?: string;
        exchRt?: number;
        bankAccount?: string;
        bankName?: string;
        invDiscAmount?: number;
        invVatRate?: string | null;
        note?: string;
        customer?: {
            custCd?: string;
            custNm?: string;
            custCompany?: string;
            taxCode?: string;
            custCity?: string;
            custDistrictName?: string;
            custAddrs?: string;
            custPhone?: string;
            custBankAccount?: string;
            custBankName?: string;
            email?: string;
            emailCC?: string;
        };
        products?: Array<{
            itmCd?: string;
            itmName?: string;
            itmKnd?: number;
            unitNm?: string;
            qty?: number;
            unprc?: number;
            discRate?: number;
            discAmt?: number;
            vatRt?: string;
        }>;
    };
    onBack?: () => void;
}

interface ProductItem {
    id: string;
    itmCd: string;
    itmName: string;
    itmKnd: number;
    unitNm: string;
    qty: number;
    unprc: number;
    discRate: number;
    discAmt: number;
    vatRt: string;
}

export default function ActionInvoice({ mode: initialMode, invoiceDetail, onBack }: PublicInvoiceProps) {
    const [transactionID] = useState(crypto.randomUUID());
    const [actionMode, setActionMode] = useState<ActionMode>(
        initialMode ?? "issue",
    );
    const [transactionIdOld] = useState(
        (initialMode === "replace" || initialMode === "adjust")
            ? (invoiceDetail?.transactionId ?? invoiceDetail?.transactionID ?? "")
            : ""
    );
    const isViewMode = actionMode === "view";

    const [invoiceInfo, setInvoiceInfo] = useState({
        invRef: "",
        poNo: "",
        paidTp: "TM",
        clsfNo: "1",
        spcfNo: "",
        templateCode: "",
        hdNo: "",
        createdDate: new Date().toISOString().split("T")[0],
        exchCd: "VND",
        exchRt: 1,
        bankAccount: "",
        bankName: "",
        invDiscAmount: 0,
        note: "",
        invVatRate: "",
    });

    const [customer, setCustomer] = useState({
        custCd: "",
        custNm: "",
        custCompany: "",
        taxCode: "",
        custCity: "",
        custDistrictName: "",
        custAddrs: "",
        custPhone: "",
        custBankAccount: "",
        custBankName: "",
        email: "",
        emailCC: "",
    });

    const [products, setProducts] = useState<ProductItem[]>(() => [
        {
            id: Date.now().toString(),
            itmCd: "",
            itmName: "",
            itmKnd: 1,
            unitNm: "",
            qty: 1,
            unprc: 0,
            discRate: 0,
            discAmt: 0,
            vatRt: "10",
        },
    ]);

    const [isLoading, setIsLoading] = useState(false);

    // Prefill form từ invoiceDetail khi thay thế/điều chỉnh/xem
    useEffect(() => {
        if (!invoiceDetail || (initialMode !== "replace" && initialMode !== "adjust" && initialMode !== "view")) return;

        setInvoiceInfo({
            invRef: invoiceDetail.invRef ?? "",
            poNo: invoiceDetail.poNo ?? "",
            paidTp: invoiceDetail.paidTp ?? "TM",
            clsfNo: invoiceDetail.clsfNo ?? "1",
            spcfNo: invoiceDetail.spcfNo ?? "",
            templateCode: invoiceDetail.templateCode ?? "",
            hdNo: invoiceDetail.hdNo != null ? String(invoiceDetail.hdNo) : "",
            createdDate: invoiceDetail.createdDate
                ? invoiceDetail.createdDate.split("T")[0]
                : new Date().toISOString().split("T")[0],
            exchCd: invoiceDetail.exchCd ?? "VND",
            exchRt: invoiceDetail.exchRt ?? 1,
            bankAccount: invoiceDetail.bankAccount ?? "",
            bankName: invoiceDetail.bankName ?? "",
            invDiscAmount: invoiceDetail.invDiscAmount ?? 0,
            note: invoiceDetail.note ?? "",
            invVatRate: invoiceDetail.invVatRate != null ? String(invoiceDetail.invVatRate) : "",
        });

        if (invoiceDetail.customer) {
            setCustomer({
                custCd: invoiceDetail.customer.custCd ?? "",
                custNm: invoiceDetail.customer.custNm ?? "",
                custCompany: invoiceDetail.customer.custCompany ?? "",
                taxCode: invoiceDetail.customer.taxCode ?? "",
                custCity: invoiceDetail.customer.custCity ?? "",
                custDistrictName: invoiceDetail.customer.custDistrictName ?? "",
                custAddrs: invoiceDetail.customer.custAddrs ?? "",
                custPhone: invoiceDetail.customer.custPhone ?? "",
                custBankAccount: invoiceDetail.customer.custBankAccount ?? "",
                custBankName: invoiceDetail.customer.custBankName ?? "",
                email: invoiceDetail.customer.email ?? "",
                emailCC: invoiceDetail.customer.emailCC ?? "",
            });
        }

        if (invoiceDetail.products && invoiceDetail.products.length > 0) {
            setProducts(
                invoiceDetail.products.map((p, idx) => ({
                    id: `prefill-${idx}-${Date.now()}`,
                    itmCd: p.itmCd ?? "",
                    itmName: p.itmName ?? "",
                    itmKnd: p.itmKnd ?? 1,
                    unitNm: p.unitNm ?? "",
                    qty: p.qty ?? 1,
                    unprc: p.unprc ?? 0,
                    discRate: p.discRate ?? 0,
                    discAmt: p.discAmt ?? 0,
                    vatRt: p.vatRt != null ? String(p.vatRt) : "10",
                }))
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const calculateSummary = () => {
        let subTotal = 0;
        let totalVat = 0;
        products.forEach((p) => {
            const amt = p.qty * p.unprc - p.discAmt;
            subTotal += amt;
            const vatRtNum = parseFloat(p.vatRt);
            if (vatRtNum > 0) totalVat += amt * (vatRtNum / 100);
        });
        const totalAmount = subTotal + totalVat - invoiceInfo.invDiscAmount;
        return { subTotal, totalVat, totalAmount };
    };

    const { subTotal, totalVat, totalAmount } = calculateSummary();

    const addRow = () => {
        setProducts([
            ...products,
            {
                id: Date.now().toString(),
                itmCd: "",
                itmName: "",
                itmKnd: 1,
                unitNm: "Cái",
                qty: 1,
                unprc: 0,
                discRate: 0,
                discAmt: 0,
                vatRt: "10",
            },
        ]);
    };

    const removeRow = (id: string) => {
        if (products.length > 1) setProducts(products.filter((p) => p.id !== id));
    };

    const updateProduct = (id: string, field: keyof ProductItem, value: string | number) => {
        setProducts(
            products.map((p) => {
                if (p.id !== id) return p;
                const updated = { ...p, [field]: value };
                if (field === "discRate") {
                    const numericValue = Number(value) || 0;
                    const amt = updated.qty * updated.unprc;
                    updated.discAmt = Math.round((amt * numericValue) / 100);
                }
                if (field === "discAmt") {
                    const numericValue = Number(value) || 0;
                    const amt = updated.qty * updated.unprc;
                    updated.discRate =
                        amt > 0 ? parseFloat(((numericValue / amt) * 100).toFixed(2)) : 0;
                }
                return updated;
            }),
        );
    };

    const handleSubmit = async () => {
        const finalProducts = products.map((p) => {
            const amt = p.qty * p.unprc - p.discAmt;
            const vatRtNum = parseFloat(p.vatRt);
            const vatAmt = vatRtNum <= 0 ? 0 : amt * (vatRtNum / 100);
            return {
                itmCd: p.itmCd || `PROD-${p.id.slice(-4)}`,
                itmName: p.itmName,
                itmKnd: p.itmKnd,
                unitNm: p.unitNm,
                qty: p.qty,
                unprc: p.unprc,
                amt,
                discRate: p.discRate,
                discAmt: p.discAmt,
                vatRt: p.vatRt,
                vatAmt: parseFloat(vatAmt.toFixed(0)),
                totalAmt: parseFloat((amt + vatAmt).toFixed(0)),
            };
        });

        const basePayload = {
            invRef: invoiceInfo.invRef,
            poNo: invoiceInfo.poNo,
            invSubTotal: subTotal,
            invVatRate: invoiceInfo.invVatRate || null,
            invVatAmount: totalVat,
            invDiscAmount: invoiceInfo.invDiscAmount,
            invTotalAmount: totalAmount,
            paidTp: invoiceInfo.paidTp,
            note: invoiceInfo.note,
            hdNo: invoiceInfo.hdNo,
            createdDate: invoiceInfo.createdDate,
            clsfNo: invoiceInfo.clsfNo,
            spcfNo: invoiceInfo.spcfNo,
            templateCode: invoiceInfo.templateCode,
            exchCd: invoiceInfo.exchCd,
            exchRt: invoiceInfo.exchRt,
            bankAccount: invoiceInfo.bankAccount,
            bankName: invoiceInfo.bankName,
            customer,
            products: finalProducts,
        };

        setIsLoading(true);

        try {
            if (actionMode === "issue") {
                const payload = { ...basePayload, transactionId: transactionID, hdNo: invoiceInfo.hdNo ? Number(invoiceInfo.hdNo) : null };

                const res = await invoiceService.issue(payload);

                if (res.code === 200) {
                    toast.success(
                        `Phát hành thành công! Số HĐ: ${res.data?.invoiceNo || "(chờ cấp)"} — Ngày: ${res.data?.invDate || ""}`
                    );
                } else {
                    toast.error(`Lỗi ${res.code}: ${res.message}`);
                }

            } else if (actionMode === "replace" || actionMode === "adjust") {
                if (!transactionIdOld) {
                    toast.error("Vui lòng chọn hóa đơn gốc!");
                    setIsLoading(false);
                    return;
                }

                const payload = {
                    ...basePayload,
                    transactionId: transactionID,
                    hdNo: invoiceInfo.hdNo ? Number(invoiceInfo.hdNo) : null,
                    transactionIdOld
                };

                const res = actionMode === "replace"
                    ? await invoiceService.replace(payload)
                    : await invoiceService.adjust(payload);

                if (res.code === 200) {
                    toast.success(res.message || `${actionMode === "replace" ? "Thay thế" : "Điều chỉnh"} hóa đơn thành công!`);
                } else {
                    toast.error(`Lỗi ${res.code}: ${res.message}`);
                }
            }
        } catch (err) {
            if (err instanceof ApiError) {
                toast.error(`Lỗi hệ thống (${err.status}): ${err.message}`);
            } else {
                console.error("Submit Error:", err);
                toast.error("Không thể kết nối tới server. Vui lòng kiểm tra lại đường truyền.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fmt = (n: number) => n.toLocaleString("vi-VN");

    return (
        <div className="invoice-container container my-4">
            {/* Header */}
            <div className="inv-header d-flex justify-content-between align-items-center mb-4 mt-4">
                <div className="d-flex align-items-center gap-3">
                    {onBack && (
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={onBack}
                        >
                            <i className="ri-arrow-left-line me-1" />
                            Quay lại
                        </button>
                    )}
                    <h3 className="mb-0">
                        <span className="brand-text">DAEWOO</span>
                        <span className="separator">|</span>
                        {actionMode === "issue" && "Phát hành Hóa đơn Điện tử"}
                        {actionMode === "replace" && "Thay thế Hóa đơn"}
                        {actionMode === "adjust" && "Điều chỉnh Hóa đơn"}
                        {actionMode === "view" && "Xem chi tiết Hóa đơn"}
                        {(actionMode === "replace" || actionMode === "adjust") && invoiceDetail?.invoiceNo && (
                            <span className="badge bg-warning text-dark ms-2 fs-6">
                                #{invoiceDetail.invoiceNo}
                            </span>
                        )}
                    </h3>
                </div>
                <div className="d-flex align-items-center gap-3">
                    {!initialMode && (
                        <div className="btn-group shadow-sm" role="group">
                            <input
                                type="radio"
                                className="btn-check"
                                name="actionMode"
                                id="btnradio1"
                                autoComplete="off"
                                checked={actionMode === "issue"}
                                onChange={() => setActionMode("issue")}
                            />
                            <label className="btn btn-outline-primary" htmlFor="btnradio1">
                                Phát hành
                            </label>

                            <input
                                type="radio"
                                className="btn-check"
                                name="actionMode"
                                id="btnradio2"
                                autoComplete="off"
                                checked={actionMode === "replace"}
                                onChange={() => setActionMode("replace")}
                            />
                            <label className="btn btn-outline-primary" htmlFor="btnradio2">
                                Thay thế
                            </label>

                            <input
                                type="radio"
                                className="btn-check"
                                name="actionMode"
                                id="btnradio3"
                                autoComplete="off"
                                checked={actionMode === "adjust"}
                                onChange={() => setActionMode("adjust")}
                            />
                            <label className="btn btn-outline-primary" htmlFor="btnradio3">
                                Điều chỉnh
                            </label>
                        </div>
                    )}
                </div>
            </div>

            {isViewMode && (
                <div className="alert alert-info py-2 mb-3" role="alert">
                    Chế độ xem chi tiết: không thể chỉnh sửa dữ liệu hóa đơn.
                </div>
            )}

            <fieldset disabled={isViewMode}>

                {/*Thông tin Hóa đơn */}
                <div className="card inv-card mb-4">
                    <div className="card-header inv-card-header">
                        <span>
                            <i className="ri-file-text-line me-2" />
                            Thông tin Hóa đơn
                        </span>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label small">
                                    Mã đơn hàng / Số chứng từ
                                </label>
                                <input
                                    className="form-control"
                                    placeholder="Nhập mã đơn hàng/số chứng từ"
                                    value={invoiceInfo.invRef}
                                    onChange={(e) =>
                                        setInvoiceInfo({ ...invoiceInfo, invRef: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small">Số đơn hàng</label>
                                <input
                                    className="form-control"
                                    placeholder="Nhập số đơn hàng"
                                    value={invoiceInfo.poNo}
                                    onChange={(e) =>
                                        setInvoiceInfo({ ...invoiceInfo, poNo: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label small">Ngày phát hành</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={invoiceInfo.createdDate}
                                    onChange={(e) =>
                                        setInvoiceInfo({ ...invoiceInfo, createdDate: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label small">
                                    Phương thức thanh toán
                                </label>
                                <select
                                    className="form-select"
                                    required
                                    value={invoiceInfo.paidTp}
                                    onChange={(e) =>
                                        setInvoiceInfo({ ...invoiceInfo, paidTp: e.target.value })
                                    }
                                >
                                    <option value="TM">Tiền mặt</option>
                                    <option value="CK">Chuyển khoản</option>
                                    <option value="TM/CK">Tiền mặt/Chuyển khoản</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label className="form-label small">Số hóa đơn</label>
                                <input
                                    className="form-control"
                                    placeholder="Nhập số hóa đơn"
                                    value={invoiceInfo.hdNo}
                                    onChange={(e) =>
                                        setInvoiceInfo({ ...invoiceInfo, hdNo: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label small">
                                    Mẫu số hóa đơn
                                </label>
                                <input
                                    className="form-control"
                                    required
                                    placeholder="Nhập mẫu số hóa đơn"
                                    value={invoiceInfo.clsfNo}
                                    onChange={(e) =>
                                        setInvoiceInfo({ ...invoiceInfo, clsfNo: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label small">
                                    Ký hiệu hóa đơn
                                </label>
                                <input
                                    className="form-control"
                                    required
                                    placeholder="Nhập ký hiệu hóa đơn"
                                    value={invoiceInfo.spcfNo}
                                    onChange={(e) =>
                                        setInvoiceInfo({ ...invoiceInfo, spcfNo: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label small">Ký hiệu mẫu hóa đơn</label>
                                <input
                                    className="form-control"
                                    placeholder="Chỉ dùng SInvoice"
                                    value={invoiceInfo.templateCode}
                                    onChange={(e) =>
                                        setInvoiceInfo({ ...invoiceInfo, templateCode: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label small">
                                    Thuế suất trên hóa đơn
                                </label>
                                <select
                                    className="form-select"
                                    value={invoiceInfo.invVatRate}
                                    onChange={(e) =>
                                        setInvoiceInfo({ ...invoiceInfo, invVatRate: e.target.value })
                                    }
                                >
                                    <option value="">Nhiều thuế suất</option>
                                    <option value="0">0%</option>
                                    <option value="8">8%</option>
                                    <option value="10">10%</option>
                                    <option value="-1">Không chịu thuế</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label className="form-label small">Loại tiền</label>
                                <input
                                    className="form-control"
                                    value={invoiceInfo.exchCd}
                                    readOnly
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label small">Tỷ giá</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={invoiceInfo.exchRt}
                                    onChange={(e) =>
                                        setInvoiceInfo({ ...invoiceInfo, exchRt: +e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small">Tài khoản ngân hàng bên bán</label>
                                <input
                                    className="form-control"
                                    placeholder="Nhập số tài khoản"
                                    value={invoiceInfo.bankAccount}
                                    onChange={(e) =>
                                        setInvoiceInfo({ ...invoiceInfo, bankAccount: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small">Ngân hàng bên bán</label>
                                <input
                                    className="form-control"
                                    placeholder="Nhập tên ngân hàng"
                                    value={invoiceInfo.bankName}
                                    onChange={(e) =>
                                        setInvoiceInfo({ ...invoiceInfo, bankName: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small">Ghi chú</label>
                                <input
                                    className="form-control"
                                    placeholder="Nhập ghi chú"
                                    value={invoiceInfo.note}
                                    onChange={(e) =>
                                        setInvoiceInfo({ ...invoiceInfo, note: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Thông tin Khách hàng */}
                <div className="card inv-card mb-4">
                    <div className="card-header inv-card-header">
                        <span>
                            <i className="ri-user-3-line me-2" />
                            Thông tin Người mua
                        </span>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label small">Mã khách hàng</label>
                                <input
                                    className="form-control"
                                    placeholder="Nhập mã khách hàng"
                                    required
                                    value={customer.custCd}
                                    onChange={(e) =>
                                        setCustomer({ ...customer, custCd: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small">Tên khách hàng</label>
                                <input
                                    className="form-control"
                                    placeholder="Nhập tên khách hàng"
                                    required
                                    value={customer.custNm}
                                    onChange={(e) =>
                                        setCustomer({ ...customer, custNm: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small">Tên công ty</label>
                                <input
                                    className="form-control"
                                    placeholder="Nhập tên công ty"
                                    value={customer.custCompany}
                                    onChange={(e) =>
                                        setCustomer({ ...customer, custCompany: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small">Mã số thuế</label>
                                <input
                                    className="form-control"
                                    placeholder="Nhập mã số thuế"
                                    required
                                    value={customer.taxCode}
                                    onChange={(e) =>
                                        setCustomer({ ...customer, taxCode: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small">Số điện thoại</label>
                                <input
                                    className="form-control"
                                    placeholder="Nhập số điện thoại"
                                    required
                                    value={customer.custPhone}
                                    onChange={(e) =>
                                        setCustomer({ ...customer, custPhone: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small">Email nhận hóa đơn</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Nhập địa chỉ email"
                                    value={customer.email}
                                    onChange={(e) =>
                                        setCustomer({ ...customer, email: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small">Email nhận bản sao</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Nhập địa chỉ email"
                                    value={customer.emailCC}
                                    onChange={(e) =>
                                        setCustomer({ ...customer, emailCC: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small">Thành phố / Tỉnh</label>
                                <input
                                    className="form-control"
                                    placeholder="Nhập thành phố / tỉnh"
                                    value={customer.custCity}
                                    onChange={(e) =>
                                        setCustomer({ ...customer, custCity: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small">Quận / Huyện</label>
                                <input
                                    className="form-control"
                                    placeholder="Nhập quận / huyện"
                                    value={customer.custDistrictName}
                                    onChange={(e) =>
                                        setCustomer({ ...customer, custDistrictName: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small">Địa chỉ</label>
                                <input
                                    className="form-control"
                                    placeholder="Nhập địa chỉ"
                                    value={customer.custAddrs}
                                    onChange={(e) =>
                                        setCustomer({ ...customer, custAddrs: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small">Tài khoản ngân hàng bên mua</label>
                                <input
                                    className="form-control"
                                    placeholder="Nhập tài khoản ngân hàng"
                                    value={customer.custBankAccount}
                                    onChange={(e) =>
                                        setCustomer({ ...customer, custBankAccount: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small">Ngân hàng bên mua</label>
                                <input
                                    className="form-control"
                                    placeholder="Nhập tên ngân hàng"
                                    value={customer.custBankName}
                                    onChange={(e) =>
                                        setCustomer({ ...customer, custBankName: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* III. Chi tiết Sản phẩm */}
                <div className="card inv-card mb-4">
                    <div className="card-header inv-card-header d-flex justify-content-between align-items-center">
                        <span>
                            <i className="ri-list-check me-2" />
                            Chi tiết Sản phẩm / Dịch vụ
                        </span>
                        {!isViewMode && (
                            <button className="btn btn-sm btn-add-row" onClick={addRow}>
                                <i className="ri-add-line me-1" />
                                Thêm dòng
                            </button>
                        )}
                    </div>
                    <div className="p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0 inv-table">
                                <thead>
                                    <tr className="small text-center">
                                        <th style={{ width: "4%" }}>STT</th>
                                        <th style={{ width: "8%" }}>Mã hàng</th>
                                        <th style={{ width: "22%" }}>Tên hàng / Dịch vụ</th>
                                        <th style={{ width: "7%" }}>Loại</th>
                                        <th style={{ width: "6%" }}>Đơn vị tính</th>
                                        <th style={{ width: "7%" }}>Số lượng</th>
                                        <th style={{ width: "12%" }}>Đơn giá</th>
                                        <th style={{ width: "10%" }}>Thành tiền</th>
                                        <th style={{ width: "7%" }}>Tỉ lệ chiết khấu (%)</th>
                                        <th style={{ width: "9%" }}>Tiền chiết khấu</th>
                                        <th style={{ width: "7%" }}>Thuế</th>
                                        <th style={{ width: "9%" }}>Tiền thuế</th>
                                        <th style={{ width: "4%" }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p, idx) => {
                                        const amt = p.qty * p.unprc - p.discAmt;
                                        const vatRtNum = parseFloat(p.vatRt);
                                        const vatAmt = vatRtNum <= 0 ? 0 : amt * (vatRtNum / 100);
                                        return (
                                            <tr key={p.id} className="align-middle text-center">
                                                <td className="text-muted small">{idx + 1}</td>
                                                <td>
                                                    <input
                                                        className="form-control form-control-sm"
                                                        value={p.itmCd}
                                                        onChange={(e) =>
                                                            updateProduct(p.id, "itmCd", e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className="form-control form-control-sm"
                                                        value={p.itmName}
                                                        onChange={(e) =>
                                                            updateProduct(p.id, "itmName", e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={p.itmKnd}
                                                        onChange={(e) =>
                                                            updateProduct(p.id, "itmKnd", +e.target.value)
                                                        }
                                                    >
                                                        <option value={1}>Hàng hóa/Dịch vụ</option>
                                                        <option value={2}>Khuyến mãi</option>
                                                        <option value={3}>Chiết khấu</option>
                                                        <option value={4}>Ghi chú</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        className="form-control form-control-sm"
                                                        value={p.unitNm}
                                                        onChange={(e) =>
                                                            updateProduct(p.id, "unitNm", e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        value={p.qty}
                                                        onChange={(e) =>
                                                            updateProduct(p.id, "qty", +e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        value={p.unprc}
                                                        onChange={(e) =>
                                                            updateProduct(p.id, "unprc", +e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td className="cell-readonly">{fmt(p.qty * p.unprc)}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        value={p.discRate}
                                                        onChange={(e) =>
                                                            updateProduct(p.id, "discRate", +e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        value={p.discAmt}
                                                        onChange={(e) =>
                                                            updateProduct(p.id, "discAmt", +e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={p.vatRt}
                                                        onChange={(e) =>
                                                            updateProduct(p.id, "vatRt", e.target.value)
                                                        }
                                                    >
                                                        <option value="0">0%</option>
                                                        <option value="5">5%</option>
                                                        <option value="8">8%</option>
                                                        <option value="10">10%</option>
                                                        <option value="-1">KCT</option>
                                                    </select>
                                                </td>
                                                <td className="cell-readonly text-primary">
                                                    {fmt(vatAmt)}
                                                </td>
                                                <td>
                                                    {!isViewMode && (
                                                        <button
                                                            className="btn btn-link text-danger p-0"
                                                            onClick={() => removeRow(p.id)}
                                                        >
                                                            <i className="ri-delete-bin-line" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* IV. Tổng kết */}
                <div className="card inv-card mb-4">
                    <div className="card-header inv-card-header">
                        <i className="ri-calculator-line me-2" />
                        Tổng kết
                    </div>
                    <div className="card-body">
                        <div className="row g-3 justify-content-end">
                            <div className="col-md-3">
                                <label className="form-label small">Tổng tiền hàng</label>
                                <input
                                    className="form-control bg-light text-end fw-semibold"
                                    value={fmt(subTotal)}
                                    readOnly
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small">Chiết khấu tổng HĐ</label>
                                <input
                                    type="number"
                                    className="form-control text-end"
                                    value={invoiceInfo.invDiscAmount}
                                    onChange={(e) =>
                                        setInvoiceInfo({
                                            ...invoiceInfo,
                                            invDiscAmount: +e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small">Tổng tiền thuế</label>
                                <input
                                    className="form-control bg-light text-end fw-semibold text-primary"
                                    value={fmt(totalVat)}
                                    readOnly
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label small fw-bold">
                                    TỔNG CỘNG THANH TOÁN
                                </label>
                                <input
                                    className="form-control total-amount text-end fw-bold"
                                    value={fmt(totalAmount)}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>

            {/* Submit */}
            {!isViewMode && (
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button
                        className="btn btn-publish btn-lg px-5"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <i className="ri-send-plane-fill me-2" />
                                {actionMode === "issue" && "PHÁT HÀNH HÓA ĐƠN"}
                                {actionMode === "replace" && "THAY THẾ HÓA ĐƠN"}
                                {actionMode === "adjust" && "ĐIỀU CHỈNH HÓA ĐƠN"}
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
