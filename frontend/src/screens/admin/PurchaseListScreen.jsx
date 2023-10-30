import { LinkContainer } from 'react-router-bootstrap';
import React from 'react';
import { Table, Row, Button ,Col } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import PaginateforAdmin from '../../components/PaginateforAdmin';
import {
    useGetPurchasesQuery,
    useDeletePurchaseMutation,
    useCreatePurchaseMutation
} from '../../slices/purchasesApiSlice';
import {
  useGetSalarysQuery,
  useDeleteSalaryMutation,
  useCreateSalaryMutation
} from '../../slices/salarysApiSlice';
import {
  useGetTransportsQuery,
  useDeleteTransportMutation,
  useCreateTransportMutation
} from '../../slices/transportsApiSlice';
import {
  useGetExpensesQuery,
  useDeleteExpenseMutation,
  useCreateExpenseMutation
} from '../../slices/expensesApiSlice';
import { format } from 'date-fns';
import ButtonUI from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  useGetBillsQuery,
  useDeleteBillMutation,
  useCreateBillMutation
} from '../../slices/billsApiSlice';
import SidebarMenu from '../../components/SidebarMenu';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const PurchaseListScreen = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  

  const { pageNumber } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const { data, isLoading, error, refetch } = useGetPurchasesQuery({
    pageNumber,
  });
  const { data : billsdetail, isLoading : isLoadingbills, error: errorbills, refetch: refetchbills } = useGetBillsQuery({
    pageNumber,
  });
  const { data : salarysdetail, isLoading : isLoadingsalarys, error: errorsalarys, refetch: refetchsalarys } = useGetSalarysQuery({
    pageNumber,
  });
  const { data : transportsdetail, isLoading : isLoadingtransports, error: errortransports, refetch: refetchtransports } = useGetTransportsQuery({
    pageNumber,
  });
  const { data : expensesdetail, isLoading : isLoadingexpenses, error: errorexpenses, refetch: refetchexpenses } = useGetExpensesQuery({
    pageNumber,
  });


  const [deletePurchase, { isLoading: loadingDelete }] =
  useDeletePurchaseMutation();

  const [deleteBill, {isLoading: loadingDeletebills}] = useDeleteBillMutation();

  const [deleteSalary, {isLoading: loadingDeletesalarys}] = useDeleteSalaryMutation();

  const [deleteTransport, {isLoading: loadingDeletetransports}] = useDeleteTransportMutation();

  const [deleteExpense, {isLoading: loadingDeleteexpenses}] = useDeleteExpenseMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this purchase')) {
      try {
        await deletePurchase(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  const deleteHandlerBill = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill')) {
      try {
        await deleteBill(id);
        refetchbills();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  const deleteHandlerSalary = async (id) => {
    if (window.confirm('Are you sure you want to delete this salary details')) {
      try {
        await deleteSalary(id);
        refetchsalarys();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  const deleteHandlerTransport = async (id) => {
    if (window.confirm('Are you sure you want to delete this transportation entry')) {
      try {
        await deleteTransport(id);
        refetchtransports();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  const deleteHandlerExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense entry')) {
      try {
        await deleteExpense(id);
        refetchexpenses();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createPurchase, { isLoading: loadingCreate }] =
  useCreatePurchaseMutation();

  const createPurchaseHandler = async () => {
    if (window.confirm('Are you sure you want to create a new purchase?')) {
      try {
        await createPurchase();
        refetch();
        handleMenuClose();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  
  const [createBill, { isLoading: loadingCreatebills }] =
  useCreateBillMutation();

  const createHandlerBill = async () => {
    if (window.confirm('Are you sure you want to create a new bill?')) {
      try {
        await createBill();
        refetchbills();
        handleMenuClose();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createSalary, { isLoading: loadingCreatesalarys }] =
  useCreateSalaryMutation();

  const createHandlerSalary = async () => {
    if (window.confirm('Are you sure you want to create a new salary entry?')) {
      try {
        await createSalary();
        refetchsalarys();
        handleMenuClose();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createTransport, { isLoading: loadingCreatetransports }] =
  useCreateTransportMutation();

  const createHandlerTransport = async () => {
    if (window.confirm('Are you sure you want to create a new transportation entry?')) {
      try {
        await createTransport();
        refetchtransports();
        handleMenuClose();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createExpense, { isLoading: loadingCreateexpenses }] =
  useCreateExpenseMutation();

  const createHandlerExpense = async () => {
    if (window.confirm('Are you sure you want to create a new expense entry?')) {
      try {
        await createExpense();
        refetchexpenses();
        handleMenuClose();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
     {userInfo?.isAdmin && <SidebarMenu />}
     <Row className='align-items-center'>
  <Col>
    <h1>Raw Materials</h1>
  </Col>
  <Col className='text-end'>
    <ButtonUI
      id="add-item-button"
      variant='contained'
      disableElevation
      onClick={handleMenuClick}
      endIcon={<KeyboardArrowDownIcon />}
    >
      Add Item
    </ButtonUI>
    <Menu
      id="add-item-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => createPurchaseHandler()}>Raw Material</MenuItem>
      <MenuItem onClick={() => createHandlerBill()}>EB Bill</MenuItem>
      <MenuItem onClick={() => createHandlerSalary()}>Worker Salary</MenuItem>
      <MenuItem onClick={() => createHandlerTransport()}>Transportation</MenuItem>
      <MenuItem onClick={() => createHandlerExpense()}>Other Expenses</MenuItem>
    </Menu>
  </Col>
</Row>


      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                
                <th>NAME</th>
                <th>BRAND</th>
                <th>PURPOSE</th>
                <th>QUANTITY</th>
                <th>DATE</th>
                <th>DESCRIPTION</th>
                <th>COST</th>

                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.purchases.map((purchase) => (
                <tr key={purchase._id}>
                  
                  <td>{purchase.name}</td>
                  <td>{purchase.brand}</td>
                  <td>{purchase.category}</td>
                  <td>{purchase.qty}</td>
                  <td>{format(new Date(purchase.date), 'yyyy-MM-dd')}</td>
                  <td>{purchase.description}</td>
                  <td>₹{purchase.cost}</td>
                  
                  
                  <td>
                   <LinkContainer to={`/admin/purchases/${purchase._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(purchase._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <PaginateforAdmin pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
      <Row className='align-items-center'>
        <Col>
          <h1>EB Bill</h1>
        </Col>
      </Row>

      {loadingCreatebills && <Loader />}
      {loadingDeletebills && <Loader />}
      {isLoadingbills ? (
        <Loader />
      ) : errorbills ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
              
                <th>FROM DATE</th>
                <th>TO DATE</th>
                <th>COST</th>
                <th>DESCRIPTION</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {billsdetail && billsdetail.bills.map((bill) => (
                <tr key={bill._id}>
                  
                  <td>{format(new Date(bill.from_date), 'yyyy-MM-dd')}</td>
                  <td>{format(new Date(bill.to_date), 'yyyy-MM-dd')}</td>
                  <td>₹{bill.cost}</td>
                  <td>{bill.description}</td>                
                  
                  <td>
                   <LinkContainer to={`/admin/bills/${bill._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandlerBill(bill._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <PaginateforAdmin pages={billsdetail.pages} page={billsdetail.page} isAdmin={true} />
        </>
      )}
      <Row className='align-items-center'>
        <Col>
          <h1>Workers Salary</h1>
        </Col>
      </Row>

      {loadingCreatesalarys && <Loader />}
      {loadingDeletesalarys && <Loader />}
      {isLoadingsalarys ? (
        <Loader />
      ) : errorsalarys ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
              
              <th>WORKER NAME</th>
                <th>FROM DATE</th>
                <th>TO DATE</th>
                <th>SALARY</th>
                <th>DESCRIPTION</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {salarysdetail && salarysdetail.salarys.map((salary) => (
                <tr key={salary._id}>
                  
                  <td>{salary.name}</td>
                  <td>{format(new Date(salary.from_date), 'yyyy-MM-dd')}</td>
                  <td>{format(new Date(salary.to_date), 'yyyy-MM-dd')}</td>
                  <td>₹{salary.cost}</td>
                  <td>{salary.description}</td>                
                  
                  <td>
                   <LinkContainer to={`/admin/salarys/${salary._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandlerSalary(salary._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <PaginateforAdmin pages={salarysdetail.pages} page={salarysdetail.page} isAdmin={true} />
        </>
      )}
            <Row className='align-items-center'>
        <Col>
          <h1>Transportation</h1>
        </Col>
      </Row>

      {loadingCreatetransports && <Loader />}
      {loadingDeletetransports && <Loader />}
      {isLoadingtransports ? (
        <Loader />
      ) : errortransports ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
              
              <th>ITEM NAME</th>
                <th>DATE</th>
                <th>QUANTITY</th>
                <th>TRANSPORT COST</th>
                <th>DESCRIPTION</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {transportsdetail && transportsdetail.transports.map((transport) => (
                <tr key={transport._id}>
                
                  <td>{transport.name}</td>
                  <td>{format(new Date(transport.date), 'yyyy-MM-dd')}</td>
                  <td>{transport.qty}</td>
                  <td>₹{transport.cost}</td>
                  <td>{transport.description}</td>                
                  
                  <td>
                   <LinkContainer to={`/admin/transports/${transport._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandlerTransport(transport._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <PaginateforAdmin pages={transportsdetail.pages} page={transportsdetail.page} isAdmin={true} />
        </>
      )}
                  <Row className='align-items-center'>
        <Col>
          <h1>Other Expenses</h1>
        </Col>
      </Row>

      {loadingCreateexpenses && <Loader />}
      {loadingDeleteexpenses && <Loader />}
      {isLoadingexpenses ? (
        <Loader />
      ) : errorexpenses ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
              
              <th>EXPENSE NAME</th>
                <th>DATE</th>
                <th>COST</th>
                <th>DESCRIPTION</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {expensesdetail && expensesdetail.expenses.map((expense) => (
                <tr key={expense._id}>
                 
                  <td>{expense.name}</td>
                  <td>{format(new Date(expense.date), 'yyyy-MM-dd')}</td>
                  <td>₹{expense.cost}</td>
                  <td>{expense.description}</td>                
                  
                  <td>
                   <LinkContainer to={`/admin/expenses/${expense._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandlerExpense(expense._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <PaginateforAdmin pages={expensesdetail.pages} page={expensesdetail.page} isAdmin={true} />
        </>
      )}

    </>
  );
};

export default PurchaseListScreen;