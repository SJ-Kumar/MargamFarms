import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';
import blurredBackgroundImage from './trying.png';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel pause='hover' className='mb-4'>
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <div className='carousel-image-container'>
              <Image src={product.image} alt={product.name} fluid className='carousel-image round-image' />
              <div className='blurred-background-image' style={{ backgroundImage: `url(${blurredBackgroundImage})` }} />
              <Carousel.Caption className='carousel-caption'>
                <h2 className='text-white text-right'>
                  {product.name}
                </h2>
              </Carousel.Caption>
            </div>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
