import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Preload } from '@react-three/drei'
import { styled } from 'styled-components'
import { useRef, useState } from 'react'

const StyledCanvas = styled(Canvas)`
  width: 100%;
  height: 100vh;
`

function SpinningTorus() {
  const meshRef = useRef<any>()
  const [hovered, setHovered] = useState(false)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta
      meshRef.current.rotation.y += delta
    }
  })

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <torusGeometry args={[1, 0.4, 16, 32]} />
      <meshStandardMaterial color={hovered ? '#E91E63' : '#2196F3'} />
    </mesh>
  )
}

const Example3D = () => {
  return (
    <StyledCanvas camera={{ position: [0, 0, 5], fov: 45 }} shadows>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} intensity={1} />
      <SpinningTorus />
      <OrbitControls />
      <Preload all />
    </StyledCanvas>
  )
}

export default Example3D
