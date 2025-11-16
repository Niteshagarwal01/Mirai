import express from 'express';
import { requireAuth } from '../middleware/clerk.js';

const router = express.Router();

// ============================================
// WEB RESEARCH - Inspired by Alwrity
// ============================================

/**
 * Conduct web research before content generation
 * Uses free Serper.dev API (100 searches/month free)
 */
async function conductWebResearch(topic, maxResults = 5) {
  try {
    const serperKey = process.env.SERPER_API_KEY;
    
    if (!serperKey || serperKey.includes('your_')) {
      console.log('⚠️ No Serper API key - skipping research');
      return null;
    }

    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': serperKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: topic,
        num: maxResults
      })
    });

    if (!response.ok) {
      console.error('Research API error:', response.status);
      return null;
    }

    const data = await response.json();
    
    // Extract useful information
    const researchSummary = {
      results: data.organic?.slice(0, maxResults).map(r => ({
        title: r.title,
        snippet: r.snippet,
        source: r.link
      })) || [],
      relatedSearches: data.relatedSearches?.slice(0, 5).map(r => r.query) || [],
      peopleAlsoAsk: data.peopleAlsoAsk?.slice(0, 3).map(q => q.question) || []
    };

    console.log(`🔍 Research completed: ${researchSummary.results.length} sources found`);
    return researchSummary;
  } catch (error) {
    console.error('Research error:', error.message);
    return null;
  }
}

/**
 * Format research data for AI prompt
 */
function formatResearchForPrompt(research) {
  if (!research || !research.results || research.results.length === 0) {
    return '';
  }

  let formatted = '\n\n📚 RESEARCH CONTEXT (Use this factual information):\n\n';
  
  // Add top search results
  research.results.forEach((result, index) => {
    formatted += `${index + 1}. ${result.title}\n   ${result.snippet}\n\n`;
  });

  // Add related topics
  if (research.relatedSearches && research.relatedSearches.length > 0) {
    formatted += '\n🔗 Related Topics: ' + research.relatedSearches.join(', ') + '\n';
  }

  // Add common questions
  if (research.peopleAlsoAsk && research.peopleAlsoAsk.length > 0) {
    formatted += '\n❓ Common Questions:\n';
    research.peopleAlsoAsk.forEach((q, i) => {
      formatted += `   ${i + 1}. ${q}\n`;
    });
  }

  return formatted;
}

// ============================================
// SEO OPTIMIZATION - Inspired by Alwrity
// ============================================

/**
 * Generate SEO metadata for content
 */
async function generateSEO(contentType, topic, content, aiProvider) {
  try {
    const seoPrompt = `Based on this content about "${topic}", generate SEO optimization:

CONTENT:
${content.substring(0, 500)}...

Please provide (in JSON format):
1. metaDescription: SEO-friendly meta description (150-160 characters)
2. keywords: 5-10 relevant keywords (array)
3. hashtags: 5-10 relevant hashtags for social media (array)
4. title: SEO-optimized title (50-60 characters)

Return ONLY valid JSON, no extra text.`;

    const seoData = await aiProvider(
      'You are an SEO expert. Return only valid JSON.',
      seoPrompt
    );

    // Try to parse JSON response
    try {
      const cleaned = seoData.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch (parseError) {
      // Fallback: extract basic SEO
      return extractBasicSEO(topic, content);
    }
  } catch (error) {
    console.error('SEO generation error:', error.message);
    return extractBasicSEO(topic, content);
  }
}

/**
 * Extract basic SEO from content (fallback)
 */
function extractBasicSEO(topic, content) {
  // Extract first 150 chars for meta description
  const metaDescription = content.substring(0, 150).trim() + '...';
  
  // Extract potential keywords (simple approach)
  const words = topic.toLowerCase().split(' ');
  const keywords = words.filter(w => w.length > 3).slice(0, 5);
  
  // Generate hashtags
  const hashtags = keywords.map(k => '#' + k.replace(/[^a-z0-9]/g, ''));
  
  return {
    metaDescription,
    keywords,
    hashtags,
    title: topic.substring(0, 60)
  };
}

// ============================================
// CONTENT TYPES - From Alwrity AI-Writer-main
// Based on AI-Writer-main/lib/ai_writers structure
// Each type follows Alwrity's proven content generation patterns
// ============================================

const CONTENT_TYPES = {
  // From insta_ai_writer.py
  'Instagram Post': {
    icon: '📸',
    category: 'Social Media',
    guidelines: `Follow these Instagram best practices:
1). Front-Loading: Capture attention by placing key info at the beginning
2). Optimize for Call-to-Action (CTA) - engagement focused
3). Hashtag Usage: Include 4-6 relevant hashtags
4). Brand Voice: Convey the selected tone authentically
5). Emojis: Inject personality and emotion naturally
6). Brevity: Keep captions concise yet impactful
7). Visual Storytelling: Describe imagery that complements the post`,
    maxLength: 2200,
    includeHashtags: true,
    style: 'visual',
    cta_options: ['Shop Now', 'Learn More', 'Swipe Up', 'Link in Bio', 'Sense of urgency'],
    tone_options: ['Neutral', 'Formal', 'Casual', 'Funny', 'Optimistic', 'Assertive', 'Friendly', 'Encouraging', 'Sarcastic']
  },
  
  // From linkedin_ai_writer.py - linkedin_post_generator_ui
  'LinkedIn Post': {
    icon: '💼',
    category: 'Professional',
    guidelines: `Create engaging, professional LinkedIn posts that drive engagement:
1). Professional Tone: Authority with approachability
2). Value-Driven: Lead with insights and takeaways
3). Data & Stats: Back claims with credible numbers
4). Industry Relevance: Connect to current trends and challenges
5). Thought Leadership: Share unique perspectives and expertise
6). Engagement: Pose thought-provoking questions
7). Formatting: Use line breaks for readability
8). Call-to-Action: Encourage meaningful professional engagement`,
    maxLength: 3000,
    includeHashtags: false,
    style: 'professional',
    target_audience: ['Professionals', 'Decision Makers', 'Industry Leaders', 'Entrepreneurs'],
    features: ['Professional tone', 'Industry terminology', 'Character optimization', 'Engagement prediction']
  },
  
  // From smart_tweet_generator.py
  'Twitter Post': {
    icon: '🐦',
    category: 'Social Media',
    guidelines: `Create viral-worthy tweets following Twitter best practices:
1). Character Limit: Maximum 280 characters - every word must count
2). Hook: Start with attention-grabbing opening line
3). Hashtags: Use 1-3 trending, relevant hashtags strategically
4). Brevity: One clear, powerful idea per tweet
5). Engagement: Pose questions or share controversial takes
6). Personality: Inject unique voice and authentic perspective
7). Urgency: Create FOMO or leverage timely relevance
8). Emojis: Use 1-2 emojis for visual appeal and emotion`,
    maxLength: 280,
    includeHashtags: true,
    style: 'concise',
    tone_options: ['Professional', 'Casual', 'Informative', 'Humorous', 'Inspirational', 'Serious'],
    emoji_suggestions: true
  },
  
  // From ai_blog_generator.py
  'Blog Post': {
    icon: '📝',
    category: 'Content Creation',
    guidelines: `Generate comprehensive, SEO-friendly blog posts:
1). SEO Optimization: Incorporate keywords naturally throughout content
2). Structure: Engaging intro, detailed body with H2/H3 headings, actionable conclusion
3). Research-Backed: Use factual data from credible sources
4). Readability: Short paragraphs, bullet points, clear language
5). Call-to-Action: Include relevant CTA if appropriate for content type
6). Unique Voice: Inject personality while maintaining professionalism
7). Target Length: Follow specified word count guidelines
8). Factual Accuracy: Ensure all claims are reliable and well-sourced
9). Image Suggestions: Recommend where visuals would enhance content
10). Internal Linking: Suggest related topics for internal links`,
    maxLength: 4000,
    includeHashtags: false,
    style: 'structured',
    blog_types: ['Informational', 'How-to', 'List', 'Review', 'Tutorial', 'Opinion'],
    blog_tones: ['Professional', 'Casual', 'Formal', 'Conversational', 'Authoritative', 'Friendly'],
    blog_demographics: ['Professional', 'General', 'Technical', 'Beginner', 'Expert', 'Student']
  },
  
  // From ai_product_description_writer.py
  'Product Description': {
    icon: '🛍️',
    category: 'E-commerce',
    guidelines: `Create compelling product descriptions that drive sales:
1). Benefits-First: Lead with customer benefits, not just features
2). Sensory Language: Use descriptive words that create mental images
3). Social Proof: Incorporate credibility indicators when applicable
4). Scannability: Use bullet points for key features
5). SEO Keywords: Include relevant search terms naturally
6). Urgency: Create sense of scarcity or limited availability
7). Clear CTA: Direct call-to-action for purchase
8). Technical Specs: Include important specifications
9). Target Audience: Speak directly to ideal customer
10). Emotion + Logic: Balance emotional appeal with practical information`,
    maxLength: 800,
    includeHashtags: false,
    style: 'persuasive',
    features: ['Benefit highlighting', 'Feature listing', 'SEO optimization', 'CTA integration']
  },
  
  // From linkedin_ai_writer.py - linkedin_article_generator_ui  
  'LinkedIn Article': {
    icon: '📄',
    category: 'Professional',
    guidelines: `Generate long-form professional LinkedIn articles:
1). Topic Research: Provide comprehensive coverage of subject matter
2). SEO Optimization: Optimize for LinkedIn article discoverability
3). Professional Style: Maintain authoritative yet accessible tone
4). Section Structure: Use clear H2/H3 headings for navigation
5). Citations: Include credible references and sources
6). Visual Placement: Suggest where images/charts would enhance content
7). Headline Optimization: Create compelling, clickable headline
8). Meta Description: Generate engaging article summary
9). Reading Time: Optimize for 5-10 minute read length
10). Internal Linking: Suggest related LinkedIn articles
11). Key Takeaways: Summarize main points at conclusion`,
    maxLength: 2500,
    includeHashtags: false,
    style: 'authoritative',
    features: ['SEO optimization', 'Professional writing', 'Citation formatting', 'Headline optimization']
  },
  
  // From essay_writer functionality
  'Essay': {
    icon: '✍️',
    category: 'Academic',
    guidelines: `Generate well-structured academic essays:
1). Thesis Statement: Clear, arguable central claim
2). Introduction: Hook, background, thesis statement
3). Body Paragraphs: Topic sentences, evidence, analysis, transitions
4). Evidence-Based: Support arguments with credible sources
5). Critical Analysis: Demonstrate deep thinking and evaluation
6). Academic Tone: Formal, objective, scholarly language
7). Proper Citations: Follow academic citation standards
8). Counterarguments: Address opposing viewpoints
9). Logical Flow: Ensure coherent progression of ideas
10). Strong Conclusion: Restate thesis, summarize key points, final insight`,
    maxLength: 3000,
    includeHashtags: false,
    style: 'academic',
    essay_types: ['Argumentative', 'Analytical', 'Expository', 'Descriptive', 'Persuasive']
  },
  
  // From story_writer functionality
  'Story': {
    icon: '📚',
    category: 'Creative Writing',
    guidelines: `Create engaging stories and narratives:
1). Story Arc: Clear beginning, rising action, climax, resolution
2). Character Development: Well-defined, relatable characters
3). Setting: Vivid descriptions of time and place
4). Dialogue: Natural, character-appropriate conversations
5). Show Don't Tell: Use sensory details and actions
6). Pacing: Balance action, dialogue, and description
7). Conflict: Central tension that drives narrative
8). Theme: Underlying message or lesson
9). Voice: Consistent narrative perspective
10). Emotional Engagement: Connect with reader emotions`,
    maxLength: 3500,
    includeHashtags: false,
    style: 'narrative',
    story_types: ['Fiction', 'Non-fiction', 'Mystery', 'Adventure', 'Drama']
  }
};

/**
 * GET AVAILABLE CONTENT TYPES
 * Returns list of supported content types
 */
router.get('/content-types', async (req, res) => {
  try {
    const contentTypes = Object.keys(CONTENT_TYPES).map(name => ({
      id: name,
      name: name,
      maxLength: CONTENT_TYPES[name].maxLength,
      includeHashtags: CONTENT_TYPES[name].includeHashtags,
      style: CONTENT_TYPES[name].style
    }));

    res.json({
      success: true,
      contentTypes
    });
  } catch (error) {
    console.error('❌ Error fetching content types:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content types'
    });
  }
});

/**
 * MAIN CONTENT GENERATION ROUTE
 * Enhanced with research, SEO, and multi-step generation
 */
router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { contentType, prompt, tone, length, provider, enableResearch = true } = req.body;
    const userId = req.user.clerkUserId;

    // Validate inputs
    if (!contentType || !prompt) {
      return res.status(400).json({
        success: false,
        error: 'Content type and prompt are required'
      });
    }

    console.log(`\n📝 ===== CONTENT GENERATION START =====`);
    console.log(`👤 User: ${userId}`);
    console.log(`📋 Type: ${contentType}`);
    console.log(`💬 Topic: ${prompt}`);
    console.log(`🎨 Tone: ${tone} | Length: ${length} | Provider: ${provider}`);

    // STEP 1: Web Research (if enabled)
    let research = null;
    if (enableResearch && contentType !== 'Twitter Post') {
      console.log(`\n🔍 STEP 1: Conducting web research...`);
      research = await conductWebResearch(prompt);
    } else {
      console.log(`\n⏩ STEP 1: Skipping research (${contentType})`);
    }

    // STEP 2: Build Enhanced Prompt (Alwrity-style)
    console.log(`\n📄 STEP 2: Building enhanced prompt with Alwrity guidelines...`);
    const contentConfig = CONTENT_TYPES[contentType] || CONTENT_TYPES['Blog Post'];

    const toneInstructions = {
      professional: 'Use a professional, polished tone.',
      casual: 'Use a casual, conversational tone.',
      friendly: 'Use a warm, friendly tone.',
      enthusiastic: 'Use an energetic, enthusiastic tone.',
      formal: 'Use a formal, business-appropriate tone.',
      humorous: 'Use a light, humorous tone.',
      inspirational: 'Use an inspiring, motivational tone.'
    };

    const lengthInstructions = {
      short: contentType.includes('Blog') || contentType.includes('Article') ? '300-500 words' : '50-100 words',
      medium: contentType.includes('Blog') || contentType.includes('Article') ? '500-800 words' : '100-200 words',
      long: contentType.includes('Blog') || contentType.includes('Article') ? '800-1500 words' : '200-300 words'
    };

    // Build comprehensive prompt using Alwrity's approach
    // Construct system instructions similar to llm_text_gen in main_text_generation.py
    const systemInstructions = `You are a highly skilled content writer with a knack for creating engaging and informative content.
Your expertise spans various writing styles and formats.

**Content Guidelines:**

1. **Language:** Your response must be in English language.
2. **Tone and Brand Alignment:** Adjust your tone, voice, and personality to be appropriate for a ${tone} audience.
3. **Content Length:** Ensure your response is approximately ${lengthInstructions[length] || lengthInstructions.medium}.
4. **Content Type:** The type of content is ${contentType}. Write accordingly, adhering to the conventions and expectations of this format.
5. **Output Format:** Your response should be in markdown format for better readability.

**Content-Specific Guidelines:**
${contentConfig.guidelines}

**Additional Instructions:**

* **SEO Optimization:** Incorporate relevant keywords naturally throughout the content to improve its search engine visibility.
* **Call to Action:** Include a call to action if appropriate for the content type and target audience.
* **Factual Accuracy:** Ensure your content is accurate and reliable. Back up any claims with credible sources${research ? ' using the research data provided' : ''}.
* **Unique Voice and Style:** Inject your unique voice and writing style to make the content engaging and memorable.`;

    // Build user prompt with research context
    let enhancedPrompt = `Topic: ${prompt}\n\n`;
    
    // Add research context if available (similar to Alwrity's web research integration)
    if (research) {
      enhancedPrompt += formatResearchForPrompt(research);
      enhancedPrompt += '\n⚠️ IMPORTANT: Use the research above to make your content factual, current, and well-sourced.\n\n';
    }
    
    enhancedPrompt += `Create ${contentType.toLowerCase()} content following all the guidelines provided in the system instructions.`;
    
    if (contentConfig.includeHashtags) {
      enhancedPrompt += `\nInclude 4-6 relevant hashtags at the end.`;
    }
    
    if (contentConfig.style === 'structured') {
      enhancedPrompt += `\nUse clear H2/H3 headings for better structure and readability.`;
    }

    // STEP 3: Generate Content (with Alwrity's multi-provider approach)
    console.log(`\n🤖 STEP 3: Generating content with AI...`);
    const selectedProvider = provider === 'auto' ? 'gemini' : provider;
    let generatedContent;
    let aiGeneratorFunction;

    try {
      // Similar to Alwrity's llm_text_gen function with provider switching
      switch (selectedProvider) {
        case 'gpt-4':
        case 'openai':
          console.log(`Using OpenAI GPT-4 for text generation...`);
          aiGeneratorFunction = generateWithOpenAI;
          generatedContent = await generateWithOpenAI(systemInstructions, enhancedPrompt);
          break;
        case 'claude':
        case 'anthropic':
          console.log(`Using Groq (Anthropic fallback) for text generation...`);
          aiGeneratorFunction = generateWithGroq;
          generatedContent = await generateWithGroq(systemInstructions, enhancedPrompt);
          break;
        case 'gemini':
        case 'google':
        default:
          console.log(`Using Google Gemini Pro for text generation...`);
          aiGeneratorFunction = generateWithGemini;
          generatedContent = await generateWithGemini(systemInstructions, enhancedPrompt);
          break;
      }
      console.log(`✅ Content generated successfully (${generatedContent.length} chars)`);
    } catch (providerError) {
      console.error(`❌ ${selectedProvider} failed:`, providerError.message);
      console.log(`🔄 Falling back to Google Gemini...`);
      // Alwrity always falls back to Gemini if primary fails
      if (selectedProvider !== 'gemini') {
        aiGeneratorFunction = generateWithGemini;
        generatedContent = await generateWithGemini(systemInstructions, enhancedPrompt);
        console.log(`✅ Fallback successful with Gemini`);
      } else {
        throw providerError;
      }
    }

    // STEP 4: Generate SEO Metadata
    console.log(`\n🔍 STEP 4: Generating SEO metadata...`);
    const seoData = await generateSEO(contentType, prompt, generatedContent, aiGeneratorFunction);
    console.log(`✅ SEO generated: ${seoData.keywords?.length || 0} keywords, ${seoData.hashtags?.length || 0} hashtags`);

    // STEP 5: Return Complete Response
    console.log(`\n✅ ===== GENERATION COMPLETE =====\n`);
    res.json({
      success: true,
      content: generatedContent,
      seo: seoData,
      metadata: {
        contentType,
        tone,
        length,
        provider: selectedProvider,
        researchUsed: !!research,
        researchSources: research?.results?.length || 0,
        wordCount: generatedContent.split(/\s+/).length,
        charCount: generatedContent.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('\n❌ ===== GENERATION FAILED =====');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate content'
    });
  }
});

/**
 * Generate content using OpenAI GPT-4
 */
async function generateWithOpenAI(systemPrompt, userPrompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey || apiKey.includes('your_') || apiKey.includes('sk-proj-')) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API error');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Generate content using Google Gemini
 */
async function generateWithGemini(systemPrompt, userPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey.includes('your_')) {
    throw new Error('Gemini API key not configured');
  }

  const combinedPrompt = `${systemPrompt}\n\n${userPrompt}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: combinedPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Gemini API error');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

/**
 * Generate content using Anthropic Claude (via Groq or direct API)
 */
async function generateWithClaude(systemPrompt, userPrompt) {
  // For now, fallback to Groq with Llama since Claude requires separate API
  return generateWithGroq(systemPrompt, userPrompt);
}

/**
 * Generate content using Groq (Llama models)
 */
async function generateWithGroq(systemPrompt, userPrompt) {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey || apiKey.includes('your_')) {
    throw new Error('Groq API key not configured');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Groq API error');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export default router;
