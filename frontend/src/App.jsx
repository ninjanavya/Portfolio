import { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'
import { AnimatePresence, motion } from 'framer-motion'

import Planet from './components/Planet'
import CustomCursor from './components/CustomCursor'
import HeroOverlay from './components/HeroOverlay'
import Header from './components/Header'
import ForgeGlobe from './components/ForgeGlobe'
import CredentialsOverlay from './components/CredentialsOverlay'
import DancingAvatar from './components/DancingAvatar'
import ProjectsOverlay from './components/ProjectsOverlay'

function CameraController({ activePlanet, currentSection }) {
  useFrame((state) => {
    // Determine base target based on section
    let baseTargetX = 0
    if (currentSection === 'forge') baseTargetX = 30
    else if (currentSection === 'about') baseTargetX = -30
    else if (currentSection === 'credentials') baseTargetX = 60
    else if (currentSection === 'projects') baseTargetX = -60

    let targetPos = new THREE.Vector3(baseTargetX, 4, 15)
    let lookAtPos = new THREE.Vector3(baseTargetX, -2, 0)

    if (activePlanet && currentSection === 'home') {
      targetPos = new THREE.Vector3(activePlanet[0], activePlanet[1] + 1, activePlanet[2] + 6)
      lookAtPos = new THREE.Vector3(activePlanet[0], activePlanet[1], activePlanet[2])
    } else if (currentSection === 'forge') {
      // Zoom in slightly on the forge globe
      targetPos = new THREE.Vector3(30, 2, 12)
      lookAtPos = new THREE.Vector3(30, 0, 0)
    } else if (currentSection === 'about') {
      targetPos = new THREE.Vector3(-30, 1, 10)
      lookAtPos = new THREE.Vector3(-30, 0, 0)
    } else if (currentSection === 'credentials') {
      targetPos = new THREE.Vector3(60, 1, 10)
      lookAtPos = new THREE.Vector3(60, 0, 0)
    } else if (currentSection === 'projects') {
      targetPos = new THREE.Vector3(-60, 1, 10)
      lookAtPos = new THREE.Vector3(-60, 0, 0)
    }

    state.camera.position.lerp(targetPos, 0.04)
    const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(state.camera.quaternion).add(state.camera.position)
    const newLookAt = currentLookAt.lerp(lookAtPos, 0.04)
    state.camera.lookAt(newLookAt)
  })
  return null
}

export default function App() {
  const [currentSection, setCurrentSection] = useState('home')
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: "Hello! I am Navya's AI clone. Ask me anything about her skills, experience, or any other query!" }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [activePlanetPos, setActivePlanetPos] = useState(null)
  const chatLogRef = useRef(null)

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight
    }
  }, [chatHistory, isTyping])

  const handleChatSubmit = async (e) => {
    e.preventDefault()
    if (!chatMessage.trim()) return

    const userMsg = { sender: 'user', text: chatMessage }
    const updatedHistory = [...chatHistory, userMsg]
    
    setChatHistory(updatedHistory)
    setChatMessage('')
    setIsTyping(true)

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatMessage, history: updatedHistory })
      })
      const data = await res.json()
      setChatHistory((prev) => [...prev, { sender: 'ai', text: data.response }])
    } catch (err) {
      setChatHistory((prev) => [...prev, { sender: 'ai', text: 'Error connecting to AI Backend.' }])
    } finally {
      setIsTyping(false)
    }
  }

  const handlePlanetClick = (position) => {
    setActivePlanetPos(position)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'var(--bg)', cursor: 'none', overflow: 'hidden' }}>
      
      <CustomCursor />
      
      {/* 2D UI Layer */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
        <Header currentSection={currentSection} setCurrentSection={setCurrentSection} />
        
        <AnimatePresence>
          {currentSection === 'home' && !activePlanetPos && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            >
              <HeroOverlay />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Forge Title Overlay */}
        <AnimatePresence>
          {currentSection === 'forge' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{ position: 'absolute', top: '15%', left: '10%', pointerEvents: 'none' }}
            >
              <h1 style={{ fontSize: '3rem', margin: 0, color: 'var(--cyan)' }}>FORGE</h1>
              <p style={{ color: 'var(--text-secondary)', letterSpacing: '0.2em' }}>MY TECH STACK & SKILLS</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* About Overlay */}
        <AnimatePresence>
          {currentSection === 'about' && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6, type: 'spring' }}
              style={{ 
                position: 'absolute', 
                top: '25%', 
                transform: 'translateY(-20%)',
                left: '10%', 
                pointerEvents: 'auto',
                maxWidth: '600px',
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '40px',
                borderRadius: '24px',
                border: '1px solid var(--border-accent)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 20px 40px rgba(0, 217, 255, 0.05)'
              }}
            >
              <h1 style={{ fontSize: '2.5rem', margin: '0 0 20px 0', color: 'var(--cyan)', fontFamily: "'Comfortaa', cursive" }}>About Me</h1>
              
              <div style={{ 
                color: 'var(--text-primary)', 
                fontSize: '1.05rem', 
                lineHeight: '1.7', 
                fontFamily: "'DM Sans', sans-serif",
                maxHeight: '60vh',
                overflowY: 'auto',
                paddingRight: '10px' // Leave room for scrollbar
              }}>
                <p>
                  I’m a passionate and self-driven developer with a strong interest in full-stack development, AI, and system design. I enjoy building innovative and impactful projects that combine problem-solving, performance optimization, and modern technologies. From intelligent systems to user-focused web applications, I continuously explore new tools and improve my skills through hands-on development and learning.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Credentials Overlay */}
        <AnimatePresence>
          {currentSection === 'credentials' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            >
              <CredentialsOverlay />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Projects Overlay */}
        <AnimatePresence>
          {currentSection === 'projects' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            >
              <ProjectsOverlay />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* 3D Canvas Layer */}
      <Canvas camera={{ position: [0, 4, 15], fov: 60 }} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
        <CameraController activePlanet={activePlanetPos} currentSection={currentSection} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00d9ff" />
        <spotLight position={[0, 10, 0]} intensity={1.5} angle={0.5} penumbra={1} color="#f59e0b" />
        
        {/* Lights for Forge section */}
        <pointLight position={[40, 10, 10]} intensity={2} color="#ffffff" />
        <pointLight position={[20, -10, -10]} intensity={2} color="#00d9ff" />

        {/* Lights for About section */}
        <pointLight position={[-20, 10, 10]} intensity={2} color="#10b981" />
        <pointLight position={[-40, -10, -10]} intensity={1} color="#a78bfa" />

        <Environment preset="city" />

        <Stars radius={100} depth={50} count={6000} factor={4} saturation={0.5} fade speed={1.5} />
        
        <OrbitControls 
          enablePan={false} 
          minDistance={5} 
          maxDistance={25} 
          enabled={!activePlanetPos && currentSection === 'home'} // Disable drag outside home
          maxPolarAngle={Math.PI / 2 + 0.2}
        />

        {/* --- HOME SECTION (x: 0) --- */}
        <group position={[0, 0, 0]}>
          <Planet 
            position={[-6, -4, -1]} 
            color="#00d9ff" 
            size={1.2} 
            title="Frontend"
            tags={['React', 'Three.js', 'Tailwind']}
            description="Building beautiful, interactive, and performant user interfaces with stunning WebGL graphics."
            isActive={activePlanetPos && activePlanetPos[0] === -6}
            onPlanetClick={handlePlanetClick}
          />
          <Planet 
            position={[0, -5, -4]} 
            color="#4b8bbe" 
            size={1.5} 
            title="Backend"
            tags={['Python', 'FastAPI', 'PostgreSQL']}
            description="Scalable APIs, efficient data processing, and robust architectures to power modern web applications."
            isActive={activePlanetPos && activePlanetPos[0] === 0}
            onPlanetClick={handlePlanetClick}
          />
          <Planet 
            position={[6, -4, 1]} 
            color="#f59e0b" 
            size={1.3} 
            title="AI / ML"
            tags={['LangChain', 'OpenAI', 'LLMs']}
            description="Interact with my personal AI clone to learn more about my experience, skills, and projects."
            isActive={activePlanetPos && activePlanetPos[0] === 6}
            onPlanetClick={handlePlanetClick}
          >
            <div style={{ marginTop: '12px' }}>
              <div className="chat-log" ref={chatLogRef}>
                {chatHistory.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`chat-msg ${msg.sender === 'user' ? 'chat-msg-user' : 'chat-msg-ai'}`}
                  >
                    {msg.text}
                  </div>
                ))}
                {isTyping && (
                  <div className="chat-typing">
                    AI is thinking...
                  </div>
                )}
              </div>
              <form onSubmit={handleChatSubmit}>
                <input 
                  type="text" 
                  className="chat-input"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message and press Enter..."
                />
              </form>
            </div>
          </Planet>
        </group>

        {/* --- FORGE SECTION (x: 30) --- */}
        <ForgeGlobe position={[30, 0, 0]} />

        {/* --- ABOUT SECTION (x: -30) --- */}
        <group position={[-30, 0, 0]}>
          <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
            <group position={[6, 0, -2]}>
              {/* Green Octahedron */}
              <mesh position={[0, 0, 0]}>
                <octahedronGeometry args={[3, 0]} />
                <meshStandardMaterial color="#10b981" wireframe={true} emissive="#10b981" emissiveIntensity={0.5} transparent opacity={0.3} />
              </mesh>
              {/* Dancing Avatar */}
              <DancingAvatar position={[0, -1.8, 0]} scale={0.9} />
            </group>
          </Float>
        </group>

        {/* --- CREDENTIALS SECTION (x: 60) --- */}
        <group position={[60, 0, 0]}>
          <Float speed={2} rotationIntensity={2} floatIntensity={1.5}>
            <mesh position={[-6, 0, -2]}>
              <dodecahedronGeometry args={[2.5, 0]} />
              <meshStandardMaterial color="#00d9ff" wireframe={true} emissive="#00d9ff" emissiveIntensity={0.5} transparent opacity={0.3} />
            </mesh>
          </Float>
        </group>

        {/* --- PROJECTS SECTION (x: -60) --- */}
        <group position={[-60, 0, 0]}>
          <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
            <mesh position={[0, 0, -5]}>
              <icosahedronGeometry args={[3.5, 1]} />
              <meshStandardMaterial color="#f59e0b" wireframe={true} emissive="#f59e0b" emissiveIntensity={0.3} transparent opacity={0.2} />
            </mesh>
          </Float>
        </group>

      </Canvas>
    </div>
  )
}
