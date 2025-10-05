import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { useUser, useClerk, useAuth } from '@clerk/clerk-react';
import '../css/admin-dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userPlan, setUserPlan] = useState(null);
  // Hardcode Pro status for admin email
  const [isPro, setIsPro] = useState(false);
  
  // Check if we're on a sub-route
  const isSubRoute = location.pathname !== '/admin';
  
  // Check if current user is admin by email
  useEffect(() => {
    const adminEmails = ['techniteshgamer@gmail.com', 'hackathonwinner001@gmail.com', 'judge@mirai.com', 'demo@mirai.com'];
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    
    console.log('🔍 Checking admin status for email:', userEmail);
    console.log('📧 Admin emails:', adminEmails);
    
    if (adminEmails.includes(userEmail)) {
      console.log('✅ ADMIN USER DETECTED - Setting Pro to TRUE');
      setIsPro(true);
    } else {
      console.log('❌ Not an admin email, keeping Pro as FALSE');
    }
  }, [user]);
  
  useEffect(() => {
    // Wait for Clerk to load
    if (!isLoaded) return;
    
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Try to fetch real data from backend
        const response = await fetch('/api/admin/dashboard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: user?.primaryEmailAddress?.emailAddress,
            name: user?.fullName || user?.firstName || 'User'
          })
        });
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        } else {
          setDashboardData(data.stats);
        }
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        
        // Use demo data as fallback
        setDashboardData({
          userCount: 2,
          activeUsers: 2,
          campaigns: 4,
          engagementRate: '4.7%',
          revenue: '$12,450',
          topContent: [
            {
              id: 1,
              title: '10 AI Marketing Strategies for 2025',
              date: 'May 1, 2025',
              views: 24,
              engagement: '78%',
              icon: 'file-alt'
            },
            {
              id: 2,
              title: 'Product Launch Campaign Analysis',
              date: 'April 28, 2025',
              views: 18,
              engagement: '65%',
              icon: 'chart-bar'
            },
            {
              id: 3,
              title: 'Summer Collection Email Campaign',
              date: 'April 25, 2025',
              views: 32,
              engagement: '81%',
              icon: 'bolt'
            }
          ],
          recommendations: [
            {
              id: 1,
              title: 'Increase social media engagement',
              description: 'Schedule posts during peak hours based on audience data'
            },
            {
              id: 2,
              title: 'Optimize email subject lines',
              description: 'Use AI to test variations and improve open rates'
            },
            {
              id: 3,
              title: 'Create more video content',
              description: 'Video engagement is 40% higher than other content types'
            }
          ]
        });
        setError('Note: Using demo data. Backend connection unavailable.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Fetch user plan status
    const fetchUserPlan = async () => {
      try {
        const token = await getToken();
        console.log('🔐 Fetching user plan with token:', token ? 'Token exists' : 'No token');
        console.log('👤 User email:', user?.primaryEmailAddress?.emailAddress);
        
        const response = await fetch('http://localhost:3001/api/user/plan', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        console.log('📡 Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Plan data received:', data);
          setUserPlan(data);
          setIsPro(data.plan === 'pro' || data.isAdmin === true);
          console.log('🎯 isPro set to:', data.plan === 'pro' || data.isAdmin === true);
        } else {
          const errorText = await response.text();
          console.error('❌ Plan fetch failed:', response.status, errorText);
        }
      } catch (err) {
        console.error('💥 Error fetching user plan:', err);
      }
    };
    
    if (user) {
      fetchUserPlan();
    }
  }, [isLoaded, user]);
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
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
    <div className="modern-admin-dashboard">
      {/* Logo and Sidebar section */}
      <div className="admin-sidebar">
        <div className="brand-logo">
          <div className="logo-icon">
            <span className="colored-icon"></span>
          </div>
          <h2>Mirai AI</h2>
        </div>
        
        <div className="sidebar-section">
          <ul className="sidebar-menu">
            <li className={`menu-item ${!isSubRoute ? 'active' : ''}`}>
              <Link to="/admin">
                <i className="fas fa-th-large"></i>
                <span>Dashboard</span>
                <i className="fas fa-chevron-right arrow-icon"></i>
              </Link>
            </li>
            
            <li className={`menu-item ${location.pathname.includes('/admin/content') ? 'active' : ''}`}>
              <Link to="/admin/content">
                <i className="fas fa-file-alt"></i>
                <span>Content Generator</span>
              </Link>
            </li>
            
            <li className="menu-item">
              <Link to="#">
                <i className="fas fa-video"></i>
                <span>AI VideoShoot</span>
              </Link>
            </li>
            
            <li className="menu-item">
              <Link to="#">
                <i className="fas fa-image"></i>
                <span>AI Photoshoot</span>
              </Link>
            </li>
            
            <li className="menu-item">
              <Link to="#">
                <i className="fas fa-comment-alt"></i>
                <span>Voice Agent</span>
              </Link>
            </li>
            
            <li className="menu-item">
              <Link to="#">
                <i className="fas fa-envelope"></i>
                <span>Email Marketing</span>
              </Link>
            </li>
            
            <li className={`menu-item ${location.pathname.includes('/admin/business-planner') ? 'active' : ''}`}>
              <Link to="/admin/business-planner">
                <i className="fas fa-calendar-alt"></i>
                <span>Business Planner</span>
              </Link>
            </li>
            
            <li className="menu-item">
              <Link to="#">
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="sidebar-footer">
          {isPro ? (
            <div className="pro-badge-sidebar">
              <i className="fas fa-crown"></i>
              <span>Pro Active</span>
              <i className="fas fa-check-circle"></i>
            </div>
          ) : (
            <Link to="/upgrade-pro" className="upgrade-pro-sidebar-btn">
              <i className="fas fa-rocket"></i>
              <span>Upgrade to Pro</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
          )}
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="admin-main-content">
        {/* Hide the Command Center header when on Content Generator or Business Planner routes */}
        {!location.pathname.includes('/admin/content') && !location.pathname.includes('/admin/business-planner') && (
          <div className="admin-header">
            <div className="header-title">
              <div className="title-icon">
                <i className="fas fa-terminal"></i>
              </div>
              <div className="title-content">
                <h1>Command Center</h1>
                <p>Your marketing intelligence dashboard</p>
              </div>
            </div>
            
            <div className="admin-user-info">
              <span className="online-indicator">
                <span className="dot"></span>
                SYSTEM ONLINE
              </span>
              <span className="user-name">
                {user?.fullName || user?.firstName || 'User'}
                {isPro && <span className="pro-badge-header"><i className="fas fa-crown"></i> PRO</span>}
              </span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        )}
        
        <div className="admin-content">
          {/* If on a sub-route, show the nested content, otherwise show the dashboard */}
          {isSubRoute ? (
            <Outlet />
          ) : (
            dashboardData && (
              <>
                {/* Stats Cards Row */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Total Users</h3>
                    <div className="stat-value">{dashboardData.userCount || 2}</div>
                    <div className="stat-icon"><i className="fas fa-users"></i></div>
                  </div>
                  
                  <div className="stat-card">
                    <h3>Active Users</h3>
                    <div className="stat-value">{dashboardData.activeUsers || 2}</div>
                    <div className="stat-icon"><i className="fas fa-user-check"></i></div>
                  </div>
                  
                  <div className="stat-card">
                    <h3>Campaigns</h3>
                    <div className="stat-value">{dashboardData.campaigns || 4}</div>
                    <div className="stat-icon"><i className="fas fa-bullhorn"></i></div>
                  </div>
                </div>
                  {/* Top Row with Content and Recommendations Side by Side */}
                <div className="top-section-header">
                  <h2 className="section-title">Dashboard Overview</h2>
                </div>
                
                <div className="dashboard-insights-row">
                  {/* Top Performing Content */}
                  <div className="dashboard-card insights-card">
                    <div className="card-header">
                      <div className="card-title">
                        <i className="fas fa-chart-line"></i>
                        <h3>Top Performing Content</h3>
                      </div>
                      <div className="card-subtitle">Highest engagement assets</div>
                    </div>
                    
                    <div className="performance-list">
                      {dashboardData.topContent && dashboardData.topContent.map(item => (
                        <div className="performance-item" key={item.id}>
                          <div className={`performance-icon performance-icon-${item.icon}`}>
                            <i className={`fas fa-${item.icon}`}></i>
                          </div>
                          <div className="performance-details">
                            <div className="performance-title">{item.title}</div>
                            <div className="performance-date">{item.date}</div>
                            <div className="performance-stats">
                              <span><i className="fas fa-eye"></i> {item.views}</span>
                              <span><i className="fas fa-chart-pie"></i> {item.engagement}</span>
                            </div>
                          </div>
                          <div className="performance-action">
                            <button className="view-btn">View</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* AI Recommendations */}
                  <div className="dashboard-card recommendations-card">
                    <div className="card-header">
                      <div className="card-title">
                        <i className="fas fa-robot"></i>
                        <h3>AI Recommendations</h3>
                      </div>
                      <div className="card-subtitle">Optimization insights</div>
                    </div>
                    
                    <div className="recommendations-list">
                      {dashboardData.recommendations && dashboardData.recommendations.map(rec => (
                        <div className="recommendation-item" key={rec.id}>
                          <div className="recommendation-content">
                            <div className="recommendation-title">{rec.title}</div>
                            <div className="recommendation-description">{rec.description}</div>
                          </div>
                          <div className="recommendation-action">
                            <button className="analyze-btn">
                              <i className="fas fa-arrow-right"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="analyze-wrapper">
                      <button className="analyze-all-btn">Analyze <i className="fas fa-code"></i></button>
                    </div>
                  </div>
                </div>
                  {/* AI Tools Grid */}
                <div className="dashboard-section">
                  <h2 className="section-title">AI Tools</h2>
                    <div className="ai-tools-grid">
                    {/* Active Tools First */}
                    <Link to="/admin/content" className="ai-tool-card active-tool">
                      <div className="tool-icon content-tool">
                        <i className="fas fa-file-alt"></i>
                      </div>
                      <div className="tool-label">
                        <div className="tool-tag">AI TOOL</div>
                        <h3>Content Generator</h3>
                        <p>Create blogs, social posts and marketing materials</p>
                      </div>
                      <div className="tool-badge">Active</div>
                    </Link>
                    
                    <Link to="/admin/business-planner" className="ai-tool-card active-tool">
                      <div className="tool-icon plan-tool">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <div className="tool-label">
                        <div className="tool-tag">AI TOOL</div>
                        <h3>Business Planner</h3>
                        <p>Generate comprehensive business plans with AI</p>
                      </div>
                      <div className="tool-badge">Active</div>
                    </Link>
                    
                    {/* Other Tools */}
                    <div className="ai-tool-card">
                      <div className="tool-icon email-tool">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <div className="tool-label">
                        <div className="tool-tag">AI TOOL</div>
                        <h3>Email Engine</h3>
                        <p>Smart email automation with AI-powered templates</p>
                      </div>
                    </div>
                    
                    <div className="ai-tool-card">
                      <div className="tool-icon image-tool">
                        <i className="fas fa-image"></i>
                      </div>
                      <div className="tool-label">
                        <div className="tool-tag">AI TOOL</div>
                        <h3>AI Product Photoshoot</h3>
                        <p>Transform regular photos into professional marketing images</p>
                      </div>
                    </div>
                    
                    <div className="ai-tool-card">
                      <div className="tool-icon voice-tool">
                        <i className="fas fa-microphone-alt"></i>
                      </div>
                      <div className="tool-label">
                        <div className="tool-tag">AI TOOL</div>
                        <h3>Voice Sales Agent</h3>
                        <p>Configure AI phone agents to handle customer calls</p>
                      </div>
                    </div>
                    
                    <div className="ai-tool-card">
                      <div className="tool-icon video-tool">
                        <i className="fas fa-video"></i>
                      </div>
                      <div className="tool-label">
                        <div className="tool-tag">AI TOOL</div>
                        <h3>Video Generator</h3>
                        <p>Create professional video content with AI assistance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
