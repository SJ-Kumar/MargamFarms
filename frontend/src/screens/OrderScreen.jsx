import { Link, useParams} from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
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
import axios from 'axios';
import { url } from "../slices/api";
import { useState } from 'react';
import { loadRazorpay, initiateRazorpayPayment  } from '../utils/razorpay';



const OrderScreen = ({cartItems}) => {
  const { id: orderId } = useParams();


  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const navigate = useNavigate();

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [orderPaymentId, setOrderPaymentId] = useState(null);

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
      .unwrap() // Unwrap the promise to access the response data
      .then((result) => {
        if (result.isPaid) { // Check the value of success directly
          setOrderPaymentId(razorpayPaymentId);
          refetch();
          toast.success('Order is paid');
          setTimeout(() => {
            navigate(`/order/success/${orderId}`);
          }, 6000);
        } else {
          toast.error('Failed to mark order as paid');
        }
      })
      
      .catch((error) => {
        toast.error(error?.data?.message || error.error);
      });
  };

/*
  const handleRazorpaySuccess = async (paymentResponse) => {
    try {
      const razorpayOrderId = paymentResponse.razorpay_order_id;
      const razorpayPaymentId = paymentResponse.razorpay_payment_id;
      const razorpaySignature = paymentResponse.razorpay_signature;
  
      // Make an API call to mark the order as paid
      const response = await payOrder({
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
    
  const initiateRazorpayPayment = () => {
    const options = {
      key: 'rzp_test_4fe6t6EDDMh9vb', // Replace with your actual Razorpay API key
      amount: order.totalPrice * 100, // Amount in paisa (multiply by 100)
      currency: 'INR', // Currency code
      name: 'Margam Farms',
      description: 'Order Payment',
      // Add more options as needed

    };
    loadRazorpay(options, handleRazorpaySuccess, handleRazorpayError);
  };
*/
  
  const handleRazorpayError = (error) => {
    toast.error(error.message);
  };
  
  // TESTING ONLY! REMOVE BEFORE PRODUCTION
  async function onApproveTest() {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();
    toast.success('Order is paid');
  }


  const deliverOrderHandler=async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order Delivered');
    } catch(err) {
      toast.error(err?.data?.message || err.message)
    }
  } 


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
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order.deliveredAt}
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
                <Message variant='success'>Paid on {order.paidAt}</Message>
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
                  {order.orderItems.map((item, index) => (
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
                  ))}
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
                      {/* THIS BUTTON IS FOR TESTING! REMOVE BEFORE PRODUCTION! */}
                      <Button
                        className="btn btn-primary w-100 mb-2"
                        onClick={onApproveTest}
                      >
                        Test Pay Order
                      </Button>
                      <div>
                      <Button
                      className="btn btn-primary w-100" // Added Bootstrap classes
                      onClick={() =>
                        initiateRazorpayPayment(
                          order.totalPrice * 100, // Convert to paisa
                          handleRazorpaySuccess,
                          handleRazorpayError
                        )
                      }
                    >
                      Pay with Razorpay
                    </Button>
                      </div>
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
                className='btn btn-primary w-100'
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