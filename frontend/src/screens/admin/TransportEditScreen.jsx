import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
    useGetTransportDetailsQuery,
    useUpdateTransportMutation,
} from '../../slices/transportsApiSlice';
import { TextField, Grid } from '@mui/material';

const TransportEditScreen = () => {
  const { id: transportId } = useParams();

  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [date, setDate] = useState(new Date());
  const [cost, setCost] = useState(0);
  const [description, setDescription] = useState('');

  const {
    data: transport,
    isLoading,
    refetch,
    error,
  } = useGetTransportDetailsQuery(transportId);

  const [updateTransport, { isLoading: loadingUpdate }] =
    useUpdateTransportMutation();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateTransport({
        transportId,
        name,
        qty,
        date,
        cost,
        description,
      });
      toast.success('Transportation updated');
      refetch();
      navigate('/admin/purchaseslist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (transport) {
      setName(transport.name);
      setQty(transport.qty);
      setDate(transport.date)
      setCost(transport.cost);
      setDescription(transport.description);
    }
  }, [transport]);


  return (
    <>
      <Link to='/admin/purchaseslist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Transportation</h1>
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
        label="Item Name"
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
        required
        fullWidth
        id="cost"
        label="Transport Cost"
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

export default TransportEditScreen;