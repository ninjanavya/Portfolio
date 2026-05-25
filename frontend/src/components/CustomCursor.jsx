import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])

  return (
    <>
      {/* Glow aura */}
      <motion.div
        animate={{
          x: mousePosition.x - 50,
          y: mousePosition.y - 50,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.15 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 100,
          height: 100,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99997,
          background: 'radial-gradient(circle, rgba(0,217,255,0.07) 0%, transparent 65%)',
          filter: 'blur(4px)',
        }}
      />

      {/* Main Cursor Ring */}
      <motion.div
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.05 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 999998,
          backdropFilter: 'blur(4px) saturate(150%)',
          WebkitBackdropFilter: 'blur(4px) saturate(150%)',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 0 12px rgba(0,217,255,0.06)',
        }}
      >
        {/* Reflection glare */}
        <div style={{
          position: 'absolute',
          top: 7,
          left: 9,
          width: 10,
          height: 3,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.40)',
          filter: 'blur(1.5px)',
          transform: 'rotate(-20deg)'
        }} />
      </motion.div>

      {/* Tiny solid dot */}
      <motion.div
        animate={{
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 999999,
          background: 'rgba(0,217,255,0.9)',
          boxShadow: '0 0 6px rgba(0,217,255,0.6)',
        }}
      />
    </>
  )
}
