import React from 'react';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Container, Button, Dropdown, Form} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faBars  } from '@fortawesome/free-solid-svg-icons';
import { Link, Navigate, useNavigate  } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const togglePasswordVisibility = () => {
  const passwordInput = document.getElementById('formBasicPassword');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
  } else {
    passwordInput.type = 'password';
  }
};




function Login() {
  return (
    <div className='login-body'>
      <Container>   
            <Dropdown>
            <Dropdown.Toggle>
                <FontAwesomeIcon icon={faBars} size='2x' />
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item>
                    <Link className="nav-link navbar-brand text-center" to="/Login">Bejelentkezés</Link>
                </Dropdown.Item>
                <Dropdown.Item> 
                    <Link className="nav-link navbar-brand text-center" to="/Registration">Regisztráció</Link>
                </Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
        </Container> 

       <div className="bg-overlay">
      <Container>
        <Row className="justify-content-center" style={{minHeight: '50vh', width: '50vh', margin:'0 auto'}}>
          
            <div className="login-form">
              <h3>Bejelentkezés</h3>
              <Form>
                <Form.Group controlId="formBasicEmail" style={{marginBottom: '30px'}}>
                  <Form.Label style={{marginBottom: '10px'}}>Email cím</Form.Label>
                  <Form.Control type="email" placeholder="Add meg az email címed" />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" style={{marginBottom: '30px'}}>
                  <Form.Label>Jelszó</Form.Label>
                  <Form.Control type="password" placeholder="Jelszó"/>
                  <Form.Text className="text-muted">
                  <FontAwesomeIcon style={{marginLeft: '95%', marginTop: '0%'}} icon={faEye} onClick={togglePasswordVisibility}/>
                  </Form.Text>
                  <Form.Label style={{marginRight: '30%'}}>Elfelejtette a jelszavát?</Form.Label>
                  
                  <Form.Label>Regisztráció</Form.Label>
                </Form.Group>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                <div>
                  <Link to="/Home">
                    <button style={{backgroundColor: 'Green', color: 'white', width: ' 100%', height: '50px', borderRadius: '50px', marginBottom: '10px', marginTop: '15px'}}>Bejelentkezés</button>
                  </Link>
                </div>
                  
                <div>
                  <Link to="/Home">
                    <button style={{backgroundColor: 'grey', color: 'white', width: ' 100%', height: '50px', borderRadius: '50px'}}>Vissza a főoldalra</button>
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

export default Login;