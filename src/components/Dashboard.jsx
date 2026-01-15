import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard = ({ user, beneficiaries, distributionCenters }) => {
  const [searchCnic, setSearchCnic] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const todayDistributions = beneficiaries.filter(b => 
    b.distributionDate === today && b.distributionStatus === 'distributed'
  ).length;

  const pendingApprovals = beneficiaries.filter(b => b.status === 'pending').length;
  const totalBeneficiaries = beneficiaries.length;
  const activeBeneficiaries = beneficiaries.filter(b => b.status === 'approved' && b.isActive !== false).length;

  const incomeLevelData = [
    { name: 'Very Low', value: beneficiaries.filter(b => b.incomeLevel === 'Very Low').length },
    { name: 'Low', value: beneficiaries.filter(b => b.incomeLevel === 'Low').length },
    { name: 'Middle', value: beneficiaries.filter(b => b.incomeLevel === 'Middle').length },
  ];

  const distributionData = [
    { name: 'Pending', value: beneficiaries.filter(b => b.distributionStatus === 'pending').length },
    { name: 'Scheduled', value: beneficiaries.filter(b => b.distributionStatus === 'scheduled').length },
    { name: 'Distributed', value: beneficiaries.filter(b => b.distributionStatus === 'distributed').length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleSearch = () => {
    const result = beneficiaries.find(b => b.cnic === searchCnic);
    setSearchResult(result || null);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1><i className="fas fa-tachometer-alt"></i> Dashboard</h1>
        <p className="welcome-text">Welcome back, {user?.name} ({user?.role})</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#4CAF50' }}>
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>{totalBeneficiaries}</h3>
            <p>Total Beneficiaries</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#2196F3' }}>
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <h3>{todayDistributions}</h3>
            <p>Distributed Today</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#FF9800' }}>
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{pendingApprovals}</h3>
            <p>Pending Approvals</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#9C27B0' }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{activeBeneficiaries}</h3>
            <p>Active Beneficiaries</p>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3><i className="fas fa-chart-pie"></i> Income Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incomeLevelData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {incomeLevelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3><i className="fas fa-chart-bar"></i> Distribution Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="search-section">
        <div className="search-card">
          <h3><i className="fas fa-search"></i> Search Beneficiary by CNIC</h3>
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Enter CNIC (e.g., 42101-1234567-8)"
              value={searchCnic}
              onChange={(e) => setSearchCnic(e.target.value)}
            />
            <button onClick={handleSearch} className="btn-search">
              <i className="fas fa-search"></i> Search
            </button>
          </div>
          
          {searchResult && (
            <div className="search-result">
              <h4>Search Result:</h4>
              <div className="result-details">
                <p><strong>Name:</strong> {searchResult.name}</p>
                <p><strong>Status:</strong> <span className={`status-badge status-${searchResult.status}`}>{searchResult.status}</span></p>
                <p><strong>Phone:</strong> {searchResult.phone}</p>
                <p><strong>Family Members:</strong> {searchResult.familyMembers}</p>
                {searchResult.tokenNumber && <p><strong>Token:</strong> {searchResult.tokenNumber}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="centers-card">
          <h3><i className="fas fa-map-marker-alt"></i> Distribution Centers</h3>
          <div className="centers-list">
            {distributionCenters.map(center => (
              <div key={center.id} className="center-item">
                <div className="center-icon">
                  <i className="fas fa-warehouse"></i>
                </div>
                <div className="center-info">
                  <h4>{center.name}</h4>
                  <p>{center.address}</p>
                  <p className="capacity">Capacity: {center.capacity} packages/day</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;