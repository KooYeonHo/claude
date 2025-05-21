import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface GenerativeArtBackgroundProps {
  particleCount?: number;
  baseColor?: string;
  animationSpeed?: number;
}

const GenerativeArtBackground: React.FC<GenerativeArtBackgroundProps> = ({
  particleCount = 500,
  baseColor = '#00FF00',
  animationSpeed = 0.1,
}) => {
  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
      }}
      camera={{ position: [0, 0, 5] }}
    >
      <Particles
        count={particleCount}
        baseColor={baseColor}
        animationSpeed={animationSpeed}
      />
    </Canvas>
  );
};

interface ParticlesProps {
  count: number;
  baseColor: string;
  animationSpeed: number;
}

const Particles: React.FC<ParticlesProps> = ({ count, baseColor, animationSpeed }) => {
  const pointsRef = useRef<THREE.Points>(null!);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, [count]);

  const colors = useMemo(() => {
    const temp = [];
    const base = new THREE.Color(baseColor);
    for (let i = 0; i < count; i++) {
      // Vary shades of green
      const color = base.clone();
      color.lerp(new THREE.Color(0x006400), Math.random() * 0.5); // DarkGreen
      color.lerp(new THREE.Color(0x98FB98), Math.random() * 0.5); // PaleGreen
      temp.push(color.r, color.g, color.b);
    }
    return new Float32Array(temp);
  }, [count, baseColor]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * animationSpeed * 0.1;
      pointsRef.current.rotation.x += delta * animationSpeed * 0.05;

      // Subtle individual particle movement (optional, can be performance intensive)
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        // Drift upwards
        positions[i + 1] += delta * animationSpeed * 0.2;
        // Reset if too high
        if (positions[i+1] > 5) {
            positions[i+1] = -5;
            positions[i] = (Math.random() - 0.5) * 10; // Re-randomize x
        }

        // Gentle random motion (Brownian)
        positions[i] += (Math.random() - 0.5) * delta * animationSpeed * 0.1;
        positions[i+2] += (Math.random() - 0.5) * delta * animationSpeed * 0.1;

         // Keep within bounds (optional, can also wrap around)
        if (positions[i] > 5) positions[i] = -5;
        if (positions[i] < -5) positions[i] = 5;
        if (positions[i+2] > 5) positions[i+2] = -5;
        if (positions[i+2] < -5) positions[i+2] = 5;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} positions={particles} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
};

export default GenerativeArtBackground;
