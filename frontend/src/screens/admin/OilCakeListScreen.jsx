import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useGetOilcakesQuery,
  useDeleteOilcakeMutation,
  useCreateOilcakeMutation,
} from '../../slices/oilcakesApiSlice';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import SidebarMenu from '../../components/SidebarMenu';
import { useSelector } from 'react-redux';
import PaginateforOilCake from '../../components/PaginateforOilCake';

const OilCakeListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetOilcakesQuery({
    pageNumber,
  });
  const { userInfo } = useSelector((state) => state.auth);

  const [deleteOilcake, { isLoading: loadingDelete }] =
    useDeleteOilcakeMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this oil cake entry')) {
      try {
        await deleteOilcake(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createOilcake, { isLoading: loadingCreate }] =
    useCreateOilcakeMutation();

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new oil cake entry?')) {
      try {
        await createOilcake();
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
          <h1>Oil Cake</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createProductHandler}>
            <FaPlus /> Create Oilcake Entry 
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
                <th>NAME OF BUYER</th>
                <th>QUANTITY</th>
                <th>DATE</th>
                <th>PRICE</th>
                <th>DESCRIPTION</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.oilcakes.map((oilcake) => (
                <tr key={oilcake._id}>
                  <td>{oilcake.name}</td>
                  <td>{oilcake.qty}</td>
                  <td>{format(new Date(oilcake.date), 'yyyy-MM-dd')}</td>
                  <td>₹{oilcake.cost}</td>
                  <td>{oilcake.description}</td>
                  <td>
                   <LinkContainer to={`/admin/oilcakes/${oilcake._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(oilcake._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <PaginateforOilCake pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default OilCakeListScreen;