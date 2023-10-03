import React, { useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import { useTheme,useMediaQuery } from "@mui/material";

const PlaceOrderScreen = () => {

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address || !cart.shippingAddress.locationLink) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address,cart.shippingAddress.locationLink, navigate]);

  const dispatch = useDispatch();
  const placeOrderHandler = async () => {
    try {
      if (cart.paymentMethod === 'COD') {
        const res = await createOrder({
          orderItems: cart.cartItems,
          shippingAddress: {
            ...cart.shippingAddress,
            locationLink: cart.shippingAddress.locationLink,
          },
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          totalPrice: cart.totalPrice,
        }).unwrap();
        dispatch(clearCartItems());
        navigate(`/order/cod/${res._id}`);
       
      } 
      else {
        const res = await createOrder({
          orderItems: cart.cartItems,
          shippingAddress: {
            ...cart.shippingAddress,
            locationLink: cart.shippingAddress.locationLink,
          },
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          totalPrice: cart.totalPrice,
        }).unwrap();
        dispatch(clearCartItems());
        navigate(`/order/online/${res._id}`);
      }
    } 
    catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="place-order-container"> 
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
              {cart.shippingAddress.locationLink && (
    <p>
      <strong>Location Link: </strong>
      <a href={cart.shippingAddress.locationLink} target='_blank' rel='noopener noreferrer'>
        View on Google Maps
      </a>
    </p>
  )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {isMobile ? (
                      // Render cart items for mobile
                      cart.cartItems.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row>
                            <Col xs={4} md={1}>
                              <Image
                                src={item.image}
                                alt={item.name}
                                fluid
                                rounded
                              />
                            </Col>
                            <Col xs={8}>
                              <Link to={`/product/${item.product}`}>
                                {item.name}
                              </Link>
                              <div style={{ marginTop: '10px' }}>
                                {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                              </div>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))
                    ) : (
                      // Render cart items for non-mobile
                      cart.cartItems.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row>
                            <Col md={1}>
                              <Image
                                src={item.image}
                                alt={item.name}
                                fluid
                                rounded
                              />
                            </Col>
                            <Col>
                              <Link to={`/product/${item.product}`}>
                                {item.name}
                              </Link>
                            </Col>
                            <Col md={4}>
                              {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))
                    )}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>₹{cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>₹{cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant='danger'>{error.data.message}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn btn-primary w-100 btn-for-all-screens'
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Proceed
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      </div>
    </>
  );
};

export default PlaceOrderScreen;