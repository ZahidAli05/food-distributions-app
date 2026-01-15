import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BeneficiaryRegistration from './components/BeneficiaryRegistration';
import BeneficiaryManagement from './components/BeneficiaryManagement';
import FoodScheduling from './components/FoodScheduling';
import DistributionTracking from './components/DistributionTracking';
import Navbar from './components/Navbar';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('foodDistributionUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [beneficiaries, setBeneficiaries] = useState(() => {
    const savedBeneficiaries = localStorage.getItem('beneficiaries');
    return savedBeneficiaries ? JSON.parse(savedBeneficiaries) : [];
  });

  const [distributionCenters] = useState([
    { id: 1, name: 'Community Center A', address: '123 Main St', capacity: 200 },
    { id: 2, name: 'City Shelter B', address: '456 Oak Ave', capacity: 150 },
    { id: 3, name: 'Relief Camp C', address: '789 Pine Rd', capacity: 300 },
    { id: 4, name: 'Food Bank D', address: '321 Elm Blvd', capacity: 250 }
  ]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('foodDistributionUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('foodDistributionUser');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('beneficiaries', JSON.stringify(beneficiaries));
  }, [beneficiaries]);

  const loginUser = (email, password) => {
    const mockUsers = [
      { id: 1, email: 'admin@food.org', password: 'admin123', role: 'admin', name: 'System Admin' },
      { id: 2, email: 'staff@food.org', password: 'staff123', role: 'staff', name: 'Distribution Staff' }
    ];
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setUser(null);
  };

  const registerBeneficiary = (beneficiaryData) => {
    const newBeneficiary = {
      id: Date.now(),
      ...beneficiaryData,
      status: 'pending',
      registrationDate: new Date().toISOString().split('T')[0],
      tokenNumber: null,
      pickupDate: null,
      distributionCenter: null,
      distributionStatus: 'pending',
      distributionDate: null
    };
    setBeneficiaries([...beneficiaries, newBeneficiary]);
    return newBeneficiary;
  };

  const updateBeneficiary = (id, updates) => {
    setBeneficiaries(beneficiaries.map(b => 
      b.id === id ? { ...b, ...updates } : b
    ));
  };

  const generateTokenNumber = () => {
    return 'FD' + Date.now().toString().slice(-6);
  };

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} logoutUser={logoutUser} />}
        <Routes>
          <Route path="/login" element={
            user ? <Navigate to="/dashboard" /> : <Login loginUser={loginUser} />
          } />
          <Route path="/dashboard" element={
            user ? <Dashboard user={user} beneficiaries={beneficiaries} distributionCenters={distributionCenters} /> : <Navigate to="/login" />
          } />
          <Route path="/register" element={
            <BeneficiaryRegistration 
              registerBeneficiary={registerBeneficiary}
              user={user}
            />
          } />
          <Route path="/manage-beneficiaries" element={
            user ? <BeneficiaryManagement 
              beneficiaries={beneficiaries} 
              updateBeneficiary={updateBeneficiary}
              user={user}
              distributionCenters={distributionCenters}
              generateTokenNumber={generateTokenNumber}
            /> : <Navigate to="/login" />
          } />
          <Route path="/schedule" element={
            user ? <FoodScheduling 
              beneficiaries={beneficiaries.filter(b => b.status === 'approved')}
              updateBeneficiary={updateBeneficiary}
              distributionCenters={distributionCenters}
              generateTokenNumber={generateTokenNumber}
            /> : <Navigate to="/login" />
          } />
          <Route path="/tracking" element={
            user ? <DistributionTracking 
              beneficiaries={beneficiaries}
              updateBeneficiary={updateBeneficiary}
              user={user}
            /> : <Navigate to="/login" />
          } />
          <Route path="/" element={
            <Navigate to={user ? "/dashboard" : "/login"} />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;