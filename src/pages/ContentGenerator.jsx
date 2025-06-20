import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { aiService } from '../services/aiService';
import '../css/content-generator.css';

const ContentGenerator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [contentTypes, setContentTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'history'
  const [contentHistory, setContentHistory] = useState([]);

  // Get user from localStorage
  const userData = localStorage.getItem('user') ? 
    JSON.parse(localStorage.getItem('user')) : null;
  
  // Check if user is logged in
  useEffect(() => {
    if (!userData) {
      navigate('/login');
      return;
    }
    
    // Fetch content types
    fetchContentTypes();
  }, [navigate, userData]);
  // Fetch content types from API
  const fetchContentTypes = async () => {
    try {
      setIsLoading(true);
      
      // For prototype/demo (when MongoDB is bypassed), use local content types
      if (userData && userData._id && userData._id.includes('admin-local-bypass')) {
        const localContentTypes = [
          {
            id: 'instagram-post',
            name: 'Instagram Post',
            icon: 'instagram',
            image: '/src/assets/insta.jpeg',
            description: 'Create engaging captions and visuals optimized for Instagram\'s audience'
          },
          {
            id: 'linkedin-post',
            name: 'LinkedIn Post',
            icon: 'linkedin',
            image: '/src/assets/LinkedIn-Logo-2-scaled.jpg',
            description: 'Professional content that drives engagement and showcases expertise'
          },
          {
            id: 'twitter-post',
            name: 'Twitter Post',
            icon: 'twitter',
            image: '/src/assets/twitter.jpeg',
            description: 'Concise, engaging tweets that spark conversation and sharing'
          },
          {
            id: 'blog-post',
            name: 'Blog Post',
            icon: 'file-alt',
            image: '/src/assets/blogpost.jpeg',
            description: 'In-depth content that educates your audience and builds authority'
          }
        ];
        
        setContentTypes(localContentTypes);
        setIsLoading(false);
        return;
      }
      
      // If connected to real backend, fetch from API
      const response = await aiService.getContentTypes();
      if (response.success) {
        setContentTypes(response.contentTypes);
      } else {
        throw new Error(response.error || 'Failed to fetch content types');
      }
    } catch (error) {
      console.error('Error fetching content types:', error);
      setError('Failed to load content types. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selecting content type
  const handleSelectType = (type) => {
    setSelectedType(type);
    setGeneratedContent('');
    setError('');
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    if (tab === 'history' && contentHistory.length === 0) {
      fetchContentHistory();
    }
  };

  // Fetch content history
  const fetchContentHistory = async () => {
    try {
      setIsLoading(true);
        // For prototype/demo (when MongoDB is bypassed), use local history
      if (userData && userData._id && userData._id.includes('admin-local-bypass')) {
        const mockHistory = [
          {
            id: '1',
            userId: userData._id,
            contentType: 'instagram-post',
            prompt: 'New summer collection launch',
            content: 'Summer vibes just dropped! 🌞 Our new collection is here to elevate your seasonal style. Swipe to see more and let us know your favorite piece in the comments! #NewCollection #SummerStyle',
            createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
          },
          {
            id: '2',
            userId: userData._id,
            contentType: 'blog-post',
            prompt: 'Digital marketing trends 2025',
            content: '# Top Digital Marketing Trends for 2025\n\nAs we move further into the digital age, marketing strategies continue to evolve at a rapid pace...',
            createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
          },
          {
            id: '3',
            userId: userData._id,
            contentType: 'twitter-post',
            prompt: 'AI assistant product launch',
            content: 'Excited to announce our new AI assistant! It\'s going to revolutionize how you work. Early access sign-ups open now! #AIAssistant #ProductLaunch #Innovation',
            createdAt: new Date(Date.now() - 259200000).toISOString() // 3 days ago
          },
          {
            id: '4',
            userId: userData._id,
            contentType: 'linkedin-post',
            prompt: 'Industry leadership insights',
            content: 'I\'m excited to share some key insights from our latest industry research.\n\nOur team found that companies embracing AI are seeing a 40% increase in productivity.\n\nWhat has been your experience with AI adoption? Share in the comments below!\n\n#AIInnovation #Leadership #IndustryInsights',
            createdAt: new Date(Date.now() - 345600000).toISOString() // 4 days ago
          }
        ];
        
        setContentHistory(mockHistory);
        setIsLoading(false);
        return;
      }
      
      // If connected to real backend, fetch from API
      const response = await aiService.getContentHistory(userData._id);
      if (response.success) {
        setContentHistory(response.history);
      } else {
        throw new Error(response.error || 'Failed to fetch content history');
      }
    } catch (error) {
      console.error('Error fetching content history:', error);
      setError('Failed to load content history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate content
  const handleGenerateContent = async (e) => {
    e.preventDefault();
    
    if (!selectedType) {
      setError('Please select a content type');
      return;
    }
    
    if (!prompt.trim()) {
      setError('Please enter a prompt for your content');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      setGeneratedContent('');
      
      // For prototype/demo (when MongoDB is bypassed), generate mock content
      if (userData && userData._id && userData._id.includes('admin-local-bypass')) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        let mockContent = '';
          if (selectedType.id === 'instagram-post') {
          mockContent = `✨ ${prompt} ✨\n\nWe're excited to share this with you! Let us know what you think in the comments below.\n\n#${prompt.split(' ').join('')} #MarketingMagic #BrandGrowth`;
        } else if (selectedType.id === 'linkedin-post') {
          mockContent = `I'm thrilled to share some insights about ${prompt}.\n\nThis is something our team has been working on, and we've seen incredible results. Would love to hear your thoughts!\n\n#ProfessionalGrowth #${prompt.split(' ').join('')}`;
        } else if (selectedType.id === 'twitter-post') {
          mockContent = `Just discovered something amazing about ${prompt}! Can't wait to share more details soon. Stay tuned! #${prompt.split(' ').join('')} #ComingSoon`;
        } else {
          mockContent = `# ${prompt}: A Complete Guide\n\nIn today's rapidly evolving digital landscape, understanding ${prompt} is crucial for success. Let's dive into what this means for your business.\n\n## Why ${prompt} Matters\n\nModern businesses need to adapt quickly to changing market conditions...`;
        }
        
        setGeneratedContent(mockContent);
        
        // Add to local history
        const newHistoryItem = {
          id: Date.now().toString(),
          userId: userData._id,
          contentType: selectedType.id,
          prompt: prompt,
          content: mockContent,
          createdAt: new Date().toISOString()
        };
        
        setContentHistory(prev => [newHistoryItem, ...prev]);
        setIsLoading(false);
        return;
      }
      
      // If connected to real backend, generate via API
      const response = await aiService.generateContent({
        contentType: selectedType.id,
        prompt,
        tone,
        length,
        userId: userData._id
      });
      
      if (response.success) {
        setGeneratedContent(response.content);
        
        // Add to history
        fetchContentHistory();
      } else {
        throw new Error(response.error || 'Failed to generate content');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setError('Failed to generate content. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy content to clipboard
  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent)
      .then(() => {
        alert('Content copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy content: ', err);
      });
  };  return (
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
          <div className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => handleTabChange('create')}
            >
              <i className="fas fa-plus"></i> Create Content
            </button>
            <button 
              className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => handleTabChange('history')}
            >
              <i className="fas fa-history"></i> Content History
            </button>
          </div>
          
          {activeTab === 'create' && (
            <div className="content-generator-main">
              <div className="content-type-selection">
                <h2>Select Content Type</h2>                <div className="content-types-grid">
                  {contentTypes.map((type) => (
                    <div 
                      key={type.id}
                      className={`content-type-card ${selectedType?.id === type.id ? 'selected' : ''}`}
                      onClick={() => handleSelectType(type)}
                    >
                      {type.image ? (
                        <div className="card-image">
                          <img src={type.image} alt={type.name} />
                        </div>
                      ) : (
                        <div className="card-icon">
                          <i className={`fab fa-${type.icon}`}></i>
                        </div>
                      )}
                      <h3>{type.name}</h3>
                      <p>{type.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedType && (
                <div className="content-form">
                  <h2>Generate {selectedType.name}</h2>
                  
                  <form onSubmit={handleGenerateContent}>
                    <div className="form-group">
                      <label htmlFor="prompt">What would you like to create?</label>
                      <textarea 
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={`Enter details about your ${selectedType.name}...`}
                        required
                      ></textarea>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="tone">Tone</label>
                        <select 
                          id="tone"
                          value={tone}
                          onChange={(e) => setTone(e.target.value)}
                        >
                          <option value="professional">Professional</option>
                          <option value="casual">Casual</option>
                          <option value="friendly">Friendly</option>
                          <option value="authoritative">Authoritative</option>
                          <option value="humorous">Humorous</option>
                          <option value="persuasive">Persuasive</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="length">Length</label>
                        <select 
                          id="length"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                        >
                          <option value="short">Short</option>
                          <option value="medium">Medium</option>
                          <option value="long">Long</option>
                        </select>
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="generate-btn"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Generating...' : 'Generate Content'}
                      {!isLoading && <i className="fas fa-bolt"></i>}
                    </button>
                    
                    {error && <div className="error-message">{error}</div>}
                  </form>
                </div>
              )}
              
              {generatedContent && (
                <div className="generated-content">
                  <div className="content-header">
                    <h2>Generated {selectedType?.name}</h2>
                    <button className="copy-btn" onClick={handleCopyContent}>
                      <i className="fas fa-copy"></i> Copy
                    </button>
                  </div>
                  
                  <div className="content-box">
                    {generatedContent.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                  
                  <div className="content-footer">
                    <p>
                      <i className="fas fa-info-circle"></i> 
                      Always review AI-generated content before publishing. You can customize and edit this content as needed.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'history' && (
            <div className="content-history">
              <h2>Your Content History</h2>
              
              {isLoading ? (
                <div className="loading">Loading history...</div>
              ) : contentHistory.length > 0 ? (
                <div className="history-list">
                  {contentHistory.map((item) => (
                    <div className="history-item" key={item.id}>
                      <div className="history-header">                        <span className="content-type-badge">
                          {item.contentType === 'instagram-post' && <i className="fab fa-instagram"></i>}
                          {item.contentType === 'linkedin-post' && <i className="fab fa-linkedin"></i>}
                          {item.contentType === 'twitter-post' && <i className="fab fa-twitter"></i>}
                          {item.contentType === 'blog-post' && <i className="fas fa-file-alt"></i>}
                          {item.contentType.replace('-', ' ')}
                        </span>
                        <span className="date">{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <h3>{item.prompt}</h3>
                      
                      <div className="history-content">
                        {item.content.split('\n').slice(0, 3).map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                        {item.content.split('\n').length > 3 && <p>...</p>}
                      </div>
                      
                      <button 
                        className="view-btn"
                        onClick={() => {
                          setSelectedType(contentTypes.find(type => type.id === item.contentType));
                          setPrompt(item.prompt);
                          setGeneratedContent(item.content);
                          setActiveTab('create');
                        }}
                      >
                        <i className="fas fa-eye"></i> View & Edit
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-history">
                  <i className="fas fa-history"></i>
                  <p>You haven't generated any content yet.</p>
                  <button
                    className="create-btn"
                    onClick={() => setActiveTab('create')}
                  >
                    Create Your First Content
                  </button>                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default ContentGenerator;
