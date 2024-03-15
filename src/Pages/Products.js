import React, { useState, useEffect, useContext } from 'react';
import './Products.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Row, Container, Dropdown, Table, Nav, Navbar, NavbarBrand,  } from 'react-bootstrap';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link, NavLink } from 'react-router-dom';
import { useCartContext } from './CartContext';
import {  AuthContext } from './AuthContext';
import styled from 'styled-components';

const ProductContent = styled.div`
  display: grid;
  
  gap: 20px;
  align-items: flex-start;
  text-align: left;
  margin-left: 20%;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    margin-top: 5px;
    margin-left: 25px;
    margin-right: auto;
    max-width: 90%;
    border-left: none;
  }
`;

const ProductImage = styled.img`
  grid-area: 1 / 2;

  @media (max-width: 992px) {
    grid-area: auto;
  }
`;





const HorizontalRule = styled.hr`
    display: none; // Alapértelmezésben a hr elemeket elrejtjük
    @media (min-width: 992px) {
        display: block; // Desktop nézetben megjelenítjük a hr elemeket
        color: red;
        border: none;
        border-top: 5px solid;
        border-radius: 100%;
    }
`;



const ResponsiveNavbar = styled.nav`
    
position: relative;
top: 19%;
width: 100%;

@media (max-width: 992px) {
  justify-content: center;
  text-align: center;
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



function Products() {
    const { addToCart,cartItems, setCartItems } = useCartContext();
    const { isLoggedIn, logout } = useContext(AuthContext);
    const [mappedData, setMappedData] = useState([]);
    const [allmappedData, setAllMappedData] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(''); 
    const [addedToCart, setAddedToCart] = useState(false); // Új állapot az ellenőrzéshez
    const [selectedCategory, setSelectedCategory] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const increaseQuantity = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prevQuantity) => prevQuantity - 1);
        }
    };
    const [formWidth, setFormWidth] = useState('100%');
    

    const loadAllAutomatics = () => {
        fetch('https://localhost:7276/api/Product', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Az összes termékadat feldolgozása
            setAllMappedData(data);
        })
        .catch(error => {
            console.error('Fetch error:', error);
            setAllMappedData([]); // Ha hiba történik, üres tömbre állítjuk
        });
        setMappedData([]);
    };
    
    useEffect(() => {
        const savedCartItems = localStorage.getItem('cartItems');
        if (savedCartItems) {
            setCartItems(JSON.parse(savedCartItems));
        }
    }, []);

    // Kosár mentése a localStorage-be minden cartItems állapot frissítésekor
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        if (!selectedProductId || selectedProductId === '') {
            setMappedData([]);
            setQuantity(1);
        }
    }, [selectedProductId]);

    const handleProductSelect = (selectedProduct) => {
        setSelectedProductId(selectedProduct);
        setQuantity(1);
        setAddedToCart(false); // Reset addedToCart állapot
    
        if (!selectedProduct || selectedProduct === '') {
            return;
        }
    
        fetch(`https://localhost:7276/api/Product/${selectedProduct}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const mappedData = {
                products: [{
                    type: data.type,
                    serialName: data.serialName,
                    price: data.price,
                     // Hozzáadott imageUrl mező
                }]
            };
            setMappedData([mappedData]);
            console.log(mappedData) // Minden esetben beállítjuk a mappedData-t
        })
        .catch(error => {
            console.error('Fetch error:', error);
            setMappedData([]);
        });
    
        // Minden más terméket töröljünk ki az allmappedData állapotból
        setAllMappedData([]);
    };

    
    const handleAddToCart = (quantity) => {
        if (selectedProductId && quantity > 0 && mappedData.length > 0 && !addedToCart) {
            const product = mappedData[0]?.products[0]; // Az első termék elérése
            if (product) {
                const { type, serialName, price } = product;
    
                const alreadyInCartIndex = cartItems.findIndex(
                    (item) => item.productId === parseInt(selectedProductId)
                );
    
                // Ellenőrzi, hogy a termék már benne van-e a kosárban
                if (alreadyInCartIndex !== -1) {
                    const updatedCartItems = [...cartItems];
                    // Megkeressük a terméket a kosárban és növeljük a mennyiségét
                    updatedCartItems[alreadyInCartIndex].quantity += quantity;
                    setCartItems(updatedCartItems);
                    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
                     // Állapot beállítása a további duplikáció megelőzésére
                } else {
                    // Ha még nem szerepel a termék a kosárban, hozzáadjuk
                    const updatedCartItems = [
                        ...cartItems,
                        {
                            productId: parseInt(selectedProductId),
                            quantity, // Itt használjuk a quantity változót
                            price: price || 0,
                            type: type || '',
                            serialName: serialName || '',
                        },
                    ];
                    setCartItems(updatedCartItems);
                    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
                    setAddedToCart(false); // Állapot beállítása a további duplikáció megelőzésére
                }
            }
        }
    };

    const handleAddToCartAll = (product, quantity) => {
        if (product && quantity > 0 && !addedToCart) {
            const { id, type, serialName, price } = product;
    
            const alreadyInCartIndex = cartItems.findIndex(
                (item) => item.productId === parseInt(id)
            );
    
            // Ellenőrzi, hogy a termék már benne van-e a kosárban
            if (alreadyInCartIndex !== -1) {
                const updatedCartItems = [...cartItems];
                // Megkeressük a terméket a kosárban és növeljük a mennyiségét
                updatedCartItems[alreadyInCartIndex].quantity += quantity;
                setCartItems(updatedCartItems);
                localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
                setAddedToCart(false); // Állapot visszaállítása
            } else {
                // Ha még nem szerepel a termék a kosárban, hozzáadjuk
                const updatedCartItems = [
                    ...cartItems,
                    {
                        productId: parseInt(id),
                        quantity, // Itt használjuk a quantity változót
                        price: price || 0,
                        type: type || '',
                        serialName: serialName || '',
                    },
                ];
                setCartItems(updatedCartItems);
                localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
                setAddedToCart(false); // Állapot beállítása a további duplikáció megelőzésére
            }
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
                      
            <div className='products-body ' >
                <Navbar className='my-custom-navbar'  expand='lg'>
                    <Container style={{justifyContent: 'end'}}>
                        <Navbar.Toggle  aria-controls='basic-navbar-nav'/>        
                        <Navbar.Collapse id='basic-navbar-nav' className=' justify-content-end'>                       
                        <Nav>
                            <Nav.Link style={{color: 'bisque'}} as={Link} to='/'>
                                Főoldal
                            </Nav.Link>
                            <NavbarBrand style={{color: 'bisque'}}  as={Link} to='/Products'>
                            Termékek
                            </NavbarBrand>
                            <Nav.Link style={{color: 'bisque'}}  href='#'>Kapcsolat</Nav.Link>      
                            <Nav.Link style={{color: 'bisque'}}  as={Link} to='/Cart'>
                            Kosár
                            </Nav.Link>
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


                
                <div>               
                <ResponsiveContainer> 
                <div className="products-form" style={{borderLeft: '5px solid black' }}>
                
                <div>
                    {/* Új Navbar az űrlap felett */}
                    <Navbar expand="lg" variant="dark" style={{borderRadius: '45px 50px 0 0'}}>                        
                        <Navbar.Toggle style={{marginLeft: '25px'}} aria-controls="basic-navbar-nav" />                  
                        <Navbar.Collapse style={{marginLeft: '25px'}} id="basic-navbar-nav">
                        <Navbar.Brand style={{color:'bisque' ,fontSize: '17px'}} className="ml-2">Termékek:</Navbar.Brand>
                            <Nav className="mr-auto">
                                <Nav.Link style={{color:'bisque'}} as={NavLink} to="" onClick={loadAllAutomatics}>Öntözőautomatikák</Nav.Link>
                                <Nav.Link style={{color:'bisque'}} as={NavLink} to="">Öntözőalkatrészek</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div> 
                              
 
                
                
                
                <div  style={{marginTop: '30px',marginLeft: '25px', marginBottom: '30px'}}> 
                    
                    <select onChange={(e) => handleProductSelect(e.target.value)}>
                        <option value="">Válassz egy Terméket</option>
                        <optgroup label="HUNTER Öntözőautomatikák">
                            <option value="1">HUNTER NODE-BT</option>
                            <option value="2">HUNTER X-CORE</option>
                        </optgroup>
                        <optgroup label="HUNTER Öntözőalkatrészek">
                            <option value="3">HUNTER Rain-Clik</option>
                            <option value="4">HUNTER MP Rotator</option>
                        </optgroup>
                    </select>
                </div>
                {mappedData.length > 0 && (
                    <ProductContent >
                        {mappedData[0]?.products && mappedData[0].products.map((product, index) => (
                            <div key={index}>
                                <div style={{ float: 'left', marginRight: '20px' }}>
                                    {selectedProductId === '1' && (
                                        <img src='https://res.cloudinary.com/dbmrgdyft/image/upload/v1707668947/HunterNode_tn2cla.jpg' alt='NODE-BT' style={{ width: '100%', maxWidth: '150px' }} />
                                    )}
                                    {selectedProductId === '2' && (
                                        <img src='https://res.cloudinary.com/dbmrgdyft/image/upload/v1707667618/HunterXcore_rwnbta.jpg' alt='X-CORE' style={{ width: '100%', maxWidth: '150px' }} />
                                    )}
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Termék típusa: {product.type}</p>
                                    <p style={{ fontSize: '12px', marginBottom: '5px' }}>Széria név: {product.serialName}</p>
                                    <p style={{ fontSize: '12px', marginBottom: '5px' }}>Ár: {product.price} Ft.</p>
                                    <button onClick={decreaseQuantity}>-</button>
                                    <span style={{ margin: '0 10px' }}>{quantity}</span>
                                    <button onClick={increaseQuantity}>+</button>
                                    <button onClick={() => handleAddToCart(quantity)}>Kosárba</button>
                                </div>
                            </div>
                        ))}
                    </ProductContent>
                )}

                {allmappedData.length > 0 &&  (
                    <ProductContent>
                        {allmappedData.map((product, index) => (
                            <div key={index}>
                                <div style={{ float: 'left', marginRight: '20px' }}>
                                {product.id == 1 && (
                                        <img src='https://res.cloudinary.com/dbmrgdyft/image/upload/v1707668947/HunterNode_tn2cla.jpg' alt='NODE-BT' style={{ width: '100%', maxWidth: '150px' }} />
                                    )}
                                {product.id == 2 && (
                                        <img src='https://res.cloudinary.com/dbmrgdyft/image/upload/v1707667618/HunterXcore_rwnbta.jpg' alt='NODE-BT' style={{ width: '100%', maxWidth: '150px' }} />
                                    )}    
                                    
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    
                                    <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Termék típusa: {product.type}</p>
                                    <p style={{ fontSize: '12px', marginBottom: '5px' }}>Széria név: {product.serialName}</p>
                                    <p style={{ fontSize: '12px', marginBottom: '5px' }}>Ár: {product.price} Ft.</p>
                                    <button onClick={decreaseQuantity}>-</button>
                                    <span style={{ margin: '0 10px' }}>{quantity}</span>
                                    <button onClick={increaseQuantity}>+</button>
                                    <button onClick={() => handleAddToCartAll(product ,quantity)}>Kosárba</button>
                                </div>
                            </div>
                        ))}
                    </ProductContent>
                )}
                
                            
            </div>
            </ResponsiveContainer>
            </div>
             
            </div>
        </div>
        
    );
}


export default Products;