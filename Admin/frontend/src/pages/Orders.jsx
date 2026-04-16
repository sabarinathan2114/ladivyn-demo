import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Eye, Search, Filter, ClipboardList, Box, 
  ShoppingBag, ChevronDown 
} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(o => 
    (o.order_no && o.order_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (o.customer_name && o.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (o.customer_email && o.customer_email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="orders-container">
      <div className="header-actions">
        <div>
          <h1 className="page-title" style={{ fontFamily: 'serif', letterSpacing: '0.05em' }}>Order Logistics</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track and fulfill luxury customer orders.</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-row">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search order number, customer name, email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button className="filter-btn">
          <Filter size={18} />
          Filter
        </button>

        <select className="sort-select">
          <option value="newest">Sort by: Newest</option>
          <option value="oldest">Sort by: Oldest</option>
          <option value="status">Sort by: Status</option>
        </select>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order Info</th>
              <th>Customer</th>
              <th>Total Amount</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>No orders found.</td></tr>
            ) : filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="icon-box">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.1rem' }}>
                        {order.order_no || `#LDV-${order.id}`}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {order.items_count || 0} Items • {order.payment_method || 'Razorpay'}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.customer_name || order.user_name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{order.customer_email || order.user_email}</span>
                  </div>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  ₹{parseFloat(order.total_amount).toLocaleString()}
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td>
                  <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    style={{
                      background: order.status === 'delivered' ? '#ecfdf5' : (order.status === 'cancelled' ? '#fef2f2' : '#fff7ed'),
                      color: order.status === 'delivered' ? '#10b981' : (order.status === 'cancelled' ? '#ef4444' : '#f59e0b'),
                      border: 'none',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="actions-cell">
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="action-btn" title="View Details" style={{ color: '#3b82f6' }}>
                      <Eye size={18} />
                    </button>
                    <button className="action-btn" title="Logistics" style={{ color: 'var(--accent-primary)' }}>
                      <ClipboardList size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .orders-container {
          animation: slideUp 0.4s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .data-table td {
            vertical-align: middle;
        }
      `}</style>
    </div>
  );
};

export default Orders;
