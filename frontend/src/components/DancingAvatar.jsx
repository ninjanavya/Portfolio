import { useGLTF, useAnimations } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function DancingAvatar({ position = [0, 0, 0], scale = 1, isSpeaking = false }) {
  const group = useRef()
  // Load the expressive robot model which has a pre-baked "Dance" animation from Three.js CDN
  const { scene, animations } = useGLTF('https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb')
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    let activeAction = null
    let timeoutId = null

    if (isSpeaking) {
      // Play a custom speaking sequence or a loop of expressive animations
      const sequence = ['Wave', 'ThumbsUp', 'Yes', 'Standing']
      let index = 0

      const playNext = () => {
        const animName = sequence[index]
        const nextAction = actions[animName]

        if (nextAction) {
          if (activeAction) {
            activeAction.fadeOut(0.5)
          }

          nextAction.reset().fadeIn(0.5).play()
          activeAction = nextAction

          if (animName !== 'Standing') {
            nextAction.setLoop(THREE.LoopOnce, 1)
            nextAction.clampWhenFinished = true
          }

          const clipDuration = nextAction.getClip().duration
          timeoutId = setTimeout(() => {
            index = (index + 1) % sequence.length
            playNext()
          }, Math.max(clipDuration * 1000, 2500))
        } else {
          index = (index + 1) % sequence.length
          playNext()
        }
      }

      playNext()
    } else {
      // Default: play Dance animation
      const danceAction = actions['Dance']
      if (danceAction) {
        danceAction.reset().fadeIn(0.5).play()
        activeAction = danceAction
      }
    }

    return () => {
      if (activeAction) {
        activeAction.fadeOut(0.5)
      }
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [actions, isSpeaking])

  return (
    <group ref={group} position={position} scale={scale} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}

