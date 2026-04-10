import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldAlert, Receipt, CheckCircle, Clock, Search, RefreshCcw, Filter, ChevronDown, RotateCcw } from 'lucide-react';

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/returns', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setReturns(res.data);
    } catch (error) {
      console.error('Error fetching returns:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5001/api/returns/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchReturns();
    } catch (error) {
      alert('Failed to update return status');
    }
  };

  const statusStyle = (status) => {
    switch(status) {
      case 'requested': return { color: '#f59e0b', bg: '#fef3c7' };
      case 'approved': return { color: '#0ea5e9', bg: '#e0f2fe' };
      case 'rejected': return { color: '#ef4444', bg: '#fee2e2' };
      case 'completed': return { color: '#10b981', bg: '#ecfdf5' };
      default: return { color: '#64748b', bg: '#f1f5f9' };
    }
  };

  const filteredReturns = returns.filter(r => 
    `ORD-${r.order_id}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.return_reason && r.return_reason.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div>Loading records history...</div>;

  return (
    <div className="returns-container">
      <div className="header-actions">
        <div>
          <h1 className="page-title" style={{ fontFamily: 'serif' }}>Disputes & Returns</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage order exceptions and refund authorizations.</p>
        </div>
        <button className="btn btn-transparent" style={{ width: 'auto', border: '1px solid #e2e8f0', color: 'var(--text-primary)', background: '#fff' }} onClick={fetchReturns}>
          <RefreshCcw size={18} /> Refresh Feed
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        <div className="premium-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ padding: '0.75rem', borderRadius: '1rem', background: '#fef3c7', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Action Required</p>
            <h3 style={{ fontSize: '1.5rem' }}>{returns.filter(r => r.status === 'requested').length}</h3>
          </div>
        </div>
        <div className="premium-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ padding: '0.75rem', borderRadius: '1rem', background: '#ecfdf5', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Resolved</p>
            <h3 style={{ fontSize: '1.5rem' }}>{returns.filter(r => r.status === 'completed').length}</h3>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-row">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search Order ID or reason for return..." 
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
          <option value="amount">Sort by: Amount</option>
          <option value="status">Sort by: Status</option>
        </select>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Return Info</th>
              <th>Refund Amount</th>
              <th>Resolution Status</th>
              <th>Detailed Reason</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredReturns.map((r) => {
                const style = statusStyle(r.status);
                return (
              <tr key={r.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="icon-box" style={{ background: '#fef2f2', color: '#ef4444' }}>
                      <RotateCcw size={20} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.1rem' }}>ORD-{r.order_id}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>RTN-ID: #{r.id}</p>
                    </div>
                  </div>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{parseFloat(r.refund_amount).toLocaleString()}</td>
                <td>
                  <select 
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value)}
                    style={{
                      background: style.bg,
                      color: style.color,
                      border: 'none',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="requested">Requested</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td style={{ maxWidth: '280px' }}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.875rem', color: 'var(--text-secondary)' }} title={r.return_reason}>
                        {r.return_reason}
                    </div>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {new Date(r.created_at).toLocaleDateString([], { dateStyle: 'medium' })}
                </td>
              </tr>
            )})}
            {filteredReturns.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                  <ShieldAlert size={40} style={{ margin: '0 auto 1.5rem', opacity: 0.2, display: 'block' }} />
                  Safe Harbor. All returns are currently resolved.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .returns-container {
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

export default Returns;
