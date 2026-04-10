import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  X,
  ChevronRight,
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Package,
  DollarSign,
  Tag,
  Layers,
  Barcode,
  FileText,
  Upload,
} from "lucide-react";

const NewProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    subcategory_id: "",
    cost_price: 0,
    display_price: 0,
    has_discount: false,
    discount_percent: 0,
    discount_amount: 0,
    available_qty: 0,
    barcode: "",
    short_description: "",
    description: "",
    is_out_of_stock: false,
    image_url: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryChange = async (catId) => {
    setFormData({ ...formData, category_id: catId, subcategory_id: "" });
    if (catId) {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/categories/${catId}/subcategories`
        );
        setSubcategories(res.data);
      } catch (err) {}
    } else {
      setSubcategories([]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = "";

      // 1. Upload Image if selected
      if (selectedFile) {
        const fileData = new FormData();
        fileData.append("image", selectedFile);
        
        const uploadRes = await axios.post("http://localhost:5001/api/upload", fileData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure auth
          }
        });
        
        finalImageUrl = `http://localhost:5001${uploadRes.data.image}`;
      }

      // 2. Create Product
      const res = await axios.post("http://localhost:5001/api/products", {
        ...formData,
        quantity: formData.available_qty,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const newProductId = res.data.id;

      // 3. Add Image link if uploaded
      if (finalImageUrl) {
        await axios.post(
          `http://localhost:5001/api/products/${newProductId}/images`,
          {
            image_url: finalImageUrl,
            is_primary: true,
          },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
          }
        );
      }

      navigate("/dashboard/products");
    } catch (error) {
      console.error(error);
      alert("Failed to save product. Please verify all required fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-product-container" style={{ paddingBottom: "100px" }}>
      {/* Header Section */}
      <div className="page-header" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            className="action-btn"
            style={{
              background: "#f1f5f9",
              border: "none",
              width: "40px",
              minWidth: "40px",
              height: "40px",
              borderRadius: "8px",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
            onClick={() => navigate("/dashboard/products")}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="page-title">Product Entry</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              Configure your luxury item details.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="premium-form">
        <div className="responsive-page-grid" style={{ marginTop: "1rem" }}>
          {/* Left Column: Primary Details */}
          <div className="main-col-8" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Core Details Card */}
            <div className="premium-card" style={{ padding: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "2.5rem",
                }}
              >
                <div
                  style={{
                    width: "4px",
                    height: "24px",
                    background: "var(--accent-primary)",
                    borderRadius: "2px",
                  }}
                ></div>
                <h3
                  style={{
                    fontFamily: "serif",
                    letterSpacing: "0.05em",
                    fontSize: "1.25rem",
                  }}
                >
                  Core Details
                </h3>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Product Name <span style={{ color: "var(--error)" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Diamond Studded Gold Ring"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="responsive-form-row" style={{ marginTop: "1.5rem" }}>
                <div className="form-group">
                  <label className="form-label">
                    Category <span style={{ color: "var(--error)" }}>*</span>
                  </label>
                  <select
                    className="form-input"
                    required
                    value={formData.category_id}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Sub Category</label>
                  <select
                    className="form-input"
                    value={formData.subcategory_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subcategory_id: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Sub Category</option>
                    {subcategories.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "1.5rem" }}>
                <label className="form-label">Short Description</label>
                <textarea
                  className="form-input"
                  rows="3"
                  placeholder="Summary for product cards..."
                  value={formData.short_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      short_description: e.target.value,
                    })
                  }
                ></textarea>
              </div>

              <div className="form-group" style={{ marginTop: "1.5rem" }}>
                <label className="form-label">Global Description</label>
                <textarea
                  className="form-input"
                  rows="8"
                  placeholder="In-depth details about fabric, fit, and craftsmanship..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
              </div>
            </div>

            {/* Pricing & Logistics Card */}
            <div className="premium-card" style={{ padding: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "2rem",
                  color: "var(--accent-primary)",
                }}
              >
                <DollarSign size={20} />
                <h3 style={{ fontFamily: "serif", letterSpacing: "0.05em" }}>
                  PRICING & STOCK
                </h3>
              </div>

              <div className="responsive-form-row">
                <div className="form-group">
                  <label className="form-label">Cost Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    required
                    value={formData.cost_price}
                    onChange={(e) =>
                      setFormData({ ...formData, cost_price: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Display Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    required
                    value={formData.display_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        display_price: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="responsive-form-row" style={{ marginTop: "1.5rem" }}>
                <div className="form-group">
                  <label className="form-label">Available Quantity</label>
                  <input
                    type="number"
                    className="form-input"
                    required
                    value={formData.available_qty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        available_qty: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Barcode / SKU</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="LADV-XXXX"
                    value={formData.barcode}
                    onChange={(e) =>
                      setFormData({ ...formData, barcode: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Media & Meta */}
          <div className="side-col-4" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Media Gallery Card */}
            <div className="premium-card" style={{ padding: "2.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "2rem",
                }}
              >
                <h3
                  style={{
                    fontFamily: "serif",
                    letterSpacing: "0.05em",
                    fontSize: "1.25rem",
                  }}
                >
                  Media Gallery
                </h3>
              </div>

              <input 
                type="file" 
                id="product-image-upload" 
                hidden 
                accept="image/*" 
                onChange={handleFileChange}
              />

              <div
                className="image-upload-dashed"
                onClick={() => document.getElementById('product-image-upload').click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  background: "#f8fafc",
                  borderRadius: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed #d1d5db",
                  marginBottom: "1.5rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  overflow: 'hidden'
                }}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <>
                    <div
                      style={{
                        color: "var(--accent-primary)",
                        marginBottom: "1rem",
                      }}
                    >
                      <Upload size={32} />
                    </div>
                    <p
                      style={{
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Upload Product Assets
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Click or drag images to add to gallery
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Promotional Card */}
            <div className="premium-card" style={{ padding: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "2rem",
                  color: "var(--accent-primary)",
                }}
              >
                <Tag size={20} />
                <h3 style={{ fontFamily: "serif", letterSpacing: "0.05em" }}>
                  PROMOTIONS
                </h3>
              </div>

              <div
                className="form-group"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                }}
              >
                <input
                  type="checkbox"
                  id="has_discount"
                  checked={formData.has_discount}
                  onChange={(e) =>
                    setFormData({ ...formData, has_discount: e.target.checked })
                  }
                />
                <label
                  htmlFor="has_discount"
                  className="form-label"
                  style={{ margin: 0, fontWeight: 600 }}
                >
                  Enable Discounts
                </label>
              </div>

              {formData.has_discount && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  <div className="form-group">
                    <label className="form-label">
                      Discount Percentage (%)
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.discount_percent}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_percent: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Flat Discount Amount (₹)
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.discount_amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_amount: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Inventory Status Card */}
            <div className="premium-card" style={{ padding: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "2rem",
                  color: "var(--error)",
                }}
              >
                <Barcode size={20} />
                <h3 style={{ fontFamily: "serif", letterSpacing: "0.05em" }}>
                  AVAILABILITY
                </h3>
              </div>

              <div
                className="form-group"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <input
                  type="checkbox"
                  id="is_out_of_stock"
                  checked={formData.is_out_of_stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_out_of_stock: e.target.checked,
                    })
                  }
                />
                <label
                  htmlFor="is_out_of_stock"
                  className="form-label"
                  style={{ margin: 0, fontWeight: 600, color: "var(--error)" }}
                >
                  Mark as Out of Stock
                </label>
              </div>
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "var(--text-secondary)",
                  marginTop: "0.75rem",
                }}
              >
                Manually overriding status will hide the product from the
                storefront regardless of quantity.
              </p>
            </div>
          </div>
        </div>
        
        {/* Action Bar Footer */}
        <div className="action-bar-footer">
          <button
            type="button"
            style={{
              background: "transparent",
              border: "none",
              color: "#64748b",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "1rem",
            }}
            onClick={() => navigate("/dashboard/products")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn"
            style={{
              width: "auto",
              background: "var(--accent-secondary)",
              color: "#ffffff",
              padding: "0.8rem 2.5rem",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "1rem",
              boxShadow: "none",
            }}
          >
            {loading ? "Finalizing..." : "Finalize Production"}
          </button>
        </div>
      </form>

      <style>{`
        .new-product-container {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default NewProduct;
