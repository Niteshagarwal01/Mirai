import React from 'react';
import { Link } from 'react-router-dom';

const DesktopOnly = () => {
  const currentWidth = window.innerWidth;
  const requiredWidth = 1024;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a14 0%, #1a1a2e 100%)',
      color: '#ffffff',
      padding: '20px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        maxWidth: '600px',
        textAlign: 'center',
        background: 'rgba(20, 20, 31, 0.8)',
        padding: '60px 40px',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Icon */}
        <div style={{
          width: '120px',
          height: '120px',
          margin: '0 auto 30px',
          background: 'linear-gradient(45deg, #6e40ff, #34ffe9)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '60px'
        }}>
          <i className="fas fa-desktop" style={{ color: '#fff' }}></i>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '20px',
          background: 'linear-gradient(45deg, #6e40ff, #34ffe9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Desktop Only Platform
        </h1>

        {/* Description */}
        <p style={{
          fontSize: '1.1rem',
          color: '#c4c4ce',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          Mirai is optimized for desktop computers to provide you with the best experience
          for AI-powered marketing automation.
        </p>

        {/* Device Info */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <span style={{ color: '#8e8ea0' }}>Your Screen Width:</span>
            <strong style={{ color: '#ff5252' }}>{currentWidth}px</strong>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#8e8ea0' }}>Required Width:</span>
            <strong style={{ color: '#00dfa2' }}>{requiredWidth}px</strong>
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          textAlign: 'left',
          marginBottom: '30px'
        }}>
          <h3 style={{
            fontSize: '1.1rem',
            marginBottom: '15px',
            color: '#fff'
          }}>
            <i className="fas fa-info-circle" style={{ marginRight: '8px', color: '#6e40ff' }}></i>
            How to Access Mirai
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            color: '#c4c4ce',
            lineHeight: '2'
          }}>
            <li style={{ paddingLeft: '30px', position: 'relative' }}>
              <i className="fas fa-check" style={{
                position: 'absolute',
                left: '0',
                color: '#00dfa2'
              }}></i>
              Open on a desktop or laptop computer
            </li>
            <li style={{ paddingLeft: '30px', position: 'relative' }}>
              <i className="fas fa-check" style={{
                position: 'absolute',
                left: '0',
                color: '#00dfa2'
              }}></i>
              Ensure screen width is at least 1024px
            </li>
            <li style={{ paddingLeft: '30px', position: 'relative' }}>
              <i className="fas fa-check" style={{
                position: 'absolute',
                left: '0',
                color: '#00dfa2'
              }}></i>
              Use Chrome, Firefox, Safari, or Edge
            </li>
          </ul>
        </div>

        {/* Supported Browsers */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          {['chrome', 'firefox', 'safari', 'edge'].map(browser => (
            <div key={browser} style={{
              width: '60px',
              height: '60px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'transform 0.3s ease'
            }}>
              <i className={`fab fa-${browser}`} style={{
                fontSize: '28px',
                color: '#6e40ff'
              }}></i>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          to="/"
          style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: 'linear-gradient(45deg, #6e40ff, #8956ff)',
            color: '#fff',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'transform 0.3s ease',
            boxShadow: '0 6px 15px rgba(110, 64, 255, 0.3)'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <i className="fas fa-home" style={{ marginRight: '8px' }}></i>
          Back to Home
        </Link>

        {/* Footer Note */}
        <p style={{
          marginTop: '30px',
          fontSize: '0.85rem',
          color: '#8e8ea0'
        }}>
          Need help? Contact our support team at{' '}
          <a href="mailto:support@mirai.com" style={{
            color: '#34ffe9',
            textDecoration: 'none'
          }}>
            support@mirai.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default DesktopOnly;
