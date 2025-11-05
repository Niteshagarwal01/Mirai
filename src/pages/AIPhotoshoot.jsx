import React, { useState } from 'react';
import '../css/content-generator.css';

const AIPhotoshoot = () => {
  const [selectedStyle, setSelectedStyle] = useState('');
  const [photoData, setPhotoData] = useState({
    product: '',
    background: 'studio',
    lighting: 'professional',
    angle: 'front',
    mood: 'clean'
  });

  const handleGenerate = () => {
    alert('🚧 AI Photoshoot feature is under development! This beautiful interface is ready for when our AI backend is connected.');
  };

  const photoStyles = [
    { id: 'product', name: 'Product Focus', icon: 'fas fa-cube' },
    { id: 'lifestyle', name: 'Lifestyle', icon: 'fas fa-home' },
    { id: 'commercial', name: 'Commercial', icon: 'fas fa-briefcase' },
    { id: 'fashion', name: 'Fashion', icon: 'fas fa-tshirt' },
    { id: 'food', name: 'Food & Beverage', icon: 'fas fa-utensils' },
    { id: 'beauty', name: 'Beauty & Cosmetics', icon: 'fas fa-palette' }
  ];

  const backgrounds = [
    { id: 'studio', name: 'Studio White', icon: 'fas fa-square' },
    { id: 'natural', name: 'Natural Light', icon: 'fas fa-sun' },
    { id: 'gradient', name: 'Gradient', icon: 'fas fa-layer-group' },
    { id: 'texture', name: 'Textured', icon: 'fas fa-texture' }
  ];

  return (
    <div className="content-generator">
      <div className="page-header">
        <div className="header-icon">
          <i className="fas fa-camera"></i>
        </div>
        <div className="header-content">
          <h1>AI <span className="gradient-text">Photoshoot</span></h1>
          <p>Create stunning product photography with AI</p>
        </div>
      </div>

      <div className="container">
        <div className="content-types-section">
          <h2>Choose Photography Style</h2>
          <div className="content-types-grid">
            {photoStyles.map(style => (
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
              <h2>Photo Configuration</h2>
            <div className="form-group">
              <label>Product Description</label>
              <input 
                type="text" 
                placeholder="Describe your product..."
                value={photoData.product}
                onChange={(e) => setPhotoData({...photoData, product: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Background Style</label>
              <div className="option-buttons">
                {backgrounds.map(bg => (
                  <button 
                    key={bg.id}
                    type="button"
                    className={`option-btn ${photoData.background === bg.id ? 'selected' : ''}`}
                    onClick={() => setPhotoData({...photoData, background: bg.id})}
                  >
                    <i className={bg.icon}></i>
                    {bg.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Lighting</label>
              <select 
                value={photoData.lighting}
                onChange={(e) => setPhotoData({...photoData, lighting: e.target.value})}
              >
                <option value="professional">Professional Studio</option>
                <option value="natural">Natural Light</option>
                <option value="dramatic">Dramatic</option>
                <option value="soft">Soft & Diffused</option>
              </select>
            </div>

            <div className="form-group">
              <label>Camera Angle</label>
              <select 
                value={photoData.angle}
                onChange={(e) => setPhotoData({...photoData, angle: e.target.value})}
              >
                <option value="front">Front View</option>
                <option value="side">Side View</option>
                <option value="top">Top Down</option>
                <option value="angle">45° Angle</option>
              </select>
            </div>

            <div className="form-group">
              <label>Mood & Style</label>
              <select 
                value={photoData.mood}
                onChange={(e) => setPhotoData({...photoData, mood: e.target.value})}
              >
                <option value="clean">Clean & Minimal</option>
                <option value="luxury">Luxury & Premium</option>
                <option value="modern">Modern & Tech</option>
                <option value="vintage">Vintage & Retro</option>
              </select>
            </div>

            <button className="generate-btn" onClick={handleGenerate}>
              <i className="fas fa-camera"></i>
              Generate Photos
            </button>
          </div>
        </div>

        <div className="sidebar">
          <div className="sidebar-card">
            <h3>Photo Analytics</h3>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Photos Generated</span>
                <span className="stat-value">342</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">This Month</span>
                <span className="stat-value">89</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Avg Quality</span>
                <span className="stat-value">9.2/10</span>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>Recent Photos</h3>
            <div className="recent-items">
              <div className="recent-item">
                <div className="item-icon">
                  <i className="fas fa-cube"></i>
                </div>
                <div className="item-content">
                  <div className="item-title">Product Shots</div>
                  <div className="item-date">2 hours ago</div>
                </div>
                <div className="item-status completed">Complete</div>
              </div>
              <div className="recent-item">
                <div className="item-icon">
                  <i className="fas fa-utensils"></i>
                </div>
                <div className="item-content">
                  <div className="item-title">Food Photography</div>
                  <div className="item-date">5 hours ago</div>
                </div>
                <div className="item-status completed">Complete</div>
              </div>
              <div className="recent-item">
                <div className="item-icon">
                  <i className="fas fa-tshirt"></i>
                </div>
                <div className="item-content">
                  <div className="item-title">Fashion Shoot</div>
                  <div className="item-date">1 day ago</div>
                </div>
                <div className="item-status completed">Complete</div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPhotoshoot;