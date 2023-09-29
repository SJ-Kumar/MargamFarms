import { Container } from "react-bootstrap";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Footer from './components/Footer';

const App = () => {

  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  
useEffect(() => {
  if (userInfo && userInfo.isAdmin) {
    navigate('/admin/dashboard');
  }
}, [userInfo, navigate]);
  return (
    <>
      <Header />
      <main className='py-3'>
        <Container>
          <Outlet />
        </Container>
      </main>
      {location.pathname !== '/cart' && <Footer />}
      <ToastContainer />
    </>
  );
};
export default App;