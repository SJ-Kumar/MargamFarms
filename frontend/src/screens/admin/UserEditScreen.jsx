import React from 'react'
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { TextField, Grid } from '@mui/material';
import { toast } from "react-toastify";
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../slices/usersApiSlice';

const UserEditScreen = () => {
    const { _id: userId } = useParams();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const { data: user, isLoading, error, refetch } = useGetUserDetailsQuery(userId);
    
    const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

    const navigate = useNavigate();

    useEffect(() => {
        if(user) {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        }
    }, [user]);

    
    const submitHandler = async(e) => {
        e.preventDefault();
        try {
            await updateUser({userId, name, email, isAdmin});
            toast.success('User Updated Successfully');
            refetch();
            navigate('/admin/userlist');
        } catch(err) {
            toast.error(err?.data?.message ||err.error);
        }
    };

  return (
    <>
        <Link to='/admin/userlist' className='btn btn-light my-3'>
            Go Back
        </Link>
        <FormContainer>
            <h1>Edit User</h1>
            <div style={{ marginTop: '32px' }}></div>
            {loadingUpdate && <Loader />}
            {isLoading ? (<Loader />):error ? (<Message variant='danger'>
                {error?.data?.message || error.error}</Message>) : (
                    <Form onSubmit={ submitHandler }>
      <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            </Grid>
                        <Form.Group controlId='isadmin' className='my-3'>
                            <Form.Check
                            type='checkbox'
                            label='Is Admin'
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            ></Form.Check>
                        </Form.Group>
                        <Button
                            type='submit'
                            variant='primary'
                            className='my-3'
                        >
                            Update
                        </Button>
                    </Form>
            )}
        </FormContainer>
    </>
  );
};

export default UserEditScreen;