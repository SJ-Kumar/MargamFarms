import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
    useGetPurchasesQuery,
    useDeletePurchaseMutation,
    useCreatePurchaseMutation
} from '../../slices/purchasesApiSlice';
import SidebarMenu from '../../components/SidebarMenu';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const PurchaseListScreen = () => {
  const { pageNumber } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const { data, isLoading, error, refetch } = useGetPurchasesQuery({
    pageNumber,
  });

  const [deletePurchase, { isLoading: loadingDelete }] =
  useDeletePurchaseMutation();

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

  const [createPurchase, { isLoading: loadingCreate }] =
  useCreatePurchaseMutation();

  const createPurchaseHandler = async () => {
    if (window.confirm('Are you sure you want to create a new purchase?')) {
      try {
        await createPurchase();
        refetch();
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
          <h1>Purchases</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createPurchaseHandler}>
            <FaPlus /> Create Purchase
          </Button>
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
                <th>ID</th>
                <th>NAME</th>
                <th>BRAND</th>
                <th>PURPOSE</th>
                <th>DATE</th>
                <th>COST</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.purchases.map((purchase) => (
                <tr key={purchase._id}>
                  <td>{purchase._id}</td>
                  <td>{purchase.name}</td>
                  <td>{purchase.brand}</td>
                  <td>{purchase.category}</td>
                  <td>{purchase.date}</td>
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
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default PurchaseListScreen;