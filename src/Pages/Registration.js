import React, { useState } from 'react';
import './Registration.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Container, Button, Dropdown, Form} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faBars} from '@fortawesome/free-solid-svg-icons';
import { Link} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const togglePasswordVisibility = () => {
  const passwordInput = document.getElementById('formBasicPassword');
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
  } else {
    passwordInput.type = 'password';
  }
};




function Registration() 
{
  const [startDate, setStartDate] = useState(null);  
  return (

    <div>
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
          
                <div className="registration-form">
                    <h3 style={{textDecoration: 'underline', fontWeight: 'bold'}}>Regisztráció</h3>
                    <Form>
                        <Form.Group controlId="formBasicEmail" style={{marginBottom: '10px'}}>
                            <Form.Label style={{marginBottom: '10px'}}>Név</Form.Label>
                            <Form.Control type="name" placeholder="Add meg a neved" />
                        </Form.Group>

                        <Form.Group controlId="formBasicEmail" style={{marginBottom: '10px'}}>
                            <Form.Label style={{marginBottom: '5px'}}>Email</Form.Label>
                            <Form.Control type="email" placeholder="Add meg az email címed" />
                        </Form.Group>

                    

                        <Form.Group controlId="formBasicEmail formBasicDate" style={{marginBottom: '-15px'}}>
                            <Form.Label>Jelszó</Form.Label>
                            <Form.Control type="password" placeholder="Add meg a jelszót" />
                            <Form.Control style={{marginTop: '10px'}} type="password" placeholder="Add meg újra a jelszót" />
                            <FontAwesomeIcon style={{marginLeft: '95%', marginTop: '0%'}} icon={faEye} onClick={togglePasswordVisibility}/>
                        </Form.Group>

                        <Form.Group>  
                            <Form.Label>Születési dátum</Form.Label>
                            <div style={{marginBottom: '20px'}}>
                            <DatePicker 
                                selected={startDate} // Állítsd be a kiválasztott dátumot a state-ből vagy változóból
                                onChange={(date) => setStartDate(date)} // Állítsd be a kiválasztott dátumot
                                dateFormat="yyyy-MM-dd" // Választhatod a megfelelő dátumformátumot
                                placeholderText="Válassz egy dátumot"                        
                            />
                            </div>     
                        </Form.Group>

                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div>
                            <Link to="/Home">
                                <button style={{backgroundColor: 'blue', color: 'white', width: ' 100%', height: '50px', borderRadius: '50px', marginBottom: '15px', marginTop: '15px'}}>Regisztráció</button>
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

export default Registration;