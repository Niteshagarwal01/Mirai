/**
 * Backend-Frontend Connection Test
 * Run this after setting up all API keys
 */

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export async function testConnections() {
  const results = {
    backend: { status: 'pending', message: '', details: null },
    clerk: { status: 'pending', message: '', details: null },
    database: { status: 'pending', message: '', details: null },
    razorpay: { status: 'pending', message: '', details: null }
  };

  // Test 1: Backend Health
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    
    if (response.ok) {
      results.backend = {
        status: 'success',
        message: '✅ Backend is running',
        details: data
      };
    } else {
      results.backend = {
        status: 'error',
        message: '❌ Backend returned error',
        details: data
      };
    }
  } catch (error) {
    results.backend = {
      status: 'error',
      message: '❌ Cannot connect to backend',
      details: { error: error.message, url: API_BASE_URL }
    };
  }

  // Test 2: Clerk Configuration
  if (CLERK_KEY) {
    if (CLERK_KEY.startsWith('pk_test_') || CLERK_KEY.startsWith('pk_live_')) {
      results.clerk = {
        status: 'success',
        message: '✅ Clerk key configured',
        details: { key: `${CLERK_KEY.substring(0, 20)}...` }
      };
    } else {
      results.clerk = {
        status: 'error',
        message: '❌ Invalid Clerk key format',
        details: { key: CLERK_KEY }
      };
    }
  } else {
    results.clerk = {
      status: 'error',
      message: '❌ Clerk key missing',
      details: { hint: 'Add VITE_CLERK_PUBLISHABLE_KEY to .env file' }
    };
  }

  // Test 3: Database Connection (via backend)
  try {
    const response = await fetch(`${API_BASE_URL}/api/health/database`);
    
    if (response.ok) {
      const data = await response.json();
      results.database = {
        status: 'success',
        message: '✅ Database connected',
        details: data
      };
    } else {
      results.database = {
        status: 'error',
        message: '❌ Database connection failed',
        details: await response.json()
      };
    }
  } catch (error) {
    results.database = {
      status: 'warning',
      message: '⚠️ Cannot test database (backend not running)',
      details: { error: error.message }
    };
  }

  // Test 4: Razorpay Configuration (via backend)
  try {
    const response = await fetch(`${API_BASE_URL}/api/health/razorpay`);
    
    if (response.ok) {
      const data = await response.json();
      results.razorpay = {
        status: 'success',
        message: '✅ Razorpay configured',
        details: data
      };
    } else {
      results.razorpay = {
        status: 'error',
        message: '❌ Razorpay not configured',
        details: await response.json()
      };
    }
  } catch (error) {
    results.razorpay = {
      status: 'warning',
      message: '⚠️ Cannot test Razorpay (backend not running)',
      details: { error: error.message }
    };
  }

  return results;
}

/**
 * Display test results in console
 */
export function displayResults(results) {
  console.log('\n=== 🔌 Connection Test Results ===\n');
  
  Object.entries(results).forEach(([service, result]) => {
    console.log(`${service.toUpperCase()}: ${result.message}`);
    if (result.details) {
      console.log('  Details:', result.details);
    }
    console.log('');
  });

  // Summary
  const successCount = Object.values(results).filter(r => r.status === 'success').length;
  const totalCount = Object.keys(results).length;
  
  console.log(`\n✨ Summary: ${successCount}/${totalCount} services configured\n`);
  
  if (successCount === totalCount) {
    console.log('🎉 All systems ready! You can start using the app.\n');
  } else {
    console.log('⚠️ Some services need configuration. Check API_KEYS_NEEDED.md\n');
  }
}

/**
 * Auto-run test in development
 */
if (import.meta.env.DEV) {
  // Run test after 2 seconds (let app initialize)
  setTimeout(async () => {
    const results = await testConnections();
    displayResults(results);
  }, 2000);
}

export default testConnections;
