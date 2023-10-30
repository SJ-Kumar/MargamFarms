import React, {useState} from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge, Image } from 'react-bootstrap'; // Import Image component
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import { resetCart } from '../slices/cartSlice';
import defaultImage from './default.jpg';
import logo from '../assets/logo.png';
import '../assets/styles/index.css';
import Snackbar from '@mui/material/Snackbar';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };
  
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      handleSnackbarOpen('Logged Out Successfully');
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <Navbar className="navbar" variant="dark" expand="md" collapseOnSelect>
        <Container>
        <LinkContainer to={userInfo?.isAdmin ? '/admin/dashboard' : '/'}>
          <Navbar.Brand>
            <img src={logo} alt="Logo" className="logo" />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <SearchBox />
              <LinkContainer to="/cart">
                <Nav.Link className="nav-link">
                  <FaShoppingCart className="nav-icon" /> Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg="success" className="cart-badge">
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown
                  title={
                    <>
                      <Image
                        src={userInfo.image || defaultImage}
                        alt="User"
                        roundedCircle // Use this prop to make the image round
                        width={30}
                        height={30}
                        className="user-image" // Add a class for styling
                      />
                      <span className="user-name">{userInfo.name}</span>
                    </>
                  }
                  id="username"
                  align="end"
                  className="nav-dropdown"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link className="nav-link">
                    <FaUser className="nav-icon" /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu' className="nav-dropdown-admin">
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Customers</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/currentorderlist'>
                    <NavDropdown.Item>Recent Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/purchaseslist'>
                    <NavDropdown.Item>Purchases</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/oilcakelist'>
                    <NavDropdown.Item>Oil Cakes</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
        <Snackbar
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'left',
  }}
  open={openSnackbar}
  autoHideDuration={2000}
  onClose={handleSnackbarClose}
  message={snackbarMessage}
/>
      </Navbar>
    </header>
  );
};

export default Header;

