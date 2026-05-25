import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { SiReact, SiTailwindcss, SiPython, SiMongodb, SiJavascript, SiGit, SiPlotly } from 'react-icons/si'
import { FaCss3Alt } from 'react-icons/fa'

export default function ForgeGlobe({ position }) {
  const groupRef = useRef()

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1
      groupRef.current.rotation.x += delta * 0.05
    }
  })

  // List of tech stack items
  const skills = [
    { name: 'React', icon: <SiReact color="#61DAFB" size={24} /> },
    { name: 'CSS', icon: <FaCss3Alt color="#264de4" size={24} /> },
    { name: 'Tailwind', icon: <SiTailwindcss color="#38B2AC" size={24} /> },
    { name: 'Python', icon: <SiPython color="#3776AB" size={24} /> },
    { name: 'MongoDB', icon: <SiMongodb color="#47A248" size={24} /> },
    { name: 'JavaScript', icon: <SiJavascript color="#F7DF1E" size={24} /> },
    { name: 'Git', icon: <SiGit color="#F05032" size={24} /> },
    { name: 'Plotly', icon: <SiPlotly color="#3F4F75" size={24} /> },
  ]

  const radius = 3.5 // Globe radius

  return (
    <group position={position} ref={groupRef}>
      {/* Wireframe Sphere */}
      <mesh>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshBasicMaterial 
          color="#00d9ff" 
          wireframe={true} 
          transparent={true} 
          opacity={0.15} 
        />
      </mesh>

      {/* Solid Inner Core for glowing effect */}
      <mesh>
        <sphereGeometry args={[radius * 0.98, 32, 32]} />
        <meshStandardMaterial 
          color="#00d9ff" 
          emissive="#00d9ff"
          emissiveIntensity={0.2}
          transparent={true}
          opacity={0.05}
        />
      </mesh>

      {/* Orbiting Icons */}
      {skills.map((skill, index) => {
        // Distribute points evenly using Fibonacci sphere math
        const phi = Math.acos(1 - 2 * (index + 0.5) / skills.length)
        const theta = Math.PI * (1 + Math.sqrt(5)) * index

        const x = radius * Math.sin(phi) * Math.cos(theta)
        const y = radius * Math.cos(phi)
        const z = radius * Math.sin(phi) * Math.sin(theta)

        return (
          <Html 
            key={skill.name} 
            position={[x, y, z]} 
            center
            distanceFactor={10} // Makes them scale slightly with distance
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              pointerEvents: 'none'
            }}>
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '10px',
                borderRadius: '50%',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 0 15px rgba(0, 217, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {skill.icon}
              </div>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.65rem',
                color: 'var(--text-secondary)',
                background: 'var(--bg-card)',
                padding: '2px 6px',
                borderRadius: '8px',
                border: '1px solid var(--border)'
              }}>
                {skill.name}
              </span>
            </div>
          </Html>
        )
      })}
    </group>
  )
}
