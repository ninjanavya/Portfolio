import { useGLTF, useAnimations } from '@react-three/drei'
import { useEffect, useRef } from 'react'

export default function DancingAvatar({ position = [0, 0, 0], scale = 1 }) {
  const group = useRef()
  // Load the expressive robot model which has a pre-baked "Dance" animation from Three.js CDN
  const { scene, animations } = useGLTF('https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb')
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    // Play the dance animation
    const danceAction = actions['Dance']
    if (danceAction) {
      danceAction.reset().fadeIn(0.5).play()
    }
    return () => {
      if (danceAction) {
        danceAction.fadeOut(0.5)
      }
    }
  }, [actions])

  return (
    <group ref={group} position={position} scale={scale} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}
