import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';
import { removeFromCart } from '../slices/cartSlice';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { BsTrash } from 'react-icons/bs';

const SideCart = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(true); // State to control loading effect
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  // Simulate loading effect when component mounts or cartItems change
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust the delay time (in milliseconds) as desired

    return () => clearTimeout(timer); // Clear the timeout on component unmount

  }, [cartItems]);

  return (
    <div className={`side-cart ${isLoading ? 'loading' : ''}`}>
      <div className="side-cart-header">
        <h3>Cart</h3>
        <Button className="close-button" variant="link" onClick={onClose}>
          <FaTimes />
        </Button>
      </div>
      {cartItems.length === 0 ? (
        <div className="side-cart-empty">
        <FaShoppingCart className="empty-icon" />
        <p className="empty-text">Your cart is empty.</p>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div>
                <h4>{item.name}</h4>
                <p>Quantity: {item.qty}</p>
                <p>Price: ₹{item.price * item.qty}</p>
                <Button
                  type="button"
                  variant="danger"
                  className="delete-button"
                  onClick={() => removeFromCartHandler(item._id)}
                  style={{ height: '24px', padding: '4px' }}
                >
                  <BsTrash style={{ fontSize: '16px' }} />
                </Button>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <p>Total Price: ₹{totalPrice}</p>
            {totalPrice >= 0 ? (
              <p className="free-shipping congrats">Congrats for unlocking free delivery 🎉</p>
            ) : (
              <p className="free-shipping add-items">Add items above ₹0 for free delivery!</p>
            )}
          </div>
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




