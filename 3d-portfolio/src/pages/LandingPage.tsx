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

const LandingWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`

const Title = styled.h1`
  font-size: 4rem;
  margin: 0;
  background: linear-gradient(90deg, #ffa500, #8352fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #aaa6c3;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

const DodecahedronCage = () => {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.3
      ref.current.rotation.y += delta * 0.2
    }
  })
  return (
    <mesh ref={ref}>
      <dodecahedronGeometry args={[2]} />
      <meshStandardMaterial color="#8352FD" wireframe />
    </mesh>
  )
}

const BALL_COUNT = 6

const MovingBalls = ({ radius = 1.8 }) => {
  const balls = useRef<THREE.Mesh[]>([])
  const velocities = useRef(
    Array.from({ length: BALL_COUNT }, () =>
      new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .normalize()
        .multiplyScalar(0.02)
    )
  )

  useFrame((_, delta) => {
    balls.current.forEach((ball, i) => {
      const v = velocities.current[i]
      ball.position.addScaledVector(v, delta * 60)
      if (ball.position.length() > radius) {
        ball.position.clampLength(0, radius)
        v.reflect(ball.position.clone().normalize())
      }
    })
  })

  return (
    <>
      {Array.from({ length: BALL_COUNT }).map((_, i) => (
        <mesh ref={(el) => (balls.current[i] = el!)} key={i}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#E91E63" />
        </mesh>
      ))}
    </>
  )
}

const LandingPage = () => {
  return (
    <LandingWrapper>
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
        <DodecahedronCage />
        <MovingBalls />
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
    </LandingWrapper>
  )
}

export default LandingPage 

