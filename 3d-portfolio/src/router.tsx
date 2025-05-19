import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import LandingPage from './pages/LandingPage';
import AboutMe from './pages/AboutMe';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Example3D from './pages/Example3D';
import ScrollPage from './pages/ScrollPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: 'about',
        element: <AboutMe />
      },
      {
        path: 'projects',
        element: <Projects />
      },
      {
        path: 'contact',
        element: <Contact />
      },
      {
      path: 'example',
      element: <Example3D />
      },
      {
        path: 'scroll',
        element: <ScrollPage />
      }
    ]
  },
]);

export default router; 