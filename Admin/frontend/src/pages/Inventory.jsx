import { useState, useEffect } from "react";
import axios from "axios";
import {
  Archive,
  Plus,
  X,
  Search,
  Activity,
  Box,
  Filter,
  ChevronDown,
} from "lucide-react";

const Inventory = () => {
  const [logs, setLogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    product_id: "",
    change_qty: "",
    action: "manual_update",
    reference_id: "",
  });

  useEffect(() => {
    fetchLogs();
    fetchProducts();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/inventory", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setLogs(res.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/products");
      setProducts(res.data);
    } catch (error) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/inventory", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setShowModal(false);
      setFormData({
        product_id: "",
        change_qty: "",
        action: "manual_update",
        reference_id: "",
      });
      fetchLogs();
    } catch (error) {
      alert("Failed to log inventory change");
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      (log.product_name &&
        log.product_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.action &&
        log.action.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  if (loading) return <div>Loading log history...</div>;

  return (
    <div className="inventory-container">
      <div className="header-actions">
        <div>
          <h1 className="page-title" style={{ fontFamily: "serif" }}>
            Inventory Lifecycle
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Historic audit trail of master stock movements.
          </p>
        </div>
        <button
          className="btn"
          style={{
            width: "auto",
            background: "var(--accent-primary)",
            color: "#1a1510",
          }}
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} /> Manual Adjustment
        </button>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-row">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search products, adjustment types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="filter-btn">
          <Filter size={18} />
          Filter
        </button>

        <select className="sort-select">
          <option value="recent">Sort by: Recent</option>
          <option value="oldest">Sort by: Oldest</option>
          <option value="qty">Sort by: Qty Shift</option>
        </select>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Inventory Log Info</th>
              <th>Adjustment Type</th>
              <th>Quantity Shift</th>
              <th>Reference ID</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div className="icon-box">
                      <Box size={20} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          marginBottom: "0.1rem",
                        }}
                      >
                        {log.product_name || `Unknown PRD-${log.product_id}`}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-secondary)",
                          fontWeight: 500,
                        }}
                      >
                        LOG-ID: #{log.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: log.action === "restock" ? "#10b981" : "#64748b",
                      background:
                        log.action === "restock" ? "#ecfdf5" : "#f1f5f9",
                      padding: "0.35rem 0.75rem",
                      borderRadius: "0.5rem",
                    }}
                  >
                    {log.action.replace("_", " ")}
                  </span>
                </td>
                <td
                  style={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: log.change_qty > 0 ? "#10b981" : "#ef4444",
                  }}
                >
                  {log.change_qty > 0 ? `+${log.change_qty}` : log.change_qty}
                </td>
                <td
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.875rem",
                  }}
                >
                  {log.reference_id || "--"}
                </td>
                <td
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.875rem",
                  }}
                >
                  {new Date(log.created_at).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "4rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Archive
                    size={40}
                    style={{
                      margin: "0 auto 1.5rem",
                      opacity: 0.3,
                      display: "block",
                    }}
                  />
                  No inventory movements found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div
            className="modal-content premium-card"
            style={{ maxWidth: "480px", padding: "2rem" }}
          >
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <X size={24} />
            </button>
            <h2
              style={{
                marginBottom: "2.5rem",
                fontFamily: "serif",
                color: "var(--accent-primary)",
              }}
            >
              Stock Level Control
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Search Product</label>
                <select
                  className="form-input"
                  required
                  // style={{ color: "var(--accent-primary)" }}
                  value={formData.product_id}
                  onChange={(e) =>
                    setFormData({ ...formData, product_id: e.target.value })
                  }
                >
                  <option
                    style={
                      {
                        // color: "var(--text-primary)",
                      }
                    }
                    value=""
                  >
                    Select inventory target...
                  </option>
                  {products.map((p) => (
                    <option
                      style={
                        {
                          // color: "var(--text-primary)",
                        }
                      }
                      key={p.id}
                      value={p.id}
                    >
                      {p.name} (Current: {p.quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Relative Qty Adjustment</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    className="form-input"
                    required
                    // style={{ color: "var(--accent-primary)" }}
                    placeholder="Use - for deduction"
                    value={formData.change_qty}
                    onChange={(e) =>
                      setFormData({ ...formData, change_qty: e.target.value })
                    }
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "0.7rem",
                      opacity: 0.8,
                    }}
                  >
                    Units
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Categorization</label>
                <select
                  className="form-input"
                  value={formData.action}
                  onChange={(e) =>
                    setFormData({ ...formData, action: e.target.value })
                  }
                >
                  <option
                    style={
                      {
                        // color: "var(--accent-primary)",
                      }
                    }
                    value="manual_update"
                  >
                    Manual Polish
                  </option>
                  <option
                    style={{
                      color: "var(--accent-primary)",
                    }}
                    value="restock"
                  >
                    Procurement / Restock
                  </option>
                  <option
                    style={{
                      color: "var(--accent-primary)",
                    }}
                    value="damage_removal"
                  >
                    Quality Rejection (Damage)
                  </option>
                  <option
                    style={{
                      color: "var(--accent-primary)",
                    }}
                    value="correction"
                  >
                    Audit Correction
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Ref Reference / Memo</label>
                <input
                  type="text"
                  className="form-input"
                  // style={{ color: "var(--accent-primary)" }}
                  placeholder="Optional audit trail ID"
                  value={formData.reference_id}
                  onChange={(e) =>
                    setFormData({ ...formData, reference_id: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="btn"
                style={{
                  marginTop: "2.5rem",
                  background: "var(--accent-primary)",
                  color: "#1a1510",
                  fontWeight: 700,
                }}
              >
                Commit Stock Adjustment
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .inventory-container {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Inventory;
