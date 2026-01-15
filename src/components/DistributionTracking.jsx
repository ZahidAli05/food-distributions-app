// components/DistributionTracking.jsx
import React, { useState, useEffect } from 'react';
import './DistributionTracking.css';

const DistributionTracking = ({ beneficiaries, updateBeneficiary, user }) => {
  const [searchCnic, setSearchCnic] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [todayDistributions, setTodayDistributions] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, scheduled, distributed

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayDist = beneficiaries.filter(b => 
      b.distributionDate === today && b.distributionStatus === 'distributed'
    );
    setTodayDistributions(todayDist);
  }, [beneficiaries]);

  const handleSearch = () => {
    const result = beneficiaries.find(b => b.cnic === searchCnic);
    setSearchResult(result || null);
  };

  const handleDistribute = (beneficiaryId) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString();
    
    updateBeneficiary(beneficiaryId, {
      distributionStatus: 'distributed',
      distributionDate: today,
      distributionTime: now
    });

    // Update local state
    const updatedBeneficiary = beneficiaries.find(b => b.id === beneficiaryId);
    setTodayDistributions([...todayDistributions, { ...updatedBeneficiary, distributionDate: today, distributionTime: now }]);
    
    // Clear search if this was the searched beneficiary
    if (searchResult && searchResult.id === beneficiaryId) {
      setSearchResult(null);
      setSearchCnic('');
    }
  };

  const filteredBeneficiaries = beneficiaries.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'pending') return b.distributionStatus === 'pending';
    if (filter === 'scheduled') return b.distributionStatus === 'scheduled';
    if (filter === 'distributed') return b.distributionStatus === 'distributed';
    return true;
  });

  const scheduledForToday = beneficiaries.filter(b => 
    b.distributionStatus === 'scheduled' && 
    b.pickupDate === new Date().toISOString().split('T')[0]
  );

  const pendingCount = beneficiaries.filter(b => b.distributionStatus === 'pending').length;
  const scheduledCount = beneficiaries.filter(b => b.distributionStatus === 'scheduled').length;
  const distributedCount = beneficiaries.filter(b => b.distributionStatus === 'distributed').length;

  return (
    <div className="tracking-container">
      <div className="tracking-header">
        <h1><i className="fas fa-clipboard-check"></i> Distribution Tracking</h1>
        <p className="subtitle">Track and manage food package distribution</p>
      </div>

      <div className="stats-row">
        <div className="distribution-stat">
          <div className="stat-icon pending">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-info">
            <h3>{pendingCount}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="distribution-stat">
          <div className="stat-icon scheduled">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-info">
            <h3>{scheduledCount}</h3>
            <p>Scheduled</p>
          </div>
        </div>

        <div className="distribution-stat">
          <div className="stat-icon distributed">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <h3>{distributedCount}</h3>
            <p>Distributed</p>
          </div>
        </div>

        <div className="distribution-stat">
          <div className="stat-icon today">
            <i className="fas fa-sun"></i>
          </div>
          <div className="stat-info">
            <h3>{todayDistributions.length}</h3>
            <p>Today's Distribution</p>
          </div>
        </div>
      </div>

      <div className="distribution-content">
        <div className="distribution-search-section">
          <div className="search-card">
            <h3><i className="fas fa-search-location"></i> Search for Collection</h3>
            <p className="search-instruction">Enter beneficiary CNIC to mark package as distributed</p>
            
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Enter CNIC (e.g., 42101-1234567-8)"
                value={searchCnic}
                onChange={(e) => setSearchCnic(e.target.value)}
              />
              <button onClick={handleSearch} className="btn-search-distribute">
                <i className="fas fa-search"></i> Search
              </button>
            </div>

            {searchResult && (
              <div className="search-result-card">
                <div className="result-header">
                  <h4>Beneficiary Found</h4>
                  <span className={`status-badge status-${searchResult.distributionStatus}`}>
                    {searchResult.distributionStatus}
                  </span>
                </div>
                
                <div className="result-details">
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{searchResult.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">CNIC:</span>
                    <span className="detail-value">{searchResult.cnic}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Family Members:</span>
                    <span className="detail-value">{searchResult.familyMembers}</span>
                  </div>
                  
                  {searchResult.tokenNumber && (
                    <div className="detail-row">
                      <span className="detail-label">Token Number:</span>
                      <span className="detail-value token-number">{searchResult.tokenNumber}</span>
                    </div>
                  )}
                  
                  {searchResult.pickupDate && (
                    <div className="detail-row">
                      <span className="detail-label">Scheduled Date:</span>
                      <span className="detail-value">{searchResult.pickupDate}</span>
                    </div>
                  )}

                  <div className="distribution-actions">
                    {searchResult.distributionStatus === 'scheduled' ? (
                      <button 
                        onClick={() => handleDistribute(searchResult.id)}
                        className="btn-mark-distributed"
                      >
                        <i className="fas fa-check-circle"></i> Mark as Distributed
                      </button>
                    ) : searchResult.distributionStatus === 'distributed' ? (
                      <div className="already-distributed">
                        <i className="fas fa-info-circle"></i>
                        <span>Package already distributed on {searchResult.distributionDate}</span>
                      </div>
                    ) : (
                      <div className="not-scheduled">
                        <i className="fas fa-exclamation-triangle"></i>
                        <span>Package not scheduled for distribution</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="today-scheduled-card">
            <h3><i className="fas fa-calendar-day"></i> Scheduled for Today</h3>
            <div className="scheduled-list">
              {scheduledForToday.length === 0 ? (
                <div className="empty-scheduled">
                  <i className="fas fa-calendar-times"></i>
                  <p>No distributions scheduled for today</p>
                </div>
              ) : (
                scheduledForToday.map(b => (
                  <div key={b.id} className="scheduled-item">
                    <div className="scheduled-info">
                      <h4>{b.name}</h4>
                      <p>Token: <strong>{b.tokenNumber}</strong></p>
                      <p className="scheduled-time">
                        <i className="fas fa-clock"></i> {b.pickupTime || '10:00'}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDistribute(b.id)}
                      className="btn-distribute-now"
                    >
                      <i className="fas fa-check"></i> Distribute
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="distribution-list-section">
          <div className="list-header">
            <h3><i className="fas fa-list"></i> All Distributions</h3>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Pending
              </button>
              <button 
                className={`filter-btn ${filter === 'scheduled' ? 'active' : ''}`}
                onClick={() => setFilter('scheduled')}
              >
                Scheduled
              </button>
              <button 
                className={`filter-btn ${filter === 'distributed' ? 'active' : ''}`}
                onClick={() => setFilter('distributed')}
              >
                Distributed
              </button>
            </div>
          </div>

          <div className="distribution-table-container">
            <table className="distribution-table">
              <thead>
                <tr>
                  <th>CNIC</th>
                  <th>Name</th>
                  <th>Token</th>
                  <th>Schedule Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBeneficiaries.map(b => (
                  <tr key={b.id}>
                    <td>{b.cnic}</td>
                    <td>{b.name}</td>
                    <td>{b.tokenNumber || 'N/A'}</td>
                    <td>{b.pickupDate || 'Not scheduled'}</td>
                    <td>
                      <span className={`status-badge status-${b.distributionStatus}`}>
                        {b.distributionStatus}
                      </span>
                    </td>
                    <td>
                      {b.distributionStatus === 'scheduled' && (
                        <button 
                          onClick={() => handleDistribute(b.id)}
                          className="btn-quick-distribute"
                          title="Mark as Distributed"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                      )}
                      {b.distributionStatus === 'distributed' && (
                        <span className="distributed-info">
                          {b.distributionDate} {b.distributionTime}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBeneficiaries.length === 0 && (
            <div className="empty-distribution">
              <i className="fas fa-box-open"></i>
              <p>No distributions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DistributionTracking;