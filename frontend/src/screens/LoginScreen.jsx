import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import axios from 'axios';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import YouTube from 'react-youtube';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { TextField,Grid } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { useTheme,useMediaQuery } from "@mui/material";


const LoginScreen = () => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //const [videoData, setVideoData] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [videoDataList, setVideoDataList] = useState([]);
const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';
  const [showPassword, setShowPassword] = useState(false);

  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };
  
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const fetchMostLikedVideos = async () => {
    try {
      const response = await axios.get(
        'https://www.googleapis.com/youtube/v3/search',
        {
          params: {
            part: 'snippet',
            channelId: 'UCjKvB7E6YiqV9_UMjBC9BHA', // Replace with your YouTube channel ID
            order: 'date',
            maxResults: 10, // Retrieve multiple videos (you can change this number)
            key: 'AIzaSyD0gbH6qSaSGJNhU4TsQH-Xs8genUcuGEc', // Replace with your actual YouTube Data API key
          },
        }
      );
  
      const videoIds = response.data.items.map((item) => item.id.videoId);
      
      const videoDataArray = await Promise.all(
        videoIds.map(async (videoId) => {
          const videoResponse = await axios.get(
            'https://www.googleapis.com/youtube/v3/videos',
            {
              params: {
                part: 'snippet',
                id: videoId,
                key: 'AIzaSyD0gbH6qSaSGJNhU4TsQH-Xs8genUcuGEc',
              },
            }
          );
          return videoResponse.data.items[0];
        })
      );
  
      setVideoDataList(videoDataArray);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };
  useEffect(() => {
    fetchMostLikedVideos();
  }, []);
  
  const handleVideoEnd = () => {
    if (currentVideoIndex < videoDataList.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      // Reset to the first video when reaching the end
      setCurrentVideoIndex();
    }
  };
  
  
  
  

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      handleSnackbarOpen('Logged in Successfully');
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
      {videoDataList.length > 0 && (
  <div>
    <h1>Featured Video</h1>
    <YouTube
      videoId={videoDataList[currentVideoIndex].id}
      opts={{
          width: isMobile ? '340' : '560',
          height: isMobile ? '315' : '315',
        playerVars: {
          autoplay: 1,
          controls: 1,
        },
      }}
      onEnd={handleVideoEnd}
    />
    <br />
  </div>
  
)}


      </div>

      {/* Sign-in form */}
      <div className="form-container">
        <FormContainer>
          <h1>Sign In</h1>

          <Form onSubmit={submitHandler}>
          <Grid container spacing={2}>
          <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  style: {
                    width: isMobile ? '62%' : 'auto', // Set width to 100% on mobile view
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  style: {
                    width: isMobile ? '62%' : 'auto', // Set width to 100% on mobile view
                  },
                  endAdornment: (
                    <div
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  ),
                }}
              />
            </Grid>
            </Grid>

            <div style={{ marginTop: '16px' }}>

            <Button disabled={isLoading} type='submit' variant='primary' className='btn-for-all-screens'>
              Sign In
            </Button>
            </div>

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
        </FormContainer>
      </div>
    </div>
  );
};

export default LoginScreen;