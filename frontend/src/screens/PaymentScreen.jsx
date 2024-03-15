import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState('COD');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check
              className='my-2'
              type='radio'
              label='Netbanking or Credit Card / Debit Card or UPI'
              id='Razorpay'
              name='paymentMethod'
              value='Razorpay'
              checked={paymentMethod === 'Razorpay'}
              onChange={() => setPaymentMethod('Razorpay')}
            ></Form.Check>
            <Form.Check
              className='my-2'
              type='radio'
              label='Cash on Delivery'
              id='COD'
              name='paymentMethod'
              value='COD'
              checked={paymentMethod === 'COD'}
              onChange={() => setPaymentMethod('COD')}
            ></Form.Check>
          </Col>
        </Form.Group>
        <div className='mt-4'>
          <Button
            type='submit'
            variant='primary'
            className='btn-for-all-screens'
          >
            Continue
          </Button>
        </div>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
