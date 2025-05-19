import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Preload, Stars } from '@react-three/drei'
import { styled } from 'styled-components'
import { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'

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

function InteractiveCube() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [active, setActive] = useState(false)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      onClick={() => setActive(!active)}
      onPointerOver={() => setActive(true)}
      onPointerOut={() => setActive(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={active ? '#E91E63' : '#2196F3'} />
    </mesh>
  )
}

const BALL_COUNT = 6
const BALL_RADIUS = 0.2

function MovingBalls({ radius = 1.8 }) {
  const balls = useRef<any[]>([])
  const velocities = useRef(
    Array.from({ length: BALL_COUNT }, () =>
      new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
        .normalize()
        .multiplyScalar(0.02)
    )
  )

  const planes = useMemo(() => {
    const g = new THREE.DodecahedronGeometry(radius)
    const pos = g.getAttribute('position')
    const p: THREE.Plane[] = []
    for (let i = 0; i < pos.count; i += 3) {
      const vA = new THREE.Vector3().fromBufferAttribute(pos, i)
      const vB = new THREE.Vector3().fromBufferAttribute(pos, i + 1)
      const vC = new THREE.Vector3().fromBufferAttribute(pos, i + 2)
      const normal = new THREE.Triangle(vA, vB, vC).getNormal(new THREE.Vector3())
      const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, vA)
      if (!p.some((pl) => pl.normal.angleTo(plane.normal) < 0.01)) {
        p.push(plane)
      }
    }
    return p
  }, [radius])

  useFrame((_, delta) => {
    balls.current.forEach((ball, i) => {
      const v = velocities.current[i]
      ball.position.addScaledVector(v, delta * 60)
      planes.forEach((plane) => {
        const dist = plane.distanceToPoint(ball.position) + BALL_RADIUS
        if (dist > 0) {
          ball.position.addScaledVector(plane.normal, -dist)
          v.reflect(plane.normal)
        }
      })
    })
  })

  return (
    <>
      {Array.from({ length: BALL_COUNT }).map((_, i) => (
        <mesh ref={(el) => (balls.current[i] = el)} key={i}>
          <sphereGeometry args={[BALL_RADIUS, 16, 16]} />
          <meshStandardMaterial color="#E91E63" />
        </mesh>
      ))}
    </>
  )
}

const Example3D = () => {
  return (
    <StyledCanvas camera={{ position: [0, 0, 5], fov: 45 }} shadows>
      <Stars radius={5} depth={20} count={2000} factor={4} fade />
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} intensity={1} />
      <DodecahedronCage />
      <MovingBalls />
      <InteractiveCube />
      <OrbitControls />
      <Preload all />
    </StyledCanvas>
  )
}

export default Example3D
