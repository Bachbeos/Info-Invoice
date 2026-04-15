import React from "react";
import type { IInvoiceDetail, IProductItem } from "../types/invoice";

export const fmt = (n: number) => (n || 0).toLocaleString("vi-VN");

interface SectionProps {
    data: IInvoiceDetail;
    onChange: (updates: Partial<IInvoiceDetail>) => void;
    isViewMode?: boolean;
}

export const InvoiceInfoSection: React.FC<SectionProps> = ({ data, onChange, isViewMode }) => (
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
                    <label className="form-label small">Mã đơn hàng / Số chứng từ</label>
                    <input
                        className="form-control"
                        placeholder="Nhập mã đơn hàng/số chứng từ"
                        value={data.invRef || ""}
                        onChange={(e) => onChange({ invRef: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label small">Số đơn hàng</label>
                    <input
                        className="form-control"
                        placeholder="Nhập số đơn hàng"
                        value={data.poNo || ""}
                        onChange={(e) => onChange({ poNo: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-2">
                    <label className="form-label small">Ngày phát hành</label>
                    <input
                        type="date"
                        className="form-control"
                        value={data.createdDate || ""}
                        onChange={(e) => onChange({ createdDate: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-2">
                    <label className="form-label small">Phương thức thanh toán</label>
                    <select
                        className="form-select"
                        required
                        value={data.paidTp || "TM"}
                        onChange={(e) => onChange({ paidTp: e.target.value })}
                        disabled={isViewMode}
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
                        value={data.hdNo || ""}
                        onChange={(e) => onChange({ hdNo: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-2">
                    <label className="form-label small">Mẫu số hóa đơn</label>
                    <input
                        className="form-control"
                        required
                        placeholder="Nhập mẫu số hóa đơn"
                        value={data.clsfNo || ""}
                        onChange={(e) => onChange({ clsfNo: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-2">
                    <label className="form-label small">Ký hiệu hóa đơn</label>
                    <input
                        className="form-control"
                        required
                        placeholder="Nhập ký hiệu hóa đơn"
                        value={data.spcfNo || ""}
                        onChange={(e) => onChange({ spcfNo: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-2">
                    <label className="form-label small">Ký hiệu mẫu hóa đơn</label>
                    <input
                        className="form-control"
                        placeholder="Chỉ dùng SInvoice"
                        value={data.templateCode || ""}
                        onChange={(e) => onChange({ templateCode: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-2">
                    <label className="form-label small">Thuế suất trên hóa đơn</label>
                    <select
                        className="form-select"
                        value={data.invVatRate ?? ""}
                        onChange={(e) => onChange({ invVatRate: e.target.value })}
                        disabled={isViewMode}
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
                    <input className="form-control" value={data.exchCd || "VND"} readOnly disabled={isViewMode} />
                </div>
                <div className="col-md-2">
                    <label className="form-label small">Tỷ giá</label>
                    <input
                        type="number"
                        className="form-control"
                        value={data.exchRt || 1}
                        onChange={(e) => onChange({ exchRt: +e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label small">Tài khoản ngân hàng bên bán</label>
                    <input
                        className="form-control"
                        placeholder="Nhập số tài khoản"
                        value={data.bankAccount || ""}
                        onChange={(e) => onChange({ bankAccount: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label small">Ngân hàng bên bán</label>
                    <input
                        className="form-control"
                        placeholder="Nhập tên ngân hàng"
                        value={data.bankName || ""}
                        onChange={(e) => onChange({ bankName: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label small">Ghi chú</label>
                    <input
                        className="form-control"
                        placeholder="Nhập ghi chú"
                        value={data.note || ""}
                        onChange={(e) => onChange({ note: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
            </div>
        </div>
    </div>
);

interface CustomerSectionProps {
    customer: IInvoiceDetail["customer"];
    onChange: (updates: Partial<IInvoiceDetail["customer"]>) => void;
    isViewMode?: boolean;
}

export const CustomerInfoSection: React.FC<CustomerSectionProps> = ({ customer, onChange, isViewMode }) => (
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
                        value={customer.custCd || ""}
                        onChange={(e) => onChange({ custCd: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label small">Tên khách hàng</label>
                    <input
                        className="form-control"
                        placeholder="Nhập tên khách hàng"
                        required
                        value={customer.custNm || ""}
                        onChange={(e) => onChange({ custNm: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label small">Tên công ty</label>
                    <input
                        className="form-control"
                        placeholder="Nhập tên công ty"
                        value={customer.custCompany || ""}
                        onChange={(e) => onChange({ custCompany: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label small">Mã số thuế</label>
                    <input
                        className="form-control"
                        placeholder="Nhập mã số thuế"
                        required
                        value={customer.taxCode || ""}
                        onChange={(e) => onChange({ taxCode: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label small">Số điện thoại</label>
                    <input
                        className="form-control"
                        placeholder="Nhập số điện thoại"
                        required
                        value={customer.custPhone || ""}
                        onChange={(e) => onChange({ custPhone: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label small">Email nhận hóa đơn</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Nhập địa chỉ email"
                        value={customer.email || ""}
                        onChange={(e) => onChange({ email: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label small">Email nhận bản sao</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Nhập địa chỉ email"
                        value={customer.emailCc || ""}
                        onChange={(e) => onChange({ emailCc: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label small">Thành phố / Tỉnh</label>
                    <input
                        className="form-control"
                        placeholder="Nhập thành phố / tỉnh"
                        value={customer.custCity || ""}
                        onChange={(e) => onChange({ custCity: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label small">Quận / Huyện</label>
                    <input
                        className="form-control"
                        placeholder="Nhập quận / huyện"
                        value={customer.custDistrict || ""}
                        onChange={(e) => onChange({ custDistrict: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label small">Địa chỉ</label>
                    <input
                        className="form-control"
                        placeholder="Nhập địa chỉ"
                        value={customer.custAddrs || ""}
                        onChange={(e) => onChange({ custAddrs: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label small">Tài khoản ngân hàng bên mua</label>
                    <input
                        className="form-control"
                        placeholder="Nhập tài khoản ngân hàng"
                        value={customer.custBankAccount || ""}
                        onChange={(e) => onChange({ custBankAccount: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label small">Ngân hàng bên mua</label>
                    <input
                        className="form-control"
                        placeholder="Nhập tên ngân hàng"
                        value={customer.custBankName || ""}
                        onChange={(e) => onChange({ custBankName: e.target.value })}
                        disabled={isViewMode}
                    />
                </div>
            </div>
        </div>
    </div>
);

interface ProductTableProps {
    products: IProductItem[];
    onUpdate: (id: number | undefined, field: keyof IProductItem, value: any) => void;
    onAdd: () => void;
    onRemove: (id: number | undefined) => void;
    isViewMode?: boolean;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onUpdate, onAdd, onRemove, isViewMode }) => (
    <div className="card inv-card mb-4">
        <div className="card-header inv-card-header d-flex justify-content-between align-items-center">
            <span>
                <i className="ri-list-check me-2" />
                Chi tiết Sản phẩm / Dịch vụ
            </span>
            {!isViewMode && (
                <button className="btn btn-sm btn-add-row" onClick={onAdd}>
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
                        {products.map((p, idx) => (
                            <tr key={p.id} className="align-middle text-center">
                                <td className="text-muted small">{idx + 1}</td>
                                <td>
                                    <input
                                        className="form-control form-control-sm"
                                        value={p.itmCd || ""}
                                        onChange={(e) => onUpdate(p.id, "itmCd", e.target.value)}
                                        disabled={isViewMode}
                                    />
                                </td>
                                <td>
                                    <input
                                        className="form-control form-control-sm"
                                        value={p.itmName || ""}
                                        onChange={(e) => onUpdate(p.id, "itmName", e.target.value)}
                                        disabled={isViewMode}
                                    />
                                </td>
                                <td>
                                    <select
                                        className="form-select form-select-sm"
                                        value={p.itmKnd || "1"}
                                        onChange={(e) => onUpdate(p.id, "itmKnd", e.target.value)}
                                        disabled={isViewMode}
                                    >
                                        <option value="1">Hàng hóa/Dịch vụ</option>
                                        <option value="2">Khuyến mãi</option>
                                        <option value="3">Chiết khấu</option>
                                        <option value="4">Ghi chú</option>
                                    </select>
                                </td>
                                <td>
                                    <input
                                        className="form-control form-control-sm"
                                        value={p.unitNm || ""}
                                        onChange={(e) => onUpdate(p.id, "unitNm", e.target.value)}
                                        disabled={isViewMode}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        value={p.qty || 0}
                                        onChange={(e) => onUpdate(p.id, "qty", +e.target.value)}
                                        disabled={isViewMode}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        value={p.unprc || 0}
                                        onChange={(e) => onUpdate(p.id, "unprc", +e.target.value)}
                                        disabled={isViewMode}
                                    />
                                </td>
                                <td className="cell-readonly">{fmt(p.qty * p.unprc)}</td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        value={p.discRate || 0}
                                        onChange={(e) => onUpdate(p.id, "discRate", +e.target.value)}
                                        disabled={isViewMode}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        value={p.discAmt || 0}
                                        onChange={(e) => onUpdate(p.id, "discAmt", +e.target.value)}
                                        disabled={isViewMode}
                                    />
                                </td>
                                <td>
                                    <select
                                        className="form-select form-select-sm"
                                        value={p.vatRt || "10"}
                                        onChange={(e) => onUpdate(p.id, "vatRt", e.target.value)}
                                        disabled={isViewMode}
                                    >
                                        <option value="0">0%</option>
                                        <option value="5">5%</option>
                                        <option value="8">8%</option>
                                        <option value="10">10%</option>
                                        <option value="-1">KCT</option>
                                    </select>
                                </td>
                                <td className="cell-readonly text-primary">{fmt(p.vatAmt)}</td>
                                <td>
                                    {!isViewMode && (
                                        <button
                                            className="btn btn-link text-danger p-0"
                                            onClick={() => onRemove(p.id)}
                                        >
                                            <i className="ri-delete-bin-line" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

interface SummarySectionProps {
    subTotal: number;
    totalVat: number;
    totalAmount: number;
    invDiscAmount: number;
    onDiscChange: (val: number) => void;
    isViewMode?: boolean;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
    subTotal,
    totalVat,
    totalAmount,
    invDiscAmount,
    onDiscChange,
    isViewMode,
}) => (
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
                        value={invDiscAmount || 0}
                        onChange={(e) => onDiscChange(+e.target.value)}
                        disabled={isViewMode}
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
                    <label className="form-label small fw-bold">TỔNG CỘNG THANH TOÁN</label>
                    <input
                        className="form-control total-amount text-end fw-bold"
                        value={fmt(totalAmount)}
                        readOnly
                    />
                </div>
            </div>
        </div>
    </div>
);
