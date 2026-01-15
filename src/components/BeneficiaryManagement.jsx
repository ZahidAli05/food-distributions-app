import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BeneficiaryManagement.css';

const BeneficiaryManagement = ({ beneficiaries, updateBeneficiary, user, distributionCenters, generateTokenNumber }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [filter, setFilter] = useState('all');

  if (!user || user.role !== 'admin') {
    navigate('/dashboard');
  }

  const filteredBeneficiaries = beneficiaries.filter(beneficiary => {
    const matchesSearch = searchTerm === '' || 
      beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      beneficiary.cnic.includes(searchTerm);
    
    const matchesFilter = filter === 'all' || 
      (filter === 'pending' && beneficiary.status === 'pending') ||
      (filter === 'approved' && beneficiary.status === 'approved') ||
      (filter === 'rejected' && beneficiary.status === 'rejected');

    return matchesSearch && matchesFilter;
  });

  const handleEdit = (beneficiary) => {
    setEditingId(beneficiary.id);
    setEditForm({ ...beneficiary });
  };

  const handleSave = (id) => {
    updateBeneficiary(id, editForm);
    setEditingId(null);
  };

  const handleApprove = (id) => {
    updateBeneficiary(id, { status: 'approved', isActive: true });
  };

  const handleReject = (id) => {
    updateBeneficiary(id, { status: 'rejected', isActive: false });
  };

  const handleToggleActive = (id, currentStatus) => {
    updateBeneficiary(id, { isActive: !currentStatus });
  };

  const handleSchedule = (id) => {
    const token = generateTokenNumber();
    const pickupDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const randomCenter = distributionCenters[Math.floor(Math.random() * distributionCenters.length)];
    
    updateBeneficiary(id, {
      tokenNumber: token,
      pickupDate: pickupDate,
      distributionCenter: randomCenter.id,
      distributionStatus: 'scheduled'
    });
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <h1><i className="fas fa-users-cog"></i> Beneficiary Management</h1>
        <p className="subtitle">Manage beneficiary registrations and status</p>
      </div>

      <div className="controls-section">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name or CNIC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({beneficiaries.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({beneficiaries.filter(b => b.status === 'pending').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved ({beneficiaries.filter(b => b.status === 'approved').length})
          </button>
        </div>
      </div>

      <div className="beneficiaries-table-container">
        <table className="beneficiaries-table">
          <thead>
            <tr>
              <th>CNIC</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Family</th>
              <th>Income</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBeneficiaries.map(beneficiary => (
              <tr key={beneficiary.id}>
                <td>{beneficiary.cnic}</td>
                <td>
                  {editingId === beneficiary.id ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    />
                  ) : (
                    beneficiary.name
                  )}
                </td>
                <td>
                  {editingId === beneficiary.id ? (
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    />
                  ) : (
                    beneficiary.phone
                  )}
                </td>
                <td>{beneficiary.familyMembers}</td>
                <td>
                  {editingId === beneficiary.id ? (
                    <select
                      value={editForm.incomeLevel}
                      onChange={(e) => setEditForm({...editForm, incomeLevel: e.target.value})}
                    >
                      <option value="Very Low">Very Low</option>
                      <option value="Low">Low</option>
                      <option value="Middle">Middle</option>
                    </select>
                  ) : (
                    <span className={`income-badge income-${beneficiary.incomeLevel.toLowerCase().replace(' ', '-')}`}>
                      {beneficiary.incomeLevel}
                    </span>
                  )}
                </td>
                <td>
                  <span className={`status-badge status-${beneficiary.status}`}>
                    {beneficiary.status}
                  </span>
                  {beneficiary.isActive === false && <span className="status-badge status-inactive">Inactive</span>}
                </td>
                <td className="actions-cell">
                  {editingId === beneficiary.id ? (
                    <>
                      <button className="btn-action btn-save" onClick={() => handleSave(beneficiary.id)}>
                        <i className="fas fa-save"></i> Save
                      </button>
                      <button className="btn-action btn-cancel" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn-action btn-edit" onClick={() => handleEdit(beneficiary)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      
                      {beneficiary.status === 'pending' && (
                        <>
                          <button className="btn-action btn-approve" onClick={() => handleApprove(beneficiary.id)}>
                            <i className="fas fa-check"></i>
                          </button>
                          <button className="btn-action btn-reject" onClick={() => handleReject(beneficiary.id)}>
                            <i className="fas fa-times"></i>
                          </button>
                        </>
                      )}
                      
                      {beneficiary.status === 'approved' && (
                        <>
                          <button 
                            className="btn-action btn-toggle-active"
                            onClick={() => handleToggleActive(beneficiary.id, beneficiary.isActive)}
                          >
                            <i className={`fas fa-${beneficiary.isActive ? 'pause' : 'play'}`}></i>
                          </button>
                          {!beneficiary.tokenNumber && (
                            <button 
                              className="btn-action btn-schedule"
                              onClick={() => handleSchedule(beneficiary.id)}
                              title="Schedule Pickup"
                            >
                              <i className="fas fa-calendar-plus"></i>
                            </button>
                          )}
                        </>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredBeneficiaries.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-users-slash"></i>
          <p>No beneficiaries found</p>
        </div>
      )}
    </div>
  );
};

export default BeneficiaryManagement;