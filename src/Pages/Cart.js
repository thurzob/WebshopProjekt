import React, { useState, useEffect, useContext } from 'react';
import './Cart.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Container, Button, Dropdown, Form, Col} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faBars} from '@fortawesome/free-solid-svg-icons';
import { Link} from 'react-router-dom';
import { CartContext } from './CartContext';
import { useAuth } from './AuthContext';



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
    // Állapot az oldal aljára görgetés ellenőrzésére

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

        <div id="bottomOfPage">
        <div>
            <Container style={{ marginLeft: '300px' }}>
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
                <div>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <h3  style={{ marginLeft: '120px', marginTop: '20px', textDecoration: 'underline', border: 'none' }}>
                        <Link className="hover" to="/Products">Termékek</Link>
                    </h3>
                    <h3  style={{ marginLeft: '250px', marginTop: '15px', textDecoration: 'underline' , fontSize: '36px' }}>
                        <Link className="hover" to="/Cart">Kosár</Link>
                    </h3>
                    <h3  style={{ marginLeft: '250px', marginTop: '20px', textDecoration: 'underline' }}>
                        <Link className="hover" to="/Home">Főoldal</Link>
                    </h3>
                </div>
                    <hr style={{ color: 'black', border: 'none', borderTop: '5px solid', borderRadius: '100%' }} />

                </div>
                
                <div>
            {/* Kosár tartalom */}
                    <div className="basket-container" style={{ height: '200vh', marginLeft: '5%' }}>
                    
                        <div >
                        <h2 style={{textDecoration: 'underline'}}>Kosár tartalma</h2>
                        {cartItems.length === 0 ? (
                            <p>A kosár üres</p>
                        ) : (
                            <div>
                            {cartItems && cartItems.length > 0 && cartItems.map((item, index) => (
                                <div key={index} style={{ display: 'table-row', marginBottom: '10px' }}>                                    
                                <div style={{ display: 'table-cell', backgroundColor: 'lightblue', border: '2px solid black', padding: '10px', width: '25%', marginRight: '5px', borderRadius: '15%' }}>     
                                    <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Mennyiség:</p>
                                    <p>{item.quantity} db</p>
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
                                        style={{ width: '50px' }}
                                    />
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
                        
                        
                        {!isLoggedIn && (
                        <h3 style={{ marginLeft: '400px', marginTop: '20px', color: 'black'  }}>
                           A rendeléshez <Link className="hover" to="/Login" style={{textDecoration: 'underline'}} >jelentkezzen</Link> be vagy ha még nincs fiókja <Link className="hover" to="/Registration" style={{textDecoration: 'underline'}}>regisztráljon</Link>
                        </h3>

                        
                        )}
                        {isLoggedIn && (
                        <h3 style={{ marginLeft: '250px', marginTop: '20px', textDecoration: 'underline' }}>
                            <Link className="hover" to="/Order" style={{ marginLeft: '25%' }}>Tovább a rendeléshez</Link>
                        </h3>
)}
                    
                    </div>

                   
                
            
            
                </div>

            </div>

            
               

        </div>
        </div>
    );
}

export default Cart;