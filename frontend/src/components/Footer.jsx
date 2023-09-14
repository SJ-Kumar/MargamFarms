import { Container, Row, Col } from 'react-bootstrap';
import { SocialIcon } from 'react-social-icons';
import './Footer.css';
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            <p>&copy; {currentYear} MargamFarms. All rights reserved.</p>
            <div className="social-icons">
              <SocialIcon url='https://twitter.com/MargamFarm' target='_blank' rel='noopener noreferrer' className="social-icon" />
              <SocialIcon url='https://www.youtube.com/@margamfarm638' target='_blank' rel='noopener noreferrer' className="social-icon" />
              <SocialIcon url='mailto:margamfarm@gmail.com' target='_blank' rel='noopener noreferrer' className="social-icon" network="email" />
              <SocialIcon url='https://wa.me/+918884345668' target='_blank' rel='noopener noreferrer' className="social-icon" network="whatsapp" />
              <SocialIcon url='https://margamfarm.medium.com/' target='_blank' rel='noopener noreferrer' className="social-icon" network="medium" />
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;




