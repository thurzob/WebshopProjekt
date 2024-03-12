import React, { useContext, useState } from 'react';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Dropdown, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import {  AuthContext } from './AuthContext';
import styled from 'styled-components';

import 'normalize.css';
library.add(faBars);



function Home()
{
    

    const { isLoggedIn, logout } = useContext(AuthContext);
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(''); 

    const handleLogout = () =>{
        logout();
        setToken('');
        setUserId('');
        localStorage.removeItem('userId');
    
      }

    const ResponsiveNavbar = styled.nav`
    
    position: relative;
    top: 19%;
    width: 100%;

    @media (max-width: 992px) {
      background-color: lightblue;
    }
  `;

  const NavbarUl = styled.ul`
    display: flex;
    justify-content: space-between;
    text-align: right;  /* Szöveg jobbra igazítása */

    @media (max-width: 992px) {
      flex-direction: column;
    }
  `;

  const NavbarLi = styled.li`
    margin-left: 1rem;
    
    @media (max-width: 992px) {
      margin-left: 0;
    }
  `;

  const NavbarLink = styled(Link)`
    font-size: 1.2rem;
    
    @media (max-width: 992px) {
      font-size: 1rem;
    }
  `;
    

    return(
      <div className='Home-body'>
      <Navbar className='my-custom-navbar'  expand='lg'>
      <Container style={{justifyContent: 'end'}}>
        <Navbar.Toggle  aria-controls='basic-navbar-nav'/>        
        <Navbar.Collapse id='basic-navbar-nav' className=' justify-content-end'>
          <Navbar.Brand style={{color: 'bisque'}} as={Link} to='/'>
            Főoldal
          </Navbar.Brand>
          <Nav>
            <Nav.Link style={{color: 'bisque'}}  as={Link} to='/Products'>
              Termékek
            </Nav.Link>
            <Nav.Link style={{color: 'bisque'}}  href='#'>Kapcsolat</Nav.Link>      
            <Nav.Link style={{color: 'bisque'}}  as={Link} to='/Cart'>
              Kosár
            </Nav.Link>
            {!isLoggedIn && (
              <Nav.Link style={{color: 'bisque'}}  as={Link} to='/Registration'>
                Regisztráció
              </Nav.Link>
            )}
            {isLoggedIn ? (
              <Nav.Link style={{color: 'bisque'}} as={Link} to='/Login' onClick={handleLogout}>
                Kijelentkezés
              </Nav.Link>
            ) : (
              <Nav.Link style={{color: 'bisque'}} as={Link} to='/Login'>
                Bejelentkezés
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
       
      </Container>
    </Navbar>
    </div>    
);
}
export default Home;