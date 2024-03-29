import React, { useState, useEffect, useContext } from 'react';
import './Admin.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Row, Container, Dropdown, Table, Navbar, Nav,NavbarBrand, Form, Button, Col, Card  } from 'react-bootstrap';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link, NavLink } from 'react-router-dom';
import { useCartContext } from './CartContext';
import {  AuthContext } from './AuthContext';
import styled from 'styled-components';


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

function Admin()
{ 
  
  const { isLoggedIn, login, logout } = useContext(AuthContext);    
  const [backendMessage, setBackendMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(''); 
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const roles = localStorage.getItem('role');
  const [modifiedOrders, setModifiedOrders] = useState({});
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showNewTable, setShowNewTable] = useState(false);
  const [showNewRecord, setShowNewRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    fullName: '',
    userName: '',
    email: '',
    age: '',
    phoneNumber: ''
  });

  const handleLogout = () =>{
    logout();
    setToken('');
    setUserId('');
    localStorage.removeItem('userId');
  };

  const getAllOrders = () => {
    // Visszaállítjuk az inputmezőket és a gombot
    const buttons = document.querySelectorAll('.filter-button');
    buttons.forEach(button => button.style.display = 'block');
  
    const inputFields = document.querySelectorAll('.form-control');
    inputFields.forEach(inputField => inputField.style.display = 'block');
  
    const labels = document.querySelectorAll('label');
    labels.forEach(label => label.style.display = 'block');
  
    const tables = document.querySelectorAll('table');
    tables.forEach(table => table.style.display = 'block');
  
    fetch(`https://localhost:7276/api/User`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data)
      setOrders(data);
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
  };
  const handlePut = (userId) => {
    // Keresd meg a módosítandó elemet
    const updatedOrder = orders.find(order => order.id === userId);
    if (!updatedOrder) {
      console.error('Nem található a felhasználó azonosítója:', userId);
      return;
  }
  const age = parseInt(updatedOrder.age);

    const userData = {
        id: updatedOrder.id,
        userName: updatedOrder.userName,
        fullName: updatedOrder.fullName,
        passwordHash: updatedOrder.passwordHash,
        age: age,
        email: updatedOrder.email,
        phoneNumber: updatedOrder.phoneNumber
    };
    
    fetch(`https://localhost:7276/api/User/${userId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
        
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('PUT request was successful with response:', data);
            console.log(userData)
        })
        .catch(error => {
            console.error('There was a problem with your PUT request:', error);
            console.log(userData)
        });
};

  const clearFilters = () => {
    setNameFilter(''); // Név szűrő ürítése
    setEmailFilter(''); // Email szűrő ürítése
    setDateFilter(''); // Dátum szűrő ürítése
  
    
  };

  

  const handleNameChange = (e, index) => {
    const updatedOrders = [...orders];
    updatedOrders[index].fullName = e.target.value;
    setOrders(updatedOrders);
    setModifiedOrders({
        ...modifiedOrders,
        [updatedOrders[index].id]: {
            fullName: e.target.value
        }
    });
  };

  const handleUserNameChange = (e, index) => {
    const updatedOrders = [...orders]; 
    updatedOrders[index].userName = e.target.value; 
    setOrders(updatedOrders);
    setModifiedOrders({
      ...modifiedOrders,
      [updatedOrders[index].id]: {
          userName: e.target.value
      }
  });
  };

  const handleEmailChange = (e, index) => {
    const updatedOrders = [...orders]; 
    updatedOrders[index].email = e.target.value; 
    setOrders(updatedOrders);
    setModifiedOrders({
      ...modifiedOrders,
      [updatedOrders[index].id]: {
          email: e.target.value
      }
  });
  };

  const handleAgeChange = (e, index) => {
    const updatedOrders = [...orders]; 
    updatedOrders[index].age = e.target.value; 
    setOrders(updatedOrders);
    setModifiedOrders({
      ...modifiedOrders,
      [updatedOrders[index].id]: {
          age: e.target.value
      }
  });
  };

  const handlePasswordChange = (e, index) => {
    const updatedOrders = [...orders]; 
    updatedOrders[index].passwordHash = e.target.value; 
    setOrders(updatedOrders);
    setModifiedOrders({
      ...modifiedOrders,
      [updatedOrders[index].id]: {
          passwordHash: e.target.value
      }
  });
  };

  const handlePhoneChange = (e, index) => {
    const updatedOrders = [...orders]; 
    updatedOrders[index].phoneNumber = e.target.value; 
    setOrders(updatedOrders);
    setModifiedOrders({
      ...modifiedOrders,
      [updatedOrders[index].id]: {
          phoneNumber: e.target.value
      }
  });
  };

  const handleUploadClick = () => {
    Object.keys(modifiedOrders).forEach(id => {
        handlePut(id, modifiedOrders[id]);
    });
    // Töröld a módosításokat az állapotból
    setModifiedOrders({});
};

const handleCheckboxChange = (userId) => {
  const selectedIndex = selectedUsers.indexOf(userId);
  if (selectedIndex === -1) {
    setSelectedUsers([...selectedUsers, userId]); // Ha nincs még kiválasztva, hozzáadja a tömbhöz
  } else {
    const updatedUsers = [...selectedUsers];
    updatedUsers.splice(selectedIndex, 1); // Kiválasztás megszüntetése
    setSelectedUsers(updatedUsers);
  }
};

// Kiválasztott felhasználók törlése gomb eseménykezelője
const handleDeleteSelectedUsers = async () => {
  try {
    // A kiválasztott felhasználók törlése
    await Promise.all(selectedUsers.map(async (userId) => {
      const response = await fetch(`https://localhost:7276/api/User/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('A törlés sikertelen volt.');
      }
    }));
    // Sikeres törlés esetén frissíthetjük a felhasználók listáját vagy más szükséges műveleteket végezhetünk
    console.log('A kiválasztott felhasználók sikeresen törölve lettek.');
  } catch (error) {
    console.error('Hiba történt a törlés során:', error);
    // Kezelhetjük a hibát a megfelelő módon
  }
};

// Ellenőrzi, hogy egy adott sor kiválasztva van-e
const isSelected = (userId) => {
  return selectedUsers.includes(userId);
};

const handleAddNew = () => {
  setShowNewTable(true);
};

const handleNewRecordChange = (e, field) => {
  setNewRecord({
    ...newRecord,
    [field]: e.target.value
  });
};




  return(
  <div>
    <div>
    <Navbar className='my-custom-navbar'  expand='lg'>
        <Container style={{justifyContent: 'end'}}>
            <Navbar.Toggle  aria-controls='basic-navbar-nav'/>        
            <Navbar.Collapse id='basic-navbar-nav' className=' justify-content-end'>                       
              <Nav>
                <Nav.Link style={{color: 'bisque'}}  as={Link} to='/Home'>
                  Főolal
                </Nav.Link>    
                <Nav.Link style={{color: 'bisque'}}  as={Link} to='/Products'>
                  Termékek
                </Nav.Link>
                <Nav.Link style={{color: 'bisque'}}  href='#'>
                  Kapcsolat
                </Nav.Link>      
                <Nav.Link style={{color: 'bisque'}} as={Link} to='/Cart'>
                  Kosár
                </Nav.Link>
                {isLoggedIn && ( // Megjelenítem a Rendelés fület csak akkor, ha be van jelentkezve a felhasználó
                <Nav.Link style={{ color: 'bisque' }} as={Link} to='/Order'>
                  Rendelés
                </Nav.Link>
                )}
                {isLoggedIn && roles.includes('ADMIN') && ( // Csak akkor jelenítjük meg az Admin fület, ha a felhasználó admin
                <NavbarBrand style={{ color: 'bisque' }} as={Link} to='/Admin'>
                  Admin
                </NavbarBrand>
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
    </div>
  <div>  
    <ResponsiveContainer> 
      <div className="admin-form" style={{borderLeft: '5px solid black' }}>             
        <div>
        {/* Új Navbar az űrlap felett */}
          <Navbar expand="lg" variant="dark" style={{borderRadius: '45px 50px 0 0'}}>                        
            <Navbar.Toggle style={{marginLeft: '25px'}} aria-controls="basic-navbar-nav" />                  
            <Navbar.Collapse style={{marginLeft: '25px'}} id="basic-navbar-nav">
            <Nav variant="tabs" defaultActiveKey="orders">
              <Nav.Item>
                <Nav.Link style={{color: 'green'}} eventKey="orders" onClick={() => setActiveTab('orders')}>Rendelések</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link style={{color: 'green'}} eventKey="users" onClick={() => { setActiveTab('users'); clearFilters(); }}>Felhasználók</Nav.Link>
              </Nav.Item>
            </Nav>
            </Navbar.Collapse>
          </Navbar>        
        </div> 
        {activeTab === 'orders' && (
        <div>
        <Form style={{marginLeft: '1%'}}>
          <ResponsiveRow>
            <Form.Group  style={{width: '15%'}} controlId="formName">
              <Form.Label style={{textDecoration: 'underline'}}>Név:</Form.Label>
              <Form.Control type="text" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} placeholder="Név alapján szűrés" />
            </Form.Group>

            <Form.Group style={{width: '15%'}} controlId="formEmail">
              <Form.Label style={{textDecoration: 'underline'}}>Email:</Form.Label>
              <Form.Control type="email" value={emailFilter}  onChange={(e) => setEmailFilter(e.target.value)} placeholder="Email alapján szűrés" />
            </Form.Group>     

            <Form.Group style={{width: '15%'}} controlId="formDate">
              <Form.Label style={{textDecoration: 'underline'}}>Dátum:</Form.Label>
              <Form.Control type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} placeholder="Dátum alapján szűrés" />
            </Form.Group>
            
            <button 
            type='button'
            className='filter-button'
            onClick={getAllOrders}
            style={{
              width: '15%',
              height: '1%', 
              marginTop: '2.9%', 
              borderRadius: '15%', 
              backgroundColor: 'greenyellow' }}>
              Lekérdezés
            </button>
          </ResponsiveRow>
          <div className="table-container">
          <Table  style={{width: '99%',marginTop: '1%'}} striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Teljes név</th>
                <th>Számlázási név</th>
                <th>Számlázási cím</th>
                <th>Számlázási irányítószám</th> 
                <th>Szállítási cím</th>
                <th>Szállítási cím irányítószám</th>
                <th>Email</th>
                <th>Rendelés dátuma</th>
                <th>Rendelés státusza</th>
                <th>Termék típusa</th>
                <th>Termék Széria neve</th>
                <th>Rendelt mennyiség</th>
                <th>Termék ára</th>
              </tr>
            </thead>
            <tbody>
            {orders && orders
              .filter(order => 
                (nameFilter === '' || (order.fullName && order.fullName.includes(nameFilter))) &&
                (emailFilter === '' || (order.purchaseEmail && order.purchaseEmail.includes(emailFilter))) &&
                (dateFilter === '' || (order.purchaseDate && order.purchaseDate.includes(dateFilter)))
              )
              .map((order, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{order.fullName}</td>
                  <td>{order.purchaseBillingName}</td>
                  <td>{order.purchaseBillingAddress}</td>
                  <td>{order.purchaseBillingPostalCode}</td>
                  <td>{order.purchasaeDeliveryAddress}</td>
                  <td>{order.purchasePostalCode}</td>
                  <td>{order.purchaseEmail}</td>      
                  <td>{order.purchaseDate}</td>
                  <td>{order.status}</td> 
                  <td>{order.merchantType}</td> 
                  <td>{order.merchantSerialName}</td> 
                  <td>{order.merchantQuantity}</td>
                  <td>{order.merchantPrice}</td>
                </tr>
            ))}
            </tbody>
          </Table>
          </div>      
        </Form> 
        </div> 
        )} 
        {activeTab === 'users' && (
        <div>
          <Form style={{marginLeft: '1%'}}>
          <ResponsiveRow>
            <Form.Group  style={{width: '15%'}} controlId="formName">
              <Form.Label style={{textDecoration: 'underline'}}>Név:</Form.Label>
              <Form.Control type="text" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} placeholder="Név alapján szűrés" />
            </Form.Group>

            <Form.Group style={{width: '15%'}} controlId="formEmail">
              <Form.Label style={{textDecoration: 'underline'}}>Email:</Form.Label>
              <Form.Control type="email" value={emailFilter}  onChange={(e) => setEmailFilter(e.target.value)} placeholder="Email alapján szűrés" />
            </Form.Group>     
  
            <button 
            type='button'
            className='filter-button'
            onClick={getAllOrders}
            style={{
              width: '15%',
              height: '1%', 
              marginTop: '2.9%', 
              borderRadius: '15%', 
              backgroundColor: 'greenyellow' }}>
              Lekérdezés
            </button>

            <button 
              type='button'
              className='filter-button'
              onClick={() => handleAddNew(true)}
              style={{
                width: '15%',
                height: '1%', 
                marginTop: '2.9%', 
                borderRadius: '15%', 
                backgroundColor: 'greenyellow' }}>
              Új hozzáadása
            </button>

            <button 
              type='button'
              className='filter-button'
              onClick={handleUploadClick}
              style={{
                width: '15%',
                height: '1%', 
                marginTop: '2.9%', 
                borderRadius: '15%', 
                backgroundColor: 'greenyellow' }}>
              Módosítás
            </button>

            <button 
              type='button'
              className='filter-button'
              onClick={handleDeleteSelectedUsers}
              style={{
                width: '15%',
                height: '1%', 
                marginTop: '2.9%', 
                borderRadius: '15%', 
                backgroundColor: 'red' }}>
              Kiválasztottak törlése
            </button>
            
          </ResponsiveRow>
          <div className="table-container">
          <Table  style={{width: '99%',marginRight: '1%', marginTop: '1%'}} striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>GUID</th>
                <th>Teljes név</th>
                <th>Felhasználónév</th>
                <th>Email</th>
                <th>Kor</th>
                <th>Jelszó</th>
                <th>Telefonszám</th>
              </tr>
            </thead>
            <tbody>
            {orders && orders
              .filter(order => 
                (nameFilter === '' || (order.fullName && order.fullName.includes(nameFilter))) &&
                (emailFilter === '' || (order.purchaseEmail && order.purchaseEmail.includes(emailFilter))) &&
                (dateFilter === '' || (order.purchaseDate && order.purchaseDate.includes(dateFilter)))
              )
              .map((order, index) => (
                <tr key={index}>
                  <td>{index + 1}
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(order.id)} // Ide írd a kiválasztás kezelőjét
                    checked={isSelected(order.id)} // Ide írd a kiválasztás állapotának ellenőrzését
                  />
                  </td>
                  <td onClick={() => setEditingIndex(index)}>
                    {order.id}
                  </td>
                  <td onClick={() => setEditingIndex(index)}>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={order.fullName}
                        onChange={(e) => handleNameChange(e, index)}
                      />
                    ) : (
                      order.fullName
                    )}
                  </td>
                  <td onClick={() => setEditingIndex(index)}>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={order.userName}
                        onChange={(e) => handleUserNameChange(e, index)}
                      />
                    ) : (
                      order.userName
                    )}
                  </td>
                  <td onClick={() => setEditingIndex(index)}>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={order.email}
                        onChange={(e) => handleEmailChange(e, index)}
                      />
                    ) : (
                      order.email
                    )}
                  </td>
                  <td onClick={() => setEditingIndex(index)}>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={order.age}
                        onChange={(e) => handleAgeChange(e, index)}
                      />
                    ) : (
                      order.age
                    )}
                  </td>
                  <td onClick={() => setEditingIndex(index)}>
                    <div style={{ maxWidth: '400px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {editingIndex === index ? (
                        <input                  
                          type="text"
                          value={order.passwordHash}
                          onChange={(e) => handlePasswordChange(e, index)}
                        />
                      ) : (
                        order.passwordHash
                      )}
                    </div>
                  </td>
                  <td onClick={() => setEditingIndex(index)}>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={order.phoneNumber}
                        onChange={(e) => handlePhoneChange(e, index)}
                      />
                    ) : (
                      order.phoneNumber
                    )}
                  </td>                            
                </tr>           
            ))} 
            </tbody>
              </Table>
              {showNewTable && (
  <div className="table-container">
    <Table style={{ width: '99%', marginRight: '1%', marginTop: '1%' }} striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Teljes név</th>
          <th>Felhasználónév</th>
          <th>Email</th>
          <th>Kor</th>
          <th>Telefonszám</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>
            <input
              type="text"
              onChange={(e) => handleNewRecordChange (e, 'fullName')}
            />
          </td>
          <td>
            <input
              type="text"
              onChange={(e) => handleNewRecordChange(e, 'userName')}
            />
          </td>
          <td>
            <input
              type="text"
              onChange={(e) => handleNewRecordChange(e, 'email')}
            />
          </td>
          <td>
            <input
              type="text"
              onChange={(e) => handleNewRecordChange(e, 'age')}
            />
          </td>
          <td>
            <input
              type="text"
              onChange={(e) => handleNewRecordChange(e, 'phoneNumber')}
            />
          </td>
        </tr>
      </tbody>
    </Table>
  </div>
)}
          </div>      
        </Form> 
        </div>
      )}       
      </div>
    </ResponsiveContainer>
   </div>
</div>  
    
    
    
  )
    
}

export default Admin;