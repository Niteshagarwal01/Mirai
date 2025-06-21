import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { aiService } from '../services/aiService';
import '../css/content-generator.css';

// Import images directly
import instagramImg from '../assets/insta.jpeg';
import linkedinImg from '../assets/LinkedIn-Logo-2-scaled.jpg';
import twitterImg from '../assets/twitter.jpeg';
import blogpostImg from '../assets/blogpost.jpeg';

const ContentGenerator = () => {
  const navigate = useNavigate();
  const location = useLocation();  const [contentTypes, setContentTypes] = useState([]);
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

  // Fetch content types - always use local content types with images
  const fetchContentTypes = async () => {
    try {
      setIsLoading(true);
      
      // Always use these predefined content types with images
      const localContentTypes = [
        {
          id: 'instagram-post',
          name: 'Instagram Post',
          icon: 'instagram',
          image: instagramImg,
          description: 'Create engaging captions and visuals optimized for Instagram\'s audience'
        },
        {
          id: 'linkedin-post',
          name: 'LinkedIn Post',
          icon: 'linkedin',
          image: linkedinImg,
          description: 'Professional content that drives engagement and showcases expertise'
        },
        {
          id: 'twitter-post',
          name: 'Twitter Post',
          icon: 'twitter',
          image: twitterImg,
          description: 'Concise, engaging tweets that spark conversation and sharing'
        },
        {
          id: 'blog-post',
          name: 'Blog Post',
          icon: 'file-alt',
          image: blogpostImg,
          description: 'In-depth content that educates your audience and builds authority'
        }
      ];
      
      setContentTypes(localContentTypes);
      setIsLoading(false);
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
      
      // Always use local history for the file-based system
      const mockHistory = [
        {
          id: '1',
          userId: userData._id || userData.id,
          contentType: 'instagram-post',
          prompt: 'New summer collection launch',
          content: 'Summer vibes just dropped! 🌞 Our new collection is here to elevate your seasonal style. Swipe to see more and let us know your favorite piece in the comments! #NewCollection #SummerStyle',
          createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          id: '2',
          userId: userData._id || userData.id,
          contentType: 'blog-post',
          prompt: 'Digital marketing trends 2025',
          content: '# Top Digital Marketing Trends for 2025\n\nAs we move further into the digital age, marketing strategies continue to evolve at a rapid pace...',
          createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        },
        {
          id: '3',
          userId: userData._id || userData.id,
          contentType: 'twitter-post',
          prompt: 'AI assistant product launch',
          content: 'Excited to announce our new AI assistant! It\'s going to revolutionize how you work. Early access sign-ups open now! #AIAssistant #ProductLaunch #Innovation',
          createdAt: new Date(Date.now() - 259200000).toISOString() // 3 days ago
        },
        {
          id: '4',
          userId: userData._id || userData.id,
          contentType: 'linkedin-post',
          prompt: 'Industry leadership insights',
          content: 'I\'m excited to share some key insights from our latest industry research.\n\nOur team found that companies embracing AI are seeing a 40% increase in productivity.\n\nWhat has been your experience with AI adoption? Share in the comments below!\n\n#AIInnovation #Leadership #IndustryInsights',
          createdAt: new Date(Date.now() - 345600000).toISOString() // 4 days ago
        }
      ];
      
      setContentHistory(mockHistory);
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
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let mockContent = '';
      
      // Generate more realistic content based on content type and length
      if (selectedType.id === 'instagram-post') {
        // Instagram posts are typically short with emojis and hashtags
        if (length === 'short') {
          mockContent = `✨ ${prompt} ✨\n\nCan't wait to share this with you! #${prompt.split(' ').join('')} #Trending`;
        } else if (length === 'medium') {
          mockContent = `✨ ${prompt} ✨\n\nWe're excited to share this with you! Let us know what you think in the comments below.\n\n#${prompt.split(' ').join('')} #MarketingMagic #BrandGrowth`;
        } else { // long
          mockContent = `✨ ${prompt} ✨\n\nWe're thrilled to finally reveal this to our amazing community! This has been in the works for months, and your feedback has been instrumental in making it happen.\n\nDrop a comment to let us know your thoughts! Tag a friend who needs to see this!\n\n#${prompt.split(' ').join('')} #MarketingMagic #BrandGrowth #InstaDaily #ContentCreator`;
        }
        
        // Adjust tone
        if (tone === 'casual') {
          mockContent = mockContent.replace("We're excited", "We're super stoked");
          mockContent = mockContent.replace("Let us know", "Drop a comment");
        } else if (tone === 'humorous') {
          mockContent = mockContent.replace("We're excited", "We're ridiculously excited");
          mockContent = mockContent.replace("Let us know", "Tell us (honestly, we can take it!)");
          mockContent += "\n\n😂 #JustForLaughs";
        } else if (tone === 'persuasive') {
          mockContent = mockContent.replace("We're excited", "You won't want to miss");
          mockContent = mockContent.replace("Let us know", "Don't miss out - let us know");
          mockContent += "\n\n👉 Limited time only!";
        }
      } else if (selectedType.id === 'linkedin-post') {
        // LinkedIn posts are more professional and often contain business insights
        if (length === 'short') {
          mockContent = `I'm excited to share some thoughts about ${prompt}.\n\n${tone === 'professional' ? 'What are your perspectives on this topic?' : 'Would love to hear your thoughts!'}\n\n#${prompt.split(' ').join('')} #ProfessionalDevelopment`;
        } else if (length === 'medium') {
          mockContent = `I'm thrilled to share some insights about ${prompt}.\n\nAfter analyzing industry trends for the past quarter, our team has identified three key factors that are driving change in this space:\n\n1️⃣ Increased digital adoption across demographics\n2️⃣ Rising demand for personalized experiences\n3️⃣ Integration of AI in everyday business operations\n\nThis is something our team has been working on, and we've seen incredible results. Would love to hear your thoughts!\n\n#ProfessionalGrowth #${prompt.split(' ').join('')} #IndustryInsights`;
        } else { // long
          mockContent = `I'm thrilled to share some comprehensive insights about ${prompt}.\n\n📊 INDUSTRY ANALYSIS:\n\nAfter conducting extensive research and analyzing market trends for the past year, our team has identified five critical factors that are reshaping the landscape:\n\n1️⃣ Accelerated digital transformation across all sectors\n2️⃣ Evolving consumer expectations demanding more personalized experiences\n3️⃣ Integration of AI and machine learning in core business processes\n4️⃣ Sustainability becoming a central business priority rather than a peripheral concern\n5️⃣ Remote work culture permanently altering talent acquisition and retention strategies\n\nOur findings suggest that organizations embracing these changes are seeing an average of 27% growth in key performance indicators compared to their peers.\n\n🔍 KEY TAKEAWAYS:\n\n• Investment in digital infrastructure is no longer optional\n• Customer experience should be personalized but respect privacy boundaries\n• Upskilling teams for the AI-driven economy is critical\n• Sustainability initiatives directly impact bottom line\n\nI'd be interested to hear your experiences with these trends. Has your organization been adapting to these changes? What challenges have you encountered?\n\n#ProfessionalGrowth #${prompt.split(' ').join('')} #BusinessStrategy #MarketTrends #LeadershipInsights #IndustryAnalysis`;
        }
        
        // Adjust tone
        if (tone === 'authoritative') {
          mockContent = mockContent.replace("I'm thrilled", "Based on my 15+ years of industry experience, I can confidently state");
          mockContent = mockContent.replace("Would love to hear", "I welcome your professional insights on");
        } else if (tone === 'casual') {
          mockContent = mockContent.replace("I'm thrilled", "I'm really happy");
          mockContent = mockContent.replace("Would love to hear", "Drop your thoughts in the comments!");
        } else if (tone === 'persuasive') {
          mockContent = mockContent.replace("I'm thrilled", "You need to know");
          mockContent = mockContent.replace("Would love to hear", "Don't miss this opportunity to share");
        }
      } else if (selectedType.id === 'twitter-post') {
        // Twitter/X posts are very concise
        if (length === 'short') {
          mockContent = `Just discovered something amazing about ${prompt}! #${prompt.split(' ').join('')}`;
        } else if (length === 'medium') {
          mockContent = `Just discovered something amazing about ${prompt}! Can't wait to share more details soon. Stay tuned! #${prompt.split(' ').join('')} #ComingSoon`;
        } else { // long - still relatively short for Twitter
          mockContent = `Just discovered something amazing about ${prompt}! After months of research, we're ready to share our findings.\n\nThe results might surprise you - especially point #3!\n\nStay tuned for the full thread coming tomorrow! #${prompt.split(' ').join('')} #ComingSoon #ThreadAlert`;
        }
        
        // Adjust tone
        if (tone === 'humorous') {
          mockContent = mockContent.replace("Just discovered", "OMG just found out");
          mockContent = mockContent.replace("amazing", "mind-blowing");
          mockContent += " 😂";
        } else if (tone === 'authoritative') {
          mockContent = mockContent.replace("Just discovered", "Breaking: New data reveals");
          mockContent = mockContent.replace("amazing", "significant findings");
        } else if (tone === 'persuasive') {
          mockContent = mockContent.replace("Just discovered", "You won't believe what I just learned");
          mockContent = mockContent.replace("Stay tuned", "You definitely don't want to miss this");
        }
      } else if (selectedType.id === 'blog-post') {
        // Blog posts are much longer, detailed and structured
        if (length === 'short') {
          mockContent = `# ${prompt}: A Quick Overview\n\nIn today's rapidly evolving digital landscape, understanding ${prompt} is becoming increasingly important. Let's explore the basics.\n\n## Why ${prompt} Matters\n\n${prompt} has emerged as a critical factor in how businesses approach their digital strategy. With changing consumer behaviors and technological advancements, staying informed about ${prompt} can give you a competitive edge.\n\n## Key Takeaways\n\n- ${prompt} is transforming how businesses operate online\n- Understanding the fundamentals can improve your marketing results\n- Staying updated on trends related to ${prompt} is essential for future success\n\nWhat aspects of ${prompt} are you most interested in learning more about? Let us know in the comments!`;
        } else if (length === 'medium') {
          mockContent = `# ${prompt}: A Complete Guide\n\nIn today's rapidly evolving digital landscape, understanding ${prompt} is crucial for success. Let's dive into what this means for your business.\n\n## Why ${prompt} Matters\n\nModern businesses need to adapt quickly to changing market conditions. ${prompt} has emerged as a key factor in determining which companies thrive and which fall behind. Research shows that organizations implementing effective ${prompt} strategies see an average of 23% higher growth rates compared to their peers.\n\n## Key Components of ${prompt}\n\n### 1. Strategic Implementation\n\nSuccessful ${prompt} begins with a clear strategy. This includes:\n\n- Setting measurable objectives\n- Understanding your audience demographics and preferences\n- Analyzing competitor approaches\n- Establishing realistic timelines and milestones\n\n### 2. Technical Considerations\n\nBeyond strategy, there are important technical aspects to consider:\n\n- Platform compatibility\n- Performance optimization\n- Mobile responsiveness\n- Integration with existing systems\n\n### 3. Measurement & Analytics\n\nWhat gets measured gets managed. Key metrics to track include:\n\n- Engagement rates\n- Conversion metrics\n- ROI calculations\n- Long-term impact assessment\n\n## Common Challenges and Solutions\n\nMany organizations face hurdles when implementing ${prompt}. Here are some common challenges and effective solutions:\n\n| Challenge | Solution |\n|-----------|----------|\n| Limited resources | Prioritize high-impact initiatives |\n| Technical complexity | Start with pilot programs |\n| Measuring effectiveness | Implement proper tracking from day one |\n| Organizational resistance | Focus on education and clear benefits |\n\n## Looking Ahead\n\nThe future of ${prompt} looks promising. Emerging trends suggest that integration with AI and machine learning will create even more opportunities for businesses that are prepared.\n\n## Conclusion\n\nStaying ahead in today's competitive environment requires a solid understanding of ${prompt} and how it impacts your business operations. By focusing on strategic implementation, technical excellence, and proper measurement, you can leverage ${prompt} to drive significant business results.\n\n*What has been your experience with ${prompt}? Share your thoughts in the comments below!*`;
        } else { // long - a full comprehensive blog post
          mockContent = `# ${prompt}: The Definitive Guide for 2025 and Beyond\n\n![${prompt} Header Image](https://example.com/images/${prompt.toLowerCase().split(' ').join('-')}.jpg)\n\n## Introduction\n\nIn today's rapidly evolving digital landscape, mastering ${prompt} has become more than just a competitive advantage—it's a necessity for survival. This comprehensive guide will explore every aspect of ${prompt}, from fundamental concepts to advanced strategies, helping you position your business for success in 2025 and beyond.\n\n## Table of Contents\n\n1. [Understanding the Basics of ${prompt}](#basics)\n2. [The Evolution of ${prompt}: From Past to Present](#evolution)\n3. [Key Components of an Effective ${prompt} Strategy](#components)\n4. [Implementation Framework: Step-by-Step Approach](#implementation)\n5. [Measuring Success: KPIs and Analytics](#metrics)\n6. [Common Challenges and Solutions](#challenges)\n7. [Case Studies: Success Stories](#case-studies)\n8. [Advanced Techniques for Optimization](#advanced)\n9. [Future Trends and Predictions](#future)\n10. [Resources and Tools](#resources)\n\n<a name="basics"></a>\n## Understanding the Basics of ${prompt}\n\n${prompt} fundamentally transforms how businesses connect with their audiences. At its core, it represents a shift from traditional approaches to more dynamic, data-driven methodologies.\n\nKey concepts include:\n\n- **Audience-Centric Focus**: Understanding that ${prompt} begins and ends with deep audience insights\n- **Integration Across Channels**: Breaking down silos for consistent experiences\n- **Data-Driven Decision Making**: Using analytics to guide strategy rather than intuition alone\n- **Continuous Optimization**: Embracing an iterative approach to improvement\n\nResearch from McKinsey & Company indicates that organizations effectively implementing ${prompt} strategies see a 15-30% increase in revenue and a 20-50% reduction in acquisition costs.\n\n<a name="evolution"></a>\n## The Evolution of ${prompt}: From Past to Present\n\nThe concept of ${prompt} has undergone significant transformation over the past decade:\n\n### Early Stages (2010-2015)\n* Limited adoption primarily by tech-forward organizations\n* Focus on basic implementation with minimal integration\n* Rudimentary measurement capabilities\n\n### Middle Period (2016-2020)\n* Widespread recognition of importance across industries\n* Improvements in technology enabling better implementation\n* Enhanced analytics providing clearer ROI understanding\n\n### Current State (2021-Present)\n* AI-driven approaches revolutionizing capabilities\n* Deep integration with all business operations\n* Sophisticated measurement frameworks enabling precise optimization\n\n<a name="components"></a>\n## Key Components of an Effective ${prompt} Strategy\n\nA successful ${prompt} approach requires several interconnected elements working in harmony:\n\n### 1. Strategic Foundation\n\nEvery effective ${prompt} initiative begins with a clear strategy that includes:\n\n- **Defined Objectives**: Specific, measurable goals aligned with business outcomes\n- **Audience Analysis**: Deep understanding of target segments, needs, and behaviors\n- **Competitive Positioning**: Clear differentiation from market alternatives\n- **Resource Allocation**: Appropriate budget and talent dedicated to initiatives\n\n### 2. Technical Infrastructure\n\nThe backbone of successful ${prompt} implementation includes:\n\n- **Platform Selection**: Choosing appropriate technologies that align with needs\n- **Integration Capabilities**: Ensuring systems work together seamlessly\n- **Scalability Planning**: Building for future growth and expansion\n- **Security Considerations**: Protecting data and maintaining compliance\n\n### 3. Content Strategy\n\nContent remains king in the ${prompt} realm, requiring:\n\n- **Value-Driven Creation**: Developing material that solves real audience problems\n- **Format Diversity**: Utilizing various media types (text, video, interactive)\n- **Consistency & Cadence**: Maintaining regular publishing schedules\n- **Personalization Capabilities**: Tailoring experiences to individual preferences\n\n### 4. Analysis Framework\n\nEffective measurement includes:\n\n- **KPI Definition**: Establishing clear metrics tied to business objectives\n- **Attribution Modeling**: Understanding conversion pathways\n- **Testing Protocol**: A/B and multivariate testing methodologies\n- **Reporting Structure**: Clear communication of results to stakeholders\n\n<a name="implementation"></a>\n## Implementation Framework: Step-by-Step Approach\n\nSuccessfully deploying a ${prompt} strategy requires a methodical approach:\n\n### Phase 1: Discovery & Planning (4-6 Weeks)\n1. Conduct stakeholder interviews\n2. Perform competitive analysis\n3. Complete audience research\n4. Define success metrics\n5. Develop strategic roadmap\n\n### Phase 2: Foundation Building (6-8 Weeks)\n1. Select and implement technical platforms\n2. Develop initial content library\n3. Establish measurement frameworks\n4. Train team members\n5. Create governance documentation\n\n### Phase 3: Launch & Optimization (Ongoing)\n1. Execute initial campaigns\n2. Gather preliminary data\n3. Analyze performance metrics\n4. Make data-driven adjustments\n5. Scale successful elements\n\n<a name="metrics"></a>\n## Measuring Success: KPIs and Analytics\n\nEffectively measuring ${prompt} requires tracking both leading and lagging indicators:\n\n### Engagement Metrics\n- **Time on Page**: Average duration users interact with content\n- **Click-Through Rate (CTR)**: Percentage of users who click on specific elements\n- **Social Sharing**: Frequency of content distribution by users\n- **Comment Generation**: Volume and sentiment of user responses\n\n### Conversion Metrics\n- **Lead Generation**: Number of qualified prospects captured\n- **Conversion Rate**: Percentage of users who complete desired actions\n- **Cost Per Acquisition (CPA)**: Expense required to convert a customer\n- **Lifetime Value (LTV)**: Total revenue generated from average customer\n\n### Business Impact Metrics\n- **Revenue Attribution**: Sales directly connected to ${prompt} activities\n- **Market Share Changes**: Competitive position improvements\n- **Brand Equity Measures**: Perception and awareness improvements\n- **Operational Efficiency**: Process improvements and cost reductions\n\n<a name="challenges"></a>\n## Common Challenges and Solutions\n\nOrganizations typically encounter several obstacles when implementing ${prompt}:\n\n| Challenge | Solution | Implementation Tips |\n|-----------|----------|---------------------|\n| Limited resources | Prioritize high-impact initiatives | Focus on 2-3 key areas rather than spreading too thin |\n| Technical complexity | Start with pilot programs | Begin with a small, cross-functional team |\n| Measuring effectiveness | Implement proper tracking | Define KPIs before launching initiatives |\n| Organizational resistance | Focus on education and clear benefits | Showcase early wins to build momentum |\n| Data silos | Implement integration strategy | Start with manual processes, then automate |\n\n<a name="case-studies"></a>\n## Case Studies: Success Stories\n\n### Company A: Retail Transformation\n\nA mid-sized retailer implemented a comprehensive ${prompt} strategy with remarkable results:\n\n- **Approach**: Integrated online and in-store data to create unified customer profiles\n- **Implementation**: Phased approach over 12 months focusing on technology, then process\n- **Results**: 32% increase in repeat purchases, 28% higher average order value\n\n### Company B: B2B Manufacturing\n\nA traditional manufacturer leveraged ${prompt} to transform their sales process:\n\n- **Approach**: Created digital tools to empower distributors and direct sales\n- **Implementation**: Built centralized platform with personalized access points\n- **Results**: Reduced sales cycle by 40%, increased qualified leads by 67%\n\n<a name="advanced"></a>\n## Advanced Techniques for Optimization\n\nOnce basic implementation is complete, consider these advanced approaches:\n\n### Predictive Analytics\nUtilize machine learning to anticipate customer needs and behaviors before they occur.\n\n### AI-Driven Personalization\nImplement sophisticated algorithms that deliver truly individualized experiences at scale.\n\n### Cross-Channel Attribution\nDevelop comprehensive models that accurately track influences across multiple touchpoints.\n\n### Behavioral Economics Integration\nApply psychological principles to optimize engagement and conversion opportunities.\n\n<a name="future"></a>\n## Future Trends and Predictions\n\nThe ${prompt} landscape continues to evolve rapidly. Key trends to watch include:\n\n- **AI Ubiquity**: Artificial intelligence becoming embedded in all aspects of ${prompt}\n- **Zero-Party Data Emphasis**: Greater focus on information directly shared by customers\n- **Voice and Visual Search Integration**: New interfaces changing discovery patterns\n- **Augmented Reality Experiences**: Blending digital and physical worlds for engagement\n- **Blockchain for Trust**: Distributed ledger technology enhancing transparency\n\nIndustry analysts project the global ${prompt} market to grow at a CAGR of 18.2% through 2030, reaching a market size of $${Math.floor(Math.random() * 900) + 100} billion.\n\n<a name="resources"></a>\n## Resources and Tools\n\n### Recommended Reading\n- *${prompt} Mastery* by Jennifer Roberts\n- *The Future of ${prompt}* by Michael Chang\n- *Data-Driven ${prompt}* by Sarah Johnson\n\n### Useful Tools\n1. [AnalyticsPro](https://example.com) - Comprehensive measurement suite\n2. [ContentEngine](https://example.com) - AI-powered content optimization\n3. [IntegrationHub](https://example.com) - Platform connection tools\n\n### Learning Resources\n1. [${prompt} Academy](https://example.com) - Free certification courses\n2. [StrategyForum](https://example.com) - Professional community\n3. [InsightWebinars](https://example.com) - Monthly expert sessions\n\n## Conclusion\n\nMastering ${prompt} is not just a marketing objective—it's a business imperative for organizations aiming to thrive in today's digital economy. By understanding the fundamentals, implementing a structured approach, measuring effectively, and staying ahead of emerging trends, you can position your organization for sustainable growth and competitive advantage.\n\nThe journey toward ${prompt} excellence is continuous, requiring ongoing commitment to learning, optimization, and innovation. However, the organizations that make this commitment consistently outperform those that don't by significant margins across virtually all relevant metrics.\n\n*What aspects of ${prompt} have you found most challenging? What successes have you experienced? Share your thoughts in the comments below!*\n\n---\n\n***About the Author:*** *This comprehensive guide was prepared by our team of digital strategy experts with over 25 years of combined experience implementing ${prompt} solutions across various industries.*\n\n[Subscribe to our newsletter](#) for more in-depth content on ${prompt} and related digital transformation topics.`;
        }
        
        // Adjust tone
        if (tone === 'casual') {
          mockContent = mockContent.replace("In today's rapidly evolving digital landscape", "Let's face it");
          mockContent = mockContent.replace("understanding", "getting to grips with");
          mockContent = mockContent.replace("crucial for success", "super important");
        } else if (tone === 'authoritative') {
          mockContent = mockContent.replace("In today's rapidly evolving digital landscape", "Based on extensive research and analysis");
          mockContent = mockContent.replace("Let's dive", "This analysis will dive");
          mockContent = mockContent.replace("your business", "organizations seeking market leadership");
        } else if (tone === 'persuasive') {
          mockContent = mockContent.replace("In today's rapidly evolving digital landscape", "If you want to stay ahead of your competition");
          mockContent = mockContent.replace("understanding", "mastering");
          mockContent = mockContent.replace("crucial for success", "absolutely essential for survival");
        } else if (tone === 'humorous') {
          mockContent = mockContent.replace("In today's rapidly evolving digital landscape", "In the wild, wild west of today's digital world");
          mockContent = mockContent.replace("understanding", "figuring out");
          mockContent = mockContent.replace("crucial for success", "the difference between awesome success and epic failure");
          mockContent += "\n\n*Disclaimer: No digital marketers were harmed in the writing of this blog post. Though several caffeine addictions may have been enabled.*";
        }
      }
      
      setGeneratedContent(mockContent);
      
      // Add to local history
      const newHistoryItem = {
        id: Date.now().toString(),
        userId: userData._id || userData.id,
        contentType: selectedType.id,
        prompt: prompt,
        content: mockContent,
        createdAt: new Date().toISOString()
      };
      
      setContentHistory(prev => [newHistoryItem, ...prev]);
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
              <h2>Select Content Type</h2>
              <div className="content-types-grid">
                {contentTypes.map((type) => (
                  <div 
                    key={type.id}
                    className={`content-type-card ${selectedType?.id === type.id ? 'selected' : ''}`}
                    onClick={() => handleSelectType(type)}
                  >
                    <div className="card-image">
                      <img 
                        src={type.image} 
                        alt={type.name}
                      />
                    </div>
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
                    <div className="form-group form-group-select">
                      <label htmlFor="tone">
                        <i className="fas fa-volume-up"></i> Tone
                      </label>
                      <div className="select-wrapper">
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
                    </div>
                    
                    <div className="form-group form-group-select">
                      <label htmlFor="length">
                        <i className="fas fa-text-height"></i> Length
                      </label>
                      <div className="select-wrapper">
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
                  <div className="content-actions">
                    <div className="content-stats">
                      <span className="content-length-indicator" title="Content length">
                        <i className="fas fa-align-left"></i>
                        {generatedContent.length < 500 ? 'Short' : 
                         generatedContent.length < 2000 ? 'Medium' : 'Long'} 
                        ({Math.round(generatedContent.length / 5)} words)
                      </span>
                    </div>
                    <button className="copy-btn" onClick={handleCopyContent}>
                      <i className="fas fa-copy"></i> Copy
                    </button>
                  </div>
                </div>
                
                <div className="content-box">
                  {selectedType?.id === 'blog-post' ? (
                    // For blog posts, use more sophisticated rendering with markdown-like handling
                    generatedContent.split('\n').map((line, index) => {
                      // Handle headings
                      if (line.startsWith('# ')) {
                        return <h1 key={index}>{line.replace('# ', '')}</h1>;
                      } else if (line.startsWith('## ')) {
                        return <h2 key={index}>{line.replace('## ', '')}</h2>;
                      } else if (line.startsWith('### ')) {
                        return <h3 key={index}>{line.replace('### ', '')}</h3>;
                      } else if (line.startsWith('#### ')) {
                        return <h4 key={index}>{line.replace('#### ', '')}</h4>;
                      } 
                      // Handle bullet points
                      else if (line.startsWith('- ')) {
                        return <ul key={index}><li>{line.replace('- ', '')}</li></ul>;
                      } else if (line.startsWith('* ')) {
                        return <ul key={index}><li>{line.replace('* ', '')}</li></ul>;
                      } 
                      // Handle numbered lists
                      else if (/^\d+\.\s/.test(line)) {
                        return <ol key={index}><li>{line.replace(/^\d+\.\s/, '')}</li></ol>;
                      }
                      // Handle tables (simplified)
                      else if (line.includes('|')) {
                        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
                          const cells = line.split('|').filter(cell => cell.trim() !== '');
                          return (
                            <div key={index} style={{overflowX: 'auto', margin: '10px 0'}}>
                              <table>
                                <tr>
                                  {cells.map((cell, i) => <td key={i}>{cell.trim()}</td>)}
                                </tr>
                              </table>
                            </div>
                          );
                        }
                      }
                      // Handle horizontal rule
                      else if (line === '---') {
                        return <hr key={index} />;
                      }
                      // Handle empty lines
                      else if (line.trim() === '') {
                        return <br key={index} />;
                      }
                      // Default paragraph handling
                      return <p key={index}>{line}</p>;
                    })
                  ) : selectedType?.id === 'linkedin-post' ? (
                    // For LinkedIn, add special formatting for emojis and lists
                    generatedContent.split('\n').map((line, index) => {
                      // Handle emoji bullet points (like 1️⃣, 2️⃣, etc.)
                      if (/^[0-9]️⃣/.test(line)) {
                        return <p key={index} style={{fontWeight: 'bold'}}>{line}</p>;
                      }
                      // Handle sections with emoji headers (like 📊, 🔍)
                      else if (/^[^\w\s]/.test(line) && line.toUpperCase() === line) {
                        return <p key={index} style={{fontWeight: 'bold', marginTop: '15px'}}>{line}</p>;
                      }
                      // Handle hashtags
                      else if (line.includes('#')) {
                        return (
                          <p key={index}>
                            {line.split(' ').map((word, wordIndex) => {
                              if (word.startsWith('#')) {
                                return <span key={wordIndex} style={{color: 'var(--primary)'}}>{word} </span>;
                              }
                              return word + ' ';
                            })}
                          </p>
                        );
                      }
                      // Empty lines
                      else if (line.trim() === '') {
                        return <br key={index} />;
                      }
                      // Default handling
                      return <p key={index}>{line}</p>;
                    })
                  ) : (
                    // For other content types (Instagram, Twitter), simple line breaks
                    generatedContent.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))
                  )}
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
            ) : error ? (
              <div className="empty-history">
                <i className="fas fa-exclamation-triangle"></i>
                <p>{error}</p>
                <button 
                  className="create-btn"
                  onClick={() => {
                    setError('');
                    fetchContentHistory();
                  }}
                >
                  Retry Loading History
                </button>
              </div>
            ) : contentHistory && contentHistory.length > 0 ? (
              <div className="history-list">
                {contentHistory.map((item) => {
                  if (!item || !item.contentType) {
                    console.error('Invalid history item:', item);
                    return null;
                  }
                  
                  // Find the matching content type to get the image
                  const typeInfo = contentTypes.find(type => type.id === item.contentType);
                  
                  // Format date safely
                  let formattedDate = 'Unknown date';
                  try {
                    formattedDate = new Date(item.createdAt).toLocaleDateString();
                  } catch (dateError) {
                    console.error('Error formatting date:', dateError);
                  }
                  
                  return (
                    <div className="history-item" key={item.id || `history-${Date.now()}-${Math.random()}`}>
                      <div className="history-header">
                        <span className="content-type-badge">
                          {typeInfo && (
                            <img 
                              src={typeInfo.image} 
                              alt={typeInfo.name} 
                              className="history-type-icon"
                              style={{ width: '20px', height: '20px', marginRight: '5px' }}
                            />
                          )}
                          {item.contentType.replace('-', ' ')}
                        </span>
                        <span className="date">{formattedDate}</span>
                      </div>
                      
                      <h3>{item.prompt}</h3>
                      
                      <div className="history-content">
                        {item.content && item.content.split('\n').slice(0, 3).map((line, index) => (
                          <p key={index}>{line || ' '}</p>
                        ))}
                        {item.content && item.content.split('\n').length > 3 && <p>...</p>}
                      </div>
                      
                      <button 
                        className="view-btn"
                        onClick={() => {
                          const matchedType = contentTypes.find(type => type.id === item.contentType);
                          if (matchedType) {
                            setSelectedType(matchedType);
                            setPrompt(item.prompt || '');
                            setGeneratedContent(item.content || '');
                            setActiveTab('create');
                          } else {
                            console.error(`Could not find content type: ${item.contentType}`);
                            setError(`Could not view content - unknown type: ${item.contentType}`);
                          }
                        }}
                      >
                        <i className="fas fa-eye"></i> View & Edit
                      </button>
                    </div>
                  );
                })}
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
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentGenerator;
