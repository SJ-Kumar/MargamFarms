import { Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Button,
  Card,
} from 'react-bootstrap';
import { Button as ButtonUI } from '@mui/material';
import { FaTrash } from 'react-icons/fa';
import {toast} from 'react-toastify';
import { removeFromCart } from '../slices/cartSlice';
import CartPageFaq from '../components/CartPageFAQ';
import cartgif from '../assets/cartGif.gif';
import Alert from '@mui/material/Alert';
import { useTheme,useMediaQuery } from "@mui/material";
const CartScreen = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showFAQ, setShowFAQ] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));



  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

/*   const addToCartHandler = async (product, qty) => {
    // Check if the product is already in the cart
    const existingItem = cartItems.find((item) => item._id === product._id);
  
    // If the product is not in the cart or the quantity is increasing,
    // update the countInStock and add to the cart
    if (!existingItem || (existingItem.qty < product.countInStockOriginal && qty > existingItem.qty)) {
      // Decrease countInStock when adding to cart
      product.countInStock -= qty;
  
      dispatch(addToCart({ ...product, qty }));
    } else {
      toast.error('Cannot add more of this item to your cart');
    }
  }; */
  const toggleFAQ = () => {
    setShowFAQ(!showFAQ);
  };
  
  const removeFromCartHandler = (id) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item._id === id) {
        // Create a deep copy of the item and update its countInStock
        const updatedItem = { ...item };
        updatedItem.countInStock = updatedItem.countInStockOriginal;
        return updatedItem;
      }
      return item;
    });
  
    dispatch(removeFromCart(id, updatedCartItems));
    toast.success('Product removed from Cart');
  };
  
  

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <>
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: '20px' }}>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div style={{alignItems:"center"}}>
                          <Alert severity="info" className='alertsty custom-alert' >
                          Your cart is empty <strong><Link to='/'>Go Back</Link></strong>
                        </Alert>
                        
        <div className=' emptyCartMainParent text-center relative top-10 h-full'>
        <img src={cartgif} alt="GIF" className=" absolute cg center" />
    </div>
    </div>
        ) : (
          <ListGroup variant='flush'>
{isMobile ? (
                // Render cart items for mobile
                cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row>
                      <Col xs={5} md={2}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col xs={7} md={3}>
                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                        <div style={{marginTop:"10px"}}>₹ {item.price} x {item.qty}</div>
                        <div style={{marginTop:"10px"}}>
                        <Button
                          type='button'
                          variant='light'
                          onClick={() => removeFromCartHandler(item._id)}
                        >
                          <FaTrash />
                        </Button>
                        </div>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))
              ) : (
                // Render cart items for non-mobile
                cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row>
                      <Col md={2}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col md={3}>
                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                      </Col>
                      <Col md={2}>₹ {item.price} x {item.qty}</Col>
                      <Col md={2}>
                        <Button
                          type='button'
                          variant='light'
                          onClick={() => removeFromCartHandler(item._id)}
                        >
                          <FaTrash />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))
              )}
          </ListGroup>
        )}
      </Col>
      {cartItems.length > 0 && (
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              ₹ 
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block btn-for-all-screens'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
      )}
    </Row>
    <div style={{marginTop: "50px"}}>
      <ButtonUI variant="contained" className ='btn-block w-100 btn-for-all-screens' onClick={toggleFAQ}>
        Frequently Asked Questions
      </ButtonUI>
      </div>
      <div className='mobileview' style={{ marginTop: "-520px"}}>
  {showFAQ && <CartPageFaq />}
</div>


    </>
        

    
  );
};

export default CartScreen;