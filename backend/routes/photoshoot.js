import express from 'express';
import multer from 'multer';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { requireAuth } from '../middleware/clerkAuth.js';

const router = express.Router();

// Configure multer for memory storage (file buffer)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

/**
 * POST /api/photoshoot/generate
 * AI image generation using Google Gemini
 */
router.post('/generate', requireAuth, upload.single('productImage'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const productImage = req.file;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    if (!productImage) {
      return res.status(400).json({
        success: false,
        error: 'Image is required'
      });
    }

    console.log('🎨 AI Photoshoot - Creating professional scene:', { userId: req.auth.userId, prompt: prompt.substring(0, 50) });

    // Step 1: Use Groq's best text model to create detailed prompt
    const groqApiKey = process.env.GROQ_API_KEY;
    
    console.log('💡 Creating detailed photoshoot prompt with AI...');

    const promptResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{
          role: 'user',
          content: `Create an ultra-detailed, professional product photography prompt based on: "${prompt}"

Generate a photorealistic scene with:
- Exact product details (luxury skincare serum bottle, emerald green glass, gold cap, elegant typography)
- Professional studio lighting (key light, fill light, rim light, soft shadows, highlights on glass)
- Premium background (soft gradient, elegant neutral tones, depth of field)
- Composition (rule of thirds, centered product, shallow depth of field)
- Luxury props (minimal, elegant, complementary)
- Mood (premium, sophisticated, modern luxury, calming)
- Technical details (8K resolution, commercial photography, product focus, sharp details)

Keep under 200 words. Be VERY specific and detailed for photorealistic generation.`
        }],
        temperature: 0.8,
        max_tokens: 400
      })
    });

    if (!promptResponse.ok) {
      const errorText = await promptResponse.text();
      console.error('❌ Prompt Enhancement Error:', errorText);
      throw new Error(`Prompt enhancement failed: ${errorText}`);
    }

    const promptData = await promptResponse.json();
    const enhancedPrompt = promptData.choices[0].message.content;

    console.log('✅ Detailed prompt created:', enhancedPrompt.substring(0, 100) + '...');

    // Step 2: Generate with Pollinations AI (free, fast, no quota)
    console.log('🖼️ Generating professional photoshoot with Pollinations AI...');

    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1024&height=1024&model=flux&nologo=true`;

    const imageResponse = await fetch(pollinationsUrl);

    if (!imageResponse.ok) {
      throw new Error('Image generation failed');
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    console.log('✅ Professional marketing image generated!');

    res.json({
      success: true,
      imageUrl: imageUrl,
      prompt: prompt,
      enhancedPrompt: enhancedPrompt,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate image'
    });
  }
});

/**
 * GET /api/photoshoot/status/:jobId
 * Check status of photoshoot generation job
 */
router.get('/status/:jobId', requireAuth, async (req, res) => {
  try {
    const { jobId } = req.params;

    // In a real implementation, you would:
    // 1. Query your database for job status
    // 2. Or poll n8n for execution status
    // 3. Return the current status and generated assets

    // For now, return a placeholder
    res.json({
      success: true,
      jobId,
      status: 'processing', // processing | completed | failed
      message: 'Job status tracking will be implemented with n8n workflow completion webhook'
    });

  } catch (error) {
    console.error('❌ Status check error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to check job status'
    });
  }
});

export default router;
