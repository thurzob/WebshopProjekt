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
    const handleProductSelect = (selectedProduct) => {
        setSelectedProductId(selectedProduct);
      

        fetch(`https://localhost:7276/api/Merchant/${selectedProduct}`, {
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
        const mappedData = data.map(item => ({
            merchants: item.merchant.map(merchant => ({
                type: merchant.type,
                serialName: merchant.serialName,
                price: merchant.price
            }))
            
        }))
        setMappedData(mappedData);
    })
    
    .catch(error => {
        console.error('Fetch error:', error);
    });
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
                        <option>Válassz egy Terméket</option>
                        <optgroup label="HUNTER">
                            <option value="1">HUNTER NODE-BT</option>

                            <option value="2">HUNTER X-CORE</option>
                           

                        </optgroup>
                        <optgroup label="Toro">
                            <option value="Toro termék ">Toro termék 1</option>
                            <option value="Toro termék ">Toro termék 2</option>
                        </optgroup>
                        <optgroup label="Rain">
                            <option value="Rain termék ">Rain termék 1</option>
                            <option value="Rain termék ">Rain termék 2</option>
                        </optgroup>
                    </select>
                    
                     
                    <div>

           
            <table style={{marginLeft: '25%'}}>           
            <tbody>
            {mappedData.length > 0 && mappedData.map((item, index) => (
                <React.Fragment key={index}>
                    {item.merchants.map((merchant, idx) => (
                        <tr key={idx}>
                            <tr>
                            <td style={{fontSize: '25px', fontWeight: 'bold'}}>Termék típusa: {merchant.type}</td>
                            </tr>
                            <tr>
                            <td  style={{fontSize: '20px', fontWeight: 'bold'}}>Széria név: {merchant.serialName}</td>
                            </tr>
                            <tr>
                            <td style={{fontSize: '20px', fontWeight: 'bold', textDecoration: 'underline'}}>Ár: {merchant.price} Ft.</td>
                            </tr>
                        </tr>
                    ))}
                </React.Fragment>
            ))}
            {selectedProductId === '1' && (
                <img style={{marginLeft: '0%'}} src='https://res.cloudinary.com/dbmrgdyft/image/upload/v1707668947/HunterNode_tn2cla.jpg' alt='NODE-BT' />
                
            )}
            {selectedProductId === '2' && (
                <img style={{marginLeft: '0%'}} src='https://res.cloudinary.com/dbmrgdyft/image/upload/v1707667618/HunterXcore_rwnbta.jpg' alt='X-CORE' />
                
            )}
             </tbody>
            </table>
             </div>
                            

            </div>      
            </div>
             

        </div>
    );
}

export default Products;