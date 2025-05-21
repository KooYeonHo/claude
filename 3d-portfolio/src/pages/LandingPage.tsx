import { useState, useLayoutEffect, useRef, useMemo } from 'react'; // Removed React default import
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Preload, Text, Stars } from '@react-three/drei';
import { styled } from 'styled-components';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GenerativeArtBackground from '../components/GenerativeArtBackground'; // Path to your component

gsap.registerPlugin(ScrollTrigger);

// Existing styled components (StyledCanvas, Overlay, LandingWrapper, Title, Subtitle)
// It's important to keep these if they are used by the existing 3D scene.
// However, the overall page structure will change to accommodate scrolling sections.

const StyledCanvas = styled(Canvas)`
  width: 100%;
  height: 100vh; // Ensures canvas takes full viewport height of its container
`;

const Overlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
  z-index: 1; // Ensure overlay text is above the 3D scene if needed
`;

const LandingWrapper = styled.div`
  position: relative; // Keep relative for existing 3D scene positioning
  width: 100%;
  height: 100vh; // This will be the height of the hero section
`;

const Title = styled.h1`
  font-size: 4rem;
  margin: 0;
  background: linear-gradient(90deg, #ffa500, #8352fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #aaa6c3;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// Existing 3D components (DodecahedronCage, MovingBalls) remain unchanged
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
      {/* Experimenting with solid, translucent look */}
      <meshStandardMaterial 
        color="#90EE90" 
        wireframe={false} 
        transparent={true} 
        opacity={0.7} 
      />
      {/* Fallback if the above doesn't look good:
      <meshStandardMaterial color="#90EE90" wireframe={true} /> 
      */}
    </mesh>
  )
};

const BALL_COUNT = 6
const BALL_RADIUS = 0.2

const MovingBalls = ({ radius = 1.8 }) => {
  const balls = useRef<THREE.Mesh[]>([])
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
        <mesh ref={(el) => (balls.current[i] = el!)} key={i}>
          <sphereGeometry args={[BALL_RADIUS, 16, 16]} />
          <meshStandardMaterial color="#33CC66" />
        </mesh>
      ))}
    </>
  )
};

// New PageContainer to hold all sections and the fixed background
const PageContainer = styled.div`
  width: 100%;
  position: relative; // For the fixed GenerativeArtBackground to be relative to
`;

const Section = styled.div`
  min-height: 100vh; // Changed to min-height to accommodate content
  width: 100%;
  padding: 120px 20px 80px; // Increased top padding, added side padding
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #f0f0f0; // Light off-white for text
  border-bottom: 1px solid #222; 

  &:last-child {
    border-bottom: none; // No border for the last section
  }

  h2 { // Changed from h1 for semantic structure (h1 is in Overlay)
    font-size: 2.8rem; // Slightly adjusted
    text-align: center;
    margin-bottom: 20px;
    color: #e0e0e0; // Slightly darker than main text for emphasis
  }

  p {
    font-size: 1.1rem;
    line-height: 1.7;
    text-align: center;
    max-width: 700px; // Readability constraint
    color: #d0d0d0; // Slightly darker than h2 for paragraph text
    margin-bottom: 15px;
  }

  h3 {
    font-size: 1.8rem;
    color: #c0c0c0; // Lighter grey for subheadings
    margin-top: 30px;
    margin-bottom: 15px;
  }

  ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap; // Allow skills to wrap
    justify-content: center; // Center skills
    gap: 10px; // Spacing between skill tags
    max-width: 800px; // Max width for skills container
  }

  li {
    background-color: #2a2a3a; // Darker tag background
    color: #b0b0e0; // Light purple-ish text for tags
    padding: 8px 15px;
    border-radius: 20px; // Rounded tags
    font-size: 0.95rem;
  }
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-direction: column; /* Changed from row for better large list handling */
  align-items: center; /* Center items in column */
  width: 100%;
  gap: 20px; /* Space between skill category groups */

  @media (min-width: 768px) {
    /* No specific media query needed if always column, adjust if going back to row/columns */
  }
`;

const SkillCategory = styled.div`
  text-align: center; /* Center text within each category */
  /* width: 30%; // Removed if using single column layout */
  /* min-width: 200px; // Removed */
`;

const ProjectsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  padding: 20px 0; // Add some padding above and below the cards
  max-width: 1200px; // Max width for projects area
`;

const ProjectCard = styled.div`
  background-color: #1a1a2e; // Darker, slightly purple-blue background
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  width: 320px; // Fixed width for cards
  display: flex;
  flex-direction: column;
  justify-content: space-between; // Pushes links to the bottom

  h3 {
    font-size: 1.6rem; // Project title size
    color: #98FB98; // PaleGreen, stands out
    margin-bottom: 10px;
    margin-top: 0; // Reset margin-top for h3 inside card
  }

  p {
    font-size: 0.95rem; // Slightly smaller for description
    line-height: 1.6;
    color: #c0c0c0; // Lighter grey for readability
    margin-bottom: 10px;
  }

  p strong { // For "Tech:" label
    color: #87CEFA; // LightSkyBlue for emphasis
  }

  div > a { // Links styling
    color: #FFD700; // Gold color for links
    text-decoration: none;
    margin-right: 10px;
    font-size: 0.9rem;
    transition: color 0.3s ease;

    &:hover {
      color: #FFA500; // Orange on hover
    }
  }
`;

const ContactLink = styled.a`
  color: #FFD700; // Gold, consistent with ProjectCard links
  text-decoration: none;
  font-size: 1.1rem; // Slightly larger for contact details
  transition: color 0.3s ease;
  display: inline-block; // Allows for better spacing if needed
  margin: 5px 0;

  &:hover {
    color: #FFA500; // Orange on hover
    text-decoration: underline;
  }
`;


const LandingPage = () => {
  const [bgColor, setBgColor] = useState('#00FF00'); // Initial Green
  const [bgAnimationSpeed, setBgAnimationSpeed] = useState(0.1); // Default speed
  const [bgParticleCount, setBgParticleCount] = useState(500); // Initial particle count

  useLayoutEffect(() => {
    ScrollTrigger.refresh();
    
    // Proxies need to be defined before createTimeline if it's defined inside useLayoutEffect
    // and uses these proxies from its closure.
    let introColorProxy = { r: new THREE.Color(bgColor).r, g: new THREE.Color(bgColor).g, b: new THREE.Color(bgColor).b };
    let speedProxy = { value: bgAnimationSpeed };
    let particleCountProxy = { value: bgParticleCount };

    const introSectionTrigger = document.getElementById('intro-section');
    const aboutSectionTrigger = document.getElementById('about-section');
    const skillsSectionTrigger = document.getElementById('skills-section');
    const projectsSectionTrigger = document.getElementById('projects-section');
    const contactSectionTrigger = document.getElementById('contact-section');

    // Define target colors (remains the same)
    const introTargetColor = new THREE.Color('#228B22'); 
    const aboutTargetColor = new THREE.Color('#556B2F'); 
    const skillsTargetColor = new THREE.Color('#3CB371'); 
    const projectsTargetColor = new THREE.Color('#20B2AA'); 
    const contactTargetColor = new THREE.Color('#1E4D2B');
    
    // Define target speeds (remains the same)
    const aboutTargetSpeed = 0.02; 
    const skillsTargetSpeed = 0.05; 
    const projectsTargetSpeed = 0.08; 
    const contactTargetSpeed = 0.01;

    // Define target particle counts (remains the same)
    const skillsTargetParticleCount = 800;
    const projectsTargetParticleCount = 600;
    const contactTargetParticleCount = 500;

    // Define createTimeline INSIDE useLayoutEffect to close over proxies and setters
    const createTimeline = (
      trigger: HTMLElement | null,
      targetColor: THREE.Color,
      targetSpeed?: number,
      targetParticles?: number
    ): gsap.core.Timeline | null => { // Added return type
      if (!trigger) return null;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
          // markers: true 
        },
      });

      // Animate color (always present)
      tl.to(introColorProxy, { // introColorProxy is used for all color animations
        r: targetColor.r, g: targetColor.g, b: targetColor.b,
        onUpdate: () => setBgColor(new THREE.Color(introColorProxy.r, introColorProxy.g, introColorProxy.b).getStyle()),
      });

      // Animate speed if targetSpeed is provided
      if (targetSpeed !== undefined) {
        tl.to(speedProxy, {
          value: targetSpeed,
          onUpdate: () => setBgAnimationSpeed(speedProxy.value),
        }, 0); // Run concurrently with color change
      }

      // Animate particle count if targetParticles is provided
      if (targetParticles !== undefined) {
        tl.to(particleCountProxy, {
          value: targetParticles,
          onUpdate: () => setBgParticleCount(Math.round(particleCountProxy.value)),
        }, 0); // Run concurrently
      }
      
      return tl;
    };

    // Updated calls to createTimeline
    const introTl = createTimeline(introSectionTrigger, introTargetColor, undefined, undefined);
    const aboutTl = createTimeline(aboutSectionTrigger, aboutTargetColor, aboutTargetSpeed, undefined);
    const skillsTl = createTimeline(skillsSectionTrigger, skillsTargetColor, skillsTargetSpeed, skillsTargetParticleCount);
    const projectsTl = createTimeline(projectsSectionTrigger, projectsTargetColor, projectsTargetSpeed, projectsTargetParticleCount);
    const contactTl = createTimeline(contactSectionTrigger, contactTargetColor, contactTargetSpeed, contactTargetParticleCount);

    return () => {
      // Cleanup remains the same
      [introTl, aboutTl, skillsTl, projectsTl, contactTl].forEach(tl => tl && tl.kill());
      [introSectionTrigger, aboutSectionTrigger, skillsSectionTrigger, projectsSectionTrigger, contactSectionTrigger].forEach(triggerEl => {
        if (triggerEl) {
          ScrollTrigger.getAll().forEach(st => {
            if (st.trigger === triggerEl) {
              st.kill(true); 
            }
          });
        }
      });
    };
  }, []); 

  return (
    <PageContainer>
      <GenerativeArtBackground baseColor={bgColor} particleCount={bgParticleCount} animationSpeed={bgAnimationSpeed} />
      
      <Section id="hero-section" style={{ paddingTop: '0', paddingLeft: '0', paddingRight: '0' }}>
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
            <Stars radius={5} depth={20} count={2000} factor={4} fade />
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
              explore (scroll down)
            </Text>
            <OrbitControls enableZoom={false} />
            <Preload all />
          </StyledCanvas>
        </LandingWrapper>
      </Section>

      <Section id="intro-section">
        <h2>Discovering Digital Frontiers</h2>
        <p>
          I am a creative developer passionate about crafting immersive and interactive web experiences. 
          With a blend of design sensibility and technical expertise, I strive to build digital products 
          that are not only functional but also delightful to use.
        </p>
      </Section>

      <Section id="about-section">
        <h2>My Journey & Philosophy</h2>
        <p>
          My path into development was driven by a curiosity for how technology can transform ideas into reality. 
          I believe in continuous learning and a user-centric approach, always aiming to create solutions 
          that are both innovative and intuitive. My goal is to leverage cutting-edge tech to build meaningful applications.
        </p>
      </Section>

      <Section id="skills-section">
        <h2>My Technical Toolkit</h2>
        <SkillsContainer>
          <SkillCategory>
            <h3>Languages</h3>
            <ul>
              <li>JavaScript (ES6+)</li>
              <li>TypeScript</li>
              <li>Python</li>
              <li>HTML5</li>
              <li>CSS3</li>
            </ul>
          </SkillCategory>
          <SkillCategory>
            <h3>Frameworks/Libraries</h3>
            <ul>
              <li>React</li>
              <li>Node.js</li>
              <li>Express.js</li>
              <li>Three.js</li>
              <li>GSAP</li>
              <li>Styled Components</li>
              <li>Redux</li>
            </ul>
          </SkillCategory>
          <SkillCategory>
            <h3>Tools & Platforms</h3>
            <ul>
              <li>Git & GitHub</li>
              <li>Docker</li>
              <li>VS Code</li>
              <li>Figma</li>
              <li>Webpack</li>
              <li>Babel</li>
              <li>MongoDB</li>
            </ul>
          </SkillCategory>
        </SkillsContainer>
      </Section>

      <Section id="projects-section">
        <h2>Featured Projects</h2>
        <ProjectsContainer>
          <ProjectCard>
            <h3>Interactive Data Visualization</h3>
            <p>A web application that visualizes complex datasets using interactive charts and maps, built with D3.js and React.</p>
            <p><strong>Tech:</strong> React, D3.js, Node.js</p>
            <div>
              <a href="#">Live Demo</a> | <a href="#">GitHub</a>
            </div>
          </ProjectCard>
          <ProjectCard>
            <h3>3D Product Configurator</h3>
            <p>An e-commerce feature allowing users to customize products in 3D in real-time, developed with Three.js.</p>
            <p><strong>Tech:</strong> Three.js, React, WebGL</p>
            <div>
              <a href="#">Live Demo</a> | <a href="#">GitHub</a>
            </div>
          </ProjectCard>
        </ProjectsContainer>
      </Section>

      <Section id="contact-section">
        <h2>Let's Connect</h2>
        <p>Have a project in mind, or just want to say hi? Feel free to reach out!</p>
        <p><ContactLink href="mailto:your.email@example.com">your.email@example.com</ContactLink></p>
        <p><ContactLink href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">github.com/yourusername</ContactLink></p>
        <p><ContactLink href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">linkedin.com/in/yourusername</ContactLink></p>
      </Section>

    </PageContainer>
  );
};

export default LandingPage;

