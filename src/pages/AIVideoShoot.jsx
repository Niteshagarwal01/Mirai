import React, { useState } from 'react';
import '../css/content-generator.css';

const AIVideoShoot = () => {
  const [selectedStyle, setSelectedStyle] = useState('');
  const [videoData, setVideoData] = useState({
    product: '',
    duration: '30',
    transition: 'smooth',
    music: 'upbeat'
  });

  const handleGenerate = () => {
    alert('🚧 AI VideoShoot feature is under development! This beautiful interface is ready for when our AI backend is connected.');
  };

  const videoStyles = [
    { id: 'commercial', name: 'Commercial', icon: 'fas fa-tv' },
    { id: 'social', name: 'Social Media', icon: 'fas fa-share-alt' },
    { id: 'explainer', name: 'Explainer', icon: 'fas fa-play-circle' },
    { id: 'testimonial', name: 'Testimonial', icon: 'fas fa-quote-left' },
    { id: 'unboxing', name: 'Unboxing', icon: 'fas fa-box-open' },
    { id: 'demo', name: 'Product Demo', icon: 'fas fa-cog' }
  ];

  const musicOptions = [
    { id: 'upbeat', name: 'Upbeat', icon: 'fas fa-music' },
    { id: 'corporate', name: 'Corporate', icon: 'fas fa-briefcase' },
    { id: 'cinematic', name: 'Cinematic', icon: 'fas fa-film' },
    { id: 'ambient', name: 'Ambient', icon: 'fas fa-cloud' }
  ];

  return (
    <div className="content-generator">
      <div className="page-header">
        <div className="header-icon">
          <i className="fas fa-video"></i>
        </div>
        <div className="header-content">
          <h1>AI <span className="gradient-text">VideoShoot</span></h1>
          <p>Create professional product videos with AI</p>
        </div>
      </div>

      <div className="container">
        <div className="content-types-section">
          <h2>Choose Video Style</h2>
          <div className="content-types-grid">
            {videoStyles.map(style => (
              <div 
                key={style.id}
                className={`content-type-card ${selectedStyle === style.id ? 'selected' : ''}`}
                onClick={() => setSelectedStyle(style.id)}
              >
                <div className="content-type-icon">
                  <i className={style.icon}></i>
                </div>
                <h3>{style.name}</h3>
              </div>
            ))}
          </div>
        </div>

        <div className="content-grid">
          <div className="main-content">
            <div className="content-form-section">
              <h2>Video Configuration</h2>
            <div className="form-group">
              <label>Product/Service Name</label>
              <input 
                type="text" 
                placeholder="Enter your product or service name..."
                value={videoData.product}
                onChange={(e) => setVideoData({...videoData, product: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Video Duration</label>
              <select 
                value={videoData.duration}
                onChange={(e) => setVideoData({...videoData, duration: e.target.value})}
              >
                <option value="15">15 seconds</option>
                <option value="30">30 seconds</option>
                <option value="60">1 minute</option>
                <option value="120">2 minutes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Background Music</label>
              <div className="option-buttons">
                {musicOptions.map(music => (
                  <button 
                    key={music.id}
                    type="button"
                    className={`option-btn ${videoData.music === music.id ? 'selected' : ''}`}
                    onClick={() => setVideoData({...videoData, music: music.id})}
                  >
                    <i className={music.icon}></i>
                    {music.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Transition Style</label>
              <select 
                value={videoData.transition}
                onChange={(e) => setVideoData({...videoData, transition: e.target.value})}
              >
                <option value="smooth">Smooth</option>
                <option value="quick">Quick Cuts</option>
                <option value="fade">Fade</option>
                <option value="zoom">Zoom Effects</option>
              </select>
            </div>

            <div className="form-group">
              <label>Video Description & Requirements</label>
              <textarea 
                placeholder="Describe your video concept, key features to highlight, target audience, and any specific requirements..."
                rows="6"
              ></textarea>
            </div>

            <button className="generate-btn" onClick={handleGenerate}>
              <i className="fas fa-video"></i>
              Generate Video
            </button>
          </div>
        </div>

        <div className="sidebar">
          <div className="sidebar-card">
            <h3>Video Analytics</h3>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Videos Created</span>
                <span className="stat-value">89</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Views</span>
                <span className="stat-value">156K</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">This Month</span>
                <span className="stat-value">24</span>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>Recent Videos</h3>
            <div className="recent-items">
              <div className="recent-item">
                <div className="item-icon">
                  <i className="fas fa-tv"></i>
                </div>
                <div className="item-content">
                  <div className="item-title">Product Launch</div>
                  <div className="item-date">3 hours ago</div>
                </div>
                <div className="item-status completed">Rendered</div>
              </div>
              <div className="recent-item">
                <div className="item-icon">
                  <i className="fas fa-share-alt"></i>
                </div>
                <div className="item-content">
                  <div className="item-title">Social Campaign</div>
                  <div className="item-date">1 day ago</div>
                </div>
                <div className="item-status completed">Rendered</div>
              </div>
              <div className="recent-item">
                <div className="item-icon">
                  <i className="fas fa-box-open"></i>
                </div>
                <div className="item-content">
                  <div className="item-title">Unboxing Video</div>
                  <div className="item-date">2 days ago</div>
                </div>
                <div className="item-status processing">Processing</div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIVideoShoot;