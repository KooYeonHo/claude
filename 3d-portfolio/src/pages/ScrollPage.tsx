import LandingPage from './LandingPage'
import AboutMe from './AboutMe'
import Projects from './Projects'
import Contact from './Contact'
import Example3D from './Example3D'
import { styled } from 'styled-components'

const ScrollContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Section = styled.section`
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
`;

const ScrollPage = () => {
  return (
    <ScrollContainer>
      <Section>
        <LandingPage />
      </Section>
      <Section>
        <AboutMe />
      </Section>
      <Section>
        <Projects />
      </Section>
      <Section>
        <Contact />
      </Section>
      <Section>
        <Example3D />
      </Section>
    </ScrollContainer>
  )
}

export default ScrollPage
