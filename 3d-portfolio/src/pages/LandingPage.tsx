import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Preload, Text } from '@react-three/drei'
import { styled } from 'styled-components'
import { useRef } from 'react'
import * as THREE from 'three'

const StyledCanvas = styled(Canvas)`
  width: 100%;
  height: 100vh;
`

const Overlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
`

const Title = styled.h1`
  font-size: 4rem;
  margin: 0;
  background: linear-gradient(90deg, #ffa500, #8352fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #aaa6c3;
`

const RotatingTorus = () => {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.005
      ref.current.rotation.y += 0.01
    }
  })
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[2, 0.6, 128, 32]} />
      <meshStandardMaterial color="#8352FD" roughness={0.2} metalness={0.7} />
    </mesh>
  )
}

const LandingPage = () => {
  return (
    <>
      <Overlay>
        <Title>Welcome to My Portfolio</Title>
        <Subtitle>Crafting immersive 3D web experiences</Subtitle>
      </Overlay>
      <StyledCanvas
        shadows
        camera={{ position: [0, 0, 8], fov: 30 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[0, 0, 5]} intensity={1} />
        <RotatingTorus />
        <Text
          position={[0, -3, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          explore
        </Text>
        <OrbitControls enableZoom={false} />
        <Preload all />
      </StyledCanvas>
    </>
  )
}

export default LandingPage 

