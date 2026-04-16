import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Image as ImageIcon,
  Box,
  Eye,
  Filter,
  ChevronDown,
  Upload,
  FileDown,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Image handling
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [productImages, setProductImages] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    subcategory_id: "",
    cost_price: 0,
    display_price: 0,
    has_discount: false,
    discount_percent: 0,
    discount_amount: 0,
    quantity: 0,
    barcode: "",
    short_description: "",
    description: "",
    is_out_of_stock: false,
  });
  const [editingId, setEditingId] = useState(null);

  // Bulk Upload states
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        fetchProducts();
      } catch (error) {
        alert("Failed to delete product");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          formData,
        );
      } else {
        await axios.post("http://localhost:5000/api/products", formData);
      }
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      alert("Failed to save product");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category_id: "",
      subcategory_id: "",
      cost_price: 0,
      display_price: 0,
      has_discount: false,
      discount_percent: 0,
      discount_amount: 0,
      quantity: 0,
      barcode: "",
      short_description: "",
      description: "",
      is_out_of_stock: false,
    });
    setEditingId(null);
    setSubcategories([]);
  };

  const handleCategoryChange = async (catId) => {
    setFormData({ ...formData, category_id: catId, subcategory_id: "" });
    if (catId) {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/categories/${catId}/subcategories`,
        );
        setSubcategories(res.data);
      } catch (err) {}
    } else {
      setSubcategories([]);
    }
  };

  const openEditModal = async (product) => {
    setFormData({
      name: product.name,
      category_id: product.category_id || "",
      subcategory_id: product.subcategory_id || "",
      cost_price: product.cost_price,
      display_price: product.display_price,
      has_discount: product.has_discount === 1 || product.has_discount === true,
      discount_percent: product.discount_percent || 0,
      discount_amount: product.discount_amount || 0,
      quantity: product.quantity,
      barcode: product.barcode || "",
      short_description: product.short_description || "",
      description: product.description || "",
      is_out_of_stock:
        product.is_out_of_stock === 1 || product.is_out_of_stock === true,
    });

    if (product.category_id) {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/categories/${product.category_id}/subcategories`,
        );
        setSubcategories(res.data);
      } catch (err) {}
    }

    setEditingId(product.id);
    setShowModal(true);
  };

  const openImageModal = async (product) => {
    setSelectedProduct(product);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/products/${product.id}`,
      );
      setProductImages(res.data.images || []);
    } catch (error) {
      console.error(error);
    }
    setShowImageModal(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      // 1. Upload to server
      const uploadRes = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        },
      );

      const fullImageUrl = `http://localhost:5000${uploadRes.data.image}`;

      // 2. Persist to DB
      await axios.post(
        `http://localhost:5000/api/products/${selectedProduct.id}/images`,
        {
          image_url: fullImageUrl,
          is_primary: productImages.length === 0,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        },
      );

      // 3. Refresh display
      const res = await axios.get(
        `http://localhost:5000/api/products/${selectedProduct.id}`,
      );
      setProductImages(res.data.images || []);
      fetchProducts(); // Update main table too
      setShowImageModal(false); // Auto-close on success
    } catch (err) {
      alert("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/products/${selectedProduct.id}/images/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        },
      );

      // Refresh management modal
      const res = await axios.get(
        `http://localhost:5000/api/products/${selectedProduct.id}`,
      );
      setProductImages(res.data.images || []);
      fetchProducts(); // Update main list too
    } catch (error) {
      alert("Failed to delete image");
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!bulkFile) return;

    setUploading(true);
    setBulkResult(null);

    const formData = new FormData();
    formData.append("file", bulkFile);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/products/bulk-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        },
      );
      setBulkResult(res.data);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Category,SubCategory,CostPrice,DisplayPrice,HasDiscount,DiscountPercent,DiscountAmount,ShortDescription,Description,Quantity,IsOutOfStock,Barcode\n" +
      "Luxury Gold Ring,Jewelry,Rings,5000,12000,TRUE,10,1200,Hand-crafted rings...,Full description here...,50,FALSE,LADV-001";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "product_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.barcode &&
          p.barcode.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory =
        selectedCategory === "" ||
        p.category_id.toString() === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-low")
        return parseFloat(a.display_price) - parseFloat(b.display_price);
      if (sortBy === "price-high")
        return parseFloat(b.display_price) - parseFloat(a.display_price);
      if (sortBy === "newest")
        return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "oldest")
        return new Date(a.created_at) - new Date(b.created_at);
      return 0;
    });

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="products-container">
      <div className="header-actions">
        <div>
          <h1
            className="page-title"
            style={{ fontFamily: "serif", letterSpacing: "0.05em" }}
          >
            Product Management
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Curate and manage your luxury inventory.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            className="btn"
            style={{
              background: "#f8fafc",
              color: "#64748b",
              border: "1px solid #e2e8f0",
              width: "auto",
            }}
            onClick={() => {
              setBulkResult(null);
              setBulkFile(null);
              setShowBulkModal(true);
            }}
          >
            <Upload size={18} />
            <span>Bulk Import</span>
          </button>
          <button
            className="btn"
            style={{
              width: "auto",
              background: "var(--accent-primary)",
              color: "#1a1510",
            }}
            onClick={() => navigate("/dashboard/new-product")}
          >
            <Plus size={20} /> Add Product
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-row">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search products, categories, SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Sort by: Newest</option>
          <option value="oldest">Sort by: Oldest</option>
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
        </select>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product Info</th>
              <th>Category</th>
              <th>Sub Category</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div className="icon-box">
                      {product.primary_image ? (
                        <img
                          src={product.primary_image ? (product.primary_image.startsWith("http") ? product.primary_image : `http://localhost:5000${product.primary_image.startsWith("/") ? "" : "/"}${product.primary_image}`) : ""}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "0.75rem",
                          }}
                        />
                      ) : (
                        <Box size={20} />
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
                        {product.name}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-secondary)",
                          fontWeight: 500,
                        }}
                      >
                        SKU:{" "}
                        {product.barcode ||
                          `LADV-${product.id.toString().padStart(3, "0")}`}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    style={{
                      background: "#f1f5f9",
                      color: "#64748b",
                      padding: "0.35rem 0.75rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {product.category_name || "Uncategorized"}
                  </span>
                </td>
                <td
                  style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}
                >
                  {product.subcategory_name || "--"}
                </td>
                <td style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                  ₹{parseFloat(product.display_price).toLocaleString()}
                </td>
                <td
                  style={{
                    color:
                      product.quantity < 5
                        ? "var(--error)"
                        : "var(--text-primary)",
                    fontWeight: 600,
                  }}
                >
                  {product.quantity}
                </td>
                <td>
                  <span
                    className={`status-badge ${product.quantity > 0 && !product.is_out_of_stock ? "active" : "inactive"}`}
                  >
                    {product.is_out_of_stock
                      ? "Out of Stock"
                      : product.quantity > 0
                        ? "Active"
                        : "Out of Stock"}
                  </span>
                </td>
                <td className="actions-cell">
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="action-btn"
                      onClick={() => openImageModal(product)}
                      style={{ color: "#3b82f6" }}
                      title="Manage Gallery"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => openEditModal(product)}
                      style={{ color: "var(--accent-primary)" }}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div
            className="modal-content modal-wide premium-card"
            style={{ padding: "2rem", maxWidth: "1200px" }}
          >
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <X size={24} />
            </button>
            <h2
              style={{
                marginBottom: "2.5rem",
                fontFamily: "serif",
                color: "var(--accent-primary)",
                fontSize: "1.75rem",
              }}
            >
              {editingId ? "Edit Product Details" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="modal-grid">
                {/* Column 1: Basic Info */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  <div className="form-group">
                    <label className="form-label">Product Name</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
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

                  <div className="form-group">
                    <label className="form-label">Barcode / SKU</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.barcode}
                      onChange={(e) =>
                        setFormData({ ...formData, barcode: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Column 2: Pricing & Stock */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  <div className="modal-subgrid">
                    <div className="form-group">
                      <label className="form-label">Cost Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-input"
                        required
                        value={formData.cost_price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cost_price: e.target.value,
                          })
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

                  <div
                    className="premium-card"
                    style={{ padding: "1rem", background: "#f8fafc" }}
                  >
                    <div
                      className="form-group"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <input
                        type="checkbox"
                        id="has_discount"
                        checked={formData.has_discount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            has_discount: e.target.checked,
                          })
                        }
                      />
                      <label
                        htmlFor="has_discount"
                        className="form-label"
                        style={{ margin: 0 }}
                      >
                        Enable Discount
                      </label>
                    </div>

                    {formData.has_discount && (
                      <div className="modal-subgrid" style={{ gap: "0.5rem" }}>
                        <div>
                          <label
                            className="form-label"
                            style={{ fontSize: "0.7rem" }}
                          >
                            Discount %
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
                        <div>
                          <label
                            className="form-label"
                            style={{ fontSize: "0.7rem" }}
                          >
                            Fixed Amount
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

                  <div className="form-group">
                    <label className="form-label">Available Quantity</label>
                    <input
                      type="number"
                      className="form-input"
                      required
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                    />
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
                      style={{ margin: 0, color: "var(--error)" }}
                    >
                      Manually Mark Out of Stock
                    </label>
                  </div>
                </div>

                {/* Column 3: Descriptions */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  <div className="form-group">
                    <label className="form-label">Short Description</label>
                    <textarea
                      className="form-input"
                      rows="3"
                      placeholder="Brief highlight (max 150 chars)"
                      value={formData.short_description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          short_description: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Full Description</label>
                    <textarea
                      className="form-input"
                      rows="8"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "1rem",
                  marginTop: "3rem",
                }}
              >
                <button
                  type="button"
                  className="btn"
                  style={{
                    width: "auto",
                    background: "transparent",
                    border: "1px solid #e2e8f0",
                    color: "var(--text-secondary)",
                  }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn"
                  style={{
                    width: "auto",
                    background: "var(--accent-primary)",
                    color: "#1a1510",
                    padding: "0.75rem 2rem",
                    fontSize: "1rem",
                  }}
                >
                  {editingId ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showImageModal && (
        <div className="modal-overlay">
          <div
            className="modal-content premium-card"
            style={{ maxWidth: "600px", padding: "2.5rem" }}
          >
            <button
              className="modal-close"
              onClick={() => {
                setShowImageModal(false);
                setImageUrl("");
              }}
            >
              <X size={24} />
            </button>
            <h2 style={{ marginBottom: "0.5rem", fontFamily: "serif" }}>
              Visual Content Management
            </h2>
            <p
              style={{
                color: "var(--text-secondary)",
                marginBottom: "2rem",
                fontSize: "0.875rem",
              }}
            >
              Appearing in storefront for:{" "}
              <strong style={{ color: "var(--accent-primary)" }}>
                {selectedProduct?.name}
              </strong>
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              {productImages.map((img) => (
                <div
                  key={img.id}
                  style={{
                    border: "2px solid #f1f5f9",
                    borderRadius: "0.75rem",
                    overflow: "hidden",
                    height: "120px",
                    position: "relative",
                  }}
                >
                  <img
                    src={img.image_url}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(img.id);
                    }}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "rgba(255,255,255,0.9)",
                      color: "#ef4444",
                      border: "none",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                    title="Delete Image"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
              ))}
              {productImages.length === 0 && (
                <span
                  style={{
                    color: "var(--text-secondary)",
                    gridColumn: "1/-1",
                    textAlign: "center",
                    padding: "2rem",
                    background: "#f8fafc",
                    borderRadius: "1rem",
                  }}
                >
                  No images attached yet.
                </span>
              )}
            </div>

            <div
              style={{
                padding: "2rem",
                border: "2px dashed #e2e8f0",
                borderRadius: "1rem",
                textAlign: "center",
                background: "#f8fafc",
              }}
            >
              <input
                type="file"
                id="gallery-upload"
                hidden
                accept="image/*"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                className="btn"
                style={{
                  width: "auto",
                  margin: "0 auto",
                  background: "var(--accent-primary)",
                  color: "#1a1510",
                  padding: "0.75rem 2.5rem",
                }}
                onClick={() =>
                  document.getElementById("gallery-upload").click()
                }
                disabled={loading}
              >
                {loading ? "Uploading..." : "Add Product Photo"}
              </button>
              <p
                style={{
                  marginTop: "1rem",
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                }}
              >
                Click to select a high-fidelity image from your device.
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .products-container {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "600px" }}>
            <button
              className="modal-close"
              onClick={() => setShowBulkModal(false)}
            >
              <X size={20} />
            </button>

            <h2
              style={{
                fontFamily: "serif",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <Upload size={24} color="var(--accent-primary)" />
              Bulk Product Import
            </h2>

            {bulkResult ? (
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "1rem",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    marginBottom: "1.5rem",
                    background: "#fff",
                    padding: "1rem",
                    borderRadius: "0.75rem",
                  }}
                >
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                        marginBottom: "0.25rem",
                      }}
                    >
                      TOTAL
                    </p>
                    <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                      {bulkResult.summary.total}
                    </p>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      borderLeft: "1px solid #f1f5f9",
                      borderRight: "1px solid #f1f5f9",
                      color: "#10b981",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                        marginBottom: "0.25rem",
                      }}
                    >
                      SUCCESS
                    </p>
                    <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                      {bulkResult.summary.success}
                    </p>
                  </div>
                  <div
                    style={{ flex: 1, textAlign: "center", color: "#ef4444" }}
                  >
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                        marginBottom: "0.25rem",
                      }}
                    >
                      FAILED
                    </p>
                    <p style={{ fontSize: "1.25rem", fontWeight: 700 }}>
                      {bulkResult.summary.failed}
                    </p>
                  </div>
                </div>

                {bulkResult.errors.length > 0 && (
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        marginBottom: "0.75rem",
                        color: "#ef4444",
                      }}
                    >
                      Error Details:
                    </p>
                    {bulkResult.errors.map((err, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.5rem",
                          background: "#fff",
                          marginBottom: "0.5rem",
                          borderRadius: "0.4rem",
                          color: "#64748b",
                          borderLeft: "3px solid #ef4444",
                        }}
                      >
                        Row {err.row}: {err.error}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  className="btn"
                  style={{ marginTop: "1.5rem" }}
                  onClick={() => {
                    setBulkResult(null);
                    setShowBulkModal(false);
                  }}
                >
                  {" "}
                  Done{" "}
                </button>
              </div>
            ) : (
              <form onSubmit={handleBulkUpload}>
                <div
                  style={{
                    padding: "2.5rem",
                    border: "2px dashed #e2e8f0",
                    borderRadius: "1rem",
                    textAlign: "center",
                    background: "#f8fafc",
                    marginBottom: "1.5rem",
                  }}
                >
                  <input
                    type="file"
                    id="bulk-file"
                    hidden
                    accept=".xlsx, .xls, .csv"
                    onChange={(e) => setBulkFile(e.target.files[0])}
                  />
                  <div
                    onClick={() => document.getElementById("bulk-file").click()}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "1rem",
                        background: "rgba(197, 157, 95, 0.1)",
                        color: "var(--accent-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1.25rem",
                      }}
                    >
                      <Upload size={28} />
                    </div>
                    <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                      {bulkFile
                        ? bulkFile.name
                        : "Click to select Excel or CSV"}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      Support for .xlsx, .xls and .csv files
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    type="button"
                    onClick={downloadTemplate}
                    className="btn"
                    style={{
                      background: "#f8fafc",
                      color: "#64748b",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <FileDown size={18} />
                    <span>Template</span>
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    disabled={!bulkFile || uploading}
                  >
                    {uploading ? "Processing..." : "Start Import"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
