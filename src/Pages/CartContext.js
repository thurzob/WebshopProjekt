import React, { createContext, useContext, useEffect, useState } from 'react';

export const CartContext = createContext();
export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Kosár állapotának inicializálása a localStorage-ból vagy üres tömbbel
  const [cartItems, setCartItems] = useState(() => {
      const savedCartItems = localStorage.getItem('cartItems');
      return savedCartItems ? JSON.parse(savedCartItems) : [];
  });
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(null);

  const updateUserId = (newUserId) => {
    setUserId(newUserId);
    localStorage.setItem('userId', newUserId); // userId mentése localStorage-ba
  };

    useEffect(() => {
      // Elmentjük a kosár tartalmát a localStorage-ba
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);
    
    useEffect(() => {
      // Betöltjük a kosár tartalmát a localStorage-ból az oldal betöltésekor
      const savedCartItems = localStorage.getItem('cartItems');
      if (savedCartItems) {
        setCartItems(JSON.parse(savedCartItems));
      }
    }, []);

    useEffect(() => {
      const savedUserId = localStorage.getItem('userId');
      if (savedUserId) {
        setUserId(savedUserId);
      }
    }, [userId]);

    const addToCart = (item) => {
      const existingItemIndex = cartItems.findIndex(cartItem => cartItem.productId === item.productId);
      
      if (existingItemIndex !== -1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += parseInt(item.quantity);
        setCartItems(updatedCartItems);
      } else {
        setCartItems(prevCartItems => [...prevCartItems, item]);
      }
    };
  
  const clearCart = () => {
      setCartItems([]);
  };

    

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, clearCart, setToken, userId, updateUserId }}>
      {children}
    </CartContext.Provider>
  );

 
}; 