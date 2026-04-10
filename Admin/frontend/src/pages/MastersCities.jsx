import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const MastersCities = () => {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', district_id: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCities();
    fetchDistricts();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/locations/cities');
      setCities(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async () => {
    const res = await axios.get('http://localhost:5001/api/locations/districts');
    setDistricts(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`http://localhost:5001/api/locations/cities/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        fetchCities();
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
        await axios.put(`http://localhost:5001/api/locations/cities/${editingId}`, formData, config);
      } else {
        await axios.post('http://localhost:5001/api/locations/cities', formData, config);
      }
      setShowModal(false);
      setFormData({ name: '', district_id: '' });
      setEditingId(null);
      fetchCities();
    } catch (error) {
      alert('Save failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="header-actions">
        <div>
          <h1 className="page-title">City/Town Master</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage Cities and Towns by District.</p>
        </div>
        <button className="btn" style={{ width: 'auto' }} onClick={() => {
          setEditingId(null);
          setFormData({ name: '', district_id: '' });
          setShowModal(true);
        }}>
          <Plus size={20} /> Add City/Town
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>City/Town</th>
              <th>Parent District</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td>{c.district_name}</td>
                <td>
                  <button className="action-btn" onClick={() => {
                    setEditingId(c.id);
                    setFormData({ name: c.name, district_id: c.district_id });
                    setShowModal(true);
                  }}><Edit2 size={18} /></button>
                  <button className="action-btn delete" onClick={() => handleDelete(c.id)}><Trash2 size={18} /></button>
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
            <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit City' : 'Add City'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Parent District</label>
                <select className="form-input" required value={formData.district_id} onChange={(e) => setFormData({...formData, district_id: e.target.value})}>
                  <option value="">Select District</option>
                  {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">City/Town Name</label>
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

export default MastersCities;
