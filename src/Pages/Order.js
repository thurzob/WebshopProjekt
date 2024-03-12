import React, { useEffect, useState, useContext } from 'react';
import './Order.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Container, Button, Dropdown, Form} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faBars} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { useCartContext } from './CartContext';
import {  AuthContext } from './AuthContext';




function Order() {
  const { cartItems, clearCart, userId: initialUserId, setUserId: setInitialUserId } = useCartContext();
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [orderSent, setOrderSent] = useState(false);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(initialUserId || '');

  useEffect(() => {
    if (!initialUserId) {
      const urlParams = new URLSearchParams(window.location.search);
      const userIdFromUrl = urlParams.get('userId');
      if (userIdFromUrl) {
        setUserId(userIdFromUrl);
      }
    }
  }, [initialUserId]);

  const handleLogin = (userId) => {
    localStorage.setItem('userId', userId);
    setUserId(userId);

    // A bejelentkezés utáni frissítés helyett:
    // Frissítsd a komponens állapotát a bejelentkezett felhasználó adataival

    // Példa:
    // setLoggedIn(true);
    // setUserData(data); // A bejelentkezési API-ból kapott felhasználói adatok

  };

  const handleOrder = (event) => {
    event.preventDefault();
    if (!orderSent && cartItems.length > 0) {
      const formData = new FormData(event.target);
      const billingName = formData.get('billingName');
      const billingPostalCode = formData.get('billingPostalCode')
      const billingAddress = formData.get('billingAddress');
      const email = formData.get('email');
      const postalCode = formData.get('postalCode');
      const deliveryAddress = formData.get('deliveryAddress');
      const phoneNumber = formData.get('phoneNumber');

      

      fetch('https://localhost:7276/api/Purchase', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            billingName,
            billingPostalCode,
            billingAddress,
            email,
            postalCode,
            deliveryAddress,
            phoneNumber,
            UserId: userId
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log(data); // sikeres válasz naplózása a konzolon
          // további teendők a sikeres válasz esetén
          
          cartItems.forEach(item => {
            fetch('https://localhost:7276/api/Merchant', {
              method: 'POST',
              mode: 'cors',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                userId: userId,
                serialName: item.serialName,
                type: item.type,
                price: item.price,
                productId: item.productId,
                quantity: item.quantity
              })
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              console.log(data); // sikeres válasz naplózása a konzolon
              // további teendők a sikeres válasz esetén
              clearCart();
            })
            .catch(error => {
              console.error('Fetch error:', error); // hibaüzenet naplózása a konzolon
              console.log('Elküldött adatok:', {
                userId: userId,
                serialName: item.serialName,
                type: item.type,
                price: item.price,
                productId: item.productId,
                quantity: item.quantity
              });
            });
          });
      
          setOrderSent(true);

         
        })
        .catch(error => {
          console.error('Fetch error:', error); // hibaüzenet naplózása a konzolon
          console.log('Elküldött adatok:', {
            billingName,
            billingPostalCode,
            billingAddress,
            email,
            postalCode,
            deliveryAddress,
            phoneNumber,
            UserId: userId
          });
        });
      
    
    }
    

  };

  const handleLogout = () =>{
    logout();
    setToken('');
    setUserId('');
    localStorage.removeItem('userId');

  }


  return (
    <div>
      <Container>   
            <Dropdown>
            <Dropdown.Toggle>
                <FontAwesomeIcon icon={faBars} size='2x' />
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item>
              {isLoggedIn ? (
                <Link className="nav-link navbar-brand text-center" onClick={handleLogout} to="/Home">Kijelentkezés</Link>
              ) : (
                <Link className="nav-link navbar-brand text-center" to="/Login">Bejelentkezés</Link>
              )}
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

        
        <div className="products-form "  style={{ borderLeft: '5px solid black', overflowY: 'auto' }}>
               
     {/* Rendelés fül */}
     <div  className="order-container" style={{ height: '200vh',  marginLeft: '5%'}}>
        <div style={{marginRight: '10%', marginTop: '-25px'}} className='bg-overlay'>
            <Container>
                <Row className="justify-content-center" style={{minHeight: '50vh', width: '50vh', margin:'0 auto'}}>              
                    <div  className="order-form">                               
                    <h2 style={{paddingTop: '5%', textDecoration: 'underline'}}>Rendelés</h2>
                    <Form onSubmit={handleOrder}>
                    <Form.Group   controlId="formBasicBillingName" style={{marginBottom: '30px', width: '46.5vh'}}>
                    <Form.Label style={{marginBottom: '10px'}}>Számlázási név</Form.Label>
                    <Form.Control name='billingName' style={{width: '98.5%'}} type="text" placeholder="Add meg a számlázási nevet" />
                    </Form.Group>
                    <Form.Label>Számlázási cím</Form.Label>
                    <Form.Group controlId="formBasicBillingPostalCode" style={{marginBottom: '30px', display: 'flex'}}>
                    <Form.Control name='billingPostalCode' style={{marginRight : '2%', width: '15%'}} type="text" placeholder="Irányítószám"/>
                    <Form.Control name='billingAddress' style={{width: '100%'}} type="text" placeholder="Add meg a számlázási címet"/>
                    </Form.Group>

                    <Form.Group controlId="formBasicBillingEmail" style={{marginBottom: '30px', width: '46.5vh'}}>
                    <Form.Label>Email cím</Form.Label>
                    <Form.Control name='email' style={{width: '98.5%'}} type="email" placeholder="Add meg az email címed"/>
                    </Form.Group>

                    <Form.Label>Szállítási cím</Form.Label>
                    <Form.Group controlId="formBasicAddress" style={{marginBottom: '30px', display: 'flex'}}>                  
                    <Form.Control name='postalCode' style={{marginRight : '2%', width: '15%'}} type="text" placeholder="Irányítószám"/>
                    <Form.Control name='deliveryAddress' style={{ width: '100%'}} type="text" placeholder="Add meg a szállítási cím"/>
                    </Form.Group>

                    <Form.Group controlId="formBasicBillingPhoneNumber" style={{marginBottom: '30px', width: '46.5vh'}}>
                    <Form.Label>Telefonszám</Form.Label>
                    <Form.Control name='phoneNumber' style={{width: '98.5%'}} type="tel" placeholder="Add meg a telefonszámot"/>
                    </Form.Group>

                    <button  style={{backgroundColor: 'Green', color: 'white', width: ' 100%', height: '50px', borderRadius: '50px', marginBottom: ' 15px'}}>Megrendelés</button>
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
</div>
  );
}

export default Order;