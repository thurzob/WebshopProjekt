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
  const [startDate, setStartDate] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(e.target.value !== confirmPassword ? 'A két jelszó nem egyezik meg!' : '');
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordError(e.target.value !== password ? 'A két jelszó nem egyezik meg!' : '');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError('A két jelszó nem egyezik meg!');
      return;
    }
    // Itt lehetőséged van a jelszavakat elküldeni vagy más műveleteket végrehajtani
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
              <Link className="nav-link navbar-brand text-center" to="/Login">
                Bejelentkezés
              </Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Link className="nav-link navbar-brand text-center" to="/Registration">
                Regisztráció
              </Link>
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
                <Form.Group controlId="formBasicEmail" style={{ marginBottom: '10px' }}>
                  <Form.Label style={{ marginBottom: '10px' }}>Név</Form.Label>
                  <Form.Control type="name" placeholder="Add meg a neved" />
                </Form.Group>

                <Form.Group controlId="formBasicEmail" style={{ marginBottom: '10px' }}>
                  <Form.Label style={{ marginBottom: '5px' }}>Email</Form.Label>
                  <Form.Control type="email" placeholder="Add meg az email címed" />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" style={{ marginBottom: '10px' }}>
                  <Form.Label>Jelszó</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Add meg a jelszót"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicConfirmPassword" style={{ marginBottom: '10px' }}>
                  <Form.Control
                    type="password"
                    placeholder="Add meg újra a jelszót"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                  {passwordError && <div style={{ color: 'red', marginTop: '5px' }}>{passwordError}</div>}
                </Form.Group>

                <Form.Group>
                  <Form.Label>Születési dátum</Form.Label>
                  <div style={{ marginBottom: '20px' }}>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Válassz egy dátumot"
                    />
                  </div>
                </Form.Group>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div>
                    <Link to="/Home">
                      <button
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
                    </Link>
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