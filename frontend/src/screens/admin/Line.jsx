import Linechart from "../../components/Linechart";
import { Box } from "@mui/material";

const Line = () => {

  return (
    <Box height="85vh" paddingBottom="20px">
    <h1 className="orders-heading">Line Chart</h1>
    <Linechart />
  </Box>
  );
};

export default Line;