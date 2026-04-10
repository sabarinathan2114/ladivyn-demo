import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Search, Ticket, Calendar, Filter, ChevronDown } from 'lucide-react';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    code: '', discount_percent: '', discount_amount: '', 
    min_order_value: 0, expiry_date: '', is_active: true
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/coupons', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setCoupons(res.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this coupon code segments?')) {
      try {
        await axios.delete(`http://localhost:5001/api/coupons/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        fetchCoupons();
      } catch (error) {
        alert('Failed to delete coupon');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        expiry_date: formData.expiry_date ? formData.expiry_date : null,
      };

      if (editingId) {
        await axios.put(`http://localhost:5001/api/coupons/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
      } else {
        await axios.post('http://localhost:5001/api/coupons', payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
      }
      setShowModal(false);
      resetForm();
      fetchCoupons();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save coupon');
    }
  };

  const resetForm = () => {
    setFormData({ code: '', discount_percent: '', discount_amount: '', min_order_value: 0, expiry_date: '', is_active: true });
    setEditingId(null);
  };

  const openEditModal = (coupon) => {
    setFormData({
      code: coupon.code,
      discount_percent: coupon.discount_percent || '',
      discount_amount: coupon.discount_amount || '',
      min_order_value: coupon.min_order_value,
      expiry_date: coupon.expiry_date ? new Date(coupon.expiry_date).toISOString().split('T')[0] : '',
      is_active: coupon.is_active
    });
    setEditingId(coupon.id);
    setShowModal(true);
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading promotions...</div>;

  return (
    <div className="coupons-container">
      <div className="header-actions">
        <div>
          <h1 className="page-title" style={{ fontFamily: 'serif' }}>Promotions & Coupons</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Drive sales with dynamic discount segments.</p>
        </div>
        <button className="btn" style={{ width: 'auto', background: 'var(--accent-primary)', color: '#1a1510' }} onClick={() => {
          resetForm();
          setShowModal(true);
        }}>
          <Plus size={20} /> Create Segment
        </button>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-row">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search coupon codes (e.g. WELCOME10)..." 
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
          <option value="code">Sort by: Code</option>
          <option value="expiry">Sort by: Expiry</option>
        </select>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Coupon Info</th>
              <th>Benefit Type</th>
              <th>Min Order</th>
              <th>Validity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoupons.map((c) => {
              const isExpired = c.expiry_date && new Date(c.expiry_date) < new Date();
              return (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="icon-box" style={{ background: '#fef3c7', color: '#f59e0b' }}>
                            <Ticket size={18} />
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '0.1rem' }}>{c.code}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>REF: PRM-{c.id}</p>
                        </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {c.discount_percent > 0 ? `${c.discount_percent}% OFF` : `₹${c.discount_amount} OFF`}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>₹{parseFloat(c.min_order_value).toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: isExpired ? '#ef4444' : '#64748b' }}>
                        <Calendar size={14} />
                        {c.expiry_date ? new Date(c.expiry_date).toLocaleDateString([], { dateStyle: 'medium' }) : 'Perpetual'}
                    </div>
                  </td>
                  <td>
                    {isExpired ? (
                      <span className="status-badge inactive">Expired</span>
                    ) : (
                      <span className={`status-badge ${c.is_active ? 'active' : 'inactive'}`}>
                        {c.is_active ? 'Live' : 'Paused'}
                      </span>
                    )}
                  </td>
                  <td className="actions-cell">
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="action-btn" onClick={() => openEditModal(c)} style={{ color: 'var(--accent-primary)' }}>
                        <Edit2 size={18} />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(c.id)}>
                        <Trash2 size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filteredCoupons.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No active promotion matches found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content premium-card" style={{ maxWidth: '480px', padding: '2.5rem' }}>
            <button className="modal-close" onClick={() => setShowModal(false)}><X size={24} /></button>
            <h2 style={{ marginBottom: '2.5rem', fontFamily: 'serif' }}>{editingId ? 'Modify Promotion' : 'Configure New Segment'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Promotional Code</label>
                <input 
                  type="text" className="form-input" style={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em' }} placeholder="E.G. LUXE2024" required 
                  value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Discount %</label>
                  <input 
                    type="number" step="0.01" className="form-input" 
                    value={formData.discount_percent} onChange={(e) => setFormData({...formData, discount_percent: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Flat Amount (₹)</label>
                  <input 
                    type="number" step="0.01" className="form-input" 
                    value={formData.discount_amount} onChange={(e) => setFormData({...formData, discount_amount: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Minimum Purchase (₹)</label>
                  <input 
                    type="number" step="0.01" className="form-input" 
                    value={formData.min_order_value} onChange={(e) => setFormData({...formData, min_order_value: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Expiration Date</label>
                  <input 
                    type="date" className="form-input" 
                    value={formData.expiry_date} onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
                <input 
                  type="checkbox" id="coupon_active"
                  checked={formData.is_active} 
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                />
                <label htmlFor="coupon_active" className="form-label" style={{ margin: 0, fontWeight: 600 }}>Activate Promotion Segment</label>
              </div>

              <button type="submit" className="btn" style={{ marginTop: '2.5rem', background: 'var(--accent-primary)', color: '#1a1510', fontWeight: 700 }}>
                {editingId ? 'Commit Update' : 'Launch Promotion'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .coupons-container {
          animation: slideUp 0.4s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Coupons;
