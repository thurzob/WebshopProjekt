import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Registration from './Pages/Registration';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Registration" element={<Registration />} />
      </Routes>
    </Router>
    
  );
}



export default App;