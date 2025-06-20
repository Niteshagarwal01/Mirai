import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/admin-dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Example user data for the prototype
  const userData = localStorage.getItem('user') ? 
    JSON.parse(localStorage.getItem('user')) : null;
  
  useEffect(() => {
    // Check if user is admin, else redirect
    if (!userData || userData.role !== 'admin') {
      navigate('/login');
      return;
    }
      // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: userData.email,
            name: userData.name || 'Nitesh' 
          })
        });
        
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setDashboardData(data.stats);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [navigate, userData]);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="brand-logo">
          <div className="terminal-icon"></div>
          <h2>Mirai Admin</h2>
        </div>
        
        <div className="admin-user-info">
          <span>{userData?.name || 'Admin'}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      
      <div className="admin-content">
        <div className="admin-sidebar">
          <ul className="admin-menu">
            <li className="active"><i className="fas fa-tachometer-alt"></i> Dashboard</li>
            <li><i className="fas fa-users"></i> Users</li>
            <li><i className="fas fa-chart-line"></i> Analytics</li>
            <li><i className="fas fa-cog"></i> Settings</li>
          </ul>
        </div>
        
        <div className="admin-main">
          <h1>Admin Dashboard</h1>
          
          {error && <div className="admin-error">{error}</div>}
          
          {dashboardData && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Users</h3>
                  <div className="stat-value">{dashboardData.userCount}</div>
                  <div className="stat-icon"><i className="fas fa-users"></i></div>
                </div>
                
                <div className="stat-card">
                  <h3>Active Users</h3>
                  <div className="stat-value">{dashboardData.activeUsers}</div>
                  <div className="stat-icon"><i className="fas fa-user-check"></i></div>
                </div>
                
                <div className="stat-card">
                  <h3>New Signups</h3>
                  <div className="stat-value">{dashboardData.newSignups}</div>
                  <div className="stat-icon"><i className="fas fa-user-plus"></i></div>
                </div>
              </div>
              
              <div className="admin-panel">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                  <p>This is a prototype admin dashboard. Full functionality will be implemented in the final version.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
