import { useState, useEffect } from 'react'
import { Award, BookOpen, Code, ExternalLink, Trophy, Loader2, Star, CheckCircle } from 'lucide-react'

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8000'
  : 'https://portfolio-670r.onrender.com';

export default function CredentialsOverlay() {
  // LeetCode States
  const [lcStats, setLcStats] = useState(null)
  const [lcLoading, setLcLoading] = useState(true)
  const [lcError, setLcError] = useState(null)

  // HackerRank States
  const [hrStats, setHrStats] = useState(null)
  const [hrLoading, setHrLoading] = useState(true)
  const [hrError, setHrError] = useState(null)

  useEffect(() => {
    // Fetch LeetCode
    const fetchLeetcode = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/leetcode/Navya_Ninja`)
        const data = await response.json()
        if (data.status === 'success') {
          setLcStats(data)
        } else {
          setLcError(data.message || 'Failed to load stats')
        }
      } catch (err) {
        setLcError('Could not load LeetCode stats.')
      } finally {
        setLcLoading(false)
      }
    }

    // Fetch HackerRank
    const fetchHackerrank = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/hackerrank/navya18_kh`)
        const data = await response.json()
        if (data.status === 'success') {
          setHrStats(data)
        } else {
          setHrError(data.message || 'Failed to load stats')
        }
      } catch (err) {
        setHrError('Could not load HackerRank stats.')
      } finally {
        setHrLoading(false)
      }
    }

    fetchLeetcode()
    fetchHackerrank()
  }, [])

  const renderStars = (count) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star 
        key={index} 
        size={14} 
        fill={index < count ? 'var(--amber)' : 'none'} 
        color={index < count ? 'var(--amber)' : 'rgba(255,255,255,0.2)'} 
        style={{ marginRight: '2px' }}
      />
    ))
  }

  return (
    <div style={{
      position: 'absolute',
      top: '12%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '95%',
      maxWidth: '1200px',
      maxHeight: '80vh',
      overflowY: 'auto',
      pointerEvents: 'auto',
      background: 'rgba(10, 10, 15, 0.45)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--border-accent)',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 24px 64px rgba(0, 217, 255, 0.08)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '24px',
      fontFamily: "'DM Sans', sans-serif",
      color: 'var(--text-primary)'
    }}>
      
      {/* Column 1: LeetCode Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Code size={24} style={{ color: 'var(--cyan)' }} />
            <h2 style={{ fontSize: '1.25rem', margin: 0, fontFamily: "'Comfortaa', cursive" }}>LeetCode</h2>
          </div>
          <a 
            href="https://leetcode.com/u/Navya_Ninja/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: 'var(--cyan)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.85rem',
              textDecoration: 'none',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = 0.8}
            onMouseOut={(e) => e.currentTarget.style.opacity = 1}
          >
            Navya_Ninja <ExternalLink size={14} />
          </a>
        </div>

        {lcLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '220px', gap: '12px' }}>
            <Loader2 className="animate-spin" size={32} style={{ color: 'var(--cyan)', animation: 'spin 1s linear infinite' }} />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Fetching LeetCode stats...</span>
          </div>
        )}

        {lcError && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '220px', textAlign: 'center' }}>
            <p style={{ color: '#ef4444', margin: '0 0 10px 0', fontSize: '0.9rem' }}>{lcError}</p>
          </div>
        )}

        {!lcLoading && !lcError && lcStats && (
          <>
            {/* Summary Stat Card */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '16px' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                border: '4px solid var(--cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{lcStats.solved.all}</span>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>/{lcStats.total.all}</span>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Solved Problems</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Trophy size={14} style={{ color: 'var(--amber)' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                    Rank: {lcStats.ranking ? lcStats.ranking.toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Breakdown Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Easy */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: '#00b8a3', fontWeight: 'bold' }}>Easy</span>
                  <span>{lcStats.solved.easy} <span style={{ color: 'var(--text-muted)' }}>/ {lcStats.total.easy}</span></span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(lcStats.solved.easy / lcStats.total.easy) * 100}%`,
                    height: '100%',
                    background: '#00b8a3',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>

              {/* Medium */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: '#ffc01e', fontWeight: 'bold' }}>Medium</span>
                  <span>{lcStats.solved.medium} <span style={{ color: 'var(--text-muted)' }}>/ {lcStats.total.medium}</span></span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(lcStats.solved.medium / lcStats.total.medium) * 100}%`,
                    height: '100%',
                    background: '#ffc01e',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>

              {/* Hard */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: '#ff375f', fontWeight: 'bold' }}>Hard</span>
                  <span>{lcStats.solved.hard} <span style={{ color: 'var(--text-muted)' }}>/ {lcStats.total.hard}</span></span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(lcStats.solved.hard / lcStats.total.hard) * 100}%`,
                    height: '100%',
                    background: '#ff375f',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Column 2: HackerRank Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={24} style={{ color: '#1ba94c' }} />
            <h2 style={{ fontSize: '1.25rem', margin: 0, fontFamily: "'Comfortaa', cursive" }}>HackerRank</h2>
          </div>
          <a 
            href="https://www.hackerrank.com/profile/navya18_kh" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#1ba94c',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.85rem',
              textDecoration: 'none',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = 0.8}
            onMouseOut={(e) => e.currentTarget.style.opacity = 1}
          >
            navya18_kh <ExternalLink size={14} />
          </a>
        </div>

        {hrLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '220px', gap: '12px' }}>
            <Loader2 className="animate-spin" size={32} style={{ color: '#1ba94c', animation: 'spin 1s linear infinite' }} />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Fetching HackerRank stats...</span>
          </div>
        )}

        {hrError && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '220px', textAlign: 'center' }}>
            <p style={{ color: '#ef4444', margin: '0 0 10px 0', fontSize: '0.9rem' }}>{hrError}</p>
          </div>
        )}

        {!hrLoading && !hrError && hrStats && (
          <>
            {/* Badges List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>My Badges</div>
              
              {hrStats.badges
                .filter(b => b.stars > 0)
                .map((badge) => (
                  <div 
                    key={badge.name} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      background: 'rgba(255, 255, 255, 0.03)', 
                      padding: '12px 16px', 
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{badge.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Solved: {badge.solved} / {badge.total}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <div style={{ display: 'flex' }}>
                        {renderStars(badge.stars)}
                      </div>
                      {badge.rank && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          Rank: #{badge.rank.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Certifications Card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Certifications</div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(27, 169, 76, 0.08)',
                border: '1px solid rgba(27, 169, 76, 0.3)',
                padding: '12px 16px',
                borderRadius: '12px'
              }}>
                <CheckCircle size={22} style={{ color: '#1ba94c', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Python (Basic)</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>Verified Skill Certification</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Column 3: Education & Professional Certifications */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Education */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <BookOpen size={22} style={{ color: 'var(--cyan)' }} />
            <h2 style={{ fontSize: '1.15rem', margin: 0, fontFamily: "'Comfortaa', cursive" }}>Education</h2>
          </div>
          <div>
            <h3 style={{ fontSize: '1.02rem', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Bachelor of Technology</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--cyan)', margin: '0 0 8px 0', fontWeight: '500' }}>Computer Science & Engineering</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
              Focus on software development, data structures, algorithms, and artificial intelligence integration.
            </p>
          </div>
        </div>

        {/* Certifications */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <Award size={22} style={{ color: 'var(--cyan)' }} />
            <h2 style={{ fontSize: '1.15rem', margin: 0, fontFamily: "'Comfortaa', cursive" }}>Certifications</h2>
          </div>
          
          {/* Certificate 1: Infosys */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', margin: '0 0 2px 0', fontWeight: 'bold', lineHeight: '1.3' }}>Java Foundation Certification</h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--cyan)', fontWeight: '500' }}>Infosys Springboard</div>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>Mar 2026</span>
            </div>
            <a 
              href="https://validate.onwingspan.com" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
                marginTop: '4px',
                width: 'fit-content'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--cyan)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              Verify Credential <ExternalLink size={11} />
            </a>
          </div>

          {/* Certificate 2: Tata */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', margin: '0 0 2px 0', fontWeight: 'bold', lineHeight: '1.3' }}>GenAI Powered Data Analytics</h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--cyan)', fontWeight: '500' }}>TATA (via Forage)</div>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>Jul 2025</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Exploratory Data Analysis, Predictive Delinquency with AI, and Data Storytelling.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
