import React from 'react';
import { useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ProductCarousel from '../components/ProductCarousel';
import { useParams } from 'react-router-dom';
import Paginate from '../components/Paginate';
import SidebarMenu from '../components/SidebarMenu';
import i1 from "../assets/i1.jpeg";
import i2 from "../assets/i2.jpeg";
import i3 from "../assets/i3.jpeg";
import i4 from "../assets/i4.jpeg";
import i5 from "../assets/i5.jpeg";
import i6 from "../assets/i6.jpeg";
import i7 from "../assets/i7.jpeg";
import i8 from "../assets/i8.jpeg";
import i9 from "../assets/i9.jpeg";
import i10 from "../assets/i10.jpeg";
import i11 from "../assets/i11.jpeg";
import i12 from "../assets/i12.jpeg";
import i13 from "../assets/i13.jpeg";
import { ExternalLink } from 'react-external-link';
import Marquee from "react-fast-marquee";
import '../components/FollowUs.css';

const FollowUs = () => {


  return (
    <div className='flex flex-row gap-28 mt-44 flex-wrap mb-36'>
      <p className='igText '> GLIMPSE OF OUR FARM </p>


      <div className='followOnInstaMarqueeConatiner' style={{marginTop:"70px"}}>
        <Marquee pauseOnHover={true} speed={100}>
        <ExternalLink href='https://twitter.com/MargamFarm/status/1705897962541666456/photo/1' >
            <img src={i1} alt='Farm' className=' w-60 rounded-2xl   mrMl carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://twitter.com/MargamFarm/status/1705897962541666456/photo/3'>
            <img src={i2} alt='Farm' className=' w-60 rounded-2xl  mrMl  carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://twitter.com/MargamFarm/status/1675726893402951681/photo/1'>
            <img src={i3} alt='Farm' className=' w-60 rounded-2xl   mrMl carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://twitter.com/MargamFarm/status/1675726472408076289/photo/1'>
            <img src={i4} alt='Farm' className=' w-60 rounded-2xl   mrMl carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://twitter.com/MargamFarm/status/1675725810538541058/photo/3'>
            <img src={i5} alt='Farm' className=' w-60 rounded-2xl  mrMl  carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://twitter.com/MargamFarm/status/1675725559983378432/photo/2'>
            <img src={i6} alt='Farm' className=' w-60 rounded-2xl  mrMl  carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://twitter.com/MargamFarm/status/1617065456292212737/photo/1'>
            <img src={i7} alt='Farm' className=' w-60 rounded-2xl   mrMl carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://twitter.com/MargamFarm/status/1617065305007849478/photo/1'>
            <img src={i8} alt='Farm' className=' w-60 rounded-2xl   mrMl carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://twitter.com/MargamFarm/status/1617063384633208832/photo/4'>
            <img src={i9} alt='Farm' className=' w-60 rounded-2xl  mrMl carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://twitter.com/MargamFarm/status/1541070495704985600/photo/1'>
            <img src={i10} alt='Farm' className=' w-60 rounded-2xl  mrMl  carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://twitter.com/MargamFarm/status/1539933993285537792/photo/1'>
            <img src={i11} alt='Farm' className=' w-60 rounded-2xl  mrMl  carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://twitter.com/MargamFarm/status/1541339012639559681/photo/1'>
            <img src={i12} alt='Farm' className=' w-60 rounded-2xl  mrMl  carouselIMg' />
          </ExternalLink>

          <ExternalLink href='https://twitter.com/MargamFarm/status/1539081484614529026/photo/1'>
            <img src={i13} alt='Farm' className=' w-60 rounded-2xl  mrMl  carouselIMg' />
          </ExternalLink>
          
        </Marquee>
      </div>
    </div>
  );
};

const HomeScreen = () => {
  const { keyword, pageNumber } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      {userInfo?.isAdmin && <SidebarMenu />}

      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <h1 className='latest-products-title'>PRODUCTS</h1>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''} />
          <div style={{marginTop:"-30px"}}>
          <FollowUs />
          </div>
          
        </>
      )}
    </>
  );
};

export default HomeScreen;
