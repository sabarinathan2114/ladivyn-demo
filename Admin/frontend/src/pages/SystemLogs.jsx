import { useState, useEffect } from 'react';
import axios from 'axios';
import { Terminal, Copy, Search, ShieldCheck, Filter, ChevronDown, Activity } from 'lucide-react';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/system/audit/logs', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setLogs(res.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyLog = (log) => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    // Subtle alert logic could be added here
  };

  const filteredLogs = logs.filter(log => 
    (log.action && log.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.table_name && log.table_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (log.record_id && log.record_id.toString().includes(searchTerm))
  );

  if (loading) return <div>Synchronizing audit trail...</div>;

  return (
    <div className="system-logs-container">
      <div className="header-actions">
        <div>
          <h1 className="page-title" style={{ fontFamily: 'serif' }}>System Audit Logs</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Immutable ledger of fundamental database state changes.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.875rem', fontWeight: 600 }}>
           <ShieldCheck size={18} /> End-to-end encrypted logs
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-row">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search action, table, or record ID..." 
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
          <option value="actor">Sort by: Actor</option>
          <option value="table">Sort by: Table</option>
        </select>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Log Entry</th>
              <th>Operation</th>
              <th>Entity Type</th>
              <th>Record ID</th>
              <th>Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => {
                const isMutation = log.action === 'DELETE' || log.action === 'UPDATE';
                return (
              <tr key={log.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="icon-box" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                      <Activity size={18} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.1rem' }}>
                        {log.user_id ? `Admin-${log.user_id}` : 'System Kernel'}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>LOG-ID: #{log.id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ 
                    padding: '0.35rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    background: log.action === 'INSERT' ? '#ecfdf5' : log.action === 'DELETE' ? '#fef2f2' : '#eff6ff',
                    color: log.action === 'INSERT' ? '#10b981' : log.action === 'DELETE' ? '#ef4444' : '#3b82f6'
                  }}>
                    {log.action}
                  </span>
                </td>
                <td>
                    <code style={{ background: '#f8fafc', padding: '0.35rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.8rem', color: '#6366f1', border: '1px solid #e2e8f0', fontWeight: 600 }}>
                        {log.table_name}
                    </code>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{log.record_id}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {new Date(log.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </td>
                <td>
                  <button className="action-btn" onClick={() => copyLog(log)} title="Copy Raw Record" style={{ color: 'var(--accent-primary)' }}>
                    <Copy size={18} />
                  </button>
                </td>
              </tr>
            )})}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                  <Terminal size={40} style={{ margin: '0 auto 1.5rem', opacity: 0.2, display: 'block' }} />
                  Database audit trail is empty for the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .system-logs-container {
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

export default SystemLogs;
