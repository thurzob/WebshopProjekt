import React, { useEffect, useState, useContext } from 'react';
import './Order.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Container, Button, Dropdown, Form, Nav, Navbar, NavDropdown, NavbarBrand} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faBars} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { useCartContext } from './CartContext';
import {  AuthContext } from './AuthContext';
import styled from 'styled-components';

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
  margin-top: 50px;

  @media (max-width: 992px) {
    justify-content: center;
    display: flex;
    align-items: center;
    margin-top: calc(100px + 10px); /* A navbar magassága + némi extra tér */
  }
`;


const ResponsiveRow = styled(Row)`
@media (max-width: 992px) {
justify-content: center;
}
`;

const ResponsiveForm = styled(Form)`
  width: 100%; /* Az űrlap szélessége legyen 100% */
`;

function Order() {
  const { cartItems, clearCart } = useCartContext();
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [orderSent, setOrderSent] = useState(false);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const roles = localStorage.getItem('role');
  useEffect(() => {
    if (!userId) {
      const urlParams = new URLSearchParams(window.location.search);
      const userIdFromUrl = urlParams.get('userId');
      if (userIdFromUrl) {
        setUserId(userIdFromUrl);
      }
    }
  }, [userId]);

 
  

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
      const storedUserId = localStorage.getItem('userId');
      let postData= [];

     
      cartItems.forEach(item => {
        fetch('https://localhost:7276/api/Merchant', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                UserId: storedUserId,
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
            console.log('Szerver válasza:', data); 
            const responseData = data;
            
            return fetch('https://localhost:7276/api/Purchase', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "billingName": billingName,
                   "billingPostalCode": billingPostalCode,
                   "billingAddress": billingAddress,
                    "email": email,
                   "postalCode": postalCode,
                   "deliveryAddress": deliveryAddress,
                   "phoneNumber": phoneNumber,
                   "tidid": responseData,
                    UserId: storedUserId
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Ide kerülhet a második fetch válaszának kezelése, ha szükséges
            })
            .catch(error => {
                console.error('Purchase API fetch error:', error); 
                console.log(billingName,
                  billingPostalCode,
                  billingAddress,
                  email,
                  postalCode,
                  deliveryAddress,
                  phoneNumber,
                  responseData,
                  storedUserId)
            });
        })
        .catch(error => {
            console.error('Merchant API fetch error:', error); 
        });
    
        clearCart();
    });
        
                 
            
                
                
               
    
        setOrderSent(true);

     
        const userId = localStorage.getItem('userId');
        console.log('id:' + userId)
        fetch(`https://localhost:7276/api/User/${userId}/CreateOrderStatus`, {
          method: 'POST',
          mode: 'cors',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
                // Egyéb szükséges fejlécek
          },
          body: JSON.stringify({ OrderStatus: 'Megrendelés alatt', id: userId })
          
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
     <Navbar className='my-custom-navbar'  expand='lg'>
                    <Container style={{justifyContent: 'end'}}>
                        <Navbar.Toggle  aria-controls='basic-navbar-nav'/>        
                        <Navbar.Collapse id='basic-navbar-nav' className=' justify-content-end'>                       
                        <Nav> 
                            <Nav.Link style={{color: 'bisque'}}  as={Link} to='/Home'>
                            Főolal
                            </Nav.Link>
                            <Nav.Link style={{color: 'bisque'}} as={Link} to='/Products'>
                            Termékek
                            </Nav.Link>  
                                 
                            <Nav.Link style={{color: 'bisque'}}  as={Link} to='/Cart'>
                            Kosár
                            </Nav.Link>
                            {isLoggedIn && ( // Megjelenítem a Rendelés fület csak akkor, ha be van jelentkezve a felhasználó
                            <NavbarBrand style={{ color: 'bisque' }} as={Link} to='/Order'>
                            Rendelés
                            </NavbarBrand>
                            )}
                            {isLoggedIn && roles.includes('ADMIN') && ( // Csak akkor jelenítjük meg az Admin fület, ha a felhasználó admin
                              <Nav.Link style={{ color: 'bisque' }} as={Link} to='/Admin'>
                                Admin
                              </Nav.Link>
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

        
      
               
     {/* Rendelés fül */}
     <div  className="order-container" style={{ height: '200vh',  marginLeft: '5%'}}>
        <div className='bg-overlay'>
            <ResponsiveContainer>
                <ResponsiveRow className="justify-content-center" style={{minHeight: '50vh', width: '50vh', margin:'0 auto'}}>              
                    <div  className="order-form">                               
                    <h2 style={{paddingTop: '5%', textDecoration: 'underline', color: 'bisque'}}>Rendelés</h2>
                    <ResponsiveForm onSubmit={handleOrder}>
                    <Form.Group   controlId="formBasicBillingName" style={{marginBottom: '30px'}}>
                    <Form.Label style={{marginBottom: '10px', color: 'bisque'}}>Számlázási név</Form.Label>
                    <Form.Control name='billingName' style={{}} type="text" placeholder="Add meg a számlázási nevet" />
                    </Form.Group>
                    <Form.Label style={{color: 'bisque'}}>Számlázási cím</Form.Label>
                    <Form.Group controlId="formBasicBillingPostalCode" style={{marginBottom: '30px', display: 'flex'}}>
                    <Form.Control name='billingPostalCode' style={{marginRight : '2%', width: '60px'}} type="text" placeholder="Irányítószám"/>
                    <Form.Control name='billingAddress' style={{}} type="text" placeholder="Add meg a számlázási címet"/>
                    </Form.Group>

                    <Form.Group controlId="formBasicBillingEmail" style={{marginBottom: '30px'}}>
                    <Form.Label style={{color: 'bisque'}}>Email cím</Form.Label>
                    <Form.Control name='email' style={{}} type="email" placeholder="Add meg az email címed"/>
                    </Form.Group>

                    <Form.Label style={{color: 'bisque'}}>Szállítási cím</Form.Label>
                    <Form.Group controlId="formBasicAddress" style={{marginBottom: '30px', display: 'flex'}}>                  
                    <Form.Control name='postalCode' style={{marginRight : '2%', width: '60px'}} type="text" placeholder="Irányítószám"/>
                    <Form.Control name='deliveryAddress' style={{}} type="text" placeholder="Add meg a szállítási cím"/>
                    </Form.Group>

                    <Form.Group controlId="formBasicBillingPhoneNumber" style={{marginBottom: '30px'}}>
                    <Form.Label style={{color: 'bisque'}}>Telefonszám</Form.Label>
                    <Form.Control name='phoneNumber' style={{}} type="tel" placeholder="Add meg a telefonszámot"/>
                    </Form.Group>

                    <button  
                    style={{
                      color: 'bisque',
                      width: '100%',
                      backgroundColor: 'Green',
                      color: 'white',
                      height: '50px',
                      borderRadius: '50px',
                      marginBottom: ' 15px'
                      }}>
                      Megrendelés
                      </button>
                    <div>
                    <Link to="/Home">
                      <button
                        style={{
                          color: 'bisque',
                          width: '100%',
                          backgroundColor: 'grey',
                          color: 'white',   
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
                          color: 'bisque',
                          width: '100%',
                          backgroundColor: 'black',
                          color: 'white',                         
                          height: '50px',
                          borderRadius: '50px',
                        }}
                      >
                        Vissza
                      </button>
                    </Link>
                  </div>              
                    </ResponsiveForm>
                </div>              
            </ResponsiveRow>
        </ResponsiveContainer>
    </div>
    </div>
</div>

  );
}

export default Order;