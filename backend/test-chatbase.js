import ChatbaseService from './lib/chatbase.js';
import dotenv from 'dotenv';

dotenv.config();

async function testChatbase() {
  console.log('🤖 Testing Chatbase Integration...\n');
  
  // Test 1: Create a chatbot
  console.log('1. Creating a test chatbot...');
  const chatbotData = {
    name: 'Test Customer Support Bot',
    type: 'customer-support', 
    description: 'A helpful customer support chatbot for testing',
    personality: 'professional',
    language: 'english',
    welcomeMessage: 'Hi! I\'m here to help with your questions.',
    fallbackMessage: 'I\'m sorry, I didn\'t understand that. Could you please rephrase?',
    integrations: ['website', 'whatsapp']
  };

  const createResult = await ChatbaseService.createChatbot(chatbotData);
  console.log('Create Result:', JSON.stringify(createResult, null, 2));
  
  if (createResult.success) {
    const chatbotId = createResult.chatbotId;
    console.log(`✅ Chatbot created successfully! ID: ${chatbotId}\n`);
    
    // Test 2: Get chatbot details
    console.log('2. Getting chatbot details...');
    const getResult = await ChatbaseService.getChatbot(chatbotId);
    console.log('Get Result:', JSON.stringify(getResult, null, 2));
    
    // Test 3: Send a test message
    console.log('\n3. Testing chatbot conversation...');
    const messageResult = await ChatbaseService.sendMessage(
      chatbotId, 
      'Hello, can you help me with my order?'
    );
    console.log('Message Result:', JSON.stringify(messageResult, null, 2));
    
    // Test 4: List all chatbots
    console.log('\n4. Listing all chatbots...');
    const listResult = await ChatbaseService.listChatbots();
    console.log('List Result:', JSON.stringify(listResult, null, 2));
    
  } else {
    console.log('❌ Failed to create chatbot:', createResult.error);
  }
}

// Run the test
testChatbase().catch(error => {
  console.error('Test failed:', error);
});

// Sample data for frontend testing
console.log('\n📋 Sample Data for Frontend Testing:');
console.log('=====================================');

const sampleChatbotData = {
  name: 'E-commerce Support Bot',
  type: 'customer-support',
  description: 'Helps customers with product questions, orders, and returns',
  personality: 'friendly',
  language: 'english',
  welcomeMessage: 'Welcome! How can I help you today?',
  fallbackMessage: 'I apologize, but I need more information. Can you be more specific?',
  integrations: ['website', 'whatsapp', 'facebook']
};

console.log('Sample Chatbot Data:');
console.log(JSON.stringify(sampleChatbotData, null, 2));

const sampleVoiceAgentData = {
  name: 'Sales Call Assistant',
  type: 'sales',
  description: 'AI voice agent for qualifying leads and scheduling appointments',
  systemPrompt: 'You are a professional sales assistant. Be friendly, helpful, and focus on understanding customer needs.',
  voiceId: 'jennifer',
  firstMessage: 'Hi! Thanks for calling. I\'m here to help you learn more about our products. What can I tell you?',
  endCallMessage: 'Thank you for your time! Someone from our team will follow up with you soon.'
};

console.log('\nSample Voice Agent Data:');
console.log(JSON.stringify(sampleVoiceAgentData, null, 2));

console.log('\n🔧 API Testing Commands:');
console.log('========================');
console.log('POST /api/chatbots/create - Create chatbot');
console.log('GET /api/chatbots - List chatbots');
console.log('POST /api/voice-agents/create - Create voice agent');
console.log('GET /api/voice-agents - List voice agents');