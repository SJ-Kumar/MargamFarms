import Linechart from "../../components/Linechart";
import Piechart from "../../components/Piechart";
import ProgressCircle from "../../components/ProgressCircle";
import StatBox from "../../components/StatBox";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../assets/styles/theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import EmailIcon from "@mui/icons-material/Email";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const Dashboard = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [Data,setData] = useState([]);
  const [totalOrders, setTotalOrders] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);


  useEffect(() => {
    axios
      .get('/api/orders/total-orders')
      .then((response) => {
        setTotalOrders(response.data.totalOrders);
      })
      .catch((error) => {
        console.error('Error fetching total orders:', error);
      });
  }, []);

  useEffect(() => {
    axios
      .get('/api/users/total-customers')
      .then((response) => {
        setTotalUsers(response.data.totalUsers);
      })
      .catch((error) => {
        console.error('Error fetching total orders:', error);
      });
  }, []);
  

  const fetchRecentTransactions = async () => {
    try {
      const response = await axios.get("/api/orders/recent");
      setRecentTransactions(response.data);
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
    }
  };
  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  useEffect(() => {
    axios.get('/api/orders/linechart-sales')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  

  return (
    <Box m="20px">

      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">

      <Typography variant="h4" fontWeight="750" color={colors.grey[100]} marginBottom="15px">
            Welcome to your Dashboard
          </Typography>

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              marginBottom:"15px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>

      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* 🟨🟨🟨🟨🟨🟨 ROW 1 🟨🟨🟨🟨🟨🟨 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="12,361"
            subtitle="Emails Sent"
            progress="0.75"
            increase="+14%"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalOrders !== null ? totalOrders.toString() : 0}
            subtitle="Orders Obtained"
            progress="0.50"
            increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalUsers !== null ? totalUsers.toString() : 0}
            subtitle="Customers"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="1,325,134"
            subtitle="Traffic Received"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* 🟨🟨🟨🟨🟨🟨 ROW 2 🟨🟨🟨🟨🟨🟨 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
          position="relative"
          height="320px"
        >
          <Box
            mt="-15px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
                marginTop="10px"
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                ₹{Data[0]?.totalRevenue}
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="270px" m="-20px 0 0 0" paddingBottom="20px">
            <Linechart isDashboard={true} />
          </Box>
        </Box>
        
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          height="320px"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {recentTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h9"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]} >
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]} >{transaction.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
                color={colors.grey[100]}
              >
                {transaction.cost}
              </Box>
            </Box>
          ))}
        </Box>

        {/* 🟨🟨🟨🟨🟨🟨 ROW 3 🟨🟨🟨🟨🟨🟨 */}
        <Box
          gridColumn="span 5"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          height="320px"
          marginTop="22px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
            color={colors.grey[100]}
            marginBottom="15px"
          >
            Sales Quantity
          </Typography>
          <Box height="300px" mt="-20px">
            <Piechart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
          marginTop="22px"
          height="320px"

        >
          <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>



      </Box>
    </Box>
  );
};

export default Dashboard;