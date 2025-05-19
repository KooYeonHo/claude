import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Preload } from '@react-three/drei'
import { styled } from 'styled-components'
import { useRef } from 'react'
import { Vector3 } from 'three'

const StyledCanvas = styled(Canvas)`
  width: 100%;
  height: 100vh;
`

function DodecahedronCage() {
  const meshRef = useRef<any>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3
      meshRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <mesh ref={meshRef}>
      <dodecahedronGeometry args={[2]} />
      <meshStandardMaterial color="#2196F3" wireframe />
    </mesh>
  )
}

const BALL_COUNT = 6

function MovingBalls({ radius = 1.8 }) {
  const balls = useRef<any[]>([])
  const velocities = useRef(
    Array.from({ length: BALL_COUNT }, () =>
      new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
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
        <mesh ref={(el) => (balls.current[i] = el)} key={i}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#E91E63" />
        </mesh>
      ))}
    </>
  )
}

const Example3D = () => {
  return (
    <StyledCanvas camera={{ position: [0, 0, 5], fov: 45 }} shadows>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} intensity={1} />
      <DodecahedronCage />
      <MovingBalls />
      <OrbitControls />
      <Preload all />
    </StyledCanvas>
  )
}

export default Example3D
