import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/business-planner.css';

const BusinessPlanner = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [currentSection, setCurrentSection] = useState('basics');
  const [completion, setCompletion] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  
  // Business Plan Form State
  const [formData, setFormData] = useState({
    // Basics
    businessName: '',
    businessDescription: '',
    industry: '',
    targetLocation: '',
    currentStage: 'idea',
    
    // Product
    productDescription: '',
    keyFeatures: '',
    developmentStage: 'concept',
    
    // Market
    targetCustomerProfile: '',
    marketSize: 'small',
    competitors: '',
    uniqueSellingProposition: '',
    
    // Financial
    startupCosts: '',
    monthlyExpenses: '',
    pricingModel: '',
    breakEvenTimeframe: '',
    
    // Strategy
    marketingChannels: '',
    growthStrategy: '',
    keyMilestones: '',
    riskFactors: ''
  });
  // Authentication is handled by the parent AdminDashboard component
  // We don't need to check auth here as it's now a nested route
  useEffect(() => {
    // Just initialize plans or other data here
    // Auth check is no longer needed as it's done at the AdminDashboard level
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Update completion percentage
    calculateCompletion();
  };

  const handleSelectOption = (field, value) => {
    setFormData({ ...formData, [field]: value });
    calculateCompletion();
  };

  const calculateCompletion = () => {
    // Calculate how many fields are filled
    const sections = {
      basics: ['businessName', 'businessDescription', 'industry', 'targetLocation', 'currentStage'],
      product: ['productDescription', 'keyFeatures', 'developmentStage'],
      market: ['targetCustomerProfile', 'marketSize', 'competitors', 'uniqueSellingProposition'],
      financial: ['startupCosts', 'monthlyExpenses', 'pricingModel', 'breakEvenTimeframe'],
      strategy: ['marketingChannels', 'growthStrategy', 'keyMilestones', 'riskFactors']
    };
    
    // Count total fields and filled fields
    let totalFields = 0;
    let filledFields = 0;
    
    for (const section in sections) {
      sections[section].forEach(field => {
        totalFields++;
        if (formData[field]) filledFields++;
      });
    }
    
    const percentage = Math.floor((filledFields / totalFields) * 100);
    setCompletion(percentage);
  };

  const handleStartPlan = () => {
    setShowCreatePlan(true);
  };
  const handleNextSection = () => {
    const sections = ['basics', 'product', 'market', 'financial', 'strategy'];
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1]);
    }
  };

  const handlePreviousSection = () => {
    const sections = ['basics', 'product', 'market', 'financial', 'strategy'];
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex > 0) {
      setCurrentSection(sections[currentIndex - 1]);
    }
  };  const handleGeneratePlan = async () => {
    try {
      setIsGenerating(true);
      
      // Validate required fields
      const requiredFields = {
        businessName: 'Business Name',
        businessDescription: 'Business Description', 
        industry: 'Industry'
      };
      
      const missingFields = Object.keys(requiredFields).filter(field => 
        !formData[field] || formData[field].trim().length === 0
      );
      
      if (missingFields.length > 0) {
        const missingFieldNames = missingFields.map(field => requiredFields[field]);
        alert(`Please fill in the following required fields: ${missingFieldNames.join(', ')}`);
        setIsGenerating(false);
        return;
      }
      
      // Use AI service to generate business plan
      const planData = {
        businessName: formData.businessName.trim(),
        businessDescription: formData.businessDescription.trim(),
        industry: formData.industry.trim(),
        targetAudience: formData.targetCustomerProfile || '',
        uniqueSellingPoints: formData.uniqueSellingProposition || '',
        tone: 'professional'
      };
      
      const response = await aiService.generateBusinessPlan(planData);
      
      if (response.success && response.content) {
        // Create a business plan structure from AI response
        const generatedPlan = {
          id: Date.now().toString(),
          name: formData.businessName || 'Unnamed Business Plan',
          createdAt: new Date().toISOString(),
          content: response.content,
          provider: response.provider,
          status: 'completed'
        };
        
        setGeneratedPlan(generatedPlan);
        setPlans([...plans, generatedPlan]);
        setShowCreatePlan(false);
      } else {
        alert(response.error || 'Failed to generate business plan. Please try again.');
      }
      
    } catch (error) {
      console.error('Error generating business plan:', error);
      alert('An error occurred while generating your business plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
    const handleBackToPlans = () => {
    setShowCreatePlan(false);
  };
   
  // Render the plan list (empty state)
  const renderPlanList = () => {
    return (
      <div className="plan-list-empty">
        <div className="empty-icon">📄</div>
        <h3>No business plans yet</h3>
        <p>Create your first business plan to get started</p>
        <button className="create-plan-btn" onClick={handleStartPlan}>
          Create Your First Plan
        </button>
      </div>
    );
  };  // Render the welcome screen
  const renderWelcome = () => {
    return (
      <div className="plan-welcome">
        <div className="plan-welcome-glow"></div>
        <div className="floating-elements">
          <div className="floating-box fb-1"><i className="fas fa-lightbulb"></i></div>
          <div className="floating-box fb-2"><i className="fas fa-chart-line"></i></div>
          <div className="floating-box fb-3"><i className="fas fa-rocket"></i></div>
          <div className="floating-box fb-4"><i className="fas fa-bullseye"></i></div>
        </div>
        <h2>Business Planner</h2>
        <p className="welcome-tagline">Generate a strategic business plan with AI</p>
        <p>Create comprehensive business plans that outline your vision, strategy, and execution path</p>
        
        <div className="feature-boxes">
          <div className="feature-box">
            <div className="feature-icon"><i className="fas fa-brain"></i></div>
            <h3>AI-Powered</h3>
            <p>Create strategic plans using advanced AI</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon"><i className="fas fa-file-alt"></i></div>
            <h3>Comprehensive</h3>
            <p>Covers all aspects of your business</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon"><i className="fas fa-clock"></i></div>
            <h3>Time-Saving</h3>
            <p>Generate in minutes, not weeks</p>
          </div>
        </div>

        <button className="create-plan-btn" onClick={handleStartPlan}>
          Create New Plan <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    );
  };
  // Render the plan configuration form
  const renderPlanConfiguration = () => {
    return (
      <div className="plan-configuration">
        <div className="plan-configuration-header">
          <h2><i className="fas fa-cogs"></i> Configure Your Business Plan</h2>
          <div className="plan-progress-container">
            <div className="completion-text">Completion: {completion}%</div>
            <div className="configuration-progress">
              <div className="progress-bar" style={{ width: `${completion}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className="tab-navigation">
          <button 
            className={`tab-button ${currentSection === 'basics' ? 'active' : ''}`} 
            onClick={() => setCurrentSection('basics')}
          >
            Basics
          </button>
          <button 
            className={`tab-button ${currentSection === 'product' ? 'active' : ''}`} 
            onClick={() => setCurrentSection('product')}
          >
            Product
          </button>
          <button 
            className={`tab-button ${currentSection === 'market' ? 'active' : ''}`} 
            onClick={() => setCurrentSection('market')}
          >
            Market
          </button>
          <button 
            className={`tab-button ${currentSection === 'financial' ? 'active' : ''}`} 
            onClick={() => setCurrentSection('financial')}
          >
            Financial
          </button>
          <button 
            className={`tab-button ${currentSection === 'strategy' ? 'active' : ''}`} 
            onClick={() => setCurrentSection('strategy')}
          >
            Strategy
          </button>
        </div>
        
        {currentSection === 'basics' && renderBasicsSection()}
        {currentSection === 'product' && renderProductSection()}
        {currentSection === 'market' && renderMarketSection()}
        {currentSection === 'financial' && renderFinancialSection()}
        {currentSection === 'strategy' && renderStrategySection()}
        
        <div className="navigation-buttons">
          {currentSection !== 'basics' && (
            <button className="btn btn-secondary" onClick={handlePreviousSection}>
              <i className="fas fa-arrow-left"></i> Previous
            </button>
          )}
          {currentSection === 'basics' && (
            <button className="btn btn-secondary" onClick={handleBackToPlans}>
              <i className="fas fa-arrow-left"></i> Back to Plans
            </button>
          )}
          {currentSection !== 'strategy' ? (
            <button className="btn btn-primary" onClick={handleNextSection}>
              Next <i className="fas fa-arrow-right"></i>
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleGeneratePlan} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Plan'} <i className="fas fa-check"></i>
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render Basics Section
  const renderBasicsSection = () => {
    return (
      <div className="plan-section">
        <div className="plan-section-header">
          <h3><i className="fas fa-info-circle"></i> Business Basics</h3>
          <p>Start by defining the fundamental aspects of your business. This information helps establish the foundation of your strategic plan.</p>
        </div>
        
        <form>
          <div className="form-group">
            <label htmlFor="businessName">Business Name</label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              className="form-control"
              placeholder="Your business or product name"
              value={formData.businessName}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="businessDescription">Business Description</label>
            <textarea
              id="businessDescription"
              name="businessDescription"
              className="form-control"
              placeholder="Briefly describe your business concept and mission"
              value={formData.businessDescription}
              onChange={handleInputChange}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="industry">Industry</label>
            <input
              type="text"
              id="industry"
              name="industry"
              className="form-control"
              placeholder="e.g. Technology, Healthcare, Retail"
              value={formData.industry}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="targetLocation">Target Location</label>
            <input
              type="text"
              id="targetLocation"
              name="targetLocation"
              className="form-control"
              placeholder="e.g. North America, Global, San Francisco"
              value={formData.targetLocation}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>Current Stage</label>
            <div className="options-grid">
              <div 
                className={`option-card ${formData.currentStage === 'idea' ? 'selected' : ''}`}
                onClick={() => handleSelectOption('currentStage', 'idea')}
              >
                <h4>Idea Stage</h4>
                <p>Initial concept</p>
              </div>
              <div 
                className={`option-card ${formData.currentStage === 'preLaunch' ? 'selected' : ''}`}
                onClick={() => handleSelectOption('currentStage', 'preLaunch')}
              >
                <h4>Pre-Launch</h4>
                <p>In development</p>
              </div>
              <div 
                className={`option-card ${formData.currentStage === 'operating' ? 'selected' : ''}`}
                onClick={() => handleSelectOption('currentStage', 'operating')}
              >
                <h4>Operating</h4>
                <p>Live with customers</p>
              </div>
              <div 
                className={`option-card ${formData.currentStage === 'scaling' ? 'selected' : ''}`}
                onClick={() => handleSelectOption('currentStage', 'scaling')}
              >
                <h4>Scaling</h4>
                <p>Growth phase</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  };

  // Render Product Section
  const renderProductSection = () => {
    return (
      <div className="plan-section">
        <div className="plan-section-header">
          <h3><i className="fas fa-cube"></i> Product/Service Details</h3>
          <p>Describe what you offer, its unique features, and current development status. This helps create targeted strategies for your specific offering.</p>
        </div>
        
        <form>
          <div className="form-group">
            <label htmlFor="productDescription">Product/Service Description</label>
            <textarea
              id="productDescription"
              name="productDescription"
              className="form-control"
              placeholder="Describe your product or service in detail"
              value={formData.productDescription}
              onChange={handleInputChange}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="keyFeatures">Key Features & Benefits</label>
            <textarea
              id="keyFeatures"
              name="keyFeatures"
              className="form-control"
              placeholder="List the main features and benefits of your product/service"
              value={formData.keyFeatures}
              onChange={handleInputChange}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Development Stage</label>
            <div className="options-grid">
              <div 
                className={`option-card ${formData.developmentStage === 'concept' ? 'selected' : ''}`}
                onClick={() => handleSelectOption('developmentStage', 'concept')}
              >
                <h4>Concept</h4>
                <p>Initial idea</p>
              </div>
              <div 
                className={`option-card ${formData.developmentStage === 'prototype' ? 'selected' : ''}`}
                onClick={() => handleSelectOption('developmentStage', 'prototype')}
              >
                <h4>Prototype</h4>
                <p>Working model</p>
              </div>
              <div 
                className={`option-card ${formData.developmentStage === 'mvp' ? 'selected' : ''}`}
                onClick={() => handleSelectOption('developmentStage', 'mvp')}
              >
                <h4>MVP</h4>
                <p>Minimal viable product</p>
              </div>
              <div 
                className={`option-card ${formData.developmentStage === 'launched' ? 'selected' : ''}`}
                onClick={() => handleSelectOption('developmentStage', 'launched')}
              >
                <h4>Launched</h4>
                <p>In market</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  };

  // Render Market Section
  const renderMarketSection = () => {
    return (
      <div className="plan-section">
        <div className="plan-section-header">
          <h3><i className="fas fa-chart-line"></i> Market Analysis</h3>
          <p>Define your target market and competitive landscape. Understanding these elements helps position your business effectively.</p>
        </div>
        
        <form>
          <div className="form-group">
            <label htmlFor="targetCustomerProfile">Target Customer Profile</label>
            <textarea
              id="targetCustomerProfile"
              name="targetCustomerProfile"
              className="form-control"
              placeholder="Describe your ideal customer (demographics, behaviors, needs)"
              value={formData.targetCustomerProfile}
              onChange={handleInputChange}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Estimated Market Size</label>
            <div className="options-grid">
              <div 
                className={`option-card ${formData.marketSize === 'small' ? 'selected' : ''}`}
                onClick={() => handleSelectOption('marketSize', 'small')}
              >
                <h4>Small</h4>
                <p>Under $1M</p>
              </div>
              <div 
                className={`option-card ${formData.marketSize === 'medium' ? 'selected' : ''}`}
                onClick={() => handleSelectOption('marketSize', 'medium')}
              >
                <h4>Medium</h4>
                <p>$1M - $10M</p>
              </div>
              <div 
                className={`option-card ${formData.marketSize === 'large' ? 'selected' : ''}`}
                onClick={() => handleSelectOption('marketSize', 'large')}
              >
                <h4>Large</h4>
                <p>$10M - $100M</p>
              </div>
              <div 
                className={`option-card ${formData.marketSize === 'enterprise' ? 'selected' : ''}`}
                onClick={() => handleSelectOption('marketSize', 'enterprise')}
              >
                <h4>Enterprise</h4>
                <p>$100M+</p>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="competitors">Main Competitors</label>
            <textarea
              id="competitors"
              name="competitors"
              className="form-control"
              placeholder="List your primary competitors and their strengths/weaknesses"
              value={formData.competitors}
              onChange={handleInputChange}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="uniqueSellingProposition">Unique Selling Proposition</label>
            <textarea
              id="uniqueSellingProposition"
              name="uniqueSellingProposition"
              className="form-control"
              placeholder="What makes your business unique compared to competitors?"
              value={formData.uniqueSellingProposition}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </form>
      </div>
    );
  };

  // Render Financial Section
  const renderFinancialSection = () => {
    return (
      <div className="plan-section">
        <div className="plan-section-header">
          <h3><i className="fas fa-dollar-sign"></i> Financial Planning</h3>
          <p>Outline your financial requirements, projections, and key financial metrics for sustainable business growth.</p>
        </div>
        
        <form>
          <div className="form-group">
            <label htmlFor="startupCosts">Initial Startup Costs</label>
            <input
              type="text"
              id="startupCosts"
              name="startupCosts"
              className="form-control"
              placeholder="Estimated initial investment needed"
              value={formData.startupCosts}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="monthlyExpenses">Monthly Operating Expenses</label>
            <input
              type="text"
              id="monthlyExpenses"
              name="monthlyExpenses"
              className="form-control"
              placeholder="Estimated monthly costs to run your business"
              value={formData.monthlyExpenses}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="pricingModel">Pricing Model</label>
            <input
              type="text"
              id="pricingModel"
              name="pricingModel"
              className="form-control"
              placeholder="How will you price your product/service?"
              value={formData.pricingModel}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="breakEvenTimeframe">Break-even Timeframe</label>
            <input
              type="text"
              id="breakEvenTimeframe"
              name="breakEvenTimeframe"
              className="form-control"
              placeholder="When do you expect to break even?"
              value={formData.breakEvenTimeframe}
              onChange={handleInputChange}
            />
          </div>
        </form>
      </div>
    );
  };

  // Render Strategy Section
  const renderStrategySection = () => {
    return (
      <div className="plan-section">
        <div className="plan-section-header">
          <h3><i className="fas fa-chess"></i> Business Strategy</h3>
          <p>Define your approach to growth, marketing, and risk management to create a clear roadmap for success.</p>
        </div>
        
        <form>
          <div className="form-group">
            <label htmlFor="marketingChannels">Marketing Channels</label>
            <textarea
              id="marketingChannels"
              name="marketingChannels"
              className="form-control"
              placeholder="Which channels will you use to reach customers?"
              value={formData.marketingChannels}
              onChange={handleInputChange}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="growthStrategy">Growth Strategy</label>
            <textarea
              id="growthStrategy"
              name="growthStrategy"
              className="form-control"
              placeholder="How do you plan to scale your business over time?"
              value={formData.growthStrategy}
              onChange={handleInputChange}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="keyMilestones">Key Milestones</label>
            <textarea
              id="keyMilestones"
              name="keyMilestones"
              className="form-control"
              placeholder="What are the major milestones for your business in the next 1-2 years?"
              value={formData.keyMilestones}
              onChange={handleInputChange}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="riskFactors">Risk Factors & Mitigation</label>
            <textarea
              id="riskFactors"
              name="riskFactors"
              className="form-control"
              placeholder="What are the main risks to your business and how will you address them?"
              value={formData.riskFactors}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </form>
      </div>
    );
  };  // Helper functions to generate business plan content
  const generateExecutiveSummary = (data) => {
    const businessName = data.businessName || 'Mirai AI Studio';
    const stage = data.currentStage || 'startup';
    const industry = data.industry || 'technology';
    const description = data.businessDescription || 'creating innovative AI-powered solutions';
    const location = data.targetLocation || 'global markets';

    return {
      summary: `${businessName} is a ${stage} stage business in the ${industry} industry, focused on ${description}. We aim to serve customers in ${location} with our unique products and services.`,
      points: [
        `${businessName} specializes in ${description}`,
        `Currently in ${stage} phase with high growth potential`,
        `Targeting ${location} with industry focus on ${industry}`,
        `Positioned to address specific market needs with innovative solutions`
      ]
    };
  };
  
  const generateMarketAnalysis = (data) => {
    const customerProfile = data.targetCustomerProfile || 'individuals and businesses seeking innovative solutions';
    const marketSize = data.marketSize || 'small';
    const competitors = data.competitors || 'various established and emerging players';
    const usp = data.uniqueSellingProposition || 'our innovative approach and dedication to customer satisfaction';
    
    // Generate more detailed competitor analysis
    const competitorsList = competitors.split(',').map(comp => comp.trim()).filter(c => c);
    const defaultCompetitors = ['Copy.ai - Good for text generation, but lacks multimedia integration', 
      'Jasper.ai - Powerful AI writer with high pricing', 
      'Pictory.ai - Focused on AI video creation, but lacks an integrated marketing suite',
      'Canva Magic Studio - Strong in visuals, weak in AI automation and scalability'];
    
    const competitorsDetails = competitorsList.length > 0 ? competitorsList : defaultCompetitors;
    
    // Generate market size estimate based on selection
    let marketSizeDetails;
    switch(marketSize) {
      case 'small':
        marketSizeDetails = { value: 'Under $1M', growth: '15-20% annually', opportunity: 'Niche market with specific needs' };
        break;
      case 'medium':
        marketSizeDetails = { value: '$1M - $10M', growth: '20-25% annually', opportunity: 'Growing sector with room for innovation' };
        break;
      case 'large':
        marketSizeDetails = { value: '$10M - $100M', growth: '15-18% annually', opportunity: 'Established market with multiple segments' };
        break;
      case 'enterprise':
        marketSizeDetails = { value: '$100M+', growth: '10-15% annually', opportunity: 'Massive market with enterprise potential' };
        break;
      default:
        marketSizeDetails = { value: '$1M - $10M', growth: '18% annually', opportunity: 'Growing market with specific needs' };
    }
    
    return {
      summary: `The target customer profile is ${customerProfile}. Our market size is ${marketSize} with competitors including ${competitors}. Our unique selling proposition is ${usp}.`,
      targetCustomer: customerProfile,
      marketSize: marketSizeDetails,
      competitors: competitorsDetails,
      uniqueSellingProposition: usp
    };
  };
  
  const generateMarketingStrategy = (data) => {
    const channels = data.marketingChannels || 'digital channels and direct outreach';
    const growth = data.growthStrategy || 'expand gradually while maintaining quality';
    const milestones = data.keyMilestones || 'product launch, first 100 customers, and expanding feature set';
    
    // Generate default marketing channels if not provided
    const channelsList = channels.split(',').map(ch => ch.trim()).filter(c => c);
    const defaultChannels = [
      { name: 'Social Media Marketing', description: 'Instagram, LinkedIn, Twitter, YouTube Shorts for AI tool demos' },
      { name: 'Content Marketing', description: 'Blogs, SEO-optimized articles on AI + creativity' },
      { name: 'Product Hunt & Indie Hackers', description: 'For initial tech user traction' },
      { name: 'Email Marketing Automation', description: 'Using our own built-in tools' },
      { name: 'Partnerships', description: 'With content creators and micro-influencers' }
    ];
    
    // Generate growth phases
    const growthPhases = [
      { phase: 'Initial Launch', description: 'Focus on niche segments like solo creators and startups for fast traction' },
      { phase: 'Expansion', description: 'Offer B2B/agency tools with white-label options' },
      { phase: 'Scaling', description: 'Launch a community referral program to drive organic growth' },
      { phase: 'Optimization', description: 'Invest in AI improvements and personalization features' },
      { phase: 'Global Expansion', description: 'Expand global reach by supporting multiple languages and regions' }
    ];
    
    // Generate milestones
    const milestonesList = milestones.split(',').map(m => m.trim()).filter(m => m);
    const defaultMilestones = [
      { time: 'Month 3', goal: 'Official product launch with core features' },
      { time: 'Month 6', goal: 'Reach 500 active users' },
      { time: 'Month 9', goal: 'Implement premium features and subscription model' },
      { time: 'Month 12', goal: 'Scale to 10,000 users & breakeven' },
      { time: 'Year 2', goal: 'Release analytics dashboard + AI personalization v2' }
    ];
    
    return {
      summary: `Our marketing will focus on ${channels} to reach our target customers. We plan to ${growth}.`,
      marketingChannels: channelsList.length > 0 ? channelsList : defaultChannels,
      growthStrategy: growthPhases,
      keyMilestones: milestonesList.length > 0 ? milestonesList : defaultMilestones
    };
  };
  
  const generateFinancialProjections = (data) => {
    const startupCosts = data.startupCosts || '$12,000 - $20,000';
    const monthlyExpenses = data.monthlyExpenses || '$1,500 - $3,000';
    const pricing = data.pricingModel || 'Freemium + Tiered Subscriptions';
    const breakEven = data.breakEvenTimeframe || '10-14 months';
    
    // Generate expense breakdown
    const expenseBreakdown = [
      { category: 'MVP Development', amount: '$5,000 - $8,000', description: 'AI modules, UI/UX design' },
      { category: 'Cloud Computing & APIs', amount: '$2,000', description: 'OpenAI, Replicate, etc.' },
      { category: 'Branding & Design', amount: '$1,500', description: 'Logo, visual identity, initial marketing materials' },
      { category: 'Legal & Administrative', amount: '$1,000', description: 'Business registration, basic legal templates' },
      { category: 'Marketing & Launch', amount: '$2,500', description: 'Initial campaigns, landing page optimization' }
    ];
    
    // Generate monthly operations costs
    const operationsCosts = [
      { category: 'Cloud Infrastructure', amount: '$500 - $1,000', description: 'GPU/API usage' },
      { category: 'Maintenance & Bug Fixes', amount: '$300 - $500', description: 'Ongoing development' },
      { category: 'Marketing', amount: '$300 - $500', description: 'Ads, SEO, socials' },
      { category: 'Subscriptions', amount: '$200 - $400', description: 'Email tools, design software, analytics' },
      { category: 'Team/Freelancer Support', amount: '$200 - $600', description: 'Part-time assistance' }
    ];
    
    // Generate subscription tiers
    const subscriptionTiers = [
      { tier: 'Free tier', price: '$0/month', features: 'Limited access to tools (ideal for testing)' },
      { tier: 'Basic Plan', price: '$9.99/month', features: 'Full access to standard features' },
      { tier: 'Pro Plan', price: '$24.99/month', features: 'Advanced features and higher usage limits' },
      { tier: 'Agency Plan', price: '$49.99/month', features: 'Team collaboration and white-labeling' },
      { tier: 'Add-ons', price: 'Variable', features: 'AI tokens, premium templates, and additional usage' }
    ];
    
    // Generate revenue projections
    const revenueProjections = [
      { period: 'Month 3', users: '100', monthlyRevenue: '$500', description: 'Initial beta users converting' },
      { period: 'Month 6', users: '500', monthlyRevenue: '$3,000', description: 'Growing user base' },
      { period: 'Month 9', users: '1,000', monthlyRevenue: '$8,000', description: 'Premium features rollout' },
      { period: 'Month 12', users: '2,000', monthlyRevenue: '$15,000', description: 'Hitting stride' },
      { period: 'Month 18', users: '5,000', monthlyRevenue: '$40,000', description: 'Strong growth phase' },
    ];
    
    return {
      summary: `Initial startup costs are estimated at ${startupCosts}, with monthly operating expenses of approximately ${monthlyExpenses}. Our pricing model is based on ${pricing}. We expect to break even within ${breakEven}.`,
      startupCosts: expenseBreakdown,
      monthlyExpenses: operationsCosts,
      pricingModel: subscriptionTiers,
      breakEvenTimeframe: breakEven,
      revenueProjections: revenueProjections
    };
  };
    const generateRiskAssessment = (data) => {
    const riskFactors = data.riskFactors || 'Market competition, high compute/API costs, user churn, tech reliability, data privacy concerns';
    
    // Create structured risk assessment
    const risksList = riskFactors.split(',').map(risk => risk.trim()).filter(r => r);
    const defaultRisks = [
      { risk: 'Market Competition', mitigation: 'Counter with a unique bundled offering and user experience' },
      { risk: 'High compute/API costs', mitigation: 'Optimize backend and negotiate usage-based API deals' },
      { risk: 'User Churn', mitigation: 'Improve onboarding and offer value-first freemium access' },
      { risk: 'Tech reliability', mitigation: 'Use scalable infrastructure (AWS/GCP) and regular QA testing' },
      { risk: 'Data privacy concerns', mitigation: 'Implement strong encryption and transparent policies' }
    ];
    
    return {
      risks: risksList.length > 0 ? risksList.map(risk => ({risk, mitigation: 'Develop specific strategies to address this risk'})) : defaultRisks
    };
  };
  
  // Render a generated business plan
  const renderGeneratedPlan = () => {
    if (!generatedPlan) return null;
    
    return (
      <div className="generated-plan">
        <div className="plan-header">
          <h2>{generatedPlan.name}</h2>
          <p className="plan-date">Created on {new Date(generatedPlan.createdAt).toLocaleDateString()}</p>
          {generatedPlan.provider && (
            <p className="plan-provider">Generated using {generatedPlan.provider}</p>
          )}
        </div>
        
        <div className="plan-content">
          <div className="plan-section-content">
            <div className="business-plan-content">
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                {generatedPlan.content}
              </pre>
            </div>
          </div>
        </div>
        
        <div className="plan-actions">
          <button className="btn btn-outline" onClick={() => { window.print(); }}>
            <i className="fas fa-print"></i> Print Plan
          </button>
          <button className="btn btn-secondary" onClick={() => copyPlanToClipboard(generatedPlan.content)}>
            <i className="fas fa-copy"></i> Copy Plan
          </button>
          <button className="btn btn-primary" onClick={handleStartPlan}>
            Create Another Plan <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
    );
  };

  // Helper function to copy plan to clipboard
  const copyPlanToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      alert('Business plan copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Business plan copied to clipboard!');
    }
  };
  // Render loading state when generating a plan
  const renderGeneratingState = () => {
    return (
      <div className="generating-state">
        <div className="generating-spinner"></div>
        <h3>Generating Your Business Plan</h3>
        <p>Please wait while we create your comprehensive business plan...</p>
      </div>
    );
  };
  return (
    <div className="business-planner-container">
      <div className="business-planner-main">
        {isGenerating ? (
          renderGeneratingState()
        ) : !showCreatePlan ? (
          plans.length === 0 ? renderWelcome() : (
            generatedPlan ? renderGeneratedPlan() : renderPlanList()
          )
        ) : (
          renderPlanConfiguration()
        )}
      </div>
    </div>
  );
};

export default BusinessPlanner;
