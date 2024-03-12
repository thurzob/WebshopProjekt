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
import { CartProvider } from './Pages/CartContext';
import { AuthProvider, useAuth } from './Pages/AuthContext';
import 'normalize.css';


function App() {

  return (
    <Router>
      <CartProvider>
        <AuthProvider>
          <Routes>          
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Registration" element={<Registration />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Products" element={<Products />} />
            <Route path="/Cart" element={<Cart />} />
            <Route path='/Order' element={<PrivateRoute><Order/></PrivateRoute>}/>           
          </Routes>
        </AuthProvider>
      </CartProvider>
    </Router>
  );
}

function PrivateRoute({ children, ...props }) {
  const userId = localStorage.getItem('userId');
  const { isLoggedIn } = useAuth();
  
  return userId ? children : <Navigate to="/Login" replace />;
}
export default App;