import React from 'react';
import './Products.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Dropdown, Form, Button } from 'react-bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

// Új konstans létrehozása a termékek tárolásához


function Products() {
    return(
        <div>
        <Container style={{marginLeft: '363px'}}>   
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

            <div className=" products-form" style={{borderLeft:' 5px solid black'}}>
            <div style={{borderLeft: '6px solid grey', height: '90%', position: 'absolute', left: '20%', borderRadius: '100%', top: '8%'}}></div>
            <div>
                <h3 
                style={{
                    marginLeft: '125px',
                    marginTop: '20px',
                    textDecoration: 'underline'
                }}>Termékek
                </h3>
                <hr style={{color: 'black', border: 'none', borderTop: '5px solid', borderRadius: '100%'}}/>
            </div>
            
            <div>
                <h3  style={{marginLeft: '60px', marginTop: '20px', textDecoration: 'underline'}}>Öntözőautomatikák</h3>
                <select style={{marginLeft: '90px'}}>
                <option>Válassz egy lehetőséget</option>
                <optgroup label="HUNTER">
                    <option>HUNTER termék 1</option>
                    <option>HUNTER termék 2</option>
                </optgroup>
                <optgroup label="Toro">
                    <option>Toro termék 1</option>
                    <option>Toro termék 2</option>
                </optgroup>
                <optgroup label="Rain">
                    <option>Rain termék 1</option>
                    <option>Rain termék 2</option>
                </optgroup>
                </select>
            </div>
            </div>
        
        </div>
  
  );
}

export default Products;