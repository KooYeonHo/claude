import { Canvas } from '@react-three/fiber'
import { OrbitControls, Preload } from '@react-three/drei'
import { styled } from 'styled-components'

const StyledCanvas = styled(Canvas)`
  width: 100%;
  height: 100vh;
`

const LandingPage = () => {
  return (
    <StyledCanvas
      shadows
      camera={{ position: [0, 0, 10], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 5]} intensity={1} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#8352FD" />
      </mesh>
      <OrbitControls enableZoom={false} />
      <Preload all />
    </StyledCanvas>
  )
}

export default LandingPage 