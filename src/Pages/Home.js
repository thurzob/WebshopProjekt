import React from 'react';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Dropdown } from 'react-bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';




library.add(faBars);

function Home()
{
    return(
        <div className='Home-body'> 
        <Container>   
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
                <Dropdown.Item> 
                    <Link className="nav-link navbar-brand text-center" to="/Cart">Kosár</Link>
                </Dropdown.Item>
                </Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
        </Container>  
    
            <nav className="navbar navbar-expand-lg" style={{backgroundColor: 'rgba(86, 179, 81, 0.5)', position: 'absolute', top: '19%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%' }}>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                <li className="nav-item active">
                    <Link className="nav-link navbar-brand text-center" to="/" style={{marginLeft: '1400px', fontSize: '25px' }}>Főoldal</Link>
                </li>
                <li className="nav-item">
                   <Link className="nav-link navbar-brand text-center" to="/Products" style={{ marginLeft: '100px', fontSize: '25px' }}>Termékek</Link> 
                </li>
                <li className="nav-item">
                    <a className="nav-link navbar-brand text-center" style={{ marginLeft: '100px', fontSize: '25px' }}>Kapcsolat</a>
                </li>
                </ul>
            </div>
            </nav>
        </div>

    );

}
export default Home;