import { useState } from "react";
import { toast } from "react-toastify";
import invoiceService from "../../services/InvoiceService";
import { ApiError } from "../../lib/apiClient";
import "./publicInvoice.scss";

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

export default function PublicInvoice() {
  const [transactionID] = useState(crypto.randomUUID());

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
      unitNm: "Cái",
      qty: 1,
      unprc: 0,
      discRate: 0,
      discAmt: 0,
      vatRt: "10",
    },
  ]);

  const [payloadResult, setPayloadResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

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

  const updateProduct = (id: string, field: keyof ProductItem, value: any) => {
    setProducts(
      products.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, [field]: value };
        if (field === "discRate") {
          const amt = updated.qty * updated.unprc;
          updated.discAmt = Math.round((amt * value) / 100);
        }
        if (field === "discAmt") {
          const amt = updated.qty * updated.unprc;
          updated.discRate =
            amt > 0 ? parseFloat(((value / amt) * 100).toFixed(2)) : 0;
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

    const payload = {
      transactionID,
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

    setPayloadResult(JSON.stringify(payload, null, 2));
    setIsLoading(true);

    try {
      const data = await invoiceService.issue(payload);
      if (data.status) {
        toast.success(`Phát hành thành công! Số HĐ: ${data.data?.invoiceNo}`);
      } else {
        toast.error(`Lỗi: ${data.message}`);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(`Lỗi ${err.status}: ${err.message}`);
      } else {
        toast.error("Không thể kết nối tới server. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fmt = (n: number) => n.toLocaleString("vi-VN");

  return (
    <div className="invoice-container container my-4">
      {/* Header */}
      <div className="inv-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-0">
            <span className="brand-text">DAEWOO</span>
            <span className="separator">|</span>
            Phát hành Hóa đơn Điện tử
          </h3>
          <small className="text-muted">
            Transaction ID: <code>{transactionID}</code>
          </small>
        </div>
        <span className="badge status-badge">● LIVE</span>
      </div>

      {/* I. Thông tin Hóa đơn */}
      <div className="card inv-card mb-4">
        <div className="card-header inv-card-header">
          <i className="ri-file-text-line me-2" />
          I. Thông tin Hóa đơn
        </div>
        <div className="card-body row g-3">
          <div className="col-md-3">
            <label className="form-label small">
              Số chứng từ <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              placeholder="VD: K24TGT804"
              value={invoiceInfo.invRef}
              onChange={(e) =>
                setInvoiceInfo({ ...invoiceInfo, invRef: e.target.value })
              }
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small">Số đơn hàng (poNo)</label>
            <input
              className="form-control"
              placeholder="Có thể trùng"
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
              Phương thức TT <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              value={invoiceInfo.paidTp}
              onChange={(e) =>
                setInvoiceInfo({ ...invoiceInfo, paidTp: e.target.value })
              }
            >
              <option value="TM">TM - Tiền mặt</option>
              <option value="CK">CK - Chuyển khoản</option>
              <option value="TM/CK">TM/CK</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label small">Số hóa đơn (hdNo)</label>
            <input
              className="form-control"
              placeholder="Để trống nếu auto"
              value={invoiceInfo.hdNo}
              onChange={(e) =>
                setInvoiceInfo({ ...invoiceInfo, hdNo: e.target.value })
              }
            />
          </div>

          <div className="col-md-2">
            <label className="form-label small">
              Mẫu số (clsfNo) <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              placeholder="VD: 1 hoặc 01GTKT0/001"
              value={invoiceInfo.clsfNo}
              onChange={(e) =>
                setInvoiceInfo({ ...invoiceInfo, clsfNo: e.target.value })
              }
            />
          </div>
          <div className="col-md-2">
            <label className="form-label small">
              Ký hiệu HĐ (spcfNo) <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              placeholder="VD: C24TGT"
              value={invoiceInfo.spcfNo}
              onChange={(e) =>
                setInvoiceInfo({ ...invoiceInfo, spcfNo: e.target.value })
              }
            />
          </div>
          <div className="col-md-2">
            <label className="form-label small">Template Code (SInvoice)</label>
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
              Thuế suất HĐ (invVatRate)
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
            <label className="form-label small">Tài khoản NH bên bán</label>
            <input
              className="form-control"
              placeholder="Số tài khoản"
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
              placeholder="Tên ngân hàng"
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
              value={invoiceInfo.note}
              onChange={(e) =>
                setInvoiceInfo({ ...invoiceInfo, note: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* II. Thông tin Khách hàng */}
      <div className="card inv-card mb-4">
        <div className="card-header inv-card-header">
          <i className="ri-user-3-line me-2" />
          II. Thông tin Người mua
        </div>
        <div className="card-body row g-3">
          <div className="col-md-2">
            <label className="form-label small">Mã KH</label>
            <input
              className="form-control"
              placeholder="custCd"
              value={customer.custCd}
              onChange={(e) =>
                setCustomer({ ...customer, custCd: e.target.value })
              }
            />
          </div>
          <div className="col-md-4">
            <label className="form-label small">Tên khách hàng</label>
            <input
              className="form-control"
              value={customer.custNm}
              onChange={(e) =>
                setCustomer({ ...customer, custNm: e.target.value })
              }
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small">Tên công ty</label>
            <input
              className="form-control"
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
              value={customer.taxCode}
              onChange={(e) =>
                setCustomer({ ...customer, taxCode: e.target.value })
              }
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small">Thành phố / Tỉnh</label>
            <input
              className="form-control"
              value={customer.custCity}
              onChange={(e) =>
                setCustomer({ ...customer, custCity: e.target.value })
              }
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small">Quận / Huyện</label>
            <input
              className="form-control"
              value={customer.custDistrictName}
              onChange={(e) =>
                setCustomer({ ...customer, custDistrictName: e.target.value })
              }
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small">Số điện thoại</label>
            <input
              className="form-control"
              value={customer.custPhone}
              onChange={(e) =>
                setCustomer({ ...customer, custPhone: e.target.value })
              }
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small">Địa chỉ</label>
            <input
              className="form-control"
              value={customer.custAddrs}
              onChange={(e) =>
                setCustomer({ ...customer, custAddrs: e.target.value })
              }
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small">Email nhận HĐ</label>
            <input
              type="email"
              className="form-control"
              value={customer.email}
              onChange={(e) =>
                setCustomer({ ...customer, email: e.target.value })
              }
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small">Email CC</label>
            <input
              type="email"
              className="form-control"
              value={customer.emailCC}
              onChange={(e) =>
                setCustomer({ ...customer, emailCC: e.target.value })
              }
            />
          </div>

          <div className="col-md-4">
            <label className="form-label small">Tài khoản NH bên mua</label>
            <input
              className="form-control"
              value={customer.custBankAccount}
              onChange={(e) =>
                setCustomer({ ...customer, custBankAccount: e.target.value })
              }
            />
          </div>
          <div className="col-md-4">
            <label className="form-label small">Ngân hàng bên mua</label>
            <input
              className="form-control"
              value={customer.custBankName}
              onChange={(e) =>
                setCustomer({ ...customer, custBankName: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* III. Chi tiết Sản phẩm */}
      <div className="card inv-card mb-4">
        <div className="card-header inv-card-header d-flex justify-content-between align-items-center">
          <span>
            <i className="ri-list-check me-2" />
            III. Chi tiết Sản phẩm / Dịch vụ
          </span>
          <button className="btn btn-sm btn-add-row" onClick={addRow}>
            <i className="ri-add-line me-1" />
            Thêm dòng
          </button>
        </div>
        <div className="p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 inv-table">
              <thead>
                <tr className="small text-center">
                  <th style={{ width: "4%" }}>#</th>
                  <th style={{ width: "8%" }}>Mã hàng</th>
                  <th style={{ width: "22%" }}>Tên hàng / DV</th>
                  <th style={{ width: "7%" }}>Loại</th>
                  <th style={{ width: "6%" }}>ĐVT</th>
                  <th style={{ width: "7%" }}>SL</th>
                  <th style={{ width: "12%" }}>Đơn giá</th>
                  <th style={{ width: "10%" }}>Thành tiền</th>
                  <th style={{ width: "7%" }}>CK%</th>
                  <th style={{ width: "9%" }}>Tiền CK</th>
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
                          <option value={1}>HH/DV</option>
                          <option value={2}>KM</option>
                          <option value={3}>CK</option>
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
                        <button
                          className="btn btn-link text-danger p-0"
                          onClick={() => removeRow(p.id)}
                        >
                          <i className="ri-delete-bin-line" />
                        </button>
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
          IV. Tổng kết
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

      {/* Submit */}
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <button
          className="btn btn-outline-secondary"
          onClick={() =>
            setPayloadResult(JSON.stringify({ transactionID }, null, 2))
          }
        >
          <i className="ri-eye-line me-2" />
          Xem Payload
        </button>
        <button
          className="btn btn-publish btn-lg px-5"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Đang phát hành...
            </>
          ) : (
            <>
              <i className="ri-send-plane-fill me-2" />
              PHÁT HÀNH HÓA ĐƠN
            </>
          )}
        </button>
      </div>

      {payloadResult && (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="form-label fw-bold mb-0">
              📦 Request Payload:
            </label>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                navigator.clipboard.writeText(payloadResult);
                toast.info("Đã copy!");
              }}
            >
              <i className="ri-clipboard-line me-1" />
              Copy
            </button>
          </div>
          <pre className="result-box bg-dark text-success p-3 rounded">
            {payloadResult}
          </pre>
        </div>
      )}
    </div>
  );
}
