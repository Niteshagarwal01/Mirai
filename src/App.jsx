import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home.jsx'
import Login from './pages/login.jsx'
import Signup from './pages/Signup.jsx'
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
          {/* //Fixed Fluid Elements */}
    <div className="fluid-element" id="fluid1"></div>
    <div className="fluid-element" id="fluid2"></div>
    <div className="fluid-element" id="fluid3"></div>   
    
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>

        </main>
    </div>
  )
}

export default App
