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
import { FaTimes } from 'react-icons/fa'; 


const ResponsiveContainer = styled(Container)`
@media (max-width: 992px) {
justify-content: center;
display: flex;
align-items: center;
}
display: flex;
justify-content: center;
align-items: center;
width: 100%; /* A konténer mindig kitölti a rendelkezésre álló teret */
max-width: 100%; /* A konténer maximális szélessége 100%, hogy soha ne legyen szélesebb a táblázatnál */
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
  const [modifiedUsers, setModifiedUsers] = useState({});
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showNewTable, setShowNewTable] = useState(false);
  const [showNewRecord, setShowNewRecord] = useState(false);
  const [users, setUsers] = useState([]);
  const [userRoles, setUserRoles] = useState({});
  const [modifiedId, setModifiedId] = useState('');
  const [modifiedOrders, setModifiedOrders] = useState('')
  const [modifiedRole, setModifiedRole] = useState('');
  const [newRoleRecord, setNewRoleRecord] = useState('');
  const [updatedBillingData, setUpdatedBillingData] = useState([]);
  const [addedMerchantIds, setAddedMerchantIds] = useState([]);
  const [displayedMerchantIds, setDisplayedMerchantIds] = useState([]);
  const [ordersArray, setOrdersArray] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const handleEditingStart = (index) => {
    setEditingIndex(index);
  };
  const [newRecord, setNewRecord] = useState({
    id: '',
    fullName: '',
    userName: '',
    email: '',
    age: '',
    passwordHash: '',
    phoneNumber: '',
    newRole: ''
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
      
      setOrders(data);
    })
    .catch(error => {
      console.error('Fetch error:', error);
    }); 
  };
  
  const getAllUsers = () => {
    // Felhasználók adatainak lekérése...
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
    .then(usersData => {
      // Felhasználók adatainak feldolgozása...
      setUsers(usersData);
  
      // Szerepkörök lekérése...
      fetch('https://localhost:7276/auth/GetRoles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(rolesData => {
        // Szerepkörök feldolgozása és hozzáadása a felhasználókhoz...
        const updatedUsers = usersData.map(user => {
          const rolesForUser = rolesData.filter(role => role.userId === user.id);
          const userRoles = rolesForUser.map(role => role.roles);
          return { ...user, role: userRoles.join(', ') };
        });
        setUsers(updatedUsers);
        
      })
      .catch(error => {
        console.error('Error fetching roles:', error);
      });
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
    
  };
 
  useEffect(() => {
    // Ha a felhasználó a "Felhasználók" fülre kattintott és a "Lekérdezés" gombra is kattintott
    if (activeTab === 'users' && showNewTable) {
      // Töltsük le a felhasználók listáját
      getAllUsers();
    }
  }, [showNewTable]);
  
  
   
  const handlePut = async (userId) => {
    // Find the user to update
    const updatedUser = users.find(user => user.id === userId.toString());
    console.log(userId)
    
    if (!updatedUser) {
      console.error();
      return;
    }
  
    // Ensure age is a number (considering potential type issues)
    const age = typeof updatedUser.age === 'number' ? updatedUser.age : parseInt(updatedUser.age, 10);
    if (isNaN(age)) {
      console.error('Invalid age value for user', userId);
      return;
    }
  
    const userData = {
      fullName: updatedUser.fullName,
      userName: updatedUser.userName,
      passwordHash: updatedUser.passwordHash,
      age,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
    };
  
    try {
      const response = await fetch(`https://localhost:7276/api/User/${userId}`, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData), // Convert userData to JSON string
      });
  
      if (!response.ok) {
        throw new Error(`Network response was not ok (status: ${response.status})`);
      }
  
      const data = await response.json();
      // Log updated user data as well
    } catch (error) {
      if (error instanceof TypeError) {
        
      } else if (error.response) {
        // Network response error, check response status and status text
        
        // Log response body for further details
      } else {
        
      }
    }      
  };   
  const HandlePutRole = (modifiedId, modifiedRole) => {
  
  fetch(`https://localhost:7276/auth/assignPutRole`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: modifiedId,
      newRole: modifiedRole
      
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to update user role'); 
    }
    console.log('User role updated successfully');
    // Esetleges további műveletek...
  })
  .catch(error => {
    console.error('Error updating user role:', error);
    
  });
  };
  const clearFilters = () => {
    setNameFilter(''); // Név szűrő ürítése
    setEmailFilter(''); // Email szűrő ürítése
    setDateFilter(''); // Dátum szűrő ürítése
  
    
  };
  const handleNameChange = (e, index) => {
    const updatedUsers = [...users];
    updatedUsers[index].fullName = e.target.value;
    setUsers(updatedUsers);
    setModifiedUsers({
        ...modifiedUsers,
        [updatedUsers[index].id]: {
            fullName: e.target.value
        }
    });
  };
  const handleUserNameChange = (e, index) => {
    const updatedUsers = [...users]; 
    updatedUsers[index].userName = e.target.value; 
    setUsers(updatedUsers);
    setModifiedUsers({
      ...modifiedUsers,
      [updatedUsers[index].id]: {
          userName: e.target.value
      }
  });
  };
  const handleEmailChange = (e, index) => {
    const updatedUsers = [...users]; 
    updatedUsers[index].email = e.target.value; 
    setUsers(updatedUsers);
    setModifiedUsers({
      ...modifiedUsers,
      [updatedUsers[index].id]: {
          email: e.target.value
      }
  });
  };
  const handleAgeChange = (e, index) => {
    const updatedUsers = [...users]; 
    updatedUsers[index].age = e.target.value; 
    setUsers(updatedUsers);
    setModifiedUsers({
      ...modifiedUsers,
      [updatedUsers[index].id]: {
          age: e.target.value
      }
  });
  };
  const handlePasswordChange = (e, index) => {
    const updatedUsers = [...users]; 
    updatedUsers[index].passwordHash = e.target.value; 
    setUsers(updatedUsers);
    setModifiedUsers({
      ...modifiedUsers,
      [updatedUsers[index].id]: {
          passwordHash: e.target.value
      }
  });
  };
  const handlePhoneChange = (e, index) => {
    const updatedUsers = [...users]; 
    updatedUsers[index].phoneNumber = e.target.value; 
    setUsers(updatedUsers);
    setModifiedUsers({
      ...modifiedUsers,
      [updatedUsers[index].id]: {
          phoneNumber: e.target.value
      }
  });
  };
  const handleRoleChange = (e, index) => {
    const updatedUsers = [...users]; 
    updatedUsers[index].role = e.target.value; 
    setUsers(updatedUsers);
    
    const Id = updatedUsers[index].id;
    const Role = e.target.value;
    
    console.log('Változás történt:', { id: Id, role: Role }); 
    setModifiedId(Id);
    setModifiedRole(Role);
    
  };

  const handleUploadClick = () => {
    Object.keys(modifiedUsers).forEach(id => {
      handlePut(id, modifiedUsers[id]); 
      
    });
    setModifiedUsers({}); // Módosítások törlése az állapotból
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
  
  const handleAddNewUser = async () => {
    try {
      const response = await fetch(`https://localhost:7276/api/User`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecord),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      console.log('New user added:', data);
  
      // Most hívjuk meg a jogosultság hozzáadását
      handleAddNewUserRole(newRoleRecord);
  
      // Állapotok frissítése, például:
      // setNewRecord({}); // Új felhasználó adatainak ürítése
      // setShowNewTable(false); // Az új felhasználók táblázat elrejtése
      // Frissíthetjük az összes felhasználó adatait is
    } catch (error) {
      console.error('Add new user error:', error);
    }
  };
  
  const handleAddNewUserRole = () => {
    console.log(newRecord.newRole, newRecord.email)
    fetch(`https://localhost:7276/auth/AssignRole`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "role": `${newRecord.newRole}`,
      "email": `${newRecord.email}`
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update user role'); 
      }
      console.log('User role updated successfully');
      // Esetleges további műveletek...
    })
    .catch(error => {
      console.error('Error updating user role:', error);
    });
  };

  


  const handlePutOrderStatus = () => {
    
    const url = `https://localhost:7276/api/User?id=${updatedBillingData.userId}`;
    const orderStatusData = {
      orderStatus: updatedBillingData.orderStatus
    };
    
    fetch(url, { 
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderStatusData) 
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Hálózati válasz nem volt rendben');
      }
      return response.json();
    })
    .then(data => {
      
    })
    .catch(error => {
      console.error('Fetch hiba:', error);
      console.log(updatedBillingData.orderStatus)
    });
  };
  
  

  const handleOrderStatusChange = (e, order, index) => {
    const updatedOrders = [...orders];
    updatedOrders[index].orderStatus = e.target.value;
    setOrders(updatedOrders);
    setModifiedOrders({
      ...modifiedOrders,
      [updatedOrders[index].purchaseId]: {
        ...modifiedOrders[updatedOrders[index].purchaseId],
        purchase: {
          ...modifiedOrders[updatedOrders[index].purchaseId]?.purchase,
          orderStatus: e.target.value
        }
      }
    });
    setUpdatedBillingData(prevData => ({
      ...prevData,
      orderStatus: e.target.value,
      userId: order.id // itt használjuk az order objektumot és annak az id tulajdonságát
    }));
  };
  
  
  useEffect(() => {
    const checkPurchaseDateMatch = () => {
      
      orders.forEach(order => {
        order.purchases.forEach((purchase, index) => {
          const currentPurchaseDate = purchase.purchaseDate;
          const matchedPurchase = order.purchases.find((p, i) => i !== index && p.purchaseDate === currentPurchaseDate);
          if (matchedPurchase) {
            console.log('Match found in order:', order);
            
            const hasMatch = true;
          }
        });
      });
    };

    checkPurchaseDateMatch();

  }, [orders]);
  

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
      <ResponsiveRow>
      <div className="admin-form" style={{borderLeft: '5px solid black' }}>             
          <ResponsiveRow>      
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
          </ResponsiveRow>   

        
          {activeTab === 'orders' && (
  <div>
    <Form>
      <ResponsiveRow>
        <div style={{marginTop: '15px'}} className="col-md-12 d-flex">
        <Form.Group className="col-md-4" controlId="formName">
          <Form.Label style={{textDecoration: 'underline'}}>Név:</Form.Label>
          <Form.Control type="text" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} placeholder="Név alapján szűrés" />
        </Form.Group>

        <Form.Group style={{ marginLeft: '20px'}} className="col-md-4" controlId="formEmail">
          <Form.Label style={{textDecoration: 'underline'}}>Email:</Form.Label>
          <Form.Control type="email" value={emailFilter}  onChange={(e) => setEmailFilter(e.target.value)} placeholder="Email alapján szűrés" />
        </Form.Group>     
        
          <button 
          style={{height: '37px', marginTop: '32px', marginLeft: '15%',}}
            type='button'
            className='btn btn-success filter-button'
            onClick={getAllOrders}>
            Lekérdezés
          </button>
          <button 
           style={{height: '37px', marginTop: '32px'}}
            type='button'
            className='btn btn-success filter-button'
            onClick={handlePutOrderStatus}>
            Módosítás
          </button>
        </div>   
        
      </ResponsiveRow>
      
      <div className="table-responsive">
        <Table style={{ marginTop: '1%' }} striped bordered hover>
          <thead>
            <tr>
              <th>#SZID</th>
              <th>Teljes név</th>
              <th>Számlázási név</th>
              <th>Számlázási cím</th>
              <th>Számlázási irányítószám</th>
              <th>Szállítási cím</th>
              <th>Szállítási cím irányítószám</th>
              <th>Email</th>
              <th>Telefonszám</th>
              <th>Rendelés dátuma</th>
              <th>Rendelés státusza</th>
              <th>#TID</th>
              <th>Termék típusa</th>
              <th>Termék Széria neve</th>
              <th>Rendelt mennyiség</th>
              <th>Termék ára</th>
            </tr>
          </thead>
          <tbody>
          
            {orders &&
              orders 
              
              .filter(order => 
                (nameFilter === '' || (order.fullName && order.fullName.toLowerCase().includes(nameFilter.toLowerCase()))) &&
                (emailFilter === '' || (order.purchases.some(purchase => purchase.purchaseEmail && purchase.purchaseEmail.toLowerCase().includes(emailFilter.toLowerCase())))) 
               
              )
                .sort((a, b) => a.purchaseId - b.purchaseId)
                .map((order, index) => (
                  <React.Fragment key={index}>
                    {order.purchases.map((purchase, purchaseIndex) => (
                      <React.Fragment key={`${index}-purchase-${purchaseIndex}`}>
                        <tr key={`${index}-column`}>
                          <td>{purchase.purchaseId}</td>
                          <td>{order.fullName}</td>
                          <td>
                            {editingIndex === index ? (
                              <input           
                                type="text"
                                value={purchase.purchaseBillingName}
                                disabled={true}
                                style={{ width: '100%' }}
                                
                              />
                                
                            ) : (
                              purchase.purchaseBillingName
                              
                            )}
                          </td>
                          <td>
                            {editingIndex === index ? (
                              <input
                                type="text"
                                value={purchase.purchaseBillingAddress}
                                disabled={true}
                              />
                            ) : (
                              purchase.purchaseBillingAddress
                            )}
                          </td>
                          <td
                           
                          >
                            {editingIndex === index ? (
                              <input
                                type="text"
                                value={purchase.purchaseBillingPostalCode}
                                disabled={true}
                                style={{ width: '100%' }}
                              />
                            ) : (
                              purchase.purchaseBillingPostalCode
                            )}
                          </td>
                          <td
                            
                          >
                            {editingIndex === index ? (
                              <input
                                type="text"
                                value={
                                  purchase.purchasaeDeliveryAddress
                                }
                                disabled={true}
                                style={{ width: '100%' }}
                              />
                            ) : (
                              purchase.purchaseDeliveryAddress
                            )}
                          </td>
                          <td
                            
                          >
                            {editingIndex === index ? (
                              <input
                                type="text"
                                value={purchase.purchasePostalCode}
                                disabled={true}
                                style={{ width: '100%' }}
                              />
                            ) : (
                              purchase.purchasePostalCode
                            )}
                          </td>
                          <td
                           
                          >
                            {editingIndex === index ? (
                              <input
                                type="text"
                                value={purchase.purchaseEmail}
                                disabled={true}
                                style={{ width: '100%' }}
                              />
                            ) : (
                              purchase.purchaseEmail
                            )}
                          </td>
                          <td
                            
                          >
                            {editingIndex === index ? (
                              <input
                                type="text"
                                value={
                                  purchase.purchasePhoneNumber
                                }
                                disabled={true}
                                style={{ width: '100%' }}
                              />
                            ) : (
                              purchase.purchasePhoneNumber
                            )}
                          </td>
                          <th>{purchase.purchaseDate}</th>
                          <td>
                            {editingIndex === index ? (
                              <textarea
                                type="text"
                                value={order.orderStatus}
                                onChange={(e) => handleOrderStatusChange(e, order, index)}
                                style={{ width: '100%' }}
                                autoFocus
                              />
                            ) : (
                              <span onClick={() => setEditingIndex(index)}>{order.orderStatus}</span>
                            )}
                          </td>
                          
                          <td style={{backgroundColor: 'lightblue'}}></td>
                          <td style={{backgroundColor: 'lightblue'}}></td>
                          <td style={{backgroundColor: 'lightblue'}}></td>
                          <td style={{backgroundColor: 'lightblue'}}></td>
                          <td style={{backgroundColor: 'lightblue'}}></td>
                          
                        </tr>
                        {order.merchants.map((merchant, merchantIndex) => {
                        const isAlreadyAdded = displayedMerchantIds.includes(merchant.id);
                        if (purchase.tid !== merchant.id || isAlreadyAdded) {
                          return null;
                        }
                        return (
                            <tr key={`${index}-${purchaseIndex}-merchant-${merchantIndex}`}>
                              <td colSpan="11"></td> {/* 10 = a vissza maradó oszlopok száma */}
                              <td>{merchant.id}</td>
                              <td>
                                {editingIndex === index ? (
                                  <input
                                    type="text"
                                    value={merchant.type}
                                    style={{ width: '100%' }}
                                  />
                                ) : (
                                  merchant.type
                                )}
                              </td>
                              <td>
                                {editingIndex === index ? (
                                  <input
                                    type="text"
                                    value={merchant.serialName}
                                    style={{ width: '100%' }}
                                  />
                                ) : (
                                  merchant.serialName
                                )}
                              </td>
                              <td>
                                {editingIndex === index ? (
                                  <input
                                    type="text"
                                    value={merchant.quantity}
                                    style={{ width: '100%' }}
                                  />
                                ) : (
                                  merchant.quantity
                                )}
                              </td>
                              <td>
                                {editingIndex === index ? (
                                  <input
                                    type="text"
                                    value={merchant.price}
                                    style={{ width: '100%' }}
                                  />
                                ) : (
                                  merchant.price
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  
                  </React.Fragment>
                ))}
          </tbody>
        </Table>
      </div>      
    </Form> 
  </div> 
)}
       {activeTab === 'users' && (
  <div>
    <Form>
      <ResponsiveRow>
        <Form.Group className="col-md-4" controlId="formName">
          <Form.Label style={{textDecoration: 'underline'}}>Név:</Form.Label>
          <Form.Control type="text" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} placeholder="Név alapján szűrés" />
        </Form.Group>

        <Form.Group className="col-md-4" controlId="formEmail">
          <Form.Label style={{textDecoration: 'underline'}}>Email:</Form.Label>
          <Form.Control type="email" value={emailFilter}  onChange={(e) => setEmailFilter(e.target.value)} placeholder="Email alapján szűrés" />
        </Form.Group>     
        
        <div style={{marginTop: '32px'}} className="col-md-4">
          <button 
            type='button'
            className='btn btn-success filter-button'
            onClick={getAllUsers}>
            Lekérdezés
          </button>

          <button 
            type='button'
            className='btn btn-success filter-button'
            onClick={() => handleAddNew(true)}>
            Új hozzáadása
          </button>

          <button 
            type='button'
            className='btn btn-success filter-button'
            onClick={() => {
              handleUploadClick();
              handleAddNewUser();
              HandlePutRole(modifiedId, modifiedRole);}}>
            Módosítás
          </button>

          <button 
            type='button'
            className='btn btn-danger filter-button'
            onClick={handleDeleteSelectedUsers}>
            Kiválasztottak törlése
          </button>
        </div>
      </ResponsiveRow>
      
      <div style={{marginTop: '15px'}} className="table-responsive">
        <Table striped bordered hover>
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
              <th>Jogosultság</th>
            </tr>
          </thead>
          <tbody>
            {users && users
              .filter(user => 
                (nameFilter === '' || (user.fullName && user.fullName.toLowerCase().includes(nameFilter.toLowerCase()))) &&
                (emailFilter === '' || (user.email && user.email.toLowerCase().includes(emailFilter.toLowerCase()))) 
              )
              .map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td onClick={() => setEditingIndex(index)}>{user.id}</td>
                  <td onClick={() => setEditingIndex(index)}>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={user.fullName}
                        onChange={(e) => handleNameChange(e, index)}
                      />
                    ) : (
                      user.fullName
                    )}
                  </td>
                  <td onClick={() => setEditingIndex(index)}>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={user.userName}
                        onChange={(e) => handleUserNameChange(e, index)}
                      />
                    ) : (
                      user.userName
                    )}
                  </td>
                  <td onClick={() => setEditingIndex(index)}>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={user.email}
                        onChange={(e) => handleEmailChange(e, index)}
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td onClick={() => setEditingIndex(index)}>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={user.age}
                        onChange={(e) => handleAgeChange(e, index)}
                      />
                    ) : (
                      user.age
                    )}
                  </td>
                  <td onClick={() => setEditingIndex(index)}>
                    <div>
                      {editingIndex === index ? (
                        <input                  
                          type="password"
                          value={user.passwordHash.slice(0, 10)}
                          onChange={(e) => handlePasswordChange(e, index)}
                        />
                      ) : (
                        "*".repeat(user.passwordHash.slice(0, 10).length) 
                      )}
                    </div>
                  </td>
                  <td onClick={() => setEditingIndex(index)}>
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={user.phoneNumber}
                        onChange={(e) => handlePhoneChange(e, index)}
                      />
                    ) : (
                      user.phoneNumber
                    )}
                  </td> 
                  <td onClick={() => setEditingIndex(index)}>
                    {editingIndex === index ? (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(e, index)}
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>                           
                </tr>           
              ))} 
          </tbody>
        </Table>
      </div>

      {showNewTable && (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Teljes név</th>
                <th>Felhasználónév</th>
                <th>Email</th>
                <th>Kor</th>
                <th>Jelszó</th>
                <th>Telefonszám</th>
                <th>Jogosultság</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <input
                    type="text"
                    onChange={(e) => handleNewRecordChange(e, 'fullName')}
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
                    onChange={(e) => handleNewRecordChange (e, 'passwordHash')}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    onChange={(e) => handleNewRecordChange(e, 'phoneNumber')}
                  />
                </td>
                <td>
                  <select
                    value={newRecord.newRole}
                    onChange={(e) => handleNewRecordChange(e, 'newRole')}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      )}
    </Form>
  </div>
)}
      </div>
      </ResponsiveRow>
    </ResponsiveContainer>
   </div>
</div>  
    
    
    
  )
    
}

export default Admin;