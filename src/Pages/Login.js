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
import { jwtDecode } from 'jwt-decode';


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
  const [role, setRole] = useState(''); 
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    // Töröljük az űrlap többi részét
    setFormData({
      email: '',
      password: ''
    });
    setFormError('');
    setBackendMessage('');
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let decoded;
    

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
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Hálózati hiba történt');
    }
  })
  .then(data => {
    const decodedToken = jwtDecode(data.token);
    console.log('Decoded Token:', decodedToken);
    setToken(data.token);
    console.log('Token tárolva:', data.token);
    login();
    navigate('/Home');
  
    // Ha a token tartalmazza a userId-t, akkor beállítjuk a globális állapotban
    if (decodedToken && decodedToken.sub) {
      setUserId(decodedToken.sub);
      localStorage.setItem('userId', decodedToken.sub);
      console.log('userId tárolva:', decodedToken.sub);
    } else {
      console.log('A token nem tartalmaz felhasználó azonosítót');
    }
  
    // Role beállítása
    if (decodedToken && decodedToken.role) {
      setRole(decodedToken.role);
      localStorage.setItem('role', decodedToken.role);
      console.log('role tárolva:', decodedToken.role);
      

    } else {
      console.log('A token nem tartalmaz role azonosítót');
    }
      // A többi adatot is kezeld megfelelően, ha szükséges


    if (data && data.userId) {
         // Sikeres tárolás kiírása a konzolra
    }
    if (data && data.backendMessage) {
      setBackendMessage(data.backendMessage); // Backend által visszaadott üzenet beállítása
    } else {
      setBackendMessage('Hibás felhasználónév vagy jelszó'); // Ha nincs backendMessage, akkor a hibaüzenetet állítsuk be
    }
    console.log(data);
    })
    .catch(error => {
      console.error('Fetch error:', error);
      setBackendMessage('Hibás jelszó vagy felhasználónév!');
    });
}
  
const handleSendPasswordReset = async () => {
  
  const requestData = {
    email: email,
    updatesPassword: 'string' // Itt helyettesítse be az új jelszót vagy az új jelszóhoz tartozó adatot
    };
    // Küldj egy POST kérést a szervernek az új jelszó kérésével
    fetch(`https://localhost:7276/auth/reset-password`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
          // Egyéb szükséges fejlécek
      },
      body: JSON.stringify(requestData),
      
  })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          console.log(data);
          console.log(email);
          if(data && data.message) {
            setMessage(data.message);
        } else {
            setMessage('Elküldtük emailben az új jelszót.');
        }
          
      })

      .catch(error => {
          console.error('Fetch error:', error);
           // Állapot nullázása hiba esetén
      });
   
  };

 
 

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
            {isLoggedIn && ( // Megjelenítem a Rendelés fület csak akkor, ha be van jelentkezve a felhasználó
                <Nav.Link style={{ color: 'bisque' }} as={Link} to='/Order'>
                  Rendelés
                </Nav.Link>
              )}
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
    
    <ResponsiveContainer>
          <ResponsiveRow className="justify-content-center" style={{ width: '50vh', margin: '0 auto', paddingTop: '100px' }}>
            <div className="login-form">
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
                  <Link onClick={handleForgotPasswordClick} to="#" style={{ marginRight: '200px' }}>Elfelejtette a jelszavát?</Link>
                  <Link to="/Registration">Regisztráció</Link>
                  </Form.Group>
                  {showForgotPassword && (
                  <div>
                    <Form>
                      <p style={{fontSize: '17px',color: 'red'}}>A jelszó visszaállításához adja meg az email címét</p>
                      {message && <div style={{fontSize: '17px',marginBottom: '5px', color: 'green'}}>{message}</div>}
                      <Form.Group controlId="formBasicEmail">
                        <Form.Control type="email" placeholder="Adja meg az email címét" onChange={handleEmailChange} />
                      </Form.Group>
                      <button type='button' style={{marginTop: '5px', borderRadius: '15%'}} onClick={handleSendPasswordReset}>Küldés</button>
                      
                    </Form>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div>
                    <button  style={{ backgroundColor: 'Green', color: 'white', width: ' 100%', height: '50px', borderRadius: '50px', marginBottom: '15px', marginTop: '15px' }}>Bejelentkezés</button>
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
