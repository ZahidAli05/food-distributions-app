// components/FoodScheduling.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FoodScheduling.css';

const FoodScheduling = ({ beneficiaries, updateBeneficiary, distributionCenters, generateTokenNumber }) => {
  const navigate = useNavigate();
  const [selectedBeneficiary, setSelectedBeneficiary] = useState('');
  const [selectedCenter, setSelectedCenter] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [scheduledTokens, setScheduledTokens] = useState([]);

  const unscheduledBeneficiaries = beneficiaries.filter(b => 
    b.status === 'approved' && !b.tokenNumber
  );

  const handleSchedule = () => {
    if (!selectedBeneficiary || !selectedCenter || !pickupDate) {
      alert('Please fill all required fields');
      return;
    }

    const token = generateTokenNumber();
    const beneficiary = beneficiaries.find(b => b.id === parseInt(selectedBeneficiary));
    
    updateBeneficiary(beneficiary.id, {
      tokenNumber: token,
      pickupDate: pickupDate,
      pickupTime: pickupTime,
      distributionCenter: parseInt(selectedCenter),
      distributionStatus: 'scheduled'
    });

    const centerName = distributionCenters.find(c => c.id === parseInt(selectedCenter))?.name;
    setScheduledTokens([...scheduledTokens, {
      token,
      beneficiary: beneficiary.name,
      center: centerName,
      date: pickupDate,
      time: pickupTime
    }]);

    // Reset form
    setSelectedBeneficiary('');
    setSelectedCenter('');
    setPickupDate('');
    setPickupTime('10:00');
  };

  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="scheduling-container">
      <div className="scheduling-header">
        <h1><i className="fas fa-calendar-alt"></i> Food Package Scheduling</h1>
        <p className="subtitle">Schedule pickup dates and generate token numbers</p>
      </div>

      <div className="scheduling-content">
        <div className="scheduling-form-card">
          <h3><i className="fas fa-plus-circle"></i> Schedule New Pickup</h3>
          
          <div className="form-group">
            <label htmlFor="beneficiary">
              <i className="fas fa-user"></i> Select Beneficiary
            </label>
            <select
              id="beneficiary"
              value={selectedBeneficiary}
              onChange={(e) => setSelectedBeneficiary(e.target.value)}
              required
            >
              <option value="">-- Select Beneficiary --</option>
              {unscheduledBeneficiaries.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.cnic}) - Family: {b.familyMembers}
                </option>
              ))}
            </select>
            <small>{unscheduledBeneficiaries.length} beneficiaries awaiting scheduling</small>
          </div>

          <div className="form-group">
            <label htmlFor="center">
              <i className="fas fa-map-marker-alt"></i> Distribution Center
            </label>
            <select
              id="center"
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
              required
            >
              <option value="">-- Select Center --</option>
              {distributionCenters.map(center => (
                <option key={center.id} value={center.id}>
                  {center.name} ({center.address})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">
                <i className="fas fa-calendar"></i> Pickup Date
              </label>
              <input
                type="date"
                id="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={today}
                max={nextWeek}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">
                <i className="fas fa-clock"></i> Pickup Time
              </label>
              <select
                id="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
              >
                {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'].map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <button onClick={handleSchedule} className="btn-generate-schedule">
            <i className="fas fa-ticket-alt"></i> Generate Token & Schedule
          </button>
        </div>

        <div className="scheduled-tokens-card">
          <h3><i className="fas fa-list-alt"></i> Recently Scheduled Tokens</h3>
          <div className="tokens-list">
            {scheduledTokens.length === 0 ? (
              <div className="empty-tokens">
                <i className="fas fa-ticket-alt"></i>
                <p>No tokens generated yet</p>
              </div>
            ) : (
              scheduledTokens.map((token, index) => (
                <div key={index} className="token-item">
                  <div className="token-header">
                    <span className="token-number">{token.token}</span>
                    <span className="token-status">Scheduled</span>
                  </div>
                  <div className="token-details">
                    <p><strong>Beneficiary:</strong> {token.beneficiary}</p>
                    <p><strong>Center:</strong> {token.center}</p>
                    <p><strong>Date:</strong> {token.date}</p>
                    <p><strong>Time:</strong> {token.time}</p>
                  </div>
                  <div className="token-actions">
                    <button className="btn-print-token">
                      <i className="fas fa-print"></i> Print
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="upcoming-distributions">
        <h3><i className="fas fa-calendar-check"></i> Upcoming Distributions</h3>
        <div className="distributions-list">
          {beneficiaries
            .filter(b => b.distributionStatus === 'scheduled' && b.pickupDate)
            .sort((a, b) => new Date(a.pickupDate) - new Date(b.pickupDate))
            .slice(0, 5)
            .map(b => {
              const center = distributionCenters.find(c => c.id === b.distributionCenter);
              return (
                <div key={b.id} className="distribution-item">
                  <div className="distribution-date">
                    <span className="day">{new Date(b.pickupDate).getDate()}</span>
                    <span className="month">{new Date(b.pickupDate).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div className="distribution-info">
                    <h4>{b.name}</h4>
                    <p>Token: {b.tokenNumber}</p>
                    <p className="center-name">{center?.name}</p>
                  </div>
                  <div className="distribution-time">
                    <i className="fas fa-clock"></i> {b.pickupTime || '10:00'}
                  </div>
                </div>
              );
            })}
          
          {beneficiaries.filter(b => b.distributionStatus === 'scheduled').length === 0 && (
            <div className="empty-distributions">
              <i className="fas fa-calendar-times"></i>
              <p>No upcoming distributions scheduled</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodScheduling;