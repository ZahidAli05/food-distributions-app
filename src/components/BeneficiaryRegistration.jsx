import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BeneficiaryRegistration.css';

const BeneficiaryRegistration = ({ registerBeneficiary, user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cnic: '',
    name: '',
    phone: '',
    address: '',
    familyMembers: 1,
    incomeLevel: 'Low',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBeneficiary = registerBeneficiary(formData);
    setRegistrationId(newBeneficiary.id);
    setIsSubmitted(true);
    
    setFormData({
      cnic: '',
      name: '',
      phone: '',
      address: '',
      familyMembers: 1,
      incomeLevel: 'Low',
    });
  };

  const formatCNIC = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 13) {
      let formatted = cleaned;
      if (cleaned.length > 5) {
        formatted = cleaned.slice(0, 5) + '-' + cleaned.slice(5);
      }
      if (cleaned.length > 12) {
        formatted = cleaned.slice(0, 5) + '-' + cleaned.slice(5, 12) + '-' + cleaned.slice(12);
      }
      return formatted;
    }
    return value;
  };

  if (user && user.role !== 'admin') {
    navigate('/dashboard');
  }

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-header">
          <h1><i className="fas fa-user-plus"></i> Beneficiary Registration</h1>
          <p className="subtitle">Register new beneficiaries for food assistance</p>
        </div>

        {isSubmitted ? (
          <div className="confirmation-section">
            <div className="confirmation-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Registration Successful!</h2>
            <p>Your registration has been submitted for approval.</p>
            <div className="confirmation-details">
              <p><strong>Registration ID:</strong> {registrationId}</p>
              <p><strong>Status:</strong> <span className="status-pending">Pending Approval</span></p>
              <p className="note">You will receive a token number and pickup schedule after approval.</p>
            </div>
            <button onClick={() => setIsSubmitted(false)} className="btn-new-registration">
              <i className="fas fa-plus"></i> Register Another Beneficiary
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cnic">
                  <i className="fas fa-id-card"></i> CNIC Number
                </label>
                <input
                  type="text"
                  id="cnic"
                  name="cnic"
                  value={formData.cnic}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    cnic: formatCNIC(e.target.value)
                  }))}
                  placeholder="42101-1234567-8"
                  pattern="\d{5}-\d{7}-\d{1}"
                  required
                />
                <small>Format: 42101-1234567-8</small>
              </div>

              <div className="form-group">
                <label htmlFor="name">
                  <i className="fas fa-user"></i> Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">
                  <i className="fas fa-phone"></i> Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03XX-XXXXXXX"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="familyMembers">
                  <i className="fas fa-users"></i> Family Members
                </label>
                <select
                  id="familyMembers"
                  name="familyMembers"
                  value={formData.familyMembers}
                  onChange={handleChange}
                  required
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num} member{num !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="incomeLevel">
                <i className="fas fa-money-bill-wave"></i> Income Level
              </label>
              <div className="income-level-options">
                {['Very Low', 'Low', 'Middle'].map(level => (
                  <label key={level} className="income-option">
                    <input
                      type="radio"
                      name="incomeLevel"
                      value={level}
                      checked={formData.incomeLevel === level}
                      onChange={handleChange}
                    />
                    <span className={`income-label income-${level.toLowerCase().replace(' ', '-')}`}>
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">
                <i className="fas fa-home"></i> Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter complete address"
                rows="3"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                <i className="fas fa-paper-plane"></i> Submit Registration
              </button>
              <button type="button" className="btn-cancel" onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BeneficiaryRegistration;