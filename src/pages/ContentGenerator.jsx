import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import aiService from '../services/aiService.js';
import '../css/content-generator.css';

// Import images directly - keeping your original design
import instagramImg from '../assets/insta.jpeg';
import linkedinImg from '../assets/LinkedIn-Logo-2-scaled.jpg';
import twitterImg from '../assets/twitter.jpeg';
import blogpostImg from '../assets/blogpost.jpeg';

const ContentGenerator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [contentTypes, setContentTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [providers, setProviders] = useState([]);
  const [formData, setFormData] = useState({
    prompt: '',
    tone: 'professional',
    length: 'medium',
    provider: 'auto'
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  // Get user ID from localStorage or session
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };

  // Content types matching backend exactly
  const defaultContentTypes = [
    {
      id: 'Instagram Post',
      name: 'Instagram Post',
      description: 'Create engaging captions and visuals optimized for Instagram\'s audience',
      image: instagramImg,
      category: 'Social Media'
    },
    {
      id: 'LinkedIn Post',
      name: 'LinkedIn Post',
      description: 'Professional content that drives engagement and showcases expertise',
      image: linkedinImg,
      category: 'Professional'
    },
    {
      id: 'Twitter Post',
      name: 'Twitter Post',
      description: 'Concise, engaging tweets that spark conversation and sharing',
      image: twitterImg,
      category: 'Social Media'
    },
    {
      id: 'Blog Post',
      name: 'Blog Post',
      description: 'In-depth content that educates your audience and builds authority',
      image: blogpostImg,
      category: 'Content Creation'
    },
    {
      id: 'Email Campaign',
      name: 'Email Campaign',
      description: 'Draft professional email marketing campaigns',
      image: blogpostImg,
      icon: '✉️',
      category: 'Marketing'
    },
    {
      id: 'Product Description',
      name: 'Product Description',
      description: 'Generate compelling product descriptions for e-commerce',
      image: blogpostImg,
      icon: '🛍️',
      category: 'E-commerce'
    }
  ];

  // Load initial data on component mount
  useEffect(() => {
    // Set default content types immediately to avoid loading state
    setContentTypes(defaultContentTypes);
    loadProviders();
    // Remove loadContentHistory since we don't have this endpoint yet
  }, []);



  const loadProviders = async () => {
    try {
      const response = await aiService.getAvailableProviders();
      if (response.success) {
        setProviders(response.providers);
      }
    } catch (error) {
      console.error('Error loading providers:', error);
    }
  };



  const handleSelectType = (type) => {
    setSelectedType(type);
    setFormData({
      prompt: '',
      tone: 'professional',
      length: 'medium',
      provider: 'auto'
    });
    setResult('');
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (name === 'prompt' && error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.prompt.trim()) {
      setError('Please enter a prompt for content generation');
      return false;
    }

    if (formData.prompt.trim().length < 10) {
      setError('Please provide a more detailed prompt (at least 10 characters)');
      return false;
    }

    if (!selectedType) {
      setError('Please select a content type');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setResult('');
    setError('');

    try {
      const currentUser = getCurrentUser();
      const contentData = {
        contentType: selectedType.name, // Use name instead of id to match backend
        topic: formData.prompt.trim(), // Backend expects 'topic' not 'prompt'
        tone: formData.tone,
        provider: formData.provider === 'auto' ? 'groq' : formData.provider // Default to groq
      };

      const response = await aiService.generateContent(contentData);
      
      if (response.success && response.content) {
        setResult(response.content);
      } else {
        setError(response.error || 'Failed to generate content');
      }
    } catch (error) {
      console.error('Content generation error:', error);
      setError('An error occurred while generating content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Content copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Content copied to clipboard!');
    }
  };

  const formatContent = (content) => {
    if (!content) return '';
    
    // Basic formatting for better display
    return content
      .replace(/\n\n/g, '\n')
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .trim();
  };

  return (
    <div className="content-generator">
      <div className="page-header">
        <div className="header-icon">
          <i className="fas fa-file-alt"></i>
        </div>
        <div className="header-content">
          <h1>Content <span className="gradient-text">Generator</span></h1>
          <p>Create professional marketing content with AI in seconds</p>
        </div>
      </div>

      <div className="container">
        {/* Content Types Grid - Restoring your original image-based design */}
        {contentTypes.length > 0 && (
          <div className="content-types-section">
            <h2>Choose Content Type</h2>
            <div className="content-types-grid">
              {contentTypes.map((type) => (
                <div
                  key={type.id}
                  className={`content-type-card ${selectedType?.id === type.id ? 'selected' : ''}`}
                  onClick={() => handleSelectType(type)}
                >
                  <div className="card-image">
                    <img src={type.image} alt={type.name} />
                    <div className="card-overlay">
                      <span className="card-icon">{type.icon}</span>
                    </div>
                  </div>
                  <div className="card-content">
                    <h3>{type.name}</h3>
                    <p>{type.description}</p>
                    <span className="card-category">{type.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Generation Form */}
        {selectedType && (
          <div className="content-form-section">
            <div className="content-form">
              <h2>Generate {selectedType.name}</h2>
              <form onSubmit={handleSubmit} className="generation-form">
                <div className="form-group">
                  <label htmlFor="prompt">Content Topic/Prompt *</label>
                  <textarea
                    id="prompt"
                    name="prompt"
                    value={formData.prompt}
                    onChange={handleInputChange}
                    placeholder={`Describe what you want your ${selectedType.name.toLowerCase()} to be about...`}
                    required
                    rows={4}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="tone">Tone</label>
                    <select
                      id="tone"
                      name="tone"
                      value={formData.tone}
                      onChange={handleInputChange}
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="friendly">Friendly</option>
                      <option value="authoritative">Authoritative</option>
                      <option value="humorous">Humorous</option>
                      <option value="persuasive">Persuasive</option>
                      <option value="neutral">Neutral</option>
                      <option value="uplifting">Uplifting</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="length">Length</label>
                    <select
                      id="length"
                      name="length"
                      value={formData.length}
                      onChange={handleInputChange}
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </div>

                  {providers.length > 0 && (
                    <div className="form-group">
                      <label htmlFor="provider">AI Provider</label>
                      <select
                        id="provider"
                        name="provider"
                        value={formData.provider}
                        onChange={handleInputChange}
                      >
                        {providers.map((provider) => (
                          <option 
                            key={provider.id} 
                            value={provider.id}
                            disabled={provider.status === 'unavailable'}
                          >
                            {provider.name} {provider.status === 'unavailable' ? '(Unavailable)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <button type="submit" className="generate-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic"></i>
                      Generate Content
                    </>
                  )}
                </button>
              </form>

              {error && (
                <div className="error-message">
                  <i className="fas fa-exclamation-triangle"></i>
                  Failed to fetch
                </div>
              )}

              {result && (
                <div className="result-section">
                  <div className="result-header">
                    <h3>Generated Content</h3>
                    <button 
                      className="copy-btn"
                      onClick={() => copyToClipboard(result)}
                      title="Copy to clipboard"
                    >
                      <i className="fas fa-copy"></i>
                      Copy
                    </button>
                  </div>
                  <div className="result-content">
                    <pre>{formatContent(result)}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}



        {/* Loading State */}
        {contentTypes.length === 0 && !error && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading content types...</p>
          </div>
        )}

        {/* Error State */}
        {contentTypes.length === 0 && error && (
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Unable to Load Content Types</h3>
            <p>{error}</p>
            <button onClick={loadContentTypes} className="retry-btn">
              <i className="fas fa-redo"></i>
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentGenerator;
