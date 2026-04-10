import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const MastersPincodes = () => {
  const [pincodes, setPincodes] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ pincode: '', city_id: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPincodes();
    fetchCities();
  }, []);

  const fetchPincodes = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/locations/pincodes');
      setPincodes(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    const res = await axios.get('http://localhost:5001/api/locations/cities');
    setCities(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`http://localhost:5001/api/locations/pincodes/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        fetchPincodes();
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
        await axios.put(`http://localhost:5001/api/locations/pincodes/${editingId}`, formData, config);
      } else {
        await axios.post('http://localhost:5001/api/locations/pincodes', formData, config);
      }
      setShowModal(false);
      setFormData({ pincode: '', city_id: '' });
      setEditingId(null);
      fetchPincodes();
    } catch (error) {
      alert('Save failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="header-actions">
        <div>
          <h1 className="page-title">Pin Code Master</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage Pin Codes by City/Town.</p>
        </div>
        <button className="btn" style={{ width: 'auto' }} onClick={() => {
          setEditingId(null);
          setFormData({ pincode: '', city_id: '' });
          setShowModal(true);
        }}>
          <Plus size={20} /> Add Pin Code
        </button>
      </div>

      <div className="data-table-container" style={{ maxWidth: '800px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Pin Code</th>
              <th>Parent City/Town</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pincodes.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td style={{ fontWeight: 600 }}>{p.pincode}</td>
                <td>{p.city_name}</td>
                <td>
                  <button className="action-btn" onClick={() => {
                    setEditingId(p.id);
                    setFormData({ pincode: p.pincode, city_id: p.city_id });
                    setShowModal(true);
                  }}><Edit2 size={18} /></button>
                  <button className="action-btn delete" onClick={() => handleDelete(p.id)}><Trash2 size={18} /></button>
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
            <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Pin Code' : 'Add Pin Code'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Parent City/Town</label>
                <select className="form-input" required value={formData.city_id} onChange={(e) => setFormData({...formData, city_id: e.target.value})}>
                  <option value="">Select City/Town</option>
                  {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Pin Code</label>
                <input type="text" className="form-input" required value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} />
              </div>
              <button type="submit" className="btn" style={{ marginTop: '1rem' }}>{editingId ? 'Update' : 'Save'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MastersPincodes;
