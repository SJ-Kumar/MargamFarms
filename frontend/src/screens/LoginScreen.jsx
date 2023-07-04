import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import axios from 'axios';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [videoData, setVideoData] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';
  const [showPassword, setShowPassword] = useState(false);


  const fetchMostLikedVideo = async () => {
    try {
      const response = await axios.get(
        'https://www.googleapis.com/youtube/v3/search',
        {
          params: {
            part: 'snippet',
            channelId: 'UCjKvB7E6YiqV9_UMjBC9BHA', // Replace with your YouTube channel ID
            order: 'rating', // Sort videos by rating (likes)
            maxResults: 1, // Retrieve only one video
            key: 'AIzaSyD0gbH6qSaSGJNhU4TsQH-Xs8genUcuGEc', // Replace with your actual YouTube Data API key
          },
        }
      );

      const videoId = response.data.items[0].id.videoId;
      const videoResponse = await axios.get(
        'https://www.googleapis.com/youtube/v3/videos',
        {
          params: {
            part: 'snippet',
            id: videoId,
            key: 'AIzaSyD0gbH6qSaSGJNhU4TsQH-Xs8genUcuGEc', // Replace with your actual YouTube Data API key
          },
        }
      );

      const videoData = videoResponse.data.items[0];
      setVideoData(videoData);
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  useEffect(() => {
    fetchMostLikedVideo();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('User Logged In Successfully');
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="d-flex">
      {/* Video */}
      <div className="video-container">
        {videoData && (
          <div>
            <h1>Featured Video</h1>
            <iframe
              width='560'
              height='315'
              src={`https://www.youtube.com/embed/${videoData.id}?autoplay=1`}
              title='YouTube Video'
              frameBorder='0'
              allow='autoplay; encrypted-media'
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>

      {/* Sign-in form */}
      <div className="form-container">
        <FormContainer>
          <h1>Sign In</h1>

          <Form onSubmit={submitHandler}>
            <Form.Group className='my-2' controlId='email'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="password">
              <Form.Label>Password</Form.Label>
              <div className="password-input">
                <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </Form.Group>


            <Button disabled={isLoading} type='submit' variant='primary'>
              Sign In
            </Button>

            {isLoading && <Loader />}
          </Form>
          <Row className='py-3'>
            <Col>
              New Customer?{' '}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : '/register'}
                style={{ fontWeight: 'bold', color: 'darkblue' }}
              >
                Register
              </Link>
            </Col>
          </Row>
        </FormContainer>
      </div>
    </div>
  );
};

export default LoginScreen;
