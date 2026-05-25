import { FileText } from 'lucide-react'
import { SiPython, SiReact, SiGit } from 'react-icons/si'
import { FaDatabase, FaCss3Alt } from 'react-icons/fa'

export default function HeroOverlay() {
  return (
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Let clicks pass through to the 3D canvas!
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '18vh',
        paddingBottom: '8vh',
        boxSizing: 'border-box',
        zIndex: 10
      }}
    >
      {/* Name and Text Group */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Hello Subtitle */}
        <p style={{ 
          color: 'var(--text-muted)', 
          fontSize: '1rem', 
          letterSpacing: '0.35em', 
          textTransform: 'uppercase', 
          marginBottom: '10px' 
        }}>
          Hello! I'm
        </p>

        {/* Name and Title */}
        <h1 style={{ 
          fontSize: 'clamp(3rem, 8vw, 5rem)', 
          margin: 0, 
          letterSpacing: '-0.02em', 
          textShadow: '0 0 40px rgba(0, 217, 255, 0.3)',
          fontWeight: 700
        }}>
          Navya Khandelwal
        </h1>
        
        {/* Passionate text */}
        <p style={{ 
          margin: '15px 0 0 0', 
          fontSize: '1.2rem', 
          color: 'var(--text-secondary)', 
          fontWeight: 300, 
          letterSpacing: '0.05em' 
        }}>
          A passionate <span style={{ color: 'var(--cyan)' }}>Full-Stack</span> &amp; <span style={{ color: 'var(--amber)' }}>ML</span> Developer
        </p>
      </div>
      
      {/* Big Faded Background Text like the reference */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(6rem, 20vw, 15rem)',
        fontWeight: 900,
        color: 'rgba(255,255,255,0.02)',
        zIndex: -1,
        pointerEvents: 'none',
        userSelect: 'none',
        whiteSpace: 'nowrap'
      }}>
        DEVELOPER
      </div>

      {/* Bottom Actions Group */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        {/* Buttons container */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          pointerEvents: 'auto' // Make buttons clickable!
        }}>
          {/* Resume Button */}
          <a 
            href="#"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              borderRadius: '100px',
              border: '1px solid rgba(0, 217, 255, 0.28)',
              background: 'rgba(0, 217, 255, 0.05)',
              color: 'rgba(0, 217, 255, 0.8)',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
              backdropFilter: 'blur(8px)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0,217,255,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0,217,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <FileText size={18} /> Resume &amp; CV
          </a>
        </div>
        
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Click the Planets to explore
        </p>
      </div>

      {/* Floating Icons (Orbiting the name) */}
      <div className="icon-float" style={{ '--dur': '5s', '--delay': '0s', top: '25%', left: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ padding: '12px', background: 'rgba(55, 118, 171, 0.1)', border: '1px solid rgba(55, 118, 171, 0.3)', borderRadius: '14px', backdropFilter: 'blur(4px)' }}>
          <SiPython color="#3776AB" size={24} />
        </div>
        <span style={{ fontSize: '0.75rem', color: '#3776AB', fontFamily: "'DM Mono', monospace", fontWeight: 'bold' }}>Python</span>
      </div>

      <div className="icon-float" style={{ '--dur': '6s', '--delay': '1s', top: '15%', left: '60%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ padding: '12px', background: 'rgba(97, 218, 251, 0.1)', border: '1px solid rgba(97, 218, 251, 0.3)', borderRadius: '14px', backdropFilter: 'blur(4px)' }}>
          <SiReact color="#61DAFB" size={24} />
        </div>
        <span style={{ fontSize: '0.75rem', color: '#61DAFB', fontFamily: "'DM Mono', monospace", fontWeight: 'bold' }}>React</span>
      </div>

      <div className="icon-float" style={{ '--dur': '4.5s', '--delay': '2s', top: '65%', left: '15%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ padding: '12px', background: 'rgba(240, 80, 50, 0.1)', border: '1px solid rgba(240, 80, 50, 0.3)', borderRadius: '14px', backdropFilter: 'blur(4px)' }}>
          <SiGit color="#F05032" size={24} />
        </div>
        <span style={{ fontSize: '0.75rem', color: '#F05032', fontFamily: "'DM Mono', monospace", fontWeight: 'bold' }}>Git</span>
      </div>

      <div className="icon-float" style={{ '--dur': '5.5s', '--delay': '0.5s', top: '75%', left: '75%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ padding: '12px', background: 'rgba(167, 139, 250, 0.1)', border: '1px solid rgba(167, 139, 250, 0.3)', borderRadius: '14px', backdropFilter: 'blur(4px)' }}>
          <FaDatabase color="#a78bfa" size={24} />
        </div>
        <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontFamily: "'DM Mono', monospace", fontWeight: 'bold' }}>RAG</span>
      </div>
      
      <div className="icon-float" style={{ '--dur': '6.5s', '--delay': '1.5s', top: '35%', left: '85%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ padding: '12px', background: 'rgba(38, 77, 228, 0.1)', border: '1px solid rgba(38, 77, 228, 0.3)', borderRadius: '14px', backdropFilter: 'blur(4px)' }}>
          <FaCss3Alt color="#264de4" size={24} />
        </div>
        <span style={{ fontSize: '0.75rem', color: '#264de4', fontFamily: "'DM Mono', monospace", fontWeight: 'bold' }}>CSS</span>
      </div>
    </div>
  )
}
