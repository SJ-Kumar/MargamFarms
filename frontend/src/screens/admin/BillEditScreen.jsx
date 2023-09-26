import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
    useGetBillDetailsQuery,
    useUpdateBillMutation,
} from '../../slices/billsApiSlice';
import { TextField, Grid } from '@mui/material';

const BillEditScreen = () => {
  const { id: billId } = useParams();
  const [from_date, setfrom_Date] = useState(new Date());
  const [to_date, setto_Date] = useState(new Date());
  const [cost, setCost] = useState(0);
  const [description, setDescription] = useState('');

  const {
    data: bill,
    isLoading,
    refetch,
    error,
  } = useGetBillDetailsQuery(billId);

  const [updateBill, { isLoading: loadingUpdate }] =
    useUpdateBillMutation();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateBill({
        billId,
        from_date,
        to_date,
        cost,
        description,
      });
      toast.success('Bill updated');
      refetch();
      navigate('/admin/purchaseslist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (bill) {
      setfrom_Date(bill.from_date)
      setto_Date(bill.to_date)
      setCost(bill.cost);
      setDescription(bill.description);
    }
  }, [bill]);


  return (
    <>
      <Link to='/admin/purchaseslist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Bill</h1>
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
        fullWidth
        id="from_date"
        label="From Date"
        name="from_date"
        type='Date'
        placeholder='Enter From Date'
        value={from_date}
        onChange={(e) => setfrom_Date(e.target.value)}
    />
    </Grid>
    <Grid item xs={12}>
    <TextField
        variant="outlined"
        fullWidth
        id="to_date"
        label="To Date"
        name="to_date"
        type='Date'
        placeholder='Enter To Date'
        value={to_date}
        onChange={(e) => setto_Date(e.target.value)}
    />
    </Grid>
    <Grid item xs={12}>
      <TextField
        variant="outlined"
        fullWidth
        id="cost"
        label="Cost"
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

export default BillEditScreen;