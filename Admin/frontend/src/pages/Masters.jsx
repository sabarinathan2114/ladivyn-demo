import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Tags,
  Layers,
  MapPin,
  Globe,
  Landmark,
  Hash,
  ChevronRight,
  Filter,
  Upload,
  Database,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

const Masters = () => {
  const [activeTab, setActiveTab] = useState("category");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  // Selection/Reference data
  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  // Bulk Upload States
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkStep, setBulkStep] = useState(1); // 1: Select Type, 2: Upload, 3: Results
  const [bulkFile, setBulkFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);

  const tabs = [
    { id: "category", label: "Category", icon: Tags },
    { id: "subcategory", label: "Sub-Category", icon: Layers },
    { id: "states", label: "States", icon: Globe },
    { id: "districts", label: "Districts", icon: Landmark },
    { id: "cities", label: "City/Towns", icon: MapPin },
    { id: "pincodes", label: "Pin Code", icon: Hash },
  ];

  useEffect(() => {
    fetchData();
    // Pre-fetch reference data
    fetchReferenceData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      switch (activeTab) {
        case "category":
          res = await axios.get(`${API_BASE}/categories`);
          break;
        case "subcategory":
          res = await axios.get(`${API_BASE}/categories/subcategories`);
          break;
        case "states":
          res = await axios.get(`${API_BASE}/locations/states`);
          break;
        case "districts":
          res = await axios.get(`${API_BASE}/locations/districts`);
          break;
        case "cities":
          res = await axios.get(`${API_BASE}/locations/cities`);
          break;
        case "pincodes":
          res = await axios.get(`${API_BASE}/locations/pincodes`);
          break;
        default:
          break;
      }
      setData(res.data);
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferenceData = async () => {
    try {
      const [cats, sts, dists, cts] = await Promise.all([
        axios.get(`${API_BASE}/categories`),
        axios.get(`${API_BASE}/locations/states`),
        axios.get(`${API_BASE}/locations/districts`),
        axios.get(`${API_BASE}/locations/cities`),
      ]);
      setCategories(cats.data);
      setStates(sts.data);
      setDistricts(dists.data);
      setCities(cts.data);
    } catch (error) {
      console.error("Error fetching reference data:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${activeTab}?`))
      return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      };
      let endpoint = "";

      if (activeTab === "category") endpoint = `${API_BASE}/categories/${id}`;
      else if (activeTab === "subcategory")
        endpoint = `${API_BASE}/categories/subcategories/${id}`;
      else if (activeTab === "states")
        endpoint = `${API_BASE}/locations/states/${id}`;
      else if (activeTab === "districts")
        endpoint = `${API_BASE}/locations/districts/${id}`;
      else if (activeTab === "cities")
        endpoint = `${API_BASE}/locations/cities/${id}`;
      else if (activeTab === "pincodes")
        endpoint = `${API_BASE}/locations/pincodes/${id}`;

      await axios.delete(endpoint, config);
      fetchData();
    } catch (error) {
      alert("Delete failed");
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!bulkFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", bulkFile);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      };
      const res = await axios.post(
        `${API_BASE}/locations/bulk-upload`,
        formData,
        config,
      );
      setBulkResult(res.data);
      setBulkStep(3);
      fetchData(); // Refresh list
    } catch (error) {
      alert(error.response?.data?.message || "Bulk upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      };
      let endpoint = "";

      if (activeTab === "category") endpoint = `${API_BASE}/categories`;
      else if (activeTab === "subcategory") {
        endpoint = editingId
          ? `${API_BASE}/categories/subcategories/${editingId}`
          : `${API_BASE}/categories/${formData.category_id}/subcategories`;
      } else {
        // Location endpoints
        endpoint = `${API_BASE}/locations/${activeTab}`;
      }

      const method = editingId ? "put" : "post";
      const url =
        editingId && activeTab !== "subcategory"
          ? `${endpoint}/${editingId}`
          : endpoint;

      await axios[method](url, formData, config);

      setShowModal(false);
      setFormData({});
      setEditingId(null);
      fetchData();
    } catch (error) {
      alert("Save failed. Please check your data.");
    }
  };

  const openForm = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ ...item });
    } else {
      setEditingId(null);
      // Initialize based on tab
      const init = { is_active: true };
      if (activeTab === "subcategory") init.category_id = "";
      if (activeTab === "districts") init.state_id = "";
      if (activeTab === "cities") init.district_id = "";
      if (activeTab === "pincodes") init.city_id = "";
      setFormData(init);
    }
    setShowModal(true);
  };

  const filteredData = data.filter((item) => {
    const val = (item.name || item.pincode || "").toString().toLowerCase();
    return val.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="masters-container">
      {/* Breadcrumbs / Header */}
      <div className="header-actions">
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
              marginBottom: "0.5rem",
            }}
          >
            <span>Admin</span> <ChevronRight size={12} />{" "}
            <span style={{ color: "var(--accent-primary)" }}>Masters</span>
          </div>
          <h1
            className="page-title"
            style={{
              fontFamily: "serif",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Master Configuration
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            System values and geographic hierarchy management.
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            className="btn"
            style={{
              width: "auto",
              background: "#f8fafc",
              color: "#64748b",
              border: "1px solid #e2e8f0",
            }}
            onClick={() => {
              setBulkStep(1);
              setBulkFile(null);
              setBulkResult(null);
              setShowBulkModal(true);
            }}
          >
            <Upload size={18} /> Bulk Import
          </button>
          <button
            className="btn"
            style={{
              width: "auto",
              background: "var(--accent-primary)",
              color: "#1a1510",
            }}
            onClick={() => openForm()}
          >
            <Plus size={18} /> Add{" "}
            {activeTab
              .replace("pincodes", "Pin Code")
              .replace("subcategory", "Sub-Category")}
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="master-tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`master-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab.id);
              setSearchTerm("");
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="search-filter-row">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder={`Search ${activeTab.replace("pincodes", "pin code")} records...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="filter-btn">
          <Filter size={18} />
          Filter
        </button>

        <select className="sort-select">
          <option value="name">Sort by: Name</option>
          <option value="status">Sort by: Status</option>
        </select>
      </div>

      {/* Main Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                {activeTab.toUpperCase().replace("PINCODES", "PIN CODE")} INFO
              </th>
              {(activeTab === "subcategory" ||
                activeTab === "districts" ||
                activeTab === "cities" ||
                activeTab === "pincodes") && <th>PARENT MAPPING</th>}
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "3rem" }}
                >
                  Fetching records...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "3rem" }}
                >
                  No matching records found.
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div className="icon-box">
                        {activeTab === "category" ? (
                          <Tags size={18} />
                        ) : activeTab === "subcategory" ? (
                          <Layers size={18} />
                        ) : (
                          <MapPin size={18} />
                        )}
                      </div>
                      <div>
                        <p
                          style={{
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            marginBottom: "0.1rem",
                          }}
                        >
                          {item.name || item.pincode}
                        </p>
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-secondary)",
                            fontWeight: 500,
                          }}
                        >
                          ID: #{item.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  {activeTab === "subcategory" && (
                    <td>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--accent-primary)",
                        }}
                      >
                        {item.category_name}
                      </span>
                    </td>
                  )}
                  {activeTab === "districts" && (
                    <td>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--accent-primary)",
                        }}
                      >
                        {item.state_name}
                      </span>
                    </td>
                  )}
                  {activeTab === "cities" && (
                    <td>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--accent-primary)",
                        }}
                      >
                        {item.district_name}
                      </span>
                    </td>
                  )}
                  {activeTab === "pincodes" && (
                    <td>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--accent-primary)",
                        }}
                      >
                        {item.city_name}
                      </span>
                    </td>
                  )}
                  <td>
                    <span
                      className={`status-badge ${item.is_active !== false ? "active" : "inactive"}`}
                    >
                      {item.is_active !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        className="action-btn"
                        onClick={() => openForm(item)}
                        style={{ color: "var(--accent-secondary)" }}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Unified Form Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div
            className="modal-content premium-card"
            style={{ maxWidth: "450px", padding: "2.5rem" }}
          >
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <X size={20} />
            </button>
            <h2
              style={{
                marginBottom: "2rem",
                fontFamily: "serif",
                color: "var(--accent-primary)",
                fontSize: "1.5rem",
              }}
            >
              {editingId ? "Update" : "Configure"}{" "}
              {activeTab.charAt(0).toUpperCase() +
                activeTab.slice(1).replace("pincodes", "Pin Code")}
            </h2>

            <form onSubmit={handleSubmit} className="premium-form">
              {/* Parent Selectors for hierarchy tabs */}
              {activeTab === "subcategory" && (
                <div className="form-group">
                  <label className="form-label">Parent Category</label>
                  <select
                    className="form-input"
                    required
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === "districts" && (
                <div className="form-group">
                  <label className="form-label">Parent State</label>
                  <select
                    className="form-input"
                    required
                    value={formData.state_id}
                    onChange={(e) =>
                      setFormData({ ...formData, state_id: e.target.value })
                    }
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === "cities" && (
                <>
                  <div className="form-group">
                    <label className="form-label">Select State</label>
                    <select
                      className="form-input"
                      value={formData.state_id || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          state_id: e.target.value,
                          district_id: "",
                        })
                      }
                    >
                      <option value="">All States</option>
                      {states.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Parent District</label>
                    <select
                      className="form-input"
                      required
                      value={formData.district_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          district_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Select District</option>
                      {districts
                        .filter(
                          (d) =>
                            !formData.state_id ||
                            d.state_id.toString() ===
                              formData.state_id.toString(),
                        )
                        .map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </>
              )}

              {activeTab === "pincodes" && (
                <>
                  <div className="form-group">
                    <label className="form-label">Select District</label>
                    <select
                      className="form-input"
                      value={formData.district_id || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          district_id: e.target.value,
                          city_id: "",
                        })
                      }
                    >
                      <option value="">All Districts</option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Parent City/Town</label>
                    <select
                      className="form-input"
                      required
                      value={formData.city_id}
                      onChange={(e) =>
                        setFormData({ ...formData, city_id: e.target.value })
                      }
                    >
                      <option value="">Select City/Town</option>
                      {cities
                        .filter(
                          (c) =>
                            !formData.district_id ||
                            c.district_id.toString() ===
                              formData.district_id.toString(),
                        )
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </>
              )}

              {/* Primary input field */}
              <div className="form-group" style={{ marginTop: "1rem" }}>
                <label className="form-label">
                  {activeTab === "pincodes"
                    ? "Pincode Value"
                    : activeTab === "subcategory"
                      ? "Sub-Category Name"
                      : activeTab === "cities"
                        ? "City/Town Name"
                        : "Name"}
                </label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={formData.name || formData.pincode || ""}
                  onChange={(e) => {
                    if (activeTab === "pincodes")
                      setFormData({ ...formData, pincode: e.target.value });
                    else setFormData({ ...formData, name: e.target.value });
                  }}
                />
              </div>

              {/* Status Toggle for all */}
              <div
                className="form-group"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginTop: "1.5rem",
                }}
              >
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active !== false}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                />
                <label
                  htmlFor="is_active"
                  className="form-label"
                  style={{ margin: 0, fontWeight: 600 }}
                >
                  Mark as Active
                </label>
              </div>

              <button
                type="submit"
                className="btn"
                style={{
                  marginTop: "2.5rem",
                  background: "var(--accent-primary)",
                  color: "#1a1510",
                  fontWeight: 600,
                }}
              >
                {editingId ? "Update Configuration" : "Save New Entry"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="modal-overlay">
          <div
            className="modal-content premium-card"
            style={{ maxWidth: "600px", padding: "2.5rem" }}
          >
            <button
              className="modal-close"
              onClick={() => setShowBulkModal(false)}
            >
              <X size={20} />
            </button>

            <h2
              style={{
                marginBottom: "1.5rem",
                fontFamily: "serif",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <Upload size={24} color="var(--accent-primary)" />
              Bulk Location Import
            </h2>

            {bulkStep === 1 ? (
              <div style={{ padding: "1rem 0" }}>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    marginBottom: "2rem",
                  }}
                >
                  Select the type of data you want to import:
                </p>
                <div
                  className="import-type-card"
                  onClick={() => setBulkStep(2)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                    padding: "2rem",
                    background: "#f8fafc",
                    borderRadius: "1rem",
                    cursor: "pointer",
                    border: "2px solid transparent",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      padding: "1rem",
                      background: "#fff",
                      borderRadius: "0.75rem",
                      color: "var(--accent-primary)",
                    }}
                  >
                    <MapPin size={32} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>
                      Geo Location Data
                    </h3>
                    <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
                      Import States, Districts, Cities and Pincodes at once.
                    </p>
                  </div>
                </div>
              </div>
            ) : bulkStep === 2 ? (
              <form onSubmit={handleBulkUpload}>
                <div
                  className="upload-dropzone"
                  onClick={() => document.getElementById("bulk-file").click()}
                  style={{
                    padding: "3rem 2rem",
                    border: "2px dashed #e2e8f0",
                    borderRadius: "1rem",
                    textAlign: "center",
                    background: "#f8fafc",
                    marginBottom: "1.5rem",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="file"
                    id="bulk-file"
                    hidden
                    accept=".xlsx, .xls, .csv, .json"
                    onChange={(e) => setBulkFile(e.target.files[0])}
                  />
                  {bulkFile ? (
                    <div>
                      <FileText
                        size={48}
                        style={{
                          margin: "0 auto 1rem",
                          color: "var(--accent-primary)",
                        }}
                      />
                      <p style={{ fontWeight: 600 }}>{bulkFile.name}</p>
                      <p style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        {(bulkFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload
                        size={48}
                        style={{ margin: "0 auto 1rem", color: "#94a3b8" }}
                      />
                      <p style={{ fontWeight: 600 }}>
                        Click to select or drag and drop
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        Supported: CSV, XLSX, JSON
                      </p>
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    type="button"
                    className="btn"
                    style={{ background: "#f1f5f9", color: "#64748b" }}
                    onClick={() => setBulkStep(1)}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    disabled={!bulkFile || uploading}
                    style={{
                      background: "var(--accent-primary)",
                      color: "#1a1510",
                    }}
                  >
                    {uploading ? "Processing Data..." : "Start Import"}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  {bulkResult?.summary?.failed > 0 ? (
                    <AlertCircle size={64} color="#ef4444" />
                  ) : (
                    <CheckCircle2 size={64} color="#10b981" />
                  )}
                </div>
                <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                  Import Completed
                </h3>

                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "center",
                    background: "#f8fafc",
                    padding: "1.5rem",
                    borderRadius: "1rem",
                    marginBottom: "2rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                        textTransform: "uppercase",
                      }}
                    >
                      Total
                    </p>
                    <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                      {bulkResult?.summary?.total}
                    </p>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      borderLeft: "1px solid #e2e8f0",
                      borderRight: "1px solid #e2e8f0",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                        textTransform: "uppercase",
                      }}
                    >
                      Success
                    </p>
                    <p
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: "#10b981",
                      }}
                    >
                      {bulkResult?.summary?.success}
                    </p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                        textTransform: "uppercase",
                      }}
                    >
                      Failed
                    </p>
                    <p
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: "#ef4444",
                      }}
                    >
                      {bulkResult?.summary?.failed}
                    </p>
                  </div>
                </div>

                {bulkResult?.errors?.length > 0 && (
                  <div
                    style={{
                      maxHeight: "150px",
                      overflowY: "auto",
                      textAlign: "left",
                      marginBottom: "2rem",
                      padding: "1rem",
                      background: "#fff1f2",
                      borderRadius: "0.5rem",
                      border: "1px solid #fecaca",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: "#991b1b",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Error Details:
                    </p>
                    {bulkResult.errors.map((err, i) => (
                      <p
                        key={i}
                        style={{ fontSize: "0.75rem", color: "#b91c1c" }}
                      >
                        Row {err.row}: {err.error}
                      </p>
                    ))}
                  </div>
                )}

                <button
                  className="btn"
                  style={{
                    background: "var(--accent-primary)",
                    color: "#1a1510",
                  }}
                  onClick={() => setShowBulkModal(false)}
                >
                  Close & Refresh Data
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .import-type-card:hover { border-color: var(--accent-primary); background: #f1f5f9 !important; }
        .upload-dropzone:hover { border-color: var(--accent-primary); background: #f1f5f9 !important; }
        .masters-container {
          animation: fadeIn 0.5s ease;
        }
        .actions-cell {
          width: 100px;
        }
        .premium-form select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Masters;
