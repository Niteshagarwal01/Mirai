// Debug component to check environment variables in production
export function DebugEnv() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const environment = import.meta.env.VITE_ENVIRONMENT;
  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  if (import.meta.env.DEV) {
    console.log('🔧 Environment Debug:', {
      VITE_BACKEND_URL: backendUrl,
      VITE_ENVIRONMENT: environment,
      VITE_CLERK_PUBLISHABLE_KEY: clerkKey ? `${clerkKey.substring(0, 20)}...` : 'MISSING',
      NODE_ENV: import.meta.env.NODE_ENV,
      MODE: import.meta.env.MODE
    });
  }
  
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px', 
      fontSize: '10px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div><strong>Environment Debug:</strong></div>
      <div>Backend: {backendUrl || 'UNDEFINED'}</div>
      <div>Environment: {environment || 'UNDEFINED'}</div>
      <div>Mode: {import.meta.env.MODE}</div>
    </div>
  );
}

export default DebugEnv;