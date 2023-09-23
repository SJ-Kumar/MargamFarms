import Linechart from "../../components/Linechart";
import { Box } from "@mui/material";
import SidebarMenu from "../../components/SidebarMenu";
import {useSelector} from 'react-redux';

const Line = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <>
    {userInfo?.isAdmin && <SidebarMenu />}
    <Box height="85vh" paddingBottom="20px">
    <h1 className="orders-heading">Line Chart</h1>
    <Linechart />
  </Box>
  </>
  );
};

export default Line;