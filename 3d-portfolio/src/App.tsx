import { Outlet } from 'react-router-dom'
import { styled } from 'styled-components'
import Navbar from './components/Navbar'

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  overflow: hidden;
  background-color: #050816;
  color: #ffffff;
`

const ContentContainer = styled.div`
  padding-top: 70px; // Nav 높이만큼 여백 추가
`

function App() {
  return (
    <AppContainer>
      <Navbar />
      <ContentContainer>
        <Outlet />
      </ContentContainer>
    </AppContainer>
  )
}

export default App
