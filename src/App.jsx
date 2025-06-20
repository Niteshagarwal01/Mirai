import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './Home.jsx'
import './css/App.css'
import './css/custom-login-fix.css'
import './css/feature-detail.css'
import './css/feature-grid.css'
import './css/login-styles.css'
import './css/onboarding.css'
import './css/pricing-page.css'
import './css/registration-styles.css'
import { initializeAnimations } from './components/script.js'

function App() {
  // Initialize animations when component mounts
  useEffect(() => {
    initializeAnimations();
  }, []);

  return (
    <div className="App">
      <div className="cursor-dot" id="cursor-dot"></div>
      <div className="cursor-outline" id="cursor-outline"></div>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
    </div>
  )
}

export default App
