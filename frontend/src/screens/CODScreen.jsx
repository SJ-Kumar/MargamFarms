import { Link, useParams} from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} from '../slices/ordersApiSlice';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { format } from 'date-fns-tz';


const CODScreen = ({cartItems}) => {
  const { id: orderId } = useParams();
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const navigate = useNavigate();

  const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation();

  const {userInfo} = useSelector((state) => state.auth);

  async function onApproveTest() {
    refetch();
    toast.success('Order Placed');
    setTimeout(() => {
      navigate(`/order/success/${orderId}`);
    }, 6000);
  }
  async function onApproveTestpp() {
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
              {userInfo && !userInfo.isAdmin && ( 
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  <div>
                    <Button
                      style={{ marginBottom: '10px' }}
                      className='btn btn-primary w-100'
                      onClick={onApproveTest}
                    >
                      Place Order
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
                className='btn btn-primary w-100'
                onClick={deliverOrderHandler}
                >
                  Mark As Delivered
                  </Button>
                  </ListGroup.Item>
              )}
              {userInfo &&
  userInfo.isAdmin &&
  !order.isPaid && (
    <ListGroup.Item>
      <Button
        type='button'
        className='btn btn-primary w-100'
        onClick={onApproveTestpp}
      >
        Paid in Person
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

export default CODScreen;