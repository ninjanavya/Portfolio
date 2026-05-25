import { useState, useEffect } from 'react'
import { Code, ExternalLink, GitBranch, Star, Users, Loader2 } from 'lucide-react'

export default function ProjectsOverlay() {
  const [githubData, setGithubData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGithub = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/github/ninjanavya')
        const data = await response.json()
        if (data.status === 'success') {
          setGithubData(data)
        } else {
          setError(data.message || 'Failed to load projects')
        }
      } catch (err) {
        setError('Could not connect to backend server.')
      } finally {
        setLoading(false)
      }
    }
    fetchGithub()
  }, [])

  return (
    <div style={{
      position: 'absolute',
      top: '15%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '1000px',
      maxHeight: '75vh',
      overflowY: 'auto',
      pointerEvents: 'auto',
      background: 'rgba(10, 10, 15, 0.45)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--border-accent)',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 24px 64px rgba(0, 217, 255, 0.08)',
      fontFamily: "'DM Sans', sans-serif",
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      gap: '30px'
    }}>
      
      {/* Header and User Info */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '20px',
        gap: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', margin: '0 0 8px 0', color: 'var(--cyan)', fontFamily: "'Comfortaa', cursive" }}>Projects</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>My active repositories and open-source contributions.</p>
        </div>
        
        {!loading && !error && githubData && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Avatar & Username */}
            <a 
              href={`https://github.com/${githubData.username}`}
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textDecoration: 'none',
                color: 'inherit',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '8px 16px',
                borderRadius: '50px',
                border: '1px solid var(--border)'
              }}
            >
              <img 
                src={githubData.avatar} 
                alt="Avatar" 
                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
              />
              <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--cyan)' }}>@{githubData.username}</span>
              <ExternalLink size={14} style={{ color: 'var(--text-muted)' }} />
            </a>

            {/* Quick Stats */}
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                <GitBranch size={16} />
                <span><strong>{githubData.public_repos}</strong> Repos</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                <Users size={16} />
                <span><strong>{githubData.followers}</strong> Followers</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '16px' }}>
          <Loader2 className="animate-spin" size={40} style={{ color: 'var(--cyan)', animation: 'spin 1.5s linear infinite' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Loading GitHub repositories...</span>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', margin: '0 0 16px 0', fontSize: '1rem' }}>{error}</p>
          <button 
            onClick={() => { setLoading(true); setError(null); }}
            style={{
              background: 'var(--cyan-muted)',
              border: '1px solid var(--border-accent)',
              color: 'var(--cyan)',
              padding: '8px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && githubData && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {githubData.repos.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '24px',
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '180px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-accent)'
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 217, 255, 0.05)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    margin: 0,
                    fontWeight: 'bold',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '85%'
                  }}>{repo.name}</h3>
                  <ExternalLink size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
                
                <p style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  lineHeight: '1.5',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {repo.description || 'No description provided.'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                {repo.language ? (
                  <span style={{
                    fontSize: '0.72rem',
                    fontFamily: "'DM Mono', monospace",
                    color: 'var(--cyan)',
                    background: 'var(--cyan-muted)',
                    border: '1px solid var(--border-accent)',
                    padding: '3px 8px',
                    borderRadius: '50px'
                  }}>{repo.language}</span>
                ) : (
                  <span />
                )}

                {repo.stars > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <Star size={14} fill="var(--amber)" color="var(--amber)" />
                    <span>{repo.stars}</span>
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
