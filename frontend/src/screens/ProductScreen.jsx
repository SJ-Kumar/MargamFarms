import '../assets/styles/index.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams} from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
} from 'react-bootstrap';
import { FormControlLabel, Checkbox } from '@mui/material'; 
import { Select, MenuItem, FormControl, InputLabel, TextField } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import Rating from "../components/Rating";
import Meta from '../components/Meta';
import Loader from '../components/Loader';
import {toast} from 'react-toastify';
import Message from '../components/Message';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice';
import {addToCart} from '../slices/cartSlice'
import SideCart from '../components/SideCart';
import Snackbar from '@mui/material/Snackbar';

const ProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();

  const [showSideCart, setShowSideCart] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');


  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    toast.success('Product added to Cart');
    setShowSideCart(true);
    // navigate('/cart');
  };
  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };
  
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  

  const closeSideCart = () => {
    setShowSideCart(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!userInfo && !anonymous) {
      toast.error('Please sign in or check the anonymous option to post a review.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    try {
      await createReview({
        productId,
        rating,
        comment,
        anonymous,
      }).unwrap();
      refetch();
      handleSnackbarOpen('Review created successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const { userInfo } = useSelector((state) => state.auth);
  const [anonymous, setAnonymous] = useState(false);

  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  return (
    <>
      <Link className='btn btn-primary my-3' style={{marginBottom:"16px",marginTop:"16px"}} to='/'>
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title = {product.name} />
          <Row>
            <Col md={6}>
              <div className="image-container">
                <Image src={product.image} alt={product.name} fluid rounded />
              </div>
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ₹ {product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>₹ {product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

              {/* Qty Select */}
              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Quantity: </Col>
                    <Col>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel>Qty </InputLabel>
                        <Select
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                          label="Quantity"
                          sx={{ minHeight: '40px' }}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <MenuItem key={x + 1} value={x + 1}>
                              {x + 1}{['Spices', 'Fruits', 'Beans','Grocery'].includes(product.category) ? 'Kg' : product.category === 'Oils' ? 'L' : ''}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

                  <ListGroup.Item>
                  <Button
                      className='btn btn-primary w-100 btn-for-all-screens'
                      type='button'
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add To Cart
                    </Button>
                    {showSideCart && (
                    <>
                    <div className="backdrop" onClick={closeSideCart}></div>
                    <SideCart onClose={closeSideCart} />
                    </>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className='review'>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Feedback</h2>

                  {loadingProductReview && <Loader />}

                  <form onSubmit={submitHandler}>
                      <FormControl variant='outlined' fullWidth>
                        <InputLabel>Rating</InputLabel>
                        <Select
                          required
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                          label="Rating"
                        >
                          <MenuItem value='1'>1 - Poor</MenuItem>
                          <MenuItem value='2'>2 - Fair</MenuItem>
                          <MenuItem value='3'>3 - Good</MenuItem>
                          <MenuItem value='4'>4 - Very Good</MenuItem>
                          <MenuItem value='5'>5 - Excellent</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        className='my-2'
                        variant='outlined'
                        fullWidth
                        multiline
                        rows={3}
                        required
                        label='Comment'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={anonymous}
                              onChange={(e) => setAnonymous(e.target.checked)}
                              name="anonymous"
                              color="primary"
                            />
                          }
                          label="Post review anonymously"
                        />
                        <Button
                          disabled={loadingProductReview}
                          type='submit'
                          variant='primary'
                          className='btn-for-all-screens'
                        >
                          Submit
                        </Button>
                      <div style={{ marginTop: '20px' }}>
                      {!userInfo && !anonymous && (
                        <Message>
                          Please <Link to='/login'>sign in</Link> to write a review or post your review anonymously.
                        </Message>
                      )}
                      </div>
                    </form>

                </ListGroup.Item>
              </ListGroup>
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
      )}
    </>
  );
};

export default ProductScreen;