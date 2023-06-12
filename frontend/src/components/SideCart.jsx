import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const SideCart = ({ onClose }) => {
  const cartItems = useSelector((state) => state.cart.cartItems);

  return (
    <div className="side-cart">
      <div className="side-cart-header">
        <h3>Cart</h3>
        <button onClick={onClose}>Close</button>
      </div>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div>
                <h4>{item.name}</h4>
                <p>Quantity: {item.qty}</p>
              </div>
            </div>
          ))}
          <div className="cart-buttons">
            <Link to="/" onClick={onClose}>
              Continue Shopping
            </Link>
            <Link to="/cart">Checkout</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default SideCart;
