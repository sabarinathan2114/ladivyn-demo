import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  ShoppingBag,
  Users as UsersIcon,
  IndianRupee,
  Package,
  Clock,
  ArrowUpRight,
  Activity,
} from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/system/dashboard-stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          },
        );

        setStats({
          users: res.data.customers,
          products: res.data.products,
          orders: res.data.orders,
          revenue: res.data.revenue,
          recentActivity: res.data.recentActivity || [],
        });
      } catch (error) {
        console.error("Failed to fetch dashboard statistics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const metricCards = [
    {
      label: "Portfolio Revenue",
      value: `₹${parseFloat(stats.revenue).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
      icon: IndianRupee,
      color: "var(--accent-primary)",
      trend: "+18.4%",
      isPositive: true,
    },
    {
      label: "Active Inventory",
      value: stats.products,
      icon: Package,
      color: "#6366f1",
      trend: `${stats.products} SKU`,
      isPositive: true,
    },
    {
      label: "Loyal Customers",
      value: stats.users,
      icon: UsersIcon,
      color: "#10b981",
      trend: "+2.1%",
      isPositive: true,
    },
    {
      label: "Gross Orders",
      value: stats.orders,
      icon: ShoppingBag,
      color: "#f59e0b",
      trend: "12-mo peak",
      isPositive: true,
    },
  ];

  if (loading)
    return (
      <div
        style={{
          padding: "4rem",
          textAlign: "center",
          color: "var(--text-secondary)",
        }}
      >
        <Activity
          className="animate-spin"
          style={{ margin: "0 auto 1rem", display: "block" }}
        />
        Synchronizing luxury storefront metrics...
      </div>
    );

  return (
    <div className="home-container">
      <div className="header-actions" style={{ marginBottom: "2.5rem" }}>
        <div>
          <h1
            className="page-title"
            style={{
              fontFamily: "serif",
              letterSpacing: "0.01em",
              fontSize: "2.25rem",
            }}
          >
            Hi, {user?.name}!
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>
            Welcome back to your curated administrative console.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
          }}
        >
          <Clock size={16} /> Precision sync:{" "}
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      <div
        className="dashboard-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(430px, 1fr))",
          gap: "2rem",
          marginBottom: "3rem",
        }}
      >
        {metricCards.map((card, idx) => (
          <div
            key={idx}
            className="premium-card"
            style={{
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  padding: "0.85rem",
                  borderRadius: "1.2rem",
                  background: `${card.color}10`,
                  color: card.color,
                }}
              >
                <card.icon size={26} />
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: card.isPositive ? "#10b981" : "#ef4444",
                  background: card.isPositive ? "#ecfdf5" : "#fef2f2",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "2rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <ArrowUpRight size={14} /> {card.trend}
              </div>
            </div>
            <div>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                  marginBottom: "0.5rem",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                {card.label}
              </p>
              <h2
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                {card.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Home;
