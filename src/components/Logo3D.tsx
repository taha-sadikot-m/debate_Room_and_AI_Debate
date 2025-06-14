
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Mesh } from 'three'
import { RoundedBox, GradientTexture } from '@react-three/drei'

const RotatingCube = () => {
  const meshRef = useRef<Mesh>(null!)

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1
      meshRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <RoundedBox ref={meshRef} args={[1.5, 1.5, 1.5]} radius={0.15}>
      <meshBasicMaterial>
        <GradientTexture
          stops={[0, 1]}
          colors={['hsl(238, 78%, 60%)', '#000000']}
        />
      </meshBasicMaterial>
    </RoundedBox>
  )
}

const Logo3D = () => {
  return (
    <div className="h-10 w-10">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <RotatingCube />
      </Canvas>
    </div>
  )
}

export default Logo3D
