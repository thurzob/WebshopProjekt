import React, { createContext, useContext, useState } from 'react';

export const CartContext = createContext();
export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    
    const addToCart = (item) => {
        setCartItems([...cartItems, item]);
      };

    const clearCart = (updatedItems) => {
    setCartItems(updatedItems);
  };


    return (
        <CartContext.Provider value={{ cartItems, addToCart, clearCart }}>
          {children}
        </CartContext.Provider>
      );
    };