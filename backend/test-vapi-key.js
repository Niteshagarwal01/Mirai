// Test VAPI API Key
// Run with: node test-vapi-key.js

import 'dotenv/config';
import axios from 'axios';

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_BASE_URL = 'https://api.vapi.ai';

console.log('🔍 Testing VAPI API Key...\n');
console.log('Key (first 10 chars):', VAPI_API_KEY?.substring(0, 10) + '...');
console.log('Key length:', VAPI_API_KEY?.length);
console.log('');

async function testVapiKey() {
  try {
    console.log('📞 Attempting to list assistants...');
    
    const response = await axios({
      method: 'GET',
      url: `${VAPI_BASE_URL}/assistant`,
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`
      }
    });

    console.log('✅ SUCCESS! Key is valid.\n');
    console.log('📋 Assistants found:', response.data?.length || 0);
    
    if (response.data && response.data.length > 0) {
      console.log('\n📝 Your assistants:');
      response.data.forEach((assistant, index) => {
        console.log(`  ${index + 1}. ${assistant.name} (ID: ${assistant.id})`);
      });
    } else {
      console.log('ℹ️ No assistants found. You can create one from the UI.');
    }

  } catch (error) {
    console.log('❌ FAILED! Key is invalid.\n');
    console.log('Error:', error.response?.data || error.message);
    console.log('');
    
    if (error.response?.status === 401) {
      console.log('💡 Common Issues:');
      console.log('  1. You might be using a PUBLIC key instead of PRIVATE key');
      console.log('  2. The key might be expired or revoked');
      console.log('  3. The key might not have the correct permissions');
      console.log('');
      console.log('🔑 Where to get the correct key:');
      console.log('  1. Go to: https://dashboard.vapi.ai');
      console.log('  2. Click: Settings → API Keys');
      console.log('  3. Look for: PRIVATE KEY (usually starts with sk_live_ or similar)');
      console.log('  4. Copy the PRIVATE key to your .env file');
      console.log('');
      console.log('📝 Current key type detection:');
      if (VAPI_API_KEY?.includes('-')) {
        console.log('  ⚠️ Your key looks like a PUBLIC key (UUID format with dashes)');
        console.log('  ✓ You need the PRIVATE key instead');
      } else if (VAPI_API_KEY?.startsWith('sk_')) {
        console.log('  ✓ Your key looks like a PRIVATE key format');
        console.log('  ⚠️ But it might be invalid or expired');
      }
    }
  }
}

testVapiKey();
