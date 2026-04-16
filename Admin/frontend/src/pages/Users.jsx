import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  UserCheck,
  Shield,
  Filter,
  ChevronDown,
  User,
} from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    mobile: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert("Failed to delete user");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/users/${editingId}`, {
          ...formData,
          is_active: true,
        });
      } else {
        await axios.post("http://localhost:5000/api/auth/register", formData);
      }
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save user");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "admin",
      mobile: "",
    });
    setEditingId(null);
  };

  const openEditModal = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Don't show password
      role: user.role,
      mobile: user.mobile || "",
    });
    setEditingId(user.id);
    setShowModal(true);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="users-container">
      <div className="header-actions">
        <div>
          <h1 className="page-title" style={{ fontFamily: "serif" }}>
            System Team
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Manage internal administrators and specialized staff.
          </p>
        </div>
        <button
          className="btn"
          style={{
            width: "auto",
            background: "var(--accent-primary)",
            color: "#1a1510",
          }}
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <Plus size={20} /> Add Admin
        </button>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-row">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by team member name or email..."
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
          <option value="role">Sort by: Role</option>
          <option value="status">Sort by: Status</option>
        </select>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Team Member</th>
              <th>Role / Dept</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div
                      className="icon-box"
                      style={{
                        background:
                          user.role === "superadmin" ? "#fef2f2" : "#f0f9ff",
                        color:
                          user.role === "superadmin" ? "#ef4444" : "#0ea5e9",
                        borderRadius: "50%",
                      }}
                    >
                      <User size={20} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          marginBottom: "0.1rem",
                        }}
                      >
                        {user.name}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-secondary)",
                          fontWeight: 500,
                        }}
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    style={{
                      padding: "0.35rem 0.75rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      background:
                        user.role === "superadmin"
                          ? "#fef2f2"
                          : user.role === "manager"
                            ? "#ecfdf5"
                            : "#eff6ff",
                      color:
                        user.role === "superadmin"
                          ? "#ef4444"
                          : user.role === "manager"
                            ? "#10b981"
                            : "#3b82f6",
                    }}
                  >
                    {user.role}
                  </span>
                </td>
                <td
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  {user.mobile || "N/A"}
                </td>
                <td>
                  <span
                    className={`status-badge ${user.is_active ? "active" : "inactive"}`}
                  >
                    {user.is_active ? "Authorized" : "Disabled"}
                  </span>
                </td>
                <td className="actions-cell">
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="action-btn"
                      onClick={() => openEditModal(user)}
                      style={{ color: "var(--accent-primary)" }}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(user.id)}
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
            className="modal-content premium-card"
            style={{ maxWidth: "450px", padding: "2.5rem" }}
          >
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <X size={24} />
            </button>
            <h2
              style={{
                marginBottom: "2rem",
                fontFamily: "serif",
                color: "var(--accent-primary)",
              }}
            >
              {editingId ? "Modify Access" : "Register New Admin"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Legal Name</label>
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
                <label className="form-label">Email Access</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              {!editingId && (
                <div className="form-group">
                  <label className="form-label">Temporary Password</label>
                  <input
                    type="password"
                    className="form-input"
                    required={!editingId}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Direct Mobile</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Security Role</label>
                <select
                  className="form-input"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="admin">Administrator</option>
                  <option value="superadmin">Superadmin</option>
                  <option value="manager">Operations Manager</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn"
                style={{
                  marginTop: "2rem",
                  background: "var(--accent-primary)",
                  color: "#1a1510",
                  fontWeight: 600,
                }}
              >
                {editingId ? "Revise Permissions" : "Authorize Team Member"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .users-container {
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

export default Users;
