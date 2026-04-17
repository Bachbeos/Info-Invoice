/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
// Giả định bạn đã import các types và hàm fmt từ file types/invoice
// import { fmt } from "./invoice-sections";

interface ModalInvoiceProps {
  mode?: "add" | "edit" | "view";
  onClose?: () => void;
  // Bổ sung props để handle data tương tự useInvoiceAction
  data?: any;
  onChange?: (updates: any) => void;
  onCustomerChange?: (updates: any) => void;
  onProductUpdate?: (id: number | undefined, field: string, value: any) => void;
  onAddProduct?: () => void;
  onRemoveProduct?: (id: number | undefined) => void;
  onSubmit?: () => void;
  totals?: { subTotal: number; totalVat: number; totalAmount: number };
}

export const fmt = (n: number) => (n || 0).toLocaleString("vi-VN");

export default function ModalInvoice({
  mode = "add",
  onClose,
  data,
  onChange,
  onCustomerChange,
  onProductUpdate,
  onAddProduct,
  onRemoveProduct,
  onSubmit,
  totals,
}: ModalInvoiceProps) {
  const isViewMode = mode === "view";
  const { subTotal = 0, totalVat = 0, totalAmount = 0 } = totals || {};

  return (
    <div className="flex flex-col w-full max-h-[95vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.05] flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
            {isViewMode
              ? "Chi tiết hóa đơn"
              : mode === "add"
                ? "Tạo hóa đơn mới"
                : "Cập nhật hóa đơn"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
            Mã tham chiếu:{" "}
            <span className="text-brand-500">
              {data?.invRef || "#AUTO-GEN"}
            </span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>
      </div>

      {/* CONTENT BODY */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* SECTION 1: THÔNG TIN HÓA ĐƠN (Đã bổ sung đầy đủ) */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-brand-500">
            <i className="ri-file-text-line text-lg"></i>
            <h4 className="font-bold uppercase tracking-wider text-sm">
              Thông tin Hóa đơn
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">
                Mã đơn hàng / Số chứng từ
              </label>
              <input
                type="text"
                disabled={isViewMode}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.1] rounded-lg text-sm outline-none"
                value={data?.invRef || ""}
                onChange={(e) => onChange?.({ invRef: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">
                Số đơn hàng (PO)
              </label>
              <input
                type="text"
                disabled={isViewMode}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.1] rounded-lg text-sm outline-none"
                value={data?.poNo || ""}
                onChange={(e) => onChange?.({ poNo: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">
                Ngày hóa đơn
              </label>
              <input
                type="date"
                disabled={isViewMode}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.1] rounded-lg text-sm outline-none"
                value={data?.createdDate || ""}
                onChange={(e) => onChange?.({ createdDate: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">
                PT Thanh toán
              </label>
              <select
                disabled={isViewMode}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.1] rounded-lg text-sm outline-none"
                value={data?.paidTp || "TM"}
                onChange={(e) => onChange?.({ paidTp: e.target.value })}
              >
                <option value="TM">Tiền mặt</option>
                <option value="CK">Chuyển khoản</option>
                <option value="TM/CK">Tiền mặt/Chuyển khoản</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">
                Số hóa đơn
              </label>
              <input
                type="text"
                disabled={isViewMode}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.1] rounded-lg text-sm outline-none"
                value={data?.hdNo || ""}
                onChange={(e) => onChange?.({ hdNo: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">
                Mẫu số & Ký hiệu
              </label>
              <div className="flex gap-1">
                <input
                  placeholder="Mẫu số"
                  disabled={isViewMode}
                  className="w-1/2 px-3 py-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.1] rounded-lg text-sm outline-none"
                  value={data?.clsfNo || ""}
                  onChange={(e) => onChange?.({ clsfNo: e.target.value })}
                />
                <input
                  placeholder="Ký hiệu"
                  disabled={isViewMode}
                  className="w-1/2 px-3 py-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.1] rounded-lg text-sm outline-none"
                  value={data?.spcfNo || ""}
                  onChange={(e) => onChange?.({ spcfNo: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">
                Loại tiền & Tỷ giá
              </label>
              <div className="flex gap-1">
                <input
                  disabled
                  className="w-1/3 px-3 py-2 bg-gray-100 dark:bg-white/[0.01] border border-gray-200 rounded-lg text-xs"
                  value="VND"
                />
                <input
                  type="number"
                  disabled={isViewMode}
                  className="w-2/3 px-3 py-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.1] rounded-lg text-sm outline-none"
                  value={data?.exchRt || 1}
                  onChange={(e) => onChange?.({ exchRt: +e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">
                Thuế suất chung (%)
              </label>
              <select
                disabled={isViewMode}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.1] rounded-lg text-sm outline-none font-bold text-blue-600"
                value={data?.invVatRate ?? ""}
                onChange={(e) => onChange?.({ invVatRate: e.target.value })}
              >
                <option value="">Nhiều thuế suất</option>
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="8">8%</option>
                <option value="10">10%</option>
                <option value="-1">KCT</option>
              </select>
            </div>
            <div className="space-y-1 lg:col-span-2">
              <label className="text-xs font-medium text-gray-500">
                Tài khoản ngân hàng bên bán
              </label>
              <input
                type="text"
                disabled={isViewMode}
                placeholder="Số tài khoản - Ngân hàng"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.1] rounded-lg text-sm outline-none"
                value={data?.bankAccount || ""}
                onChange={(e) => onChange?.({ bankAccount: e.target.value })}
              />
            </div>
            <div className="space-y-1 lg:col-span-2">
              <label className="text-xs font-medium text-gray-500">
                Ghi chú hóa đơn
              </label>
              <input
                type="text"
                disabled={isViewMode}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.1] rounded-lg text-sm outline-none"
                placeholder="Ghi chú thêm..."
                value={data?.note || ""}
                onChange={(e) => onChange?.({ note: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: THÔNG TIN KHÁCH HÀNG (Đã bổ sung đầy đủ) */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-orange-500">
            <i className="ri-user-settings-line text-lg"></i>
            <h4 className="font-bold uppercase tracking-wider text-sm">
              Thông tin khách hàng
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">
                Mã khách hàng
              </label>
              <input
                type="text"
                disabled={isViewMode}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                value={data?.customer?.custCd || ""}
                onChange={(e) => onCustomerChange?.({ custCd: e.target.value })}
              />
            </div>
            <div className="space-y-1 lg:col-span-2">
              <label className="text-xs font-medium text-gray-500">
                Tên khách hàng / Đơn vị
              </label>
              <input
                type="text"
                disabled={isViewMode}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                value={data?.customer?.custNm || ""}
                onChange={(e) => onCustomerChange?.({ custNm: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">
                Mã số thuế
              </label>
              <input
                type="text"
                disabled={isViewMode}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none font-mono"
                value={data?.customer?.taxCode || ""}
                onChange={(e) =>
                  onCustomerChange?.({ taxCode: e.target.value })
                }
              />
            </div>
            <div className="space-y-1 lg:col-span-2">
              <label className="text-xs font-medium text-gray-500">
                Địa chỉ
              </label>
              <input
                type="text"
                disabled={isViewMode}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                value={data?.customer?.custAddrs || ""}
                onChange={(e) =>
                  onCustomerChange?.({ custAddrs: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">
                Số điện thoại
              </label>
              <input
                type="text"
                disabled={isViewMode}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                value={data?.customer?.custPhone || ""}
                onChange={(e) =>
                  onCustomerChange?.({ custPhone: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">
                Email nhận hóa đơn
              </label>
              <input
                type="email"
                disabled={isViewMode}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                value={data?.customer?.email || ""}
                onChange={(e) => onCustomerChange?.({ email: e.target.value })}
              />
            </div>
            <div className="space-y-1 lg:col-span-2">
              <label className="text-xs font-medium text-gray-500">
                Tài khoản ngân hàng bên mua
              </label>
              <input
                type="text"
                disabled={isViewMode}
                placeholder="Số tài khoản - Tên ngân hàng"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                value={data?.customer?.custBankAccount || ""}
                onChange={(e) =>
                  onCustomerChange?.({ custBankAccount: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">
                Tỉnh/Thành phố
              </label>
              <input
                type="text"
                disabled={isViewMode}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                value={data?.customer?.custCity || ""}
                onChange={(e) =>
                  onCustomerChange?.({ custCity: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500">
                Quận/Huyện
              </label>
              <input
                type="text"
                disabled={isViewMode}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                value={data?.customer?.custDistrict || ""}
                onChange={(e) =>
                  onCustomerChange?.({ custDistrict: e.target.value })
                }
              />
            </div>
          </div>
        </section>

        {/* SECTION 3: DANH SÁCH SẢN PHẨM (Đã bổ sung các cột ẩn: Chiết khấu, Thành tiền sau thuế) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-emerald-500">
              <i className="ri-shopping-cart-2-line text-lg"></i>
              <h4 className="font-bold uppercase tracking-wider text-sm">
                Danh sách hàng hóa
              </h4>
            </div>
            {!isViewMode && (
              <button
                onClick={onAddProduct}
                className="flex items-center gap-1 text-xs font-bold text-white bg-emerald-500 px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <i className="ri-add-line"></i> THÊM DÒNG
              </button>
            )}
          </div>

          <div className="overflow-x-auto border border-gray-200 dark:border-white/[0.1] rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-white/[0.02] text-gray-500 dark:text-gray-400 uppercase text-[10px] font-bold tracking-widest border-b border-gray-200 dark:border-white/[0.1]">
                <tr>
                  <th className="px-4 py-3 w-10 text-center">#</th>
                  <th className="px-4 py-3 min-w-[180px]">
                    Tên hàng hóa / Dịch vụ
                  </th>
                  <th className="px-4 py-3 w-20 text-center">ĐVT</th>
                  <th className="px-4 py-3 w-24 text-center">Số lượng</th>
                  <th className="px-4 py-3 w-32 text-right">Đơn giá</th>
                  <th className="px-4 py-3 w-20 text-center">CK %</th>
                  <th className="px-4 py-3 w-20 text-center">Thuế %</th>
                  <th className="px-4 py-3 w-32 text-right">Thành tiền</th>
                  {!isViewMode && <th className="px-4 py-3 w-10"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {data?.items?.map((p: any, idx: number) => (
                  <tr key={p.id || idx}>
                    <td className="px-4 py-3 text-xs text-center text-gray-400">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        disabled={isViewMode}
                        className="w-full bg-transparent text-sm outline-none text-gray-800 dark:text-white/90"
                        value={p.itmName || ""}
                        onChange={(e) =>
                          onProductUpdate?.(p.id, "itmName", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        disabled={isViewMode}
                        className="w-full bg-transparent text-sm text-center outline-none"
                        value={p.unitNm || ""}
                        onChange={(e) =>
                          onProductUpdate?.(p.id, "unitNm", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        disabled={isViewMode}
                        className="w-full bg-transparent text-sm text-center outline-none font-semibold"
                        value={p.qty || 0}
                        onChange={(e) =>
                          onProductUpdate?.(p.id, "qty", +e.target.value)
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        disabled={isViewMode}
                        className="w-full bg-transparent text-sm text-right outline-none"
                        value={p.unprc || 0}
                        onChange={(e) =>
                          onProductUpdate?.(p.id, "unprc", +e.target.value)
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        disabled={isViewMode}
                        className="w-full bg-transparent text-sm text-center outline-none text-red-500"
                        value={p.discRate || 0}
                        onChange={(e) =>
                          onProductUpdate?.(p.id, "discRate", +e.target.value)
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        disabled={isViewMode}
                        className="w-full bg-transparent text-sm text-center outline-none cursor-pointer"
                        value={p.vatRt || "10"}
                        onChange={(e) =>
                          onProductUpdate?.(p.id, "vatRt", e.target.value)
                        }
                      >
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="8">8%</option>
                        <option value="10">10%</option>
                        <option value="-1">KCT</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-right text-brand-600">
                      {fmt(p.qty * p.unprc - (p.discAmt || 0))}
                    </td>
                    {!isViewMode && (
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onRemoveProduct?.(p.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 4: TỔNG THANH TOÁN (Đồng bộ số liệu) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50/50 dark:bg-blue-500/[0.03] rounded-xl border border-blue-100 dark:border-blue-500/[0.1]">
              <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-2">
                Thông tin bổ sung / Ghi chú thanh toán
              </h5>
              <textarea
                rows={4}
                disabled={isViewMode}
                className="w-full bg-transparent text-sm outline-none resize-none"
                placeholder="Nhập ghi chú hoặc điều kiện thanh toán..."
                value={data?.note || ""}
                onChange={(e) => onChange?.({ note: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-white/[0.02] p-6 rounded-2xl space-y-3 border border-gray-100 dark:border-white/[0.05]">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Cộng tiền hàng (chưa thuế):</span>
              <span className="font-semibold text-gray-800 dark:text-white/90">
                {fmt(subTotal)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Chiết khấu tổng HĐ:</span>
              <div className="flex items-center gap-2 border-b border-gray-200 dark:border-white/[0.1] pb-1">
                <input
                  type="number"
                  disabled={isViewMode}
                  className="w-24 bg-transparent text-right outline-none font-semibold text-red-500"
                  value={data?.invDiscAmount || 0}
                  onChange={(e) =>
                    onChange?.({ invDiscAmount: +e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Tổng tiền thuế VAT:</span>
              <span className="font-semibold text-blue-600">
                {fmt(totalVat)}
              </span>
            </div>
            <div className="pt-3 border-t border-gray-200 dark:border-white/[0.1] flex justify-between items-center">
              <span className="font-bold text-gray-800 dark:text-white/90 uppercase text-sm">
                Tổng cộng thanh toán:
              </span>
              <span className="text-2xl font-black text-brand-500">
                {fmt(totalAmount)} VND
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <div className="px-6 py-4 border-t border-gray-100 dark:border-white/[0.05] bg-gray-50/50 dark:bg-white/[0.01] flex justify-end gap-3 sticky bottom-0 z-10">
        <button
          onClick={onClose}
          className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors uppercase tracking-widest"
        >
          {isViewMode ? "Đóng" : "Hủy bỏ"}
        </button>
        {!isViewMode && (
          <button
            onClick={onSubmit}
            className="px-8 py-2 bg-brand-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-brand-500/20 hover:bg-brand-600 active:scale-95 transition-all uppercase tracking-widest"
          >
            {mode === "add" ? "Xác nhận tạo" : "Lưu thay đổi"}
          </button>
        )}
      </div>
    </div>
  );
}
