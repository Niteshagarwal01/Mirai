import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import '../css/content-generator.css';


import instagramImg from '../assets/insta.jpeg';
import linkedinImg from '../assets/LinkedIn-Logo-2-scaled.jpg';
import twitterImg from '../assets/twitter.jpeg';
import blogpostImg from '../assets/blogpost.jpeg';
import storyProductImg from '../assets/story and product descriptions.jpg';
import facebookImg from '../assets/facebook.jpg';

const ContentCreator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getToken } = useAuth();
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
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Image mapping for content types
  const contentImages = {
    'Instagram Post': instagramImg,
    'LinkedIn Post': linkedinImg,
    'Twitter Post': twitterImg,
    'Blog Post': blogpostImg,
    'Facebook Post': facebookImg,
    'LinkedIn Article': linkedinImg,
    'Article': linkedinImg,
    'Instagram Story': instagramImg,
    'Product Description': storyProductImg,
    'Essay': storyProductImg
  };

  // Category and description mapping
  const contentMetadata = {
    'Instagram Post': {
      description: 'Engaging captions with emojis, hashtags, and visual storytelling',
      category: 'Social Media'
    },
    'LinkedIn Post': {
      description: 'Professional thought leadership content that builds authority',
      category: 'Social Media'
    },
    'Twitter Post': {
      description: 'Viral-worthy tweets (280 chars max) that spark conversation',
      category: 'Social Media'
    },
    'Facebook Post': {
      description: 'Engaging posts that encourage likes, comments, and shares',
      category: 'Social Media'
    },
    'Blog Post': {
      description: 'SEO-optimized articles with research, structure, and actionable insights',
      category: 'Content'
    },
    'LinkedIn Article': {
      description: 'Professional long-form articles for LinkedIn thought leadership',
      category: 'Content'
    },
    'Instagram Story': {
      description: 'Eye-catching 15-second story scripts with swipe-up hooks',
      category: 'Social Media'
    },
    'Product Description': {
      description: 'Compelling e-commerce product descriptions that convert browsers to buyers',
      category: 'E-commerce'
    },
    'Essay': {
      description: 'Well-structured essays with introduction, body, and conclusion',
      category: 'Content'
    }
  };

  // AI providers
  const defaultProviders = [
    { id: 'auto', name: 'Auto-Select Best Model' },
    { id: 'gpt-4', name: 'GPT-4 (OpenAI)' },
    { id: 'claude', name: 'Claude (Anthropic)' },
    { id: 'gemini', name: 'Gemini (Google)' }
  ];

  useEffect(() => {
    // Fetch content types from backend
    const fetchContentTypes = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/content/types');
        const data = await response.json();
        
        if (data.success && data.contentTypes) {
          // Map backend content types to frontend format
          const types = data.contentTypes.map(type => ({
            id: type.id,
            name: type.name,
            description: contentMetadata[type.name]?.description || 'AI-powered content generation',
            image: contentImages[type.name] || instagramImg,
            category: contentMetadata[type.name]?.category || 'Content',
            maxLength: type.maxLength,
            includeHashtags: type.includeHashtags
          }));
          setContentTypes(types);
          console.log('✅ Loaded', types.length, 'content types from backend');
        } else {
          // Backend returned but no content types
          useFallbackTypes();
        }
      } catch (err) {
        console.error('❌ Failed to fetch content types from backend:', err);
        console.warn('⚠️ Using fallback content types');
        // Fallback to defaults if backend is unavailable
        useFallbackTypes();
      }
    };

    // Fallback content types if backend is unavailable
    const useFallbackTypes = () => {
      const fallbackTypes = [
        {
          id: 'Instagram Post',
          name: 'Instagram Post',
          description: 'Engaging captions with emojis, hashtags, and visual storytelling',
          image: instagramImg,
          category: 'Social Media',
          maxLength: 2200,
          includeHashtags: true
        },
        {
          id: 'LinkedIn Post',
          name: 'LinkedIn Post',
          description: 'Professional thought leadership content that builds authority',
          image: linkedinImg,
          category: 'Professional',
          maxLength: 3000,
          includeHashtags: false
        },
        {
          id: 'Twitter Post',
          name: 'Twitter Post',
          description: 'Viral-worthy tweets (280 chars max) that spark conversation',
          image: twitterImg,
          category: 'Social Media',
          maxLength: 280,
          includeHashtags: true
        },
        {
          id: 'Blog Post',
          name: 'Blog Post',
          description: 'SEO-optimized articles with research, structure, and actionable insights',
          image: blogpostImg,
          category: 'Content Creation',
          maxLength: 4000,
          includeHashtags: false
        },
        {
          id: 'Facebook Post',
          name: 'Facebook Post',
          description: 'Engaging posts that encourage likes, comments, and shares',
          image: facebookImg,
          category: 'Social Media',
          maxLength: 2000,
          includeHashtags: true
        },
        {
          id: 'LinkedIn Article',
          name: 'LinkedIn Article',
          description: 'Professional long-form articles for LinkedIn thought leadership',
          image: linkedinImg,
          category: 'Professional',
          maxLength: 5000,
          includeHashtags: false
        },
        {
          id: 'Instagram Story',
          name: 'Instagram Story',
          description: 'Short, engaging story text for Instagram Stories',
          image: instagramImg,
          category: 'Social Media',
          maxLength: 500,
          includeHashtags: true
        },
        {
          id: 'Product Description',
          name: 'Product Description',
          description: 'Compelling product descriptions that drive sales',
          image: storyProductImg,
          category: 'E-commerce',
          maxLength: 1000,
          includeHashtags: false
        },
        {
          id: 'Essay',
          name: 'Essay',
          description: 'Well-structured essays with introduction, body, and conclusion',
          image: storyProductImg,
          category: 'Content Creation',
          maxLength: 3000,
          includeHashtags: false
        }
      ];
      setContentTypes(fallbackTypes);
      console.log('📦 Loaded', fallbackTypes.length, 'fallback content types');
    };

    fetchContentTypes();
    setProviders(defaultProviders);

    // Automatically select type if coming from feature click
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type && contentTypes.length > 0) {
      const matchedType = contentTypes.find(t => t.id === type);
      if (matchedType) {
        setSelectedType(matchedType);
      }
    }
  }, [location]);

  const handleTypeSelection = (type) => {
    setSelectedType(type);
    setResult('');
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    if (!selectedType) {
      setError('Please select a content type');
      return;
    }

    if (!formData.prompt.trim()) {
      setError('Please enter a topic or description');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = await getToken();
      
      if (!token) {
        setError('Please sign in to generate content');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3001/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contentType: selectedType.id || selectedType.name,
          prompt: formData.prompt,
          tone: formData.tone,
          length: formData.length,
          provider: formData.provider
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setResult(data.content);
      setSeoData(data.seo || null); // Store SEO metadata
      console.log('✅ Generation complete:', {
        wordCount: data.metadata?.wordCount,
        researchUsed: data.metadata?.researchUsed,
        seoGenerated: !!data.seo
      });
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    alert('Content copied to clipboard!');
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([result], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedType?.name || 'content'}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="c:\Users\offic\Downloads\fcd02ed7-37cf-484e-b1ee-ea4b8ab65dbd.jpg-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Content Creator</h1>
          <p>Generate engaging social media content with AI</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate('/admin')}>
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>
      </div>

      {!selectedType ? (
        /* Content Type Selection */
        <div className="content-type-selection">
          <h2>Choose Content Type</h2>
          <div className="content-types-grid">
            {contentTypes.map((type) => (
              <div
                key={type.id}
                className="content-type-card"
                onClick={() => handleTypeSelection(type)}
              >
                <div className="type-image">
                  <img src={type.image} alt={type.name} />
                </div>
                <div className="type-info">
                  <h3>{type.name}</h3>
                  <p>{type.description}</p>
                  <span className="type-category">{type.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Generation Form */
        <div className="generation-section">
          <div className="selected-type-header">
            <div className="type-badge">
              <img src={selectedType.image} alt={selectedType.name} />
              <span>{selectedType.name}</span>
            </div>
            <button 
              className="btn-link" 
              onClick={() => {
                setSelectedType(null);
                setResult('');
                setError('');
              }}
            >
              <i className="fas fa-times"></i> Change Type
            </button>
          </div>

          <div className="generator-layout">
            {/* Form Section */}
            <div className="form-section">
              <form onSubmit={handleGenerate} className="generator-form">
                <div className="form-group">
                  <label htmlFor="prompt">
                    <i className="fas fa-lightbulb"></i>
                    Topic / Description
                  </label>
                  <textarea
                    id="prompt"
                    name="prompt"
                    value={formData.prompt}
                    onChange={handleInputChange}
                    placeholder={`Describe what you want to create for ${selectedType.name}...`}
                    rows="4"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="tone">
                      <i className="fas fa-palette"></i>
                      Tone
                    </label>
                    <select
                      id="tone"
                      name="tone"
                      value={formData.tone}
                      onChange={handleInputChange}
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="friendly">Friendly</option>
                      <option value="enthusiastic">Enthusiastic</option>
                      <option value="formal">Formal</option>
                      <option value="humorous">Humorous</option>
                      <option value="inspirational">Inspirational</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="length">
                      <i className="fas fa-ruler"></i>
                      Length
                    </label>
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
                </div>

                <div className="form-group">
                  <label htmlFor="provider">
                    <i className="fas fa-robot"></i>
                    AI Model
                  </label>
                  <select
                    id="provider"
                    name="provider"
                    value={formData.provider}
                    onChange={handleInputChange}
                  >
                    {providers.map(provider => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                </div>

                {error && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary btn-full"
                  disabled={loading}
                >
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
            </div>

            {/* Result Section */}
            <div className="result-section">
              <div className="result-card">
                <div className="result-header">
                  <h3>
                    <i className="fas fa-file-alt"></i>
                    Generated Content
                  </h3>
                  {result && (
                    <div className="result-actions">
                      <button className="btn-icon" onClick={handleCopy} title="Copy to clipboard">
                        <i className="fas fa-copy"></i>
                      </button>
                      <button className="btn-icon" onClick={handleDownload} title="Download">
                        <i className="fas fa-download"></i>
                      </button>
                    </div>
                  )}
                </div>

                <div className="result-content">
                  {loading ? (
                    <div className="loading-state">
                      <div className="spinner-large"></div>
                      <p>Generating your content...</p>
                      <small>This may take a few moments</small>
                    </div>
                  ) : result ? (
                    <>
                      <div className="generated-text">
                        <pre>{result}</pre>
                      </div>
                      
                      {/* SEO Metadata Display */}
                      {seoData && (
                        <div className="seo-metadata">
                          <h4>
                            <i className="fas fa-chart-line"></i>
                            SEO Optimization
                          </h4>
                          
                          {seoData.metaDescription && (
                            <div className="seo-section">
                              <label>Meta Description:</label>
                              <p className="meta-description">{seoData.metaDescription}</p>
                            </div>
                          )}
                          
                          {seoData.keywords && seoData.keywords.length > 0 && (
                            <div className="seo-section">
                              <label>Keywords:</label>
                              <div className="tag-list">
                                {seoData.keywords.map((keyword, idx) => (
                                  <span key={idx} className="tag tag-keyword">{keyword}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {seoData.hashtags && seoData.hashtags.length > 0 && (
                            <div className="seo-section">
                              <label>Hashtags:</label>
                              <div className="tag-list">
                                {seoData.hashtags.map((hashtag, idx) => (
                                  <span key={idx} className="tag tag-hashtag">#{hashtag}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="empty-state">
                      <i className="fas fa-file-alt"></i>
                      <p>Your generated content will appear here</p>
                      <small>Fill out the form and click generate to get started</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Generations */}
      {selectedType && (
        <div className="recent-section">
          <h3>Recent Generations</h3>
          <div className="recent-list">
            <div className="recent-item">
              <div className="recent-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="recent-info">
                <p>Instagram post about summer...</p>
                <small>2 hours ago</small>
              </div>
              <button className="btn-link">
                <i className="fas fa-eye"></i>
              </button>
            </div>
            <div className="recent-item">
              <div className="recent-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="recent-info">
                <p>LinkedIn post about AI trends...</p>
                <small>Yesterday</small>
              </div>
              <button className="btn-link">
                <i className="fas fa-eye"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCreator;
