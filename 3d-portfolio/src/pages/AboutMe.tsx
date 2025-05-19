import { styled } from 'styled-components'

const AboutContainer = styled.div`
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`

const Title = styled.h2`
  font-size: 3rem;
  margin-bottom: 2rem;
  color: #ffffff;
`

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: #aaa6c3;
`

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
`

const SkillBadge = styled.div`
  background-color: #151030;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
`

const AboutMe = () => {
  const skills = ['JavaScript', 'TypeScript', 'React', 'Three.js', 'HTML', 'CSS', 'Node.js'];
  
  return (
    <AboutContainer>
      <Title>About Me</Title>
      <Description>
        안녕하세요, 저는 웹 개발자입니다. 3D 웹 경험을 창출하는 데 관심이 많으며, 
        사용자들에게 독특하고 몰입감 있는 경험을 제공하기 위해 노력하고 있습니다.
        React와 Three.js를 주로 사용하며, 창의적인 프로젝트를 만드는 것을 좋아합니다.
      </Description>
      
      <Title>My Skills</Title>
      <SkillsContainer>
        {skills.map((skill, index) => (
          <SkillBadge key={index}>{skill}</SkillBadge>
        ))}
      </SkillsContainer>
    </AboutContainer>
  )
}

export default AboutMe 