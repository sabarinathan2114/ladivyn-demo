import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const MastersDistricts = () => {
  const [districts, setDistricts] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', state_id: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDistricts();
    fetchStates();
  }, []);

  const fetchDistricts = async () => {
    try {
      // Use the generic "get all" if exists, otherwise we might need a specific endpoint
      // Assuming GET /api/locations/districts returns all
      const res = await axios.get('http://localhost:5000/api/locations/districts');
      setDistricts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStates = async () => {
    const res = await axios.get('http://localhost:5000/api/locations/states');
    setStates(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`http://localhost:5000/api/locations/districts/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        fetchDistricts();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } };
      if (editingId) {
        await axios.put(`http://localhost:5000/api/locations/districts/${editingId}`, formData, config);
      } else {
        await axios.post('http://localhost:5000/api/locations/districts', formData, config);
      }
      setShowModal(false);
      setFormData({ name: '', state_id: '' });
      setEditingId(null);
      fetchDistricts();
    } catch (error) {
      alert('Save failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="header-actions">
        <div>
          <h1 className="page-title">District Master</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage Districts by State.</p>
        </div>
        <button className="btn" style={{ width: 'auto' }} onClick={() => {
          setEditingId(null);
          setFormData({ name: '', state_id: '' });
          setShowModal(true);
        }}>
          <Plus size={20} /> Add District
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>District Name</th>
              <th>Parent State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {districts.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td style={{ fontWeight: 600 }}>{d.name}</td>
                <td>{d.state_name}</td>
                <td>
                  <button className="action-btn" onClick={() => {
                    setEditingId(d.id);
                    setFormData({ name: d.name, state_id: d.state_id });
                    setShowModal(true);
                  }}><Edit2 size={18} /></button>
                  <button className="action-btn delete" onClick={() => handleDelete(d.id)}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}><X size={24} /></button>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit District' : 'Add District'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Parent State</label>
                <select className="form-input" required value={formData.state_id} onChange={(e) => setFormData({...formData, state_id: e.target.value})}>
                  <option value="">Select State</option>
                  {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">District Name</label>
                <input type="text" className="form-input" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <button type="submit" className="btn" style={{ marginTop: '1rem' }}>{editingId ? 'Update' : 'Save'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MastersDistricts;
