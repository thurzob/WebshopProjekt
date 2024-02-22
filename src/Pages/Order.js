import React from 'react';
import './Order.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Container, Button, Dropdown, Form} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faBars} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';





function Order() 
{
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
                <Dropdown.Item> 
                    <Link className="nav-link navbar-brand text-center" to="/Cart">Kosár</Link>
                </Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
        </Container> 


 
     {/* Rendelés fül */}
     <div  className="order-container" style={{ height: '200vh',  marginLeft: '5%'}}>
        <div className='bg-overlay'>
            <Container>
                <Row className="justify-content-center" style={{minHeight: '50vh', width: '50vh', margin:'0 auto'}}>
              
                    <div className="order-form">
                                
                    <h2 style={{paddingTop: '5%', textDecoration: 'underline'}}>Rendelés</h2>
                    <Form>
                    <Form.Group   controlId="formBasicEmail" style={{marginBottom: '30px', width: '46.5vh'}}>
                    <Form.Label style={{marginBottom: '10px'}}>Számlázási név</Form.Label>
                    <Form.Control type="name" placeholder="Add meg a számlázási nevet" />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword" style={{marginBottom: '30px', width: '46.5vh'}}>
                    <Form.Label>Számlázási cím</Form.Label>
                    <Form.Control type="address" placeholder="Add meg a számlázási címet"/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword" style={{marginBottom: '30px', width: '46.5vh'}}>
                    <Form.Label>Email cím</Form.Label>
                    <Form.Control type="billing" placeholder="Add meg az email címed"/>
                    </Form.Group>
                    <Form.Label>Szállítási cím</Form.Label>
                    <Form.Group controlId="formBasicPassword" style={{marginBottom: '30px', display: 'flex'}}>                  
                    <Form.Control style={{marginRight : '2%', width: '15%'}} type="Address" placeholder="Irányítószám"/>
                    <Form.Control style={{ width: '100%'}} type="Address" placeholder="Utca, Házszám"/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword" style={{marginBottom: '30px', width: '46.5vh'}}>
                    <Form.Label>Telefonszám</Form.Label>
                    <Form.Control type="phone" placeholder="Add meg a telefonszámot"/>
                    </Form.Group>

                    <button style={{backgroundColor: 'Green', color: 'white', width: ' 100%', height: '50px', borderRadius: '50px', marginBottom: ' 15px'}}>Megrendelés</button>
                    <div>
                    <Link to="/Home">
                      <button
                        style={{
                          backgroundColor: 'grey',
                          color: 'white',
                          width: ' 100%',
                          height: '50px',
                          borderRadius: '50px',
                          marginBottom: ' 15px'
                        }}
                      >
                        Vissza a főoldalra
                      </button>
                    </Link>
                  </div>    

                  <div>
                    <Link to="/Cart">
                      <button
                        style={{
                          backgroundColor: 'black',
                          color: 'white',
                          width: ' 100%',
                          height: '50px',
                          borderRadius: '50px',

                        }}
                      >
                        Vissza
                      </button>
                    </Link>
                  </div>              
                    </Form>
                </div>              
            </Row>
        </Container>
    </div>
</div>
</div>
  );
}

export default Order;