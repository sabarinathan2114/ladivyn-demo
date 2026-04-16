import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const MastersStates = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/locations/states');
      setStates(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`http://localhost:5000/api/locations/states/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        fetchStates();
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
        await axios.put(`http://localhost:5000/api/locations/states/${editingId}`, formData, config);
      } else {
        await axios.post('http://localhost:5000/api/locations/states', formData, config);
      }
      setShowModal(false);
      setFormData({ name: '' });
      setEditingId(null);
      fetchStates();
    } catch (error) {
      alert('Save failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="header-actions">
        <div>
          <h1 className="page-title">States Master</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage Indian States.</p>
        </div>
        <button className="btn" style={{ width: 'auto' }} onClick={() => {
          setEditingId(null);
          setFormData({ name: '' });
          setShowModal(true);
        }}>
          <Plus size={20} /> Add State
        </button>
      </div>

      <div className="data-table-container" style={{ maxWidth: '600px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>State Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {states.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td>
                  <button className="action-btn" onClick={() => {
                    setEditingId(s.id);
                    setFormData({ name: s.name });
                    setShowModal(true);
                  }}><Edit2 size={18} /></button>
                  <button className="action-btn delete" onClick={() => handleDelete(s.id)}><Trash2 size={18} /></button>
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
            <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit State' : 'Add State'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">State Name</label>
                <input type="text" className="form-input" required value={formData.name} onChange={(e) => setFormData({name: e.target.value})} />
              </div>
              <button type="submit" className="btn" style={{ marginTop: '1rem' }}>{editingId ? 'Update' : 'Save'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MastersStates;
