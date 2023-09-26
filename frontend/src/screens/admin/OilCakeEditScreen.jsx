import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
    useGetOilcakeDetailsQuery,
    useUpdateOilcakeMutation,
} from '../../slices/oilcakesApiSlice';
import { TextField, Grid } from '@mui/material';

const OilCakeEditScreen = () => {
  const { id: oilcakeId } = useParams();
  const [name,setName] = useState('');
  const [qty,setQty] = useState('');
  const [date, setDate] = useState(new Date());
  const [cost, setCost] = useState(0);
  const [description, setDescription] = useState('');

  const {
    data: oilcake,
    isLoading,
    refetch,
    error,
  } = useGetOilcakeDetailsQuery(oilcakeId);

  const [updateOilcake, { isLoading: loadingUpdate }] =
    useUpdateOilcakeMutation();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateOilcake({
        oilcakeId,
        name,
        qty,
        date,
        cost,
        description,
      });
      toast.success('Oilcake Entry updated');
      refetch();
      navigate('/admin/oilcakelist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (oilcake) {
        setName(oilcake.name);
        setQty(oilcake.qty);
      setDate(oilcake.date)
      setCost(oilcake.cost);
      setDescription(oilcake.description);
    }
  }, [oilcake]);


  return (
    <>
      <Link to='/admin/oilcakelist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Oil Cake</h1>
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
        label="Name of Buyer"
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
        id="qty"
        label="Quantity"
        name="qty"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
      />
    </Grid>
    <Grid item xs={12}>
    <TextField
        variant="outlined"
        fullWidth
        id="date"
        label="Date"
        name="date"
        type='Date'
        placeholder='Enter Date'
        value={date}
        onChange={(e) => setDate(e.target.value)}
    />
    </Grid>

    <Grid item xs={12}>
      <TextField
        variant="outlined"
        fullWidth
        id="cost"
        label="Price"
        name="cost"
        type="number"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
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

export default OilCakeEditScreen;