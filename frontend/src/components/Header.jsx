import { Home } from 'lucide-react'

export default function Header({ currentSection, setCurrentSection }) {
  const navItems = ['PROJECTS', 'CREDENTIALS', 'FORGE', 'ABOUT']

  return (
    <nav style={{
      position: 'absolute',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '900px',
      zIndex: 100,
      pointerEvents: 'auto'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo / Home Button */}
        <div 
          onClick={() => setCurrentSection('home')}
          style={{ 
            fontSize: '1.2rem', 
            fontWeight: 'bold', 
            color: 'var(--cyan)',
            cursor: 'pointer',
            fontFamily: "'Comfortaa', cursive"
          }}
        >
          navya.dev
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            onClick={() => setCurrentSection('home')}
            style={{
              padding: '8px',
              borderRadius: '12px',
              background: currentSection === 'home' ? 'var(--cyan-muted)' : 'transparent',
              color: currentSection === 'home' ? 'var(--cyan)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Home size={18} />
          </div>
          
          <div style={{ width: '1px', height: '16px', background: 'var(--border)', marginRight: '12px' }}></div>

          {navItems.map((item) => (
            <div
              key={item}
              onClick={() => setCurrentSection(item.toLowerCase())}
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                letterSpacing: '0.1em',
                padding: '6px 12px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                color: currentSection === item.toLowerCase() ? 'var(--cyan)' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (currentSection !== item.toLowerCase()) e.currentTarget.style.color = 'var(--cyan)'
              }}
              onMouseOut={(e) => {
                if (currentSection !== item.toLowerCase()) e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}
