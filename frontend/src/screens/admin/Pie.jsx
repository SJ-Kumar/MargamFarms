import PieChart from "../../components/Piechart";
import { Box } from "@mui/material";
import SidebarMenu from '../../components/SidebarMenu';
import { useSelector } from 'react-redux';


const Pie = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <>
    {userInfo?.isAdmin && <SidebarMenu />}
      <Box height="85vh" paddingBottom="60px">
        <h1 className="orders-heading">Pie Chart</h1>
        <div style={{ marginBottom: '20px' }}></div>
        <PieChart />
        
      </Box>
    </>
  );
};

export default Pie;