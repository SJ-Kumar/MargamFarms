import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge, Image, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaUserSecret } from 'react-icons/fa'; // Import FaUserSecret for incognito icon
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import { resetCart } from '../slices/cartSlice';
import defaultImage from './default.jpg';
import logo from '../assets/logo-organic.png';
import './toggle.css'; 
import Snackbar from '@mui/material/Snackbar';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false); // State for anonymous mode

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

  const handleToggleAnonymous = () => {
    setIsAnonymous((prev) => !prev);
    if (!isAnonymous) {
      handleSnackbarOpen('Anonymous Mode Enabled');
    } else {
      handleSnackbarOpen('Anonymous Mode Disabled');
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
                        roundedCircle
                        width={30}
                        height={30}
                        className="user-image"
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

              {/* Add custom toggle switch for incognito mode */}
              <div className="toggle-container" style={{marginLeft:"7px"}}>
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id="tooltip-bottom">
                      {isAnonymous ? 'Disable Incognito Mode' : 'Enable Incognito Mode'}
                    </Tooltip>
                  }
                >
                  <div className={`incognito-toggle ${isAnonymous ? 'active' : ''}`} onClick={handleToggleAnonymous}>
                    <div className="toggle-knob">
                      <FaUserSecret className="incognito-icon" />
                    </div>
                  </div>
                </OverlayTrigger>
              </div>

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
