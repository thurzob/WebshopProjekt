import React, { useState, useContext, useEffect } from 'react';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Row, Container, Form, Dropdown, Nav, Navbar, NavDropdown, NavbarBrand } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import {  AuthContext } from './AuthContext';
import styled from 'styled-components';




const togglePasswordVisibility = () => {
  const passwordInput = document.getElementById('formBasicPassword');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
  } else {
    passwordInput.type = 'password';
  }
};

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

function Login() {
  const navigate = useNavigate();
  const { isLoggedIn, login, logout } = useContext(AuthContext);
  const [backendMessage, setBackendMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(''); 
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    

    if (!formData.email || !formData.password) {
      setFormError('Az email cím és a jelszó mezők kitöltése kötelező.');
      return;
    }

    const requestData = {
      Email: formData.email,
      Password: formData.password
    };

    
    fetch(`https://localhost:7276/auth/login`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 400) {
          return response.json(); // JSON válasz feldolgozása
        } else {
          throw new Error('Network response was not ok');
        }
      }
      return response.json();
    })
    .then(data => {
      if (data && data.token) {
          setToken(data.token); // Token tárolása a globális állapotban
          console.log('Token tárolva:', data.token); // Sikeres tárolás kiírása a konzolra
          login();
          navigate('/Home');
          
        }
      if (data && data.userId) {
          setUserId(data.userId); // UserId tárolása a globális állapotban
          localStorage.setItem('userId', data.userId);
          console.log('userId tárolva:', data.userId); // Sikeres tárolás kiírása a konzolra
          
      }
      if (data && data.backendMessage) {
          setBackendMessage(data.backendMessage); // Backend által visszaadott üzenet beállítása
      }
      console.log(data);
    });
  }


  const handleLogout = () =>{
    logout();
    setToken('');
    setUserId('');
    localStorage.removeItem('userId');

  }

 

  return (
    <div className='Login-body'>
      <Navbar className='my-custom-navbar'  expand='lg'>
      <Container style={{justifyContent: 'end'}}>
        <Navbar.Toggle aria-controls='basic-navbar-nav'   />
        <Navbar.Collapse  id='basic-navbar-nav' className=' justify-content-end'>
          <Nav.Link style={{color: 'bisque'}} as={Link} to='/Home'>
            Főoldal
          </Nav.Link>
          <Nav>
            <Nav.Link style={{color: 'bisque'}} as={Link} to='/Products'>
              Termékek
            </Nav.Link>
            <Nav.Link style={{color: 'bisque'}} href='#'>Kapcsolat</Nav.Link>       
            <Nav.Link style={{color: 'bisque'}} as={Link} to='/Cart'>
              Kosár
            </Nav.Link>
            {!isLoggedIn && (
              <Nav.Link style={{color: 'bisque'}} as={Link} to='/Registration'>
                Regisztráció
              </Nav.Link>
            )}
            {isLoggedIn ? (
              <Nav.Link style={{color: 'bisque'}} as={Link} to='/Login' onClick={handleLogout}>
                Kijelentkezés
              </Nav.Link>
            ) : (
              <NavbarBrand style={{color: 'bisque'}} as={Link} to='/'>
                Bejelentkezés
              </NavbarBrand>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    

    
    <div>
    
      <ResponsiveContainer >
        <ResponsiveRow className="justify-content-center" style={{ width: '50vh', margin: '0 auto', paddingTop: '100px' }}>
          <div  className="login-form">
            <h3 style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Bejelentkezés</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail" style={{ marginBottom: '30px' }}>
                <Form.Label style={{ marginBottom: '2rem' }}>Email cím</Form.Label>
                <Form.Control onChange={handleInputChange} value={formData.email} name="email" type="email" placeholder="Add meg az email címed" />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" style={{ marginBottom: '30px' }}>
                <Form.Label>Jelszó</Form.Label>
                <Form.Control style={{ marginBottom: '2rem' }} onChange={handleInputChange} value={formData.password} name="password" type="password" placeholder="Jelszó" />
                <Form.Text className="text-muted">
                <FontAwesomeIcon
                  style={{ marginLeft: '95%', marginTop: '0%' }}
                  icon={faEye}
                  onMouseDown={togglePasswordVisibility}
                />
                </Form.Text>
                {formError && <div style={{ color: 'red' }}>{formError}</div>}
                {backendMessage && <div style={{ color: 'red' }}>{backendMessage}</div>}
                <Link to="" style={{ marginRight: '200px' }}>Elfelejtette a jelszavát?</Link>
                <Link to="/Registration">Regisztráció</Link>
              </Form.Group>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                  <button style={{ backgroundColor: 'Green', color: 'white', width: ' 100%', height: '50px', borderRadius: '50px', marginBottom: '15px', marginTop: '15px' }}>Bejelentkezés</button>
                </div>
                
                <div>
                  <Link to="/Home">
                    <button style={{ backgroundColor: 'grey', color: 'white', width: ' 100%', height: '50px', borderRadius: '50px' }}>Vissza a főoldalra</button>
                  </Link>
                </div>
              </div>
            </Form>
          </div>
        </ResponsiveRow>
      </ResponsiveContainer>
    </div>
  </div>
  );
}

export default Login;
