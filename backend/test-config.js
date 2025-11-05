// Simple test to verify Chatbase API key and basic functionality
import dotenv from 'dotenv';

dotenv.config();

console.log('🔧 Backend Configuration Test');
console.log('=============================\n');

// Check environment variables
console.log('Environment Variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('- PORT:', process.env.PORT || 3001);
console.log('- FRONTEND_URL:', process.env.FRONTEND_URL || 'http://localhost:5173');

// Check API keys
console.log('\nAPI Keys:');
console.log('- CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY ? '✅ Configured' : '❌ Missing');
console.log('- RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? '✅ Configured' : '❌ Missing');
console.log('- CHATBASE_API_KEY:', process.env.CHATBASE_API_KEY ? '✅ Configured' : '❌ Missing');
console.log('- VAPI_API_KEY:', process.env.VAPI_API_KEY ? '✅ Configured' : '❌ Missing');

if (process.env.CHATBASE_API_KEY) {
  console.log('- Chatbase API Key Preview:', process.env.CHATBASE_API_KEY.substring(0, 20) + '...');
}

// Test data for manual testing
console.log('\n📋 Test Data for Manual API Testing');
console.log('===================================\n');

const testChatbotData = {
  name: 'Customer Support Bot',
  type: 'customer-support',
  description: 'A helpful customer support chatbot for testing Mirai platform',
  personality: 'professional',
  language: 'english',
  welcomeMessage: 'Hello! I\'m your AI assistant. How can I help you today?',
  fallbackMessage: 'I\'m sorry, I didn\'t understand that. Could you please rephrase your question?',
  integrations: ['website', 'whatsapp']
};

console.log('🤖 Sample Chatbot Creation Data:');
console.log(JSON.stringify(testChatbotData, null, 2));

const testVoiceAgentData = {
  name: 'Sales Assistant',
  type: 'sales',
  description: 'AI voice agent for lead qualification and appointment scheduling',
  systemPrompt: 'You are a professional sales assistant for Mirai AI platform. Be friendly, helpful, and focus on understanding customer needs. Keep responses concise and ask relevant questions.',
  voiceId: 'jennifer',
  firstMessage: 'Hi! Thanks for calling Mirai AI. I\'m here to help you learn about our AI marketing solutions. What brings you here today?',
  endCallMessage: 'Thank you for your interest in Mirai AI! Our team will follow up with you within 24 hours. Have a great day!'
};

console.log('\n📞 Sample Voice Agent Creation Data:');
console.log(JSON.stringify(testVoiceAgentData, null, 2));

console.log('\n🚀 Quick Start Commands:');
console.log('========================');
console.log('1. Start backend: npm run dev');
console.log('2. Test endpoint: GET http://localhost:3001/health');
console.log('3. Test Chatbase: GET http://localhost:3001/api/health/chatbase');
console.log('4. Test Vapi: GET http://localhost:3001/api/health/vapi');

console.log('\n📡 API Endpoints:');
console.log('=================');
console.log('POST /api/chatbots/create');
console.log('GET  /api/chatbots');
console.log('GET  /api/chatbots/:id');
console.log('POST /api/voice-agents/create');
console.log('GET  /api/voice-agents');
console.log('GET  /api/voice-agents/:id');

console.log('\n💡 Frontend Integration:');
console.log('========================');
console.log('The frontend is already configured to use these APIs.');
console.log('Just start the backend server and the Chatbot/Voice Agent');
console.log('pages will automatically connect to create real bots!');

console.log('\n✅ Configuration test complete!');