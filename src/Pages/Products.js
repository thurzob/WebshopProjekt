import React, { useState, useEffect } from 'react';
import './Products.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Dropdown, Table } from 'react-bootstrap';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Products() {

    const [mappedData, setMappedData] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [quantity, setQuantity] = useState(1);

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
      
    const handleAddToCart = () => {
            
        console.log(`Kosárba helyezve: ${quantity} darab - Termék ID: ${selectedProductId}`);    
    }

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

            <div className="products-form" style={{ borderLeft: '5px solid black'}}>
                <div style={{ borderLeft: '6px solid grey', height: '100%', position: 'absolute', left: '20%', borderRadius: '100%', top: '0%' }}></div>
                <div style={{display: 'flex', justifyContent: 'flex-start'}}>
                <Link  to="/Products"><h3 className="hover" style={{ marginLeft: '125px', marginTop: '20px', textDecoration: 'underline', border: 'none'}}>Termékek</h3></Link>
                <Link  to="/Cart"><h3 className="hover" style={{ marginLeft: '250px', marginTop: '20px', textDecoration: 'underline' }}>Kosár</h3></Link>        
                <Link  to="/Home"><h3 className="hover" style={{ marginLeft: '1100px', marginTop: '20px', textDecoration: 'underline' }}>Főoldal</h3></Link>   
                </div>
                <div>
                <hr style={{ color: 'red', border: 'none', borderTop: '5px solid', borderRadius: '100%' }} />
                </div>
                <div>
                    <h3 style={{ marginLeft: '60px', marginTop: '20px', textDecoration: 'underline' }}>Öntözőautomatikák</h3>
                    <select style={{ marginLeft: '100px' }} onChange={(e) => handleProductSelect(e.target.value)}>
                        <option value="">Válassz egy Terméket</option>
                        <optgroup label="HUNTER">
                            <option value="2">HUNTER NODE-BT</option>

                            <option value="3">HUNTER X-CORE</option>
                           

                        </optgroup>
                        
                    </select>
                    
                     
                    <div>

           
            <table style={{marginLeft: '25%'}}>           
            <tbody>
            
            {mappedData.length > 0 && mappedData.map((item, index) => (
                <React.Fragment key={index}>
                    {item.products.map((product, idx) => (
                        <tr key={idx}>
                             
                            <tr>
                            <td style={{fontSize: '25px', fontWeight: 'bold'}}>Termék típusa: {product.type}</td>
                            </tr>
                            <tr>
                            <td style={{fontSize: '20px', fontWeight: 'bold'}}>Széria név: {product.serialName}</td>
                            </tr>
                            <tr>
                            <td style={{fontSize: '20px', fontWeight: 'bold', textDecoration: 'underline'}}>Ár: {product.price} Ft.</td>
                            </tr>
                          
                        </tr>
                    ))}
                </React.Fragment>
            ))}
            {selectedProductId === '2' && (
                <img style={{marginLeft: '0%'}} src='https://res.cloudinary.com/dbmrgdyft/image/upload/v1707668947/HunterNode_tn2cla.jpg' alt='NODE-BT' />
                
            )}
            {selectedProductId === '3' && (
                <img style={{marginLeft: '0%'}} src='https://res.cloudinary.com/dbmrgdyft/image/upload/v1707667618/HunterXcore_rwnbta.jpg' alt='X-CORE' />
                
            )}
            
           
           
                        
            </tbody>
            </table>
            <div style={{marginLeft: '452px', marginTop: '5%'}}>
            {selectedProductId === '2' && (
                        <div>
                            <input 
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                style={{ marginLeft: '10px' }}
                            />
                            <button onClick={handleAddToCart} style={{ marginLeft: '10px' }}>Kosárba</button>
                        </div>
                    )} 
            {selectedProductId === '3' && (
                        <div>
                            <input 
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                style={{ marginLeft: '10px' }}
                            />
                            <button onClick={handleAddToCart} style={{ marginLeft: '10px' }}>Kosárba</button>
                        </div>
                    )} 
            </div>
             </div>                      
            </div>      
            </div>           
        </div>
    );
}

export default Products;