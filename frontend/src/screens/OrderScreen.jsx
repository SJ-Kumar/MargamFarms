import { Link, useParams} from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader'
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} from '../slices/ordersApiSlice';
import { useNavigate } from 'react-router-dom';
import React from 'react';
//import { useState } from 'react';
import { initiateRazorpayPayment  } from '../utils/razorpay';
import { format } from 'date-fns-tz';
import axios from 'axios';
import { useTheme,useMediaQuery } from "@mui/material";

const OrderScreen = ({cartItems}) => {
  const { id: orderId } = useParams();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const navigate = useNavigate();

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  //const [orderPaymentId, setOrderPaymentId] = useState(null);

  const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const handleRazorpaySuccess = (response) => {
    const razorpayOrderId = response.razorpay_order_id;
    const razorpayPaymentId = response.razorpay_payment_id;
    const razorpaySignature = response.razorpay_signature;

    // Make an API call to mark the order as paid
    payOrder({
      orderId,
      razorpayDetails: {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      },
    })
      .unwrap()
      .then((result) => {
        if (result.isPaid) { 
          //setOrderPaymentId(razorpayPaymentId);
          refetch();
          toast.success('Order is paid');
          sendOrderConfirmationEmail(order._id, order.user.email,order.user.name, order.shippingAddress.address, order.shippingAddress.city, order.shippingAddress.locationLink,order.shippingAddress.postalCode, order.orderItems,order.itemsPrice,order.shippingPrice, order.totalPrice, order.paymentMethod);
          sendOrderReceivedEmail(order._id, order.user.email,order.user.mobile, order.user.name, order.shippingAddress.address, order.shippingAddress.city, order.shippingAddress.locationLink,order.shippingAddress.postalCode, order.orderItems,order.itemsPrice,order.shippingPrice, order.totalPrice, order.paymentMethod);
          sendSMS(order._id,order.user.name);
          setTimeout(() => {
            navigate(`/order/success/${orderId}`);
          }, 2000);
        } else {
          toast.error('Failed to mark order as paid');
        }
      })
      
      .catch((error) => {
        toast.error(error?.data?.message || error.error);
      });
  };
  const sendOrderConfirmationEmail = async (orderId, userEmail,userName,address,city, Location,postal, orderItems, itemsprice,shippingprice, totalPrice, paymentmethod) => {
    try {
      await axios.post(`/api/orders/send-order-confirmation/orderId`, {
        orderId,
        userEmail,
        userName,
        address,
        city,
        Location,
        postal,
        orderItems,
        itemsprice,
        shippingprice,
        totalPrice,
        paymentmethod,
      });
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
    }
  };
  const sendSMS = async (orderId, userName) => {
    try {
      await axios.post(`/api/orders/send-sms/orderId`, {
        orderId,
        userName,
      });
    } catch (error) {
      console.error('Error sending SMS', error);
    }
  };
  const sendOrderReceivedEmail = async (orderId, userEmail,usermobile, userName,address,city, Location,postal, orderItems, itemsprice,shippingprice, totalPrice, paymentmethod) => {
    try {
      await axios.post(`/api/orders/send-order-received/orderId`, {
        orderId,
        userEmail,
        usermobile,
        userName,
        address,
        city,
        Location,
        postal,
        orderItems,
        itemsprice,
        shippingprice,
        totalPrice,
        paymentmethod,
      });
  
    } catch (error) {
      console.error('Error sending order recieved email:', error);
    }
  };

/*
  const handleRazorpaySuccess = async (paymentResponse) => {
    try {
      const razorpayOrderId = paymentResponse.razorpay_order_id;
      const razorpayPaymentId = paymentResponse.razorpay_payment_id;
      const razorpaySignature = paymentResponse.razorpay_signature;
  
      // Make an API call to mark the order as paid
      await payOrder({
        orderId, // Order ID from useParams()
        details: {
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        },
      });
  
      if (response.data.success) {
        console.log("success");
        setOrderPaymentId(razorpayPaymentId);
        refetch();
        toast.success('Order is paid');
      } else {
        toast.error('Failed to mark order as paid');
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
    
*/
  
  const handleRazorpayError = (error) => {
    toast.error(error.message);
  };
  
  const sendOrderDeliveredEmail = async (orderId, userEmail,userName) => {
    try {
      await axios.post(`/api/orders/send-order-delivered/orderId`, {
        orderId,
        userEmail,
        userName,
      });
    } catch (error) {
      console.error('Error sending order delivered email:', error);
    }
  };

  const deliverOrderHandler=async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order Delivered and Mail sent');
      sendOrderDeliveredEmail(order._id, order.user.email,order.user.name);
    } catch(err) {
      toast.error(err?.data?.message || err.message)
    }
  } 
  const formatToIST = (timestamp) => {
    const date = new Date(timestamp);
    return format(date, 'yyyy-MM-dd HH:mm:ss', {
      timeZone: 'Asia/Kolkata', // Use the appropriate time zone
    });
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{order.user.email}
              </p>
              <p>
                <strong>Mobile No: </strong>{order.user.mobile}
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.shippingAddress.locationLink && (
    <p>
      <strong>Location Link: </strong>
      <a href={order.shippingAddress.locationLink} target='_blank' rel='noopener noreferrer'>
        View on Google Maps
      </a>
    </p>
  )}
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {formatToIST(order.deliveredAt)}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {formatToIST(order.paidAt)}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {isMobile ? (
                    // Render order items for mobile
                    order.orderItems.map((item, index) => (
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
                    // Render order items for non-mobile
                    order.orderItems.map((item, index) => (
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
                  <Col>₹{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>₹{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!userInfo.isAdmin && !order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                    <div>
                      <Button
                      className="btn btn-primary w-100 btn-for-all-screens" // Added Bootstrap classes
                      onClick={() =>
                        initiateRazorpayPayment(
                          userInfo,
                          order.totalPrice * 100, // Convert to paisa
                          handleRazorpaySuccess,
                          handleRazorpayError
                        )
                      }
                    >
                      Pay with Razorpay
                    </Button>
                    </div>
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
              <ListGroup.Item>
                <Button
                type='button'
                className='btn btn-primary w-100 btn-for-all-screens'
                onClick={deliverOrderHandler}
                >
                  Mark As Delivered
                  </Button>
                  </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}; 

export default OrderScreen;  