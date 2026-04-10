import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Coupons from "./pages/Coupons";
import Inventory from "./pages/Inventory";
import Returns from "./pages/Returns";
import SystemLogs from "./pages/SystemLogs";
import Masters from "./pages/Masters";
import NewProduct from "./pages/NewProduct";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Main Admin Layout */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="new-product" element={<NewProduct />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="returns" element={<Returns />} />
            <Route path="system-logs" element={<SystemLogs />} />

            {/* Unified Master configuration */}
            <Route path="masters" element={<Masters />} />
          </Route>

          {/* Fallback routing */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
