import { useState } from "react";
import { Outlet, Navigate, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Ticket,
  Archive,
  RotateCcw,
  TerminalSquare,
  Layers,
  FileText,
  Search,
  Bell,
  Menu,
  X,
} from "lucide-react";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Protect route
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
    { icon: Package, label: "Products", path: "/dashboard/products" },
    { icon: ShoppingCart, label: "Orders", path: "/dashboard/orders" },
    { icon: Users, label: "System Team", path: "/dashboard/users" },
    { icon: Ticket, label: "Coupons", path: "/dashboard/coupons" },
    { icon: Archive, label: "Inventory Logs", path: "/dashboard/inventory" },
    { icon: RotateCcw, label: "Returns", path: "/dashboard/returns" },
    // { icon: TerminalSquare, label: 'System Logs', path: '/dashboard/system-logs' },
    { icon: Layers, label: "Masters", path: "/dashboard/masters" },
    { icon: FileText, label: "Blogs", path: "/dashboard/blogs" },
  ];

  return (
    <div className={`layout-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div
            style={{
              background: "var(--accent-primary)",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              color: "#1a1510",
              fontWeight: "bold",
              fontSize: "1.2rem",
            }}
          >
            L
          </div>
          <span className="sidebar-title">LADIVYN</span>
        </div>

        <nav className="sidebar-nav">
          <ul style={{ listStyle: "none", padding: 0 }}>
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/dashboard"}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}

            <div
              style={{
                margin: "1.5rem 0",
                height: "1px",
                background: "rgba(255,255,255,0.05)",
              }}
            ></div>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={() => {
              handleLogout();
              setIsSidebarOpen(false);
            }}
            className="logout-btn btn-transparent"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              border: "none",
              cursor: "pointer",
              background: "transparent",
            }}
          >
            <LogOut size={20} />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div style={{ flex: 1 }}></div>

          <div className="user-profile">
            <button
              style={{
                background: "transparent",
                border: "none",
                color: "#64748b",
                cursor: "pointer",
                display: "flex",
              }}
            >
              <Bell size={20} />
            </button>
            <div
              style={{
                height: "24px",
                width: "1px",
                background: "#e2e8f0",
                margin: "0 0.5rem",
              }}
            ></div>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "var(--text-primary)",
                }}
              >
                {user.name}
              </p>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "0.75rem",
                  textTransform: "capitalize",
                }}
              >
                {user.role}
              </p>
            </div>
            <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
          </div>
        </header>

        <div
          className="content-area"
          onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
