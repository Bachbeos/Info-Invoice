import { useState } from "react";
import { toast } from "react-toastify";
import invoiceService from "../services/invoice";
import { ApiError } from "../../../lib/apiClient";
import "./invoice-action.scss";
import type { ActionMode, IActionInvoiceRequest, IInvoiceDetail, IInvoiceRequest, IProductItem } from "../types/invoice";

interface PublicInvoiceProps {
    mode?: ActionMode;
    invoiceDetail?: IInvoiceDetail;
    onBack?: () => void;
}

export default function ActionInvoice({ mode: initialMode, invoiceDetail, onBack }: PublicInvoiceProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [actionMode] = useState<ActionMode>(initialMode ?? "add");
    const isViewMode = actionMode === "view";

    const [formData, setFormData] = useState<IInvoiceDetail>(() => {
        if (invoiceDetail) {
            return {
                ...invoiceDetail,
                items: invoiceDetail.items.map((item, index) => ({
                    ...item,
                    id: item.id ?? index + 1,
                })),
            };
        }

        return {
            id: 0,
            transactionId: crypto.randomUUID(),
            invRef: "",
            poNo: "",
            invSubTotal: 0,
            invVatRate: "",
            invVatAmount: 0,
            invDiscAmount: 0,
            invTotalAmount: 0,
            paidTp: "TM",
            note: "",
            hdNo: "0",
            createdDate: new Date().toISOString().split("T")[0],
            clsfNo: "1",
            spcfNo: "",
            templateCode: "",
            exchCd: "VND",
            exchRt: 1,
            bankAccount: "",
            bankName: "",
            invoiceType: 1,
            customer: {
                custCd: "",
                custNm: "",
                custCompany: "",
                taxCode: "",
                custCity: "",
                custDistrict: "",
                custAddrs: "",
                custPhone: "",
                custBankAccount: "",
                custBankName: "",
                email: "",
                emailCc: "",
            },
            items: [
                {
                    id: 1,
                    itmCd: "",
                    itmName: "",
                    itmKnd: "1",
                    unitNm: "",
                    qty: 1,
                    unprc: 0,
                    amt: 0,
                    discRate: 0,
                    discAmt: 0,
                    vatRt: "10",
                    vatAmt: 0,
                    totalAmt: 0,
                },
            ],
        } as IInvoiceDetail;
    });

    const invoiceInfo = formData;
    const customer = invoiceInfo.customer;
    const products = invoiceInfo.items;

    const setInvoiceInfo = (next: IInvoiceDetail) => {
        setFormData(next);
    };

    const setCustomer = (next: IInvoiceDetail["customer"]) => {
        setFormData((prev) => ({ ...prev, customer: next }));
    };

    const addRow = () => {
        const nextId = products.reduce((max, item) => Math.max(max, item.id ?? 0), 0) + 1;
        const nextItem: IProductItem = {
            id: nextId,
            itmCd: "",
            itmName: "",
            itmKnd: "1",
            unitNm: "",
            qty: 1,
            unprc: 0,
            amt: 0,
            discRate: 0,
            discAmt: 0,
            vatRt: "10",
            vatAmt: 0,
            totalAmt: 0,
        };

        setFormData((prev) => ({ ...prev, items: [...prev.items, nextItem] }));
    };

    const removeRow = (id?: number) => {
        if (!id || products.length <= 1) return;
        setFormData((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }));
    };

    const updateProduct = (id: number | undefined, field: keyof IProductItem, value: string | number) => {
        if (!id) return;

        const nextItems = products.map((item) => {
            if (item.id !== id) return item;

            const nextItem = { ...item, [field]: value } as IProductItem;
            if (["qty", "unprc", "discAmt", "vatRt"].includes(field)) {
                const amt = nextItem.qty * nextItem.unprc - nextItem.discAmt;
                const vatRate = parseFloat(nextItem.vatRt) || 0;
                const vatAmt = vatRate > 0 ? (amt * vatRate) / 100 : 0;

                nextItem.amt = amt;
                nextItem.vatAmt = vatAmt;
                nextItem.totalAmt = amt + vatAmt;
            }

            return nextItem;
        });

        setFormData((prev) => ({ ...prev, items: nextItems }));
    };

    const calculateTotals = () => {
        const subTotal = products.reduce((sum, item) => sum + (item.qty * item.unprc - item.discAmt), 0);
        const totalVat = products.reduce((sum, item) => sum + item.vatAmt, 0);
        const totalAmount = subTotal + totalVat - invoiceInfo.invDiscAmount;
        return { subTotal, totalVat, totalAmount };
    };

    const { subTotal, totalVat, totalAmount } = calculateTotals();

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const hdNoNumber = invoiceInfo.hdNo === "" ? null : Number(invoiceInfo.hdNo);
            const payload: IInvoiceRequest = {
                transactionId: invoiceInfo.transactionId,
                invRef: invoiceInfo.invRef,
                poNo: invoiceInfo.poNo,
                invSubTotal: subTotal,
                invVatRate: invoiceInfo.invVatRate,
                invVatAmount: totalVat,
                invDiscAmount: invoiceInfo.invDiscAmount,
                invTotalAmount: totalAmount,
                paidTp: invoiceInfo.paidTp,
                note: invoiceInfo.note,
                hdNo: hdNoNumber !== null && Number.isNaN(hdNoNumber) ? null : hdNoNumber,
                createdDate: invoiceInfo.createdDate,
                clsfNo: invoiceInfo.clsfNo,
                spcfNo: invoiceInfo.spcfNo,
                templateCode: invoiceInfo.templateCode,
                exchCd: invoiceInfo.exchCd,
                exchRt: invoiceInfo.exchRt,
                bankAccount: invoiceInfo.bankAccount,
                bankName: invoiceInfo.bankName,
                customer: invoiceInfo.customer,
                products,
            };

            let res;
            if (actionMode === "add") {
                res = await invoiceService.add(payload);
            } else {
                if (!invoiceDetail?.transactionId) {
                    toast.error("Thiếu transactionIdOld để cập nhật hóa đơn");
                    return;
                }

                const updatePayload: IActionInvoiceRequest = {
                    ...payload,
                    transactionIdOld: invoiceDetail.transactionId,
                };
                res = await invoiceService.update(updatePayload);
            }

            if (res.code === 200) {
                toast.success(res.message || "Thao tác thành công");
                onBack?.();
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : "Lỗi kết nối");
        } finally {
            setIsLoading(false);
        }
    };

    const fmt = (n: number) => n.toLocaleString("vi-VN");

    return (
        <div className="invoice-container container my-4">
            <div className="inv-header d-flex justify-content-between align-items-center mb-4 mt-4">
                <div className="d-flex align-items-center gap-3">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onBack}>
                        <i className="ri-arrow-left-line me-1" /> Quay lại
                    </button>
                    <h3 className="mb-0">
                        {isViewMode
                            ? "Chi Tiết Hóa Đơn"
                            : actionMode === "add"
                                ? "Thêm Mới Hóa Đơn"
                                : "Cập Nhật Hóa Đơn"
                        }
                    </h3>
                </div>
            </div>

            <fieldset disabled={isViewMode}>
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
                                    value={invoiceInfo.invVatRate ?? ""}
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
                                    value={customer.emailCc}
                                    onChange={(e) =>
                                        setCustomer({ ...customer, emailCc: e.target.value })
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
                                    value={customer.custDistrict}
                                    onChange={(e) =>
                                        setCustomer({ ...customer, custDistrict: e.target.value })
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
                                                            updateProduct(p.id, "itmKnd", e.target.value)
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

            <div className="d-flex justify-content-end gap-2 mt-4">
                {isViewMode ? (
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-lg px-5"
                        onClick={onBack}
                    >
                        ĐÓNG
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-lg px-5"
                            onClick={onBack}
                        >
                            HỦY
                        </button>
                        <button
                            className="btn btn-primary btn-lg px-5"
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading
                                ? "Đang xử lý..."
                                : actionMode === "add"
                                    ? "THÊM MỚI HÓA ĐƠN"
                                    : "CẬP NHẬT HÓA ĐƠN"
                            }
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}