import { styled } from 'styled-components'

const ProjectsContainer = styled.div`
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`

const Title = styled.h2`
  font-size: 3rem;
  margin-bottom: 2rem;
  color: #ffffff;
`

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`

const ProjectCard = styled.div`
  background-color: #151030;
  padding: 1.5rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 0 25px rgba(131, 82, 253, 0.3);
  }
`

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #ffffff;
`

const ProjectDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #aaa6c3;
  margin-bottom: 1rem;
`

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`

const Tag = styled.span`
  background-color: #050816;
  color: #ffffff;
  padding: 0.3rem 0.8rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
`

const Projects = () => {
  const projects = [
    {
      title: '3D 인터랙티브 웹사이트',
      description: 'Three.js와 React를 활용한 3D 인터랙티브 웹 경험 프로젝트',
      tags: ['React', 'Three.js', 'WebGL']
    },
    {
      title: '포트폴리오 웹사이트',
      description: '개인 포트폴리오 웹사이트로, 리액트와 애니메이션 라이브러리를 활용했습니다',
      tags: ['React', 'Styled Components', 'Framer Motion']
    },
    {
      title: '3D 제품 시각화',
      description: '제품을 3D로 시각화하고 사용자가 상호작용할 수 있는 웹 애플리케이션',
      tags: ['Three.js', 'React', 'TypeScript']
    }
  ];
  
  return (
    <ProjectsContainer>
      <Title>My Projects</Title>
      <ProjectsGrid>
        {projects.map((project, index) => (
          <ProjectCard key={index}>
            <ProjectTitle>{project.title}</ProjectTitle>
            <ProjectDescription>{project.description}</ProjectDescription>
            <TagsContainer>
              {project.tags.map((tag, tagIndex) => (
                <Tag key={tagIndex}>{tag}</Tag>
              ))}
            </TagsContainer>
          </ProjectCard>
        ))}
      </ProjectsGrid>
    </ProjectsContainer>
  )
}

export default Projects 