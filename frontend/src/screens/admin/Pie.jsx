import PieChart from "../../components/Piechart";
import { Box } from "@mui/material";


const Pie = () => {

  return (
      <Box height="85vh" paddingBottom="60px">
        <h1 className="orders-heading">Pie Chart</h1>
        <div style={{ marginBottom: '20px' }}></div>
        <PieChart />
        
      </Box>

  );
};

export default Pie;