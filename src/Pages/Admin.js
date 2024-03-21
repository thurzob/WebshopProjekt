import React, { useState, useEffect, useContext } from 'react';
import './Admin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Row, Container, Dropdown, Table, Nav, Navbar, NavbarBrand, Form, Button  } from 'react-bootstrap';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link, NavLink } from 'react-router-dom';
import { useCartContext } from './CartContext';
import {  AuthContext } from './AuthContext';
import styled from 'styled-components';


const ResponsiveContainer = styled(Container)`
@media (max-width: 992px) {
justify-content: center;
display: flex;
align-items: center;


}
`;

const ResponsiveRow = styled(Row)`
@media (max-width: 992px) {
justify-content: center;

}
`;

function Admin(){

  
  const { isLoggedIn, login, logout } = useContext(AuthContext);    
  const [backendMessage, setBackendMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(''); 
  const [role, setRole] = useState(''); 
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const roles = localStorage.getItem('role');
  const handleLogout = () =>{
    logout();
    setToken('');
    setUserId('');
    localStorage.removeItem('userId');

  }

  return(
<div>
  <Navbar className='my-custom-navbar'  expand='lg'>
      <Container style={{justifyContent: 'end'}}>
          <Navbar.Toggle  aria-controls='basic-navbar-nav'/>        
          <Navbar.Collapse id='basic-navbar-nav' className=' justify-content-end'>                       
            <Nav>
              <Nav.Link style={{color: 'bisque'}}  as={Link} to='/Home'>
                Főolal
              </Nav.Link>    
              <Nav.Link style={{color: 'bisque'}}  as={Link} to='/Products'>
                Termékek
              </Nav.Link>
              <Nav.Link style={{color: 'bisque'}}  href='#'>
                Kapcsolat
              </Nav.Link>      
              <Nav.Link style={{color: 'bisque'}} as={Link} to='/Cart'>
                Kosár
              </Nav.Link>
              {isLoggedIn && ( // Megjelenítem a Rendelés fület csak akkor, ha be van jelentkezve a felhasználó
              <Nav.Link style={{ color: 'bisque' }} as={Link} to='/Order'>
                Rendelés
              </Nav.Link>
              )}
              {isLoggedIn && roles.includes('ADMIN') && ( // Csak akkor jelenítjük meg az Admin fület, ha a felhasználó admin
              <NavbarBrand style={{ color: 'bisque' }} as={Link} to='/Admin'>
                Admin
              </NavbarBrand>
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
<div>
  
  <ResponsiveContainer> 
    <div className="admin-form" style={{borderLeft: '5px solid black' }}>             
      <div>
      {/* Új Navbar az űrlap felett */}
        <Navbar expand="lg" variant="dark" style={{borderRadius: '45px 50px 0 0'}}>                        
          <Navbar.Toggle style={{marginLeft: '25px'}} aria-controls="basic-navbar-nav" />                  
          <Navbar.Collapse style={{marginLeft: '25px'}} id="basic-navbar-nav">
            <Navbar.Brand style={{color:'bisque'}} className="ml-2">
              Rendelések
            </Navbar.Brand>
            <Nav className="mr-auto">
            <Nav.Link style={{color:'bisque'}} as={NavLink} to="" ></Nav.Link>
            <Nav.Link style={{color:'bisque'}} as={NavLink} to=""></Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div> 
       <Form>
        <Form.Row>
          <Form.Group controlId="formName">
            <Form.Label>Név</Form.Label>
            <Form.Control type="text" placeholder="Név alapján szűrés" />
          </Form.Group>

          <Form.Group  controlId="formDate">
            <Form.Label>Dátum</Form.Label>
            <Form.Control type="date" placeholder="Dátum alapján szűrés" />
          </Form.Group>

          <Form.Group  controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Email alapján szűrés" />
          </Form.Group>
        </Form.Row>

        <Button variant="primary" type="submit">
          Szűrés
        </Button>
      </Form>          



    </div>
  </ResponsiveContainer>
    
</div>
</div>  
  
  
  
)
  
}

export default Admin;