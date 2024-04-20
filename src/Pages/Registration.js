import React, { useState, useContext } from 'react';
import './Registration.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Container, Button, Dropdown, Form, Nav, Navbar, NavDropdown, NavbarBrand} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faBars} from '@fortawesome/free-solid-svg-icons';
import { Link} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {  AuthContext } from './AuthContext';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

function Registration() 
{

  const { isLoggedIn, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    email: '',
    password: '',  
    phoneNumber: '', 
    age: ''
    
  });
  const [startDate, setStartDate] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(''); 
  const navigate = useNavigate();
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(e.target.value !== confirmPassword ? 'A két jelszó nem egyezik meg!' : '');
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordError(e.target.value !== password ? 'A két jelszó nem egyezik meg!' : '');
  };

  const togglePasswordVisibility = (fieldId) => {
    const passwordInput = document.getElementById(fieldId);
    if (passwordInput.type === 'password'){
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/;
    return passwordRegex.test(password);
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Ellenőrizd a jelszó megfelelőségét
    if (!validatePassword(formData.password)) {
      setPasswordError('A jelszónak legalább 8 karakter hosszúnak kell lennie, és tartalmaznia kell legalább egy kisbetűt, egy nagybetűt, egy számot és egy speciális karaktert!');
      return;
    }
  
    // Definiáld és töltse fel az üres mezők tömbjét
    const emptyFields = [];
    for (const key in formData) {
      if (formData[key].trim() === '') {
        emptyFields.push(key);
      }
    }
  
    // Ellenőrizd a jelszavak egyezőségét
    if (formData.password !== confirmPassword) {
      setPasswordError('A két jelszó nem egyezik meg!');
      return;
    }
  
    // Ha vannak üres mezők, kiírjuk az üzenetet
    if (emptyFields.length > 0) {
      const emptyFieldsText = emptyFields.map(field => {
        return field === 'username' ? 'Felhasználónév' :
               field === 'fullname' ? 'Teljes név' :
               field === 'email' ? 'Email' :
               field === 'password' ? 'Jelszó' :
               field === 'phoneNumber' ? 'Telefonszám' :
               field === 'age' ? 'Kor' : '';
      }).join(', ');
  
      alert(`A következő mező(k) nem lehet(nek) üres(ek): ${emptyFieldsText}`);
      return;
    }
  
    // További kód...
  
    // Ellenőrizd a jelszavak egyezőségét
    if (password !== confirmPassword) {
      setPasswordError('A két jelszó nem egyezik meg!');
      return;
    }
    
    const requestData = {
      UserName: formData.username,     
      FullName: formData.fullname,
      Name: formData.fullname,
      Email: formData.email,
      Password: formData.password,
      PhoneNumber: formData.phoneNumber,
      Age: formData.age
    }

   

      fetch(`https://localhost:7276/auth/register`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
          // Egyéb szükséges fejlécek
      },
      body: JSON.stringify(requestData)
      
  })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          console.log(data);
          console.log(requestData)
          navigate('/Home');
          
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
    <div >
      <Navbar className='my-custom-navbar'  expand='lg'>
      <Container style={{justifyContent: 'end'}}>
        <Navbar.Toggle  aria-controls='basic-navbar-nav'/>        
        <Navbar.Collapse id='basic-navbar-nav' className=' justify-content-end'>
          <Nav.Link style={{color: 'bisque'}} as={Link} to='/'>
            Főoldal
          </Nav.Link>
          <Nav>
            <Nav.Link style={{color: 'bisque'}}  as={Link} to='/Products'>
              Termékek
            </Nav.Link>
            <Nav.Link style={{color: 'bisque'}}  href='#'>Kapcsolat</Nav.Link>      
            <Nav.Link style={{color: 'bisque'}}  as={Link} to='/Cart'>
              Kosár
            </Nav.Link>
            {isLoggedIn && ( // Megjelenítem a Rendelés fület csak akkor, ha be van jelentkezve a felhasználó
                <Nav.Link style={{ color: 'bisque' }} as={Link} to='/Order'>
                  Rendelés
                </Nav.Link>
              )}
            {!isLoggedIn && (
              <NavbarBrand style={{color: 'bisque'}}  as={Link} to='/Registration'>
                Regisztráció
              </NavbarBrand>
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
          <ResponsiveRow className="justify-content-center" style={{ width: '50vh', margin: '0 auto', paddingTop: '83px' }}>
            <div className="registration-form">
              
              <h3 style={{ textDecoration: 'underline', fontWeight: 'bold', color: 'bisque' }}>Regisztráció</h3>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicUserName" style={{ marginBottom: '5px' }}>
                  <Form.Label style={{ marginBottom: '10px', color: 'bisque' }}>Felhasználónév</Form.Label>
                  <Form.Control  onChange={handleInputChange} name='username' value={formData.username} type="text" placeholder="Felhasználónév" />
                </Form.Group>

                <Form.Group controlId="formBasicFullName" style={{ marginBottom: '5px' }}>
                  <Form.Label style={{ marginBottom: '10px', color: 'bisque' }}>Teljes név</Form.Label>
                  <Form.Control  onChange={handleInputChange} name='fullname' value={formData.fullname} type="text" placeholder="Teljes név" />
                </Form.Group>

                <Form.Group controlId="formBasicEmail" style={{ marginBottom: '5px' }}>
                  <Form.Label style={{ marginBottom: '5px', color: 'bisque' }}>Email</Form.Label>
                  <Form.Control  onChange={handleInputChange} name='email' value={formData.email} type="email" placeholder="Email cím" />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" style={{ marginBottom: '5px' }}>
                  <Form.Label style={{color: 'bisque'}}>Jelszó</Form.Label>
                  <Form.Control
                    name='password'
                    type="password"
                    placeholder="Add meg a jelszót"
                    value={formData.password}
                    onChange={(e) => {
                      handlePasswordChange(e);
                      handleInputChange(e);
                    }}
                  />
                   <FontAwesomeIcon
                      style={{marginLeft: '95%', marginTop: '0%'}}
                      icon={faEye}
                      onClick={() => togglePasswordVisibility('formBasicPassword')} // Módosítva
                    />
                  
                </Form.Group>

                <Form.Group controlId="formBasicConfirmPassword" style={{ marginBottom: '10px' }}>
                <Form.Label style={{color: 'bisque'}}>Jelszó újra</Form.Label>
                  <Form.Control
                    name='confirmPassword'
                    type="password"
                    placeholder="Add meg újra a jelszót"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                   <Form.Text className="text-muted">
                   <FontAwesomeIcon
                    style={{marginLeft: '95%', marginTop: '0%'}}
                    icon={faEye}
                    onClick={() => togglePasswordVisibility('formBasicConfirmPassword')} 
                    /> 
                    </Form.Text>
                  {passwordError && <div style={{ color: 'red', marginTop: '5px' }}>{passwordError}</div>}
                </Form.Group>

                <Form.Group controlId="formBasicnumber" style={{ marginBottom: '10px' }}>
                <Form.Label style={{color: 'bisque'}}>Add meg a telefonszámod</Form.Label>
                <div style={{ display: 'flex' }}>
                  <div style={{textAlign: 'center', marginRight: '5px', padding: '5px', backgroundColor: 'white', borderRadius: '5px', height: '38px' }}>+36</div>
                  <Form.Control
                    name='phoneNumber'
                    type="phone"
                    placeholder="Add meg a telefonszámod"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                 </div>
                  
                </Form.Group>

                <Form.Group controlId="formBasicAge" style={{ marginBottom: '10px'  }}>
                  <Form.Label style={{ marginBottom: '10px', color: 'bisque' }}>Kor</Form.Label>
                  <Form.Control style={{width: '50px', marginRight: '15px', padding: '5px', backgroundColor: 'white', borderRadius: '5px', height: '38px' }}  onChange={handleInputChange} name='age' value={formData.age} type="text" placeholder="Kor" />
                </Form.Group>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div>
                    
                      <button
                      type='submit'
                        style={{

                          backgroundColor: 'blue',
                          color: 'bisque',
                          width: ' 100%',
                          height: '50px',
                          borderRadius: '50px',
                          marginBottom: '15px',
                          marginTop: '15px',
                        }}
                      >
                        Regisztráció
                      </button>
                    
                  </div>

                  <div>
                    <Link to="/Home">
                      <button
                        style={{
                          backgroundColor: 'grey',
                          color: 'bisque',
                          width: ' 100%',
                          height: '50px',
                          borderRadius: '50px',
                        }}
                      >
                        Vissza a főoldalra
                      </button>
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



export default Registration;