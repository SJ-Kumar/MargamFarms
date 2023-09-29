import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetCurrentOrdersQuery } from '../../slices/ordersApiSlice';
import ExcelJS from 'exceljs';
import SidebarMenu from '../../components/SidebarMenu';
import { useSelector } from 'react-redux';
import saveAs from 'file-saver';


const CurrentOrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetCurrentOrdersQuery();
  const { userInfo } = useSelector((state) => state.auth);
  const downloadOrdersAsExcel = (orders) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orders');
    
    // Add headers
    const headers = ['ID', 'USER', 'DATE', 'TOTAL', 'PAID', 'DELIVERED'];
    worksheet.addRow(headers);
    
    // Add data rows
    orders.forEach((order) => {
      worksheet.addRow([
        order._id,
        order.user && order.user.name,
        order.createdAt.substring(0, 10),
        `₹${order.totalPrice}`,
        order.isPaid ? order.paidAt.substring(0, 10) : 'Not Paid',
        order.isDelivered ? order.deliveredAt.substring(0, 10) : 'Not Delivered',
      ]);
    });
  
    // Create a blob and save the file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'orders.xlsx');
    });
  };
  

  return (
    <>
    {userInfo?.isAdmin && <SidebarMenu />}
    <div className="header-container">
      <h1 className="orders-heading">Recent Orders</h1>
      <Button
        variant="success"
        className="btn-sm download-button"
        onClick={() => downloadOrdersAsExcel(orders)}
      >
        Download as Excel
      </Button>
    </div>
      
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>₹{order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                <LinkContainer to={order.paymentMethod === 'COD' ? `/order/cod/${order._id}` : `/order/online/${order._id}`}>
                    <Button variant='light' className='btn-sm'>
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default CurrentOrderListScreen;