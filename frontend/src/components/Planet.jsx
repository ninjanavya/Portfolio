import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Float } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

export default function Planet({ position, color, size = 1, title, description, tags = [], children, onPlanetClick, isActive }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.15
    if (hovered && !isActive) {
      meshRef.current.rotation.x += delta * 0.1
    }
    const targetScale = isActive ? 1.5 : (hovered ? 1.1 : 1)
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
  })

  const handleClick = (e) => {
    e.stopPropagation()
    onPlanetClick(isActive ? null : position)
  }

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false) }}
        >
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={hovered || isActive ? 0.8 : 0.2}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>

      {!isActive && (
        <Html center position={[0, size + 0.8, 0]}>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: hovered ? 1 : 0.5, y: hovered ? 0 : 5 }}
            style={{ 
              color: 'var(--text-primary)', 
              background: 'var(--bg-card)', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--border)',
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.8rem'
            }}
          >
            {title}
          </motion.div>
        </Html>
      )}

      <Html center position={[0, 0, size + 1.5]} zIndexRange={[100, 0]}>
        <AnimatePresence>
          {isActive && (
            <>
              {/* Blur backdrop overlay */}
              <motion.div
                className="html-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => { e.stopPropagation(); onPlanetClick(null) }}
              />
              <motion.div 
                className="html-overlay"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              >
                <h2 style={{ fontFamily: "'Comfortaa', cursive" }}>{title}</h2>
                
                {tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {tags.map((tag, i) => (
                      <span key={i} className="tag-pill">{tag}</span>
                    ))}
                  </div>
                )}
  
                <p style={{ fontFamily: "'DM Sans', sans-serif" }}>{description}</p>
                
                {children}
                
                <button 
                  onClick={(e) => { e.stopPropagation(); onPlanetClick(null) }}
                  style={{ 
                    marginTop: '15px', 
                    background: 'var(--cyan-muted)', 
                    color: 'var(--cyan)', 
                    border: '1px solid var(--border-accent)', 
                    padding: '10px 16px', 
                    borderRadius: '12px', 
                    cursor: 'pointer',
                    fontWeight: '600',
                    width: '100%',
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0,217,255,0.25)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0,217,255,0.2)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'var(--cyan-muted)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  Close & Return
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Html>
    </group>
  )
}
