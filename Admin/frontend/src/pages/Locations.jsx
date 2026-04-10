import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, ChevronRight } from 'lucide-react';

const Locations = () => {
  const [activeTab, setActiveTab] = useState('states'); // states, districts, cities, pincodes
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Parent Data for Dropdowns
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    name: '', pincode: '', state_id: '', district_id: '', city_id: ''
  });

  useEffect(() => {
    fetchData();
    fetchAllParents();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5001/api/locations/${activeTab === 'pincodes' ? 'pincodes' : activeTab}`;
      // Note: Backend might need a "GET ALL" for districts/cities/pincodes if we want to list them all.
      // For now, let's assume we want to manage them hierarchically or simply fetch all.
      // If backend doesn't have "get all districts", we'll need to add it or modify this.
      const res = await axios.get(url);
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllParents = async () => {
    try {
      const [s] = await Promise.all([
        axios.get('http://localhost:5001/api/locations/states')
      ]);
      setStates(s.data);
    } catch (err) {}
  };

  const handleStateChange = async (stateId) => {
    setFormData({...formData, state_id: stateId, district_id: '', city_id: ''});
    if (stateId) {
      const res = await axios.get(`http://localhost:5001/api/locations/states/${stateId}/districts`);
      setDistricts(res.data);
    }
  };

  const handleDistrictChange = async (districtId) => {
    setFormData({...formData, district_id: districtId, city_id: ''});
    if (districtId) {
      const res = await axios.get(`http://localhost:5001/api/locations/districts/${districtId}/cities`);
      setCities(res.data);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`http://localhost:5001/api/locations/${activeTab}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        });
        fetchData();
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
        await axios.put(`http://localhost:5001/api/locations/${activeTab}/${editingId}`, formData, config);
      } else {
        await axios.post(`http://localhost:5001/api/locations/${activeTab}`, formData, config);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      alert('Save failed');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', pincode: '', state_id: '', district_id: '', city_id: '' });
    setEditingId(null);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    if (activeTab === 'states') setFormData({ name: item.name });
    if (activeTab === 'districts') setFormData({ name: item.name, state_id: item.state_id });
    if (activeTab === 'cities') setFormData({ name: item.name, district_id: item.district_id });
    if (activeTab === 'pincodes') setFormData({ pincode: item.pincode, city_id: item.city_id });
    setShowModal(true);
  };

  const renderFormFields = () => {
    switch(activeTab) {
      case 'states':
        return (
          <div className="form-group">
            <label className="form-label">State Name</label>
            <input type="text" className="form-input" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
        );
      case 'districts':
        return (
          <>
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
          </>
        );
      case 'cities':
        return (
          <>
            <div className="form-group">
              <label className="form-label">State</label>
              <select className="form-input" required value={formData.state_id} onChange={(e) => handleStateChange(e.target.value)}>
                <option value="">Select State</option>
                {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
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
          </>
        );
      case 'pincodes':
        return (
          <>
            <div className="form-group">
              <label className="form-label">District</label>
              <select className="form-input" required value={formData.district_id} onChange={(e) => handleDistrictChange(e.target.value)}>
                <option value="">Select District</option>
                {/* We'd need to fetch districts for the selected state if we wanted to be perfect here */}
                {/* For brevity, let's assume we can pick parent city more simply or show all towns */}
                <option value="temp">Please select state first logic...</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Parent City</label>
              <select className="form-input" required value={formData.city_id} onChange={(e) => setFormData({...formData, city_id: e.target.value})}>
                <option value="">Select City</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input type="text" className="form-input" required value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} />
            </div>
          </>
        );
      default: return null;
    }
  };

  return (
    <div>
      <div className="header-actions">
        <div>
          <h1 className="page-title">Location Masters</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage hierarchical geographical data.</p>
        </div>
        <button className="btn" style={{ width: 'auto' }} onClick={() => {
          resetForm();
          setShowModal(true);
        }}>
          <Plus size={20} /> Add {activeTab.slice(0, -1)}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {['states', 'districts', 'cities', 'pincodes'].map(tab => (
          <button 
            key={tab} 
            className={`btn ${activeTab === tab ? '' : 'btn-secondary'}`}
            style={{ width: 'auto', background: activeTab === tab ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', border: 'none' }}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name / Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>Loading data...</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td style={{ fontWeight: 600 }}>{item.name || item.pincode}</td>
                  <td>
                    <button className="action-btn" onClick={() => openEditModal(item)}><Edit2 size={18} /></button>
                    <button className="action-btn delete" onClick={() => handleDelete(item.id)}><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}><X size={24} /></button>
            <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}</h2>
            <form onSubmit={handleSubmit}>
              {renderFormFields()}
              <button type="submit" className="btn" style={{ marginTop: '1rem' }}>{editingId ? 'Update' : 'Save'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Locations;
