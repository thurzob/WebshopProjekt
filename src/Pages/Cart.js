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
                    </Dropdown.Menu>
                </Dropdown>
            </Container>

            <div className="products-form" style={{ borderLeft: '5px solid black' }}>
                <div style={{ borderLeft: '6px solid grey', height: '90%', position: 'absolute', left: '20%', borderRadius: '100%', top: '8%' }}></div>
                <div>
                    <h3 style={{ marginLeft: '125px', marginTop: '20px', textDecoration: 'underline' }}>Termékek</h3>
                    <hr style={{ color: 'black', border: 'none', borderTop: '5px solid', borderRadius: '100%' }} />
                </div>

                <div>
                    <h3 style={{ marginLeft: '60px', marginTop: '20px', textDecoration: 'underline' }}>Öntözőautomatikák</h3>
                    <select style={{ marginLeft: '90px' }} onChange={(e) => handleProductSelect(e.target.value)}>
                        <option value="">Válassz egy Terméket</option>
                        <optgroup label="HUNTER">
                            <option value="2">HUNTER NODE-BT</option>

                            <option value="3">HUNTER X-CORE</option>
                           

                        </optgroup>
                        
                    </select>
                    
                     
                    <div>

           
            <table style={{marginLeft: '25%'}}>           
           
            </table>         
             </div>                      
            </div>      
            </div>           
        </div>
    );
}

export default Products;