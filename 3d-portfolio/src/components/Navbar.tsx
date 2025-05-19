import { NavLink } from 'react-router-dom';
import { styled } from 'styled-components';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 2rem;
  background-color: rgba(5, 8, 22, 0.9);
  backdrop-filter: blur(10px);
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  cursor: pointer;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const StyledNavLink = styled(NavLink)`
  color: #aaa6c3;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #ffffff;
  }
  
  &.active {
    color: #8352FD;
  }
`;

const Navbar = () => {
  return (
    <NavContainer>
      <Logo>
        <NavLink to="/" style={{ color: '#ffffff', textDecoration: 'none' }}>
          3D Portfolio
        </NavLink>
      </Logo>
      
      <NavLinks>
        <StyledNavLink to="/" end>
          Home
        </StyledNavLink>
        <StyledNavLink to="/about">
          About
        </StyledNavLink>
        <StyledNavLink to="/projects">
          Projects
        </StyledNavLink>
        <StyledNavLink to="/contact">
          Contact
        </StyledNavLink>
        <StyledNavLink to="/example">
          Example
        </StyledNavLink>
        <StyledNavLink to="/scroll">
          Scroll
        </StyledNavLink>
      </NavLinks>
    </NavContainer>
  );
};

export default Navbar; 