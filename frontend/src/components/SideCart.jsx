import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import { removeFromCart } from '../slices/cartSlice';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { BsTrash } from 'react-icons/bs';

const SideCart = ({ onClose }) => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  return (
    <div className="side-cart">
      <div className="side-cart-header">
        <h3>Cart</h3>
        <Button className="close-button" variant="link" onClick={onClose}>
          <FaTimes />
        </Button>
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
            {totalPrice >= 1000 ? (
              <p className="free-shipping congrats">Congrats for unlocking free delivery 🎉</p>
            ) : (
              <p className="free-shipping add-items">Add items above ₹1000 for free delivery!</p>
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



