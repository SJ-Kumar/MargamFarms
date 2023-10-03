import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import { TextField, Grid } from '@mui/material';

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      });
      toast.success('Product updated');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
             <Grid container spacing={2}>
    <Grid item xs={12}>
      <TextField
        variant="outlined"
        required
        fullWidth
        id="name"
        label="Name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        variant="outlined"
        required
        fullWidth
        id="price"
        label="Price"
        name="price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        variant="outlined"
        required
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

    <Grid item xs={12}>
      <TextField
        variant="outlined"
        fullWidth
        id="brand"
        label="Brand"
        name="brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />
    </Grid>

    <Grid item xs={12}>
      <TextField
        variant="outlined"
        fullWidth
        id="countInStock"
        label="Count In Stock"
        name="countInStock"
        type="number"
        value={countInStock}
        onChange={(e) => setCountInStock(e.target.value)}
      />
    </Grid>
    <Grid item xs={12}>
    <TextField
        variant="outlined"
        fullWidth
        id="category"
        label="Category(Spices or Fruits or Oils or Beans or Grocery) "
        name="category"
        type='text'
        placeholder='Spices or Fruits or Oils or Beans(Groundnut) or Grocery'
        value={category}
        onChange={(e) => setCategory(e.target.value)}
    />
    </Grid>
    <Grid item xs={12}>
    <TextField
        variant="outlined"
        fullWidth
        id="description"
        label="Description"
        name="description"
        type='text'
        placeholder='Enter description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
    />
    </Grid>
</Grid>
            <Button
              type='submit'
              variant='primary'
              style={{ marginTop: '1rem' }}
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;