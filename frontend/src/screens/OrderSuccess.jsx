import React from 'react';
import { useNavigate} from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import '../assets/styles/index.css';

const SuccessPage = () => {
  const navigate = useNavigate();

  // Function to redirect to the profile page
  const goToProfile = () => {
    navigate('/profile');
  };

  // Function to redirect to the home page
  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="success-page">
      <Card className="success-card">
        <Card.Body>
          <h1 className="card-title">Thank you for your Order.</h1>
          <p>Your order has been placed successfully.</p>
          <p>A confirmation email will be sent to you shortly.</p>
          <div className="button-container">
            <Button variant="primary" onClick={goToProfile}>
              Manage Orders
            </Button>
            <Button variant="success" onClick={goToHome}>
              Continue Shopping
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SuccessPage;






