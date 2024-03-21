import React, { useState, useEffect, useContext } from 'react';
import './Cart.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Container, Button, Form, Col, Dropdown, Table, Nav, Navbar, NavbarBrand,} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faBars} from '@fortawesome/free-solid-svg-icons';
import { Link} from 'react-router-dom';
import { CartContext } from './CartContext';
import { useAuth } from './AuthContext';
import styled from 'styled-components';



const ResponsiveCartTitle = styled.h1`
    font-size: 2rem;
    margin-top: 10px;
    color: bisque;
    margin-left: -10px;
    @media (max-width: 992px) {
        font-size: 1.5rem;
    }
`;

const ProductContent = styled.div`
  
  gap: 20px;
  text-align: left;
  margin-left: 20%;

  @media (max-width: 992px) {
    /* Meglévő stílusok */
    margin-top: 5px;
    margin-left: 25px;
    margin-right: auto;
    max-width: 90%;
    border-left: none;
    grid-area: auto;

    /* Oszlopos elrendezés beállítása */
    display: flex;
    flex-direction: column;
  }
`;



const ProductImage = styled.img`
    float: right;
    width: 25%;    
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


function Cart() {
    
    const { cartItems,setCartItems, clearCart } = useContext(CartContext);
    const [mappedData, setMappedData] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedItems, setSelectedItems] = useState([]);
    const [scrolledToBottom, setScrolledToBottom] = useState(false);
    const { isLoggedIn,setIsLoggedIn, logout } = useAuth();
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState(''); 
    const [productId, setProductId] = useState(null);
    const roles = localStorage.getItem('role');
    const productImages = {
        productId1: 'https://res.cloudinary.com/dbmrgdyft/image/upload/v1707668947/HunterNode_tn2cla.jpg',
        productId2: 'https://res.cloudinary.com/dbmrgdyft/image/upload/v1707667618/HunterXcore_rwnbta.jpg',
        // Egyéb termék azonosítók és URL-ek
    };
    

    useEffect(() => {
        // Betöltéskor ellenőrizd, hogy van-e tárolt autentikációs állapot a localStorage-ban
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setIsLoggedIn(true);
            setUserId(storedUserId);
        }
    }, []);


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
        const orderContainer = document.getElementById('orderContainer');
        if (orderContainer) {
            orderContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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
        const updatedCartItems = cartItems.filter(item => !selectedItems.includes(item));
        // Kosár frissítése a kijelölt elemek nélkül
        setCartItems(updatedCartItems);
        // Kiürítjük a kijelölt elemek listáját
        setSelectedItems([]);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                // Ha az oldal aljára görgetünk
                setScrolledToBottom(true);
            } else {
                // Ha nem az oldal alján vagyunk
                setScrolledToBottom(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
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
                            <Nav.Link style={{color: 'bisque'}} as={Link} to='/Cart'>
                            Termékek
                            </Nav.Link>  
                            <Nav.Link style={{color: 'bisque'}}  href='#'>Kapcsolat</Nav.Link>      
                            <NavbarBrand style={{color: 'bisque'}}  as={Link} to='/Products'>
                            Kosár
                            </NavbarBrand>
                            {isLoggedIn && ( // Megjelenítem a Rendelés fület csak akkor, ha be van jelentkezve a felhasználó
                            <Nav.Link style={{ color: 'bisque' }} as={Link} to='/Order'>
                            Rendelés
                            </Nav.Link>
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

                <ResponsiveContainer>                     
            <div className="cart-form"  style={{ borderLeft: '5px solid black', overflowY: 'auto' }}>

            <div>
                    {/* Új Navbar az űrlap felett */}
                    <Navbar  variant="dark" style={{borderRadius: '45px 50px 0 0'}}>                        
                        <Navbar.Toggle style={{marginLeft: '25px'}} aria-controls="basic-navbar-nav" />                  
                        <Navbar.Collapse style={{marginLeft: '25px'}} id="basic-navbar-nav">
                        <ResponsiveCartTitle>Kosárban lévő termékek</ResponsiveCartTitle>
                            
                        </Navbar.Collapse>
                    </Navbar>
                </div> 
                
            <div>
            {/* Kosár tartalom */}
                    <div className="basket-container" style={{ height: 'auto', marginLeft: '5%', marginTop: '15px' }}>
                    
                    <div className="cart-container">
                            {cartItems.length === 0 ? (
                                <p className="empty-cart-message">A kosár üres</p>
                            ) : (
                                <div className="cart-items-container">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="cart-item">
                                        
                                    <div className="cart-item-details">
                                    <ProductImage src={productImages[`productId${item.productId}`]} alt="Product Image" />
                                    </div>                                   
                                    <div className="cart-item-details">
                                        <p className="item-info"><span>Típusa:</span> {item.type}</p>
                                    </div>
                                    <div className="cart-item-details">
                                        <p className="item-info"><span>Széria Név:</span> {item.serialName}</p>
                                    </div>
                                    <div className="cart-item-details">
                                        <p className="item-info"><span>Ára:</span> {item.price} Ft / db</p>
                                    </div>
                                    <p className="item-info"><span>Mennyiség:</span> {item.quantity} db</p>
                                        <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => {
                                            const newQuantity = parseInt(e.target.value);
                                            if (!isNaN(newQuantity) && newQuantity > 0) {
                                            const updatedCartItems = [...cartItems];
                                            updatedCartItems[index].quantity = newQuantity;
                                            setCartItems(updatedCartItems);
                                            }
                                        }}
                                        className="quantity-input"
                                        />
                                        <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item)}
                                        onChange={() => handleToggleItem(item)}
                                        className="item-checkbox"
                                        />
                                    </div>
                                ))}
                                </div>
                            )}
                            </div>
                        <button onClick={handleClearSelectedItems} style={{ marginTop: '20px' }}>Kijelöltek törlése</button>
                        
                        
                        <div>
                        {!isLoggedIn && (
                            <div style={{ marginLeft: '0%', marginTop: '20px', color: 'black', fontSize: '16px' }}>
                            A rendeléshez <Link className="hover" to="/Login" style={{ textDecoration: 'underline' }}>jelentkezzen</Link> be, vagy ha még nincs fiókja <Link className="hover" to="/Registration" style={{ textDecoration: 'underline' }}>regisztráljon</Link>
                            </div>
                        )}
                        {isLoggedIn && (
                            <h3 style={{ marginLeft: '5%', marginTop: '20px', textDecoration: 'underline', fontSize: '16px' }}>
                            <Link className="hover" to="/Order">Tovább a rendeléshez</Link>
                            </h3>
                        )}
                        </div>
                    
                    </div>

                   
                
            
            
                </div>
                              
            </div>
            </ResponsiveContainer>                 
            
               

        </div>
        
    );
}

export default Cart;