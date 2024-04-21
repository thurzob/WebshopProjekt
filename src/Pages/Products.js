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
    width: 100%;    
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
flex-direction: column;
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
    const roles = localStorage.getItem('role');
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
                            <Nav.Link style={{color: 'bisque'}}  as={Link} to='/Home'>
                            Főolal
                            </Nav.Link>
                            <NavbarBrand style={{color: 'bisque'}}  as={Link} to='/Products'>
                            Termékek
                            </NavbarBrand>
                            <Nav.Link style={{color: 'bisque'}}  href='#'>Kapcsolat</Nav.Link>      
                            <Nav.Link style={{color: 'bisque'}} as={Link} to='/Cart'>
                                Kosár
                            </Nav.Link>
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
                                <Nav.Link style={{color:'bisque'}} as={NavLink} to="" onClick={loadAllAutomatics}>Öntözőalkatrészek</Nav.Link>
                                
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div> 
                              
 
                
                
                
                <div  style={{marginTop: '30px',marginLeft: '25px', marginBottom: '30px', display: 'flex'}}>           
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
                <hr style={{color: 'red',borderWidth: '5px', borderRadius: '100% 0 0 0'}}></hr>
                {mappedData.length > 0 && (
                    
                    <ProductContent >
                        
                        {mappedData[0]?.products && mappedData[0].products.map((product, index) => (
                            <div key={index}>
                                <div style={{ marginRight: '20px', display: 'flex' }}>
                                {selectedProductId === '1' && (
                                    <div className="container">
                                        <div className="row">
                                        <div className="col-sm-12">
                                            <div className="d-flex">
                                            <img src="https://res.cloudinary.com/dbmrgdyft/image/upload/v1707668947/HunterNode_tn2cla.jpg" alt="NODE-BT" style={{ width: '150%', maxWidth: '250px' }} className="img-fluid" />
                                            </div>
                                        </div>
                                        <div className="col-sm-12">
                                            <div>
                                            <p style={{ marginTop: '15px' }}>
                                                Évszakhoz igaztás: 0-150%-ig az öntözés időtartama 10% lépésekben könnyedén állítható az aktuális időjárásnak megfelelően<br/>
                                                3 különböző program többszöri indítással, mely a legkülönbözőbb öntözési igényeket is kielégíti<br/>
                                                Az öntözési napok szabadon választhatók ki, a hét bármely napjai, páros vagy páratlan napok, vagy maximum 31 naponként ismétlődő ciklusok szerint<br/>
                                                Szünetmentes memória: Hálózatkimaradás esetén tökéletes védelmet nyújt, megőrzi a pontos időt, napot és a programot.<br/>
                                                Egyszerűen kezelhető: a forgókapcsolónak és a gomboknak köszönhetően<br/>
                                                Távirányítható: ROAM-KIT segítségével a kert bármely pontjáról elindítható az öntözés<br/>
                                                Automatikus vezérlés: a Solar-Sync funkciónak köszönhetően<br/>
                                                Esőérzékelő: zónánként be-, illetve kikapcsolható<br/>
                                            </p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    )}
                                    {selectedProductId === '2' && (
                                        <div className="container">
                                        <div className="row">
                                        <div className="col-sm-12">
                                            <div className="d-flex">
                                        <img src='https://res.cloudinary.com/dbmrgdyft/image/upload/v1707667618/HunterXcore_rwnbta.jpg' alt='X-CORE' style={{ width: '150%', maxWidth: '250px' }} />
                                        </div>
                                        </div>
                                        <div className="col-sm-12">
                                        <div> 
                                        <p  style={{marginLeft: '15px'}}>
                                        Évszakhoz igaztás: 0-150%-ig az öntözés időtartama 10% lépésekben könnyedén állítható az aktuális időjárásnak megfelelően
                                        3 különböző program többszöri indítással, mely a legkülönbözőbb öntözési igényeket is kielégíti
                                        Az öntözési napok szabadon választhatók ki, a hét bármely napjai, páros vagy páratlan napok, vagy maximum 31naponként ismétlődő ciklusok szerin
                                        Szünetmentes memória: Hálózatkimaradás esetén tökéletes védelmet nyújt, megőrzi a pontos időt, napot és a programot.
                                        Egyszerűen kezelhető: a forgókapcsolónak és a gomboknak köszönhetően
                                        Távirányítható: ROAM-KIT segítségével a kert bármely pontjáról elindítható az öntözés
                                        Automatikus vezérlés: a Solar-Sync funkciónak köszönhetően
                                        Esőérzékelő: zónánként be-, illetve kikapcsolható
                                        </p>  
                                        </div>
                                        </div>
                                        </div>
                                    </div> 
                                    )}
                                    {selectedProductId === '3' && (
                                        <div className="container">
                                        <div className="row">
                                        <div className="col-sm-12">
                                            <div className="d-flex">
                                        <img src='https://res.cloudinary.com/dbmrgdyft/image/upload/v1713613603/rain_clik_1_of_1_rt2_jjkkoo.jpg' alt='Rain-Click' style={{ width: '150%', maxWidth: '250px' }} />
                                        </div>
                                        </div>
                                        <div className="col-sm-12">
                                        <div> 
                                        <p  style={{marginLeft: '15px'}}>
                                        HUNTER RAIN-CLIK esőérzékelő (Quick Response™)
                                        HUNTER RAIN-CLIK esőérzékelő feladata, hogy amikor elkezd esni az eső,
                                        vagy pedig túl vagyunk egy komolyabb záporon, blokkolja az öntözőrendszert
                                        a vezérlőn keresztül azáltal, hogy megszakítja az áramkört. Amint az érzékelőben
                                        lévő szövetkorongok kiszáradnak, a mikrokapcsoló újra zár és ismét elindulhat az öntözés.
                                        A RAIN-CLIK esőérzékelő csomagjában megtalálhatóak a felszereléshez szükséges rögzítőcsavarok.
                                        Több esőérzékelőtől eltérően nem kell beállítani rajta a lezárást, mivel önmagát szabályozza.
                                        </p>  
                                        </div>
                                        </div>
                                        </div>
                                    </div>   
                                    )}
                                    {selectedProductId === '4' && (
                                        <div className="container">
                                        <div className="row">
                                        <div className="col-sm-12">
                                            <div className="d-flex">
                                        <img src='https://res.cloudinary.com/dbmrgdyft/image/upload/v1713613905/87793796_vngzku.jpg' alt='MP Rotator' style={{ width: '150%', maxWidth: '250px' }} />
                                        </div>
                                        </div>
                                        <div className="col-sm-12">
                                        <div> 
                                        <p  style={{marginLeft: '15px'}}>
                                        A Hunter MP Rotátor fúvóka egy speciálisan forgó szórófej, amely az öntözni kívánt felületen 3 szintű vízsugaraival
                                        biztosítja a számunkra oly fontos egyenletes lefedetséget. Működése közben impozáns látványt nyújtanak a forgó vízsugarak, 
                                        amint járják táncukat üde zöld pázsitunk felett.
                                        A Hunter ezen csúcsterméke nemcsak látványos működésével tűnik ki, hanem gazdaságos üzemeltetések is számos előnyt rejt,
                                        mivel kis vízfogyasztású, ezért öntözőrendszerünket gazdaságosabban állíthatjuk össze, kevesebb zónával tervezhetünk és ezáltal
                                        sok pénzt takaríthatunk meg. Akár azt is megtehetjük, hogy a régi elhasználódott vízpazarló vá vált spray zónáinkat, ezzel a fúvóka
                                        családdal váltjuk ki, mivel a rotátor nagyrészt ugyanabban a tartományban dolgozik, mint a spray fejek. Sokszor azaz előny is társul
                                        hozzá, hogy ásás és a szerelvények megbontása nélkül, pusztán a fúvókák cseréjével, az alacsonyabb vízfogyasztású, mégis jobb lefedetségű
                                        öntözőrendszer elérhetővé válik. Azt teszi ezt lehetővé, hogy az MP Rotátor fúvóka több szórófejházzal is kompatibilis, azokba können
                                        beszerelhető. Ma már kijelenthetük, hogy a házikertek öntözése elképzelhetetlen a rotátoros szórófejek használata nélkül.
                                        A HUNTER Rotátor MP1000 2,5-4,6m, 90° - 210° típus kevesebb mint fele annyi vízmennyiségből képes megoldani az öntözést, mint a hagyományos
                                        szórófej típusok. A Hunter Industries csúcstermékeinek számítanak ezek az öntözőrendszer alkatrészek, hiszen a legeffektívebb és legtakarékosabb
                                        öntözést valósítják meg a kertünkben.
                                       
                                        </p>  
                                        </div>
                                        </div>
                                        </div>
                                    </div> 
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
                                <div style={{ marginRight: '20px', }}>
                                {product.id == 1 && (
                                        <div className="card mb-3" style={{ maxWidth: '800px' }}>
                                        <div className="row g-0">
                                          <div className="col-md-4">
                                            <img src="https://res.cloudinary.com/dbmrgdyft/image/upload/v1707668947/HunterNode_tn2cla.jpg" alt="NODE-BT" className="img-fluid" style={{ maxWidth: '100%', height: 'auto' }} />
                                          </div>
                                          <div className="col-md-8">
                                            <div className="card-body">
                                              <p className="card-text">
                                                Évszakhoz igaztás: 0-150%-ig az öntözés időtartama 10% lépésekben könnyedén állítható az aktuális időjárásnak megfelelően<br/>
                                                3 különböző program többszöri indítással, mely a legkülönbözőbb öntözési igényeket is kielégíti<br/>
                                                Az öntözési napok szabadon választhatók ki, a hét bármely napjai, páros vagy páratlan napok, vagy maximum 31 naponként ismétlődő ciklusok szerint<br/>
                                                Szünetmentes memória: Hálózatkimaradás esetén tökéletes védelmet nyújt, megőrzi a pontos időt, napot és a programot.<br/>
                                                Egyszerűen kezelhető: a forgókapcsolónak és a gomboknak köszönhetően<br/>
                                                Távirányítható: ROAM-KIT segítségével a kert bármely pontjáról elindítható az öntözés<br/>
                                                Automatikus vezérlés: a Solar-Sync funkciónak köszönhetően<br/>
                                                Esőérzékelő: zónánként be-, illetve kikapcsolható<br/>
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}      
                                {product.id == 2 && (
                                     <div className="card mb-3" style={{ maxWidth: '1000px' }}>
                                     <div className="row g-0">
                                       <div className="col-md-4">
                                        <img src='https://res.cloudinary.com/dbmrgdyft/image/upload/v1707667618/HunterXcore_rwnbta.jpg' alt='NODE-BT' style={{ width: '100%', maxWidth: '300px'}} />
                                        </div>
                                          <div className="col-md-8">
                                            <div className="card-body">
                                              <p className="card-text">
                                            A villamos hálózattól távol lévő, elszigetelt területek és csepegtető körök különleges igényei számára kínál a Hunter tökéletes,
                                            gazdaságos megoldást. A NODE 400-at gyorsan és könnyen föl lehet szerelni egy szelep szolenoidjára, csavarok, fúrók vagy 
                                            kábelbekötések nélkül. Az egység szilárd felépítése révén a szelepakna mostoha körülményei között is működik. 
                                            A NODE 400 egy 9 V-os elemmel garantáltan egy teljes szezonon keresztül megbízhatóan üzemel. A kivételes megbízhatóságán 
                                            kívül még programozni is gyerekjáték, a bonyolult nyomógombok és kapcsolók helyett a jól látható folyadékkristályos kijelző révén.
                                            Kilenc indítási időpont lehetséges, így alkalmazkodik a friss vetésű gyep vagy a kis vízelnyelésű lejtők optimális öntözési ütemezéséhez.
                                        </p>
                                        </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}    
                                {product.id === 3 && (
                                        <div className="card mb-3" style={{ maxWidth: '1000px' }}>
                                        <div className="row g-0">
                                          <div className="col-md-4">
                                        <img src='https://res.cloudinary.com/dbmrgdyft/image/upload/v1713613603/rain_clik_1_of_1_rt2_jjkkoo.jpg' alt='Rain-Click' style={{ width: '150%', maxWidth: '250px' }} />
                                        </div>
                                          <div className="col-md-8">
                                            <div className="card-body">
                                              <p className="card-text">
                                        HUNTER RAIN-CLIK esőérzékelő (Quick Response™)
                                        HUNTER RAIN-CLIK esőérzékelő feladata, hogy amikor elkezd esni az eső,
                                        vagy pedig túl vagyunk egy komolyabb záporon, blokkolja az öntözőrendszert
                                        a vezérlőn keresztül azáltal, hogy megszakítja az áramkört. Amint az érzékelőben
                                        lévő szövetkorongok kiszáradnak, a mikrokapcsoló újra zár és ismét elindulhat az öntözés.
                                        A RAIN-CLIK esőérzékelő csomagjában megtalálhatóak a felszereléshez szükséges rögzítőcsavarok.
                                        Több esőérzékelőtől eltérően nem kell beállítani rajta a lezárást, mivel önmagát szabályozza.
                                        </p>  
                                        </div>
                                          </div>
                                        </div>
                                      </div>  
                                    )}
                                    {product.id === 4 && (
                                         <div className="card mb-3" style={{ maxWidth: '1000px' }}>
                                         <div className="row g-0">
                                           <div className="col-md-4">
                                         <img src='https://res.cloudinary.com/dbmrgdyft/image/upload/v1713613905/87793796_vngzku.jpg' alt='MP Rotator' style={{ width: '150%', maxWidth: '250px' }} />
                                         </div>
                                          <div className="col-md-8">
                                            <div className="card-body">
                                              <p className="card-text">
                                         A Hunter MP Rotátor fúvóka egy speciálisan forgó szórófej, amely az öntözni kívánt felületen 3 szintű vízsugaraival
                                         biztosítja a számunkra oly fontos egyenletes lefedetséget. Működése közben impozáns látványt nyújtanak a forgó vízsugarak, 
                                         amint járják táncukat üde zöld pázsitunk felett.
                                         A Hunter ezen csúcsterméke nemcsak látványos működésével tűnik ki, hanem gazdaságos üzemeltetések is számos előnyt rejt,
                                         mivel kis vízfogyasztású, ezért öntözőrendszerünket gazdaságosabban állíthatjuk össze, kevesebb zónával tervezhetünk és ezáltal
                                         sok pénzt takaríthatunk meg. Akár azt is megtehetjük, hogy a régi elhasználódott vízpazarló vá vált spray zónáinkat, ezzel a fúvóka
                                         családdal váltjuk ki, mivel a rotátor nagyrészt ugyanabban a tartományban dolgozik, mint a spray fejek. Sokszor azaz előny is társul
                                         hozzá, hogy ásás és a szerelvények megbontása nélkül, pusztán a fúvókák cseréjével, az alacsonyabb vízfogyasztású, mégis jobb lefedetségű
                                         öntözőrendszer elérhetővé válik. Azt teszi ezt lehetővé, hogy az MP Rotátor fúvóka több szórófejházzal is kompatibilis, azokba können
                                         beszerelhető. Ma már kijelenthetük, hogy a házikertek öntözése elképzelhetetlen a rotátoros szórófejek használata nélkül.
                                         A HUNTER Rotátor MP1000 2,5-4,6m, 90° - 210° típus kevesebb mint fele annyi vízmennyiségből képes megoldani az öntözést, mint a hagyományos
                                         szórófej típusok. A Hunter Industries csúcstermékeinek számítanak ezek az öntözőrendszer alkatrészek, hiszen a legeffektívebb és legtakarékosabb
                                         öntözést valósítják meg a kertünkben.
                                        
                                         </p>  
                                         </div>
                                          </div>
                                        </div>
                                      </div>   
                                    )}
                                    
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    
                                    <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Termék típusa: {product.type}</p>
                                    <p style={{ fontSize: '12px', marginBottom: '5px' }}>Széria név: {product.serialName}</p>
                                    <p style={{ fontSize: '12px', marginBottom: '5px' }}>Ár: {product.price} Ft.</p>
                                    <button onClick={decreaseQuantity}>-</button>
                                    <span style={{ margin: '0 10px' }}>{quantity}</span>
                                    <button onClick={increaseQuantity}>+</button>
                                    <button style={{marginBottom: '15px'}} onClick={() => handleAddToCartAll(product ,quantity)}>Kosárba</button>
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