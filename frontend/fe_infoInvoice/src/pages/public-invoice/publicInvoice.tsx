import { useState } from "react";
import { toast } from "react-toastify";
import "./publicInvoice.scss";

interface ProductItem {
  id: string;
  itmName: string;
  itmKnd: number;
  unitNm: string;
  qty: number;
  unprc: number;
  vatRt: string;
}

export default function PublicInvoice() {
  const [transactionID] = useState(crypto.randomUUID());
  const [config, setConfig] = useState({
    providerId: 9,
    url: "",
    ma_dvcs: "",
    username: "",
    password: "",
    tenantId: "",
  });

  const [invoiceInfo, setInvoiceInfo] = useState({
    invRef: "",
    paidTp: "TM",
    clsfNo: "1",
    spcfNo: "",
    invDiscAmount: 0,
  });

  const [customer, setCustomer] = useState({
    custNm: "",
    taxCode: "",
    email: "",
    custAddrs: "",
  });

  const [products, setProducts] = useState<ProductItem[]>(() => [
    {
      id: Date.now().toString(),
      itmName: "",
      itmKnd: 1,
      unitNm: "Cái",
      qty: 1,
      unprc: 0,
      vatRt: "10",
    },
  ]);

  const [payloadResult, setPayloadResult] = useState<string>("");

  const calculateSummary = () => {
    let subTotal = 0;
    let totalVat = 0;

    products.forEach((p) => {
      const amt = p.qty * p.unprc;
      subTotal += amt;
      const vatRtNum = parseFloat(p.vatRt);
      if (vatRtNum > 0) {
        totalVat += amt * (vatRtNum / 100);
      }
    });

    const totalAmount = subTotal + totalVat - invoiceInfo.invDiscAmount;
    return { subTotal, totalVat, totalAmount };
  };

  const { subTotal, totalVat, totalAmount } = calculateSummary();

  // --- Action Handlers ---
  const addRow = () => {
    setProducts([
      ...products,
      {
        id: Date.now().toString(),
        itmName: "",
        itmKnd: 1,
        unitNm: "Cái",
        qty: 1,
        unprc: 0,
        vatRt: "10",
      },
    ]);
  };

  const removeRow = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const updateProduct = (id: string, field: keyof ProductItem, value: any) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const handleSubmit = () => {
    const finalProducts = products.map((p) => {
      const amt = p.qty * p.unprc;
      const vatRtNum = parseFloat(p.vatRt);
      const vatAmt = vatRtNum === -1 ? 0 : amt * (vatRtNum / 100);
      return {
        itmCd: `PROD-${p.id.slice(-4)}`,
        itmName: p.itmName,
        itmKnd: p.itmKnd,
        unitNm: p.unitNm,
        qty: p.qty,
        unprc: p.unprc,
        amt: amt,
        vatRt: p.vatRt,
        vatAmt: vatAmt,
        totalAmt: amt + vatAmt,
      };
    });

    const payload = {
      login: config,
      transactionID,
      invRef: invoiceInfo.invRef,
      invSubTotal: subTotal,
      invVatAmount: totalVat,
      invDiscAmount: invoiceInfo.invDiscAmount,
      invTotalAmount: totalAmount,
      paidTp: invoiceInfo.paidTp,
      customer: { ...customer, custCompany: customer.custNm },
      products: finalProducts,
      createdDate: new Date().toISOString(),
    };

    setPayloadResult(JSON.stringify(payload, null, 2));
    toast.success("Đã tạo Payload thành công!");
    console.log("Invoice Payload:", payload);
  };

  return (
    <div className="invoice-container container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          <i className="text-primary">DAEWOO</i> | Phát hành Hóa đơn
        </h3>
        <span className="badge bg-secondary">API 2026 Ready</span>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header text-primary border-bottom">
          I. Cấu hình Nhà cung cấp
        </div>
        <div className="card-body row g-3">
          <div className="col-md-2">
            <label className="form-label small">Provider</label>
            <select
              className="form-select"
              value={config.providerId}
              onChange={(e) =>
                setConfig({ ...config, providerId: +e.target.value })
              }
            >
              <option value={1}>EasyInvoice</option>
              <option value={9}>WinInvoice</option>
              <option value={5}>EHoaDon</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label small">URL (Domain)</label>
            <input
              className="form-control"
              value={config.url}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small">MST Nhà cung cấp</label>
            <input
              className="form-control"
              value={config.ma_dvcs}
              onChange={(e) =>
                setConfig({ ...config, ma_dvcs: e.target.value })
              }
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small">Tài khoản</label>
            <input
              className="form-control"
              value={config.username}
              onChange={(e) =>
                setConfig({ ...config, username: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header text-primary border-bottom">
          II. Thông tin Hóa đơn
        </div>
        <div className="card-body row g-3">
          <div className="col-md-3">
            <label className="form-label small">ID Đơn hàng</label>
            <input
              className="form-control bg-light"
              value={transactionID}
              readOnly
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small">Số chứng từ (invRef)</label>
            <input
              className="form-control"
              value={invoiceInfo.invRef}
              onChange={(e) =>
                setInvoiceInfo({ ...invoiceInfo, invRef: e.target.value })
              }
            />
          </div>
          <div className="col-md-2">
            <label className="form-label small">Tiền hàng</label>
            <input
              className="form-control bg-light"
              value={subTotal.toLocaleString()}
              readOnly
            />
          </div>
          <div className="col-md-2">
            <label className="form-label small">Tiền Thuế</label>
            <input
              className="form-control bg-light"
              value={totalVat.toLocaleString()}
              readOnly
            />
          </div>
          <div className="col-md-2">
            <label className="form-label small fw-bold text-danger">
              TỔNG CỘNG
            </label>
            <input
              className="form-control bg-light fw-bold text-danger"
              value={totalAmount.toLocaleString()}
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header d-flex justify-content-between align-items-center text-primary border-bottom">
          IV. Chi tiết Sản phẩm
          <button className="btn btn-sm btn-outline-primary" onClick={addRow}>
            + Thêm dòng
          </button>
        </div>
        <div className="p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr className="small text-center">
                  <th style={{ width: "30%" }}>Tên hàng</th>
                  <th style={{ width: "10%" }}>ĐVT</th>
                  <th style={{ width: "10%" }}>SL</th>
                  <th style={{ width: "15%" }}>Đơn giá</th>
                  <th style={{ width: "15%" }}>Thành tiền</th>
                  <th style={{ width: "12%" }}>Thuế</th>
                  <th style={{ width: "8%" }}>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="align-middle text-center">
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
                    <td className="bg-light">
                      {(p.qty * p.unprc).toLocaleString()}
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
                        <option value="8">8%</option>
                        <option value="10">10%</option>
                        <option value="-1">KCT</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn btn-link text-danger p-0"
                        onClick={() => removeRow(p.id)}
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="d-grid">
        <button className="btn btn-success btn-lg" onClick={handleSubmit}>
          <i className="ri-send-plane-fill me-2"></i> PHÁT HÀNH HÓA ĐƠN
        </button>
      </div>

      {payloadResult && (
        <div className="mt-4">
          <label className="form-label fw-bold">Request Payload:</label>
          <pre className="result-box bg-dark text-success p-3 rounded">
            {payloadResult}
          </pre>
        </div>
      )}
    </div>
  );
}
