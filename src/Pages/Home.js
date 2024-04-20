import React, { useContext, useState, useEffect } from 'react';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Dropdown, Nav, Navbar, NavDropdown, NavbarBrand, Row, Col,  } from 'react-bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import {  AuthContext } from './AuthContext';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';



library.add(faBars);



function Home()
{
   
    const { isLoggedIn, logout } = useContext(AuthContext);
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(''); 
    const roles = localStorage.getItem('role');
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
                        <Nav>
                        <NavbarBrand style={{color: 'bisque'}}  as={Link} to='/Home'>
                            Főolal
                            </NavbarBrand>
                            
                            <Nav.Link style={{color: 'bisque'}}  as={Link} to='/Products'>
                            Termékek
                            </Nav.Link>
                            <Nav.Link style={{color: 'bisque'}}  href='#'>Kapcsolat</Nav.Link>      
                            <Nav.Link style={{color: 'bisque'}} as={Link} to='/Cart'>
                                Kosár
                            </Nav.Link>
                            {isLoggedIn && ( // Megjelenítem a Rendelés fület csak akkor, ha be van jelentkezve a felhasználó
                            <Nav.Link style={{ color: 'bisque' }} as={Link} to='/Order'>
                            Rendelés
                            </Nav.Link>
                            )}
                            {isLoggedIn && roles.includes('ADMIN') && ( // Csak akkor jelenítjük meg az Admin fület, ha a felhasználó admin
                              <Nav.Link style={{ color: 'bisque' }} as={Link} to='/Admin'>
                                Admin
                              </Nav.Link>
                            )}
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

                <div style={{marginTop: '100px'}}>          
                <h2 style={{ textAlign: 'center', color: 'bisque',textShadow: '2px 2px 5px rgba(0, 0, 0, 1)' }}>Üdvözöljük a oldalunkon! Kínálatunkban számos kerti öntözőrendszer alkatrészt találhat, amelyek segítségével díszkertjét gyönyörűen és hatékonyan locsolhatja.</h2>
                <h3 style={{textDecoration: 'underline', marginLeft: '10px', color: 'bisque', textShadow: '2px 2px 5px rgba(0, 0, 0, 1)'}}>Szolgáltatásaink:</h3>
                <ul style={{color: 'bisque',textShadow: '2px 2px 5px rgba(0, 0, 0, 1)'}}>
                  <li>
                  <h4>Kertépítés, gondozás </h4>       
                  </li>
                  <li >
                  <h4>Automata öntözőrendszer tervezés, kivitelezés   </h4>   
                  </li>
                  <li>
                  <h4>Füvesítés, gyepszőnyeg telepítés </h4>    
                  </li>
                  <li>
                  <h4>Egész éves gyepkarbantartás  </h4>    
                  </li>
                </ul>
                </div>  
                <h3 style={{textDecoration: 'underline', color: 'bisque', marginLeft: '10px',textShadow: '2px 2px 5px rgba(0, 0, 0, 1)'}}>Elérhetőségeink: </h3>
                <ul style={{color: 'bisque',textShadow: '2px 2px 5px rgba(0, 0, 0, 1)'}}>
                  <li>
                  <h4>+36/70 4212294</h4>       
                  </li>
                  <li>
                  <h4>+36/70 5303055</h4>       
                  </li>
                  <li>
                  <h4>Email: thurzobence98@gmail.com</h4>       
                  </li>
                </ul>           

                <div style={{marginTop: '10%'}} className='Home-body'>  
                <Container fluid>
                  <Row gutter={0}>
                  
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <img style={{width: '100%', height: 'auto', border: '2px solid bisque', margin: '0 30px 60px 0'}} src="kert1.jpg" alt="Kert 1" />
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <img style={{width: '100%', height: 'auto', border: '2px solid bisque', margin: '60px 30px 0 30px'}} src="kert2.jpg" alt="Kert 2" />
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <img style={{width: '100%', height: 'auto', border: '2px solid bisque', margin: '0 30px 60px 0'}} src="kert3.jpg" alt="Kert 3" />
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <img style={{width: '100%', height: 'auto', border: '2px solid bisque', margin: '60px 30px 0 -20px'}} src="kert4.jpg" alt="Kert 4" />
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <img style={{width: '100%', height: 'auto', border: '2px solid bisque', margin: '0 30px 60px 0'}} src="kert5.jpg" alt="Kert 5" />
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <img style={{width: '100%', height: 'auto', border: '2px solid bisque', margin: '60px 30px 0 30px'}} src="kert6.jpg" alt="Kert 6" />
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <img style={{width: '100%', height: 'auto', border: '2px solid bisque', margin: '0 30px 60px 0'}} src="kert7.jpg" alt="Kert 7" />
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <img style={{width: '100%', height: 'auto', border: '2px solid bisque', margin: '60px 30px 0 -20px'}} src="kert8.jpg" alt="Kert 6" />
                    </Col>
                  </Row>
                </Container>
              </div>

    </div>    
);
}
export default Home;