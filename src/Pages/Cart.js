import React, { useState, useEffect, useContext } from 'react';
import './Cart.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Container, Button, Dropdown, Form, Col} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faBars} from '@fortawesome/free-solid-svg-icons';
import { Link} from 'react-router-dom';
import { CartContext } from './CartContext';



function Cart() {
    const { cartItems, clearCart } = useContext(CartContext);
    const [mappedData, setMappedData] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedItems, setSelectedItems] = useState([]);
   

    useEffect(() => {
        if (!selectedProductId || selectedProductId === '') {
            setMappedData([]);
            setSelectedProductId(null);
            setQuantity(1);
        }

        
    }, [selectedProductId]);

    const handleProductSelect = (selectedProduct) => {
        setSelectedProductId(selectedProduct);
        setQuantity(1);

        setMappedData([]);

        if (!selectedProduct || selectedProduct === '') {
            return;
        }


        fetch(`https://localhost:7276/api/Product/${selectedProduct}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                // Egyéb szükséges fejlécek
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                const mappedData = {
                    products: [{
                        type: data.type,
                        serialName: data.serialName,
                        price: data.price
                    }]
                };
                setMappedData([mappedData]);
            })

            .catch(error => {
                console.error('Fetch error:', error);
            });
    };


    const scrollToOrder = () => {
        // Megkeressük az alábbi rendelés fület tartalmazó konténert
        const orderContainer = document.getElementById('orderContainer');

        // Görgetünk az orderContainerhez
        orderContainer.scrollIntoView({ behavior: 'smooth' });
    };

    const handleToggleItem = (item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter(selectedItem => selectedItem !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    
    const handleClearSelectedItems = () => {
        // Kijelölt elemek törlése a kosárból
        const updatedCartItems = cartItems.filter(item => !selectedItems.find(selectedItem => selectedItem === item));
        // Kosár frissítése a kijelölt elemek nélkül
        clearCart(updatedCartItems);
        // Kiürítjük a kijelölt elemek listáját
        setSelectedItems([]);
    };
    
    
    return (

        <div>
            <Container style={{ marginLeft: '363px' }}>
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

            <div className="products-form "  style={{ borderLeft: '5px solid black', height: '100vh', overflowY: 'auto'  }}>
                <div>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Link to="/Products"><h3 className="hover" style={{ marginLeft: '135px', marginTop: '20px', textDecoration: 'underline', border: 'none' }}>Termékek</h3></Link>
                    <Link to="/Cart"><h3 className="hover" style={{ marginLeft: '250px', marginTop: '12px', textDecoration: 'underline', fontSize: '36px' }}>Kosár</h3></Link>
                    <Link to="/Home"><h3 className="hover" style={{ marginLeft: '250px', marginTop: '20px', textDecoration: 'underline',  }}>Főoldal</h3></Link>
                </div>
                    <hr style={{ color: 'black', border: 'none', borderTop: '5px solid', borderRadius: '100%' }} />

                </div>
                
                <div>
            {/* Kosár tartalom */}
                    <div className="basket-container" style={{ height: '200vh', marginLeft: '5%' }}>
                    
                        <div>
                        <h2 style={{textDecoration: 'underline'}}>Kosár tartalma</h2>
                        {cartItems.length === 0 ? (
                            <p>A kosár üres</p>
                        ) : (
                            <div>
                            {cartItems.map((item, index) => (
                                <div key={index} style={{ display: 'table-row', marginBottom: '10px' }}>                                    
                                <div style={{ display: 'table-cell', backgroundColor: 'lightblue', border: '2px solid black', padding: '10px', width: '25%', marginRight: '5px', borderRadius: '15%' }}>     
                                    <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Mennyiség:</p>
                                    <p>{item.quantity} db</p>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item)}
                                        onChange={() => handleToggleItem(item)}
                                    />
                                    </div >
                                    <div style={{ display: 'table-cell', backgroundColor: 'lightblue', border: '2px solid black', padding: '10px', width: '25%', marginRight: '5px', borderRadius: '15%' }}>
                                        <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Ára:</p>
                                        <p>{item.price} Ft</p>
                                    </div>
                                    <div style={{ display: 'table-cell', backgroundColor: 'lightblue', border: '2px solid black', padding: '10px', width: '25%', marginRight: '5px', borderRadius: '15%' }}>
                                        <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Típusa:</p>
                                        <p>{item.type}</p>
                                    </div>
                                    <div style={{ display: 'table-cell', backgroundColor: 'lightblue', border: '2px solid black', padding: '10px', width: '25%', borderRadius: '15%' }}>
                                        <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Széria Név:</p>
                                        <p>{item.serialName}</p>
                                    </div>
                                    
                                </div>
                            ))}
                        </div>
                        )}

                        </div>
                        <button onClick={handleClearSelectedItems} style={{ marginTop: '20px' }}>Kijelöltek törlése</button>
                        <button onClick={scrollToOrder}>Tovább a rendeléshez</button>
                    </div>

                    {/* Rendelés fül */}
                    <div id="orderContainer" className="order-container" style={{ height: '200vh',  marginLeft: '5%'}}>
                       <div className='bg-overlay'>
                        <Container>
                            <Row className="justify-content-center" style={{minHeight: '50vh', width: '50vh', margin:'0 auto'}}>
                            
                                
                                <div className="cart-form">
                                
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

                                        <button style={{backgroundColor: 'Green', color: 'white', width: ' 100%', height: '50px', borderRadius: '50px'}}>Megrendelés</button>

                                    
                                    </Form>

                                </div>
                            

                            
                            </Row>
                        </Container>
                        </div>
                    </div>
                </div>
                
                <div>
            
            
        </div>

            </div>

            
               

        </div>
    );
}

export default Cart;