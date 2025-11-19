import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import '../css/media-studio.css';

const MediaStudio = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  
  const [prompt, setPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');
    
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('productImage', uploadedImage);

      const response = await fetch('http://localhost:3001/api/photoshoot/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedImage(data.imageUrl);
      } else {
        setError(data.error || 'Generation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="media-studio-page">
      <div className="dashboard-header">
        <div>
          <h1>🎨 AI Media Studio</h1>
          <p>Upload an image and describe what you want - AI will create it</p>
        </div>
      </div>

      <div className="media-content">
        <div className="media-form-section">
          <div className="media-card">
            <h3>
              <i className="fas fa-magic"></i>
              Generate AI Image
            </h3>
            
            <form onSubmit={handleGenerate}>
              <div className="form-group">
                <label>
                  <i className="fas fa-upload"></i>
                  Upload Your Product Image <span className="required">*</span>
                </label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    id="productImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    required
                    disabled={isGenerating}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="productImage" className="file-upload-label">
                    <i className="fas fa-cloud-upload-alt"></i>
                    {uploadedImage ? uploadedImage.name : 'Choose image file'}
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>
                  <i className="fas fa-comment-dots"></i>
                  What do you want to create? <span className="required">*</span>
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., Professional Instagram post for my product, modern design with vibrant colors, featuring the product prominently on a clean background"
                  rows="5"
                  required
                  disabled={isGenerating}
                />
              </div>

              {error && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="btn-primary btn-full btn-generate"
                disabled={isGenerating || !prompt || !uploadedImage}
              >
                {isGenerating ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic"></i>
                    Generate AI Image
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="media-tips">
            <h4><i className="fas fa-lightbulb"></i> Tips for better results</h4>
            <ul>
              <li><strong>Be specific</strong> - Describe style, colors, mood clearly</li>
              <li><strong>Mention context</strong> - Instagram post, Facebook ad, product photo, etc.</li>
              <li><strong>Add details</strong> - Background, lighting, composition preferences</li>
              <li><strong>Describe quality</strong> - Professional, modern, vintage, minimalist</li>
            </ul>
          </div>
        </div>

        <div className="media-preview-section">
          <div className="preview-card">
            <h3>
              <i className="fas fa-image"></i>
              Generated Result
            </h3>
            
            {isGenerating ? (
              <div className="generating-state">
                <div className="spinner-large"></div>
                <p>Creating your AI image...</p>
                <small>This will take just a moment</small>
              </div>
            ) : generatedImage ? (
              <div className="generated-result">
                <img src={generatedImage} alt="Generated" />
                <div className="result-actions">
                  <a 
                    href={generatedImage} 
                    download="ai-generated.png"
                    className="btn-primary"
                  >
                    <i className="fas fa-download"></i>
                    Download
                  </a>
                  <button 
                    className="btn-secondary"
                    onClick={() => window.open(generatedImage, '_blank')}
                  >
                    <i className="fas fa-external-link-alt"></i>
                    Open Full Size
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setGeneratedImage(null);
                      setPrompt('');
                      setUploadedImage(null);
                    }}
                  >
                    <i className="fas fa-redo"></i>
                    Generate New
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <i className="fas fa-image"></i>
                <p>Your AI-generated image will appear here</p>
                <small>Upload an image and describe what you want</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaStudio;
