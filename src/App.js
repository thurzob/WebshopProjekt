import React, { useContext } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Registration from './Pages/Registration';
import Products from './Pages/Products';  
import Cart from './Pages/Cart';
import Order from './Pages/Order';
import Admin from './Pages/Admin';
import { useAuth } from './Pages/AuthContext';


function App() {

  
  return (
          <Routes>          
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Registration" element={<Registration />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Products" element={<Products />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path='/Order' element={<PrivateRoute><Order/></PrivateRoute>}/>   
            <Route path='/Admin' element={<PrivateAdminRoute><Admin/></PrivateAdminRoute>}/>          
          </Routes>
        
    
  );
}

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();

  // Ellenőrizzük, hogy be van-e jelentkezve a felhasználó
  if (!isLoggedIn) {
    // Ha a felhasználó nincs bejelentkezve, átirányítjuk a felhasználót a bejelentkezési oldalra
    return <Navigate to="/Login" replace />;
  }

  // Minden feltétel teljesülése esetén megjelenítjük a gyermek komponenst
  return children;
}

function PrivateAdminRoute({ children }) {
  const { isLoggedIn} = useAuth();
  const roles = localStorage.getItem('role');
  
  if ((!isLoggedIn || !roles.includes('ADMIN'))) {
    
    return <Navigate to="/" replace />;
  }

  // Minden feltétel teljesülése esetén megjelenítjük a gyermek komponenst
  return children;
}


export default App;