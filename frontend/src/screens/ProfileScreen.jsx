import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation, useUploadUserImageMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import defaultImage from '../components/default.jpg';
import { TextField,Grid } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import SidebarMenu from '../components/SidebarMenu';


const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const { userInfo } = useSelector((state) => state.auth);
  const [image, setImage] = useState(userInfo.image || '../components/default.jpg');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  

  const cart = useSelector((state) => state.cart);


  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };
  
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();
    const [selectedImageFile, setSelectedImageFile] = useState(null);


    const [uploadUserImage, { isLoading: loadingUpload }] =
    useUploadUserImageMutation();

    useEffect(() => {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setMobile(userInfo.mobile);
      setImage(userInfo.image);
    }, [userInfo]);

  const dispatch = useDispatch();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          mobile,
          image,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        handleSnackbarOpen('Profile updated successfully');
      } catch (err) {
        handleSnackbarOpen(err?.data?.message || err.error);
      }
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    setSelectedImageFile(file);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await uploadUserImage(formData).unwrap();
      handleSnackbarOpen(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
    {userInfo?.isAdmin && <SidebarMenu />}
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        <Form onSubmit={submitHandler}>
        {selectedImageFile ? (
    <div className='selected-image-container'>
      <img
        src={URL.createObjectURL(selectedImageFile)}
        alt='Selected'
        className='selected-image'
      />
    </div>
  ) : (
    <div className='selected-image-container'>
      <img
        src={userInfo.image || defaultImage }
        alt='Default'
        className='selected-image'
      />
    </div>
  )}
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <TextField
        variant="outlined"
        fullWidth
        id="image"
        label="Image URL"
        name="image"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

              <Form.Control
                label='Choose File'
                onChange={uploadFileHandler}
                type='file'
              ></Form.Control>
      {loadingUpload && <Loader />}
    </Grid>
    <div style={{ marginTop: '16px' }}></div>



            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Mobile Number"
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <div style={{ marginTop: '16px' }}>


          <Button type='submit' variant='primary' className='btn-for-all-screens'>
            Update
          </Button>
          </div>
          {loadingUpdateProfile && <Loader />}
        </Form>
        <br />
      </Col>
      
      <Col md={9}>
        <h2>My Orders</h2>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
                    )}
                  </td>
                  <td>
                  <Link
  to={
    cart.paymentMethod === 'COD'
      ? `/order/cod/${order._id}?fromProfile=true`
      : `/order/online/${order._id}`
  }
>
  <Button className='btn-sm' variant='light'>
    Details
  </Button>
</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
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

      </Col>
    </Row>
    </>
  );
};

export default ProfileScreen;