import React, { useState } from 'react';
import './Registration.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Container, Button, Dropdown, Form} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faBars} from '@fortawesome/free-solid-svg-icons';
import { Link} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';



function Registration() 
{
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',  
    phoneNumber: '', 
    birthDate: null,
  });
  const [startDate, setStartDate] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

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
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError('A két jelszó nem egyezik meg!');
      return;
    }
    
    const requestData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      birthDate: formData.birthDate
    }

    fetch(`https://localhost:7276/api/User`, {
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
          
      })

      .catch(error => {
          console.error('Fetch error:', error);
           // Állapot nullázása hiba esetén
      });
   
  };
  

  
  return (
    <div>
      <Container>
        <Dropdown>
          <Dropdown.Toggle>
            <FontAwesomeIcon icon={faBars} size="2x" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>
              <Link className="nav-link navbar-brand text-center" to="/Login">Bejelentkezés</Link>
                
            </Dropdown.Item>
            <Dropdown.Item>
              <Link className="nav-link navbar-brand text-center" to="/Registration">Regisztráció</Link>          
            </Dropdown.Item>
            <Dropdown.Item>
              <Link className="nav-link navbar-brand text-center" to="/Cart">Kosár</Link>          
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>

      <div className="bg-overlay">
        <Container>
          <Row className="justify-content-center" style={{ minHeight: '50vh', width: '50vh', margin: '0 auto' }}>
            <div className="registration-form">
              
              <h3 style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Regisztráció</h3>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicName" style={{ marginBottom: '10px' }}>
                  <Form.Label style={{ marginBottom: '10px' }}>Név</Form.Label>
                  <Form.Control  onChange={handleInputChange} name='name' value={formData.name} type="text" placeholder="Add meg a neved" />
                </Form.Group>

                <Form.Group controlId="formBasicEmail" style={{ marginBottom: '10px' }}>
                  <Form.Label style={{ marginBottom: '5px' }}>Email</Form.Label>
                  <Form.Control  onChange={handleInputChange} name='email' value={formData.email} type="email" placeholder="Add meg az email címed" />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" style={{ marginBottom: '10px' }}>
                  <Form.Label>Jelszó</Form.Label>
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
                <Form.Label>Jelszó újra</Form.Label>
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
                <Form.Label>Add meg a telefonszámod</Form.Label>
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

                <Form.Group>
                  <Form.Label>Születési dátum</Form.Label>
                  <div style={{ marginBottom: '20px' }}>
                  <Form.Control
                    value={formData.birthDate}
                    as={DatePicker}
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date); // Frissíti a startDate állapotot a kiválasztott dátummal
                      handleInputChange({ target: { name: 'birthDate', value: date} });
                    }}
                    dateFormat="yyyy-MM-dd"
                    placeholder="Válassz egy dátumot"
                    />
                  </div>
                </Form.Group>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div>
                    
                      <button
                      type='submit'
                        style={{
                          backgroundColor: 'blue',
                          color: 'white',
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
                          color: 'white',
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
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Registration;