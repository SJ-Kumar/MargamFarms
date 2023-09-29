import Linechart from "../../components/Linechart";
import Piechart from "../../components/Piechart";
import ProgressCircle from "../../components/ProgressCircle";
import StatBox from "../../components/StatBox";
import { Box, IconButton, Typography, useTheme,useMediaQuery } from "@mui/material";
import { tokens } from "../../assets/styles/theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import StoreIcon from '@mui/icons-material/Store';
import EmailIcon from "@mui/icons-material/Email";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import SidebarMenu from "../../components/SidebarMenu";

const Dashboard = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentPurchases,setRecentPurchases] = useState([]);
  const [Data,setData] = useState([]);
  const [totalOrders, setTotalOrders] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalProducts,setTotalProducts] = useState(null);
  const [TotalPurchaseCost, setTotalPurchaseCost] = useState(null);
  const [TotalBillCost, setTotalBillCost] = useState(null);
  const [TotalSalaryCost, setTotalSalaryCost] = useState(null);
  const [TotalTransportCost, setTotalTransportCost] = useState(null);
  const [TotalExpenseCost, setTotalExpenseCost] = useState(null);
  const [TotalOilcakeCost, setTotalOilcakeCost] = useState(null);
  const profit = (Data[0]?.totalRevenue - TotalPurchaseCost - TotalBillCost - TotalSalaryCost - TotalTransportCost - TotalExpenseCost)+ TotalOilcakeCost;
  const formattedProfit = profit < 0 ? 'Loss' : 'Profit';
  const { userInfo } = useSelector((state) => state.auth);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


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

  useEffect(() => {
    axios
      .get('/api/products/total-products')
      .then((response) => {
        setTotalProducts(response.data.totalProducts);
      })
      .catch((error) => {
        console.error('Error fetching total products:', error);
      });
  }, []);
  useEffect(() => {
    axios
      .get('/api/purchases/total-purchases')
      .then((response) => {
        setTotalPurchaseCost(response.data.totalCost);
      })
      .catch((error) => {
        console.error('Error fetching total purchase cost:', error);
      });
  }, []);
  useEffect(() => {
    axios
      .get('/api/bills/total-bills')
      .then((response) => {
        setTotalBillCost(response.data.totalCost);
      })
      .catch((error) => {
        console.error('Error fetching total bill cost:', error);
      });
  }, []);
  useEffect(() => {
    axios
      .get('/api/salarys/total-salarys')
      .then((response) => {
        setTotalSalaryCost(response.data.totalCost);
      })
      .catch((error) => {
        console.error('Error fetching total salary cost:', error);
      });
  }, []);
  useEffect(() => {
    axios
      .get('/api/transports/total-transports')
      .then((response) => {
        setTotalTransportCost(response.data.totalCost);
      })
      .catch((error) => {
        console.error('Error fetching total transport cost:', error);
      });
  }, []);
  useEffect(() => {
    axios
      .get('/api/expenses/total-expenses')
      .then((response) => {
        setTotalExpenseCost(response.data.totalCost);
      })
      .catch((error) => {
        console.error('Error fetching total expense cost:', error);
      });
  }, []);
  useEffect(() => {
    axios
      .get('/api/oilcakes/total-oilcakes')
      .then((response) => {
        setTotalOilcakeCost(response.data.totalCost);
      })
      .catch((error) => {
        console.error('Error fetching total expense cost:', error);
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

  const fetchRecentPurchases = async () => {
    try {
      const response = await axios.get("/api/purchases/recent-purchases");
      setRecentPurchases(response.data);
    } catch (error) {
      console.error("Error fetching recent purchases:", error);
    }
  };
  useEffect(() => {
    fetchRecentPurchases();
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
    <>
    {userInfo?.isAdmin && <SidebarMenu />}
    <Box m="20px" paddingLeft={isMobile ? "50px" : 0}>

      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">

      <Typography variant="h4" fontWeight="750" color={colors.grey[100]} marginBottom="15px">
            Welcome to your Dashboard
          </Typography>

{/*         <Box>
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
        </Box> */}

      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns={isMobile ? "1fr" : "repeat(12, 1fr)"}
        gridAutoRows={isMobile ? "auto" : "140px"}
        gap="20px"
      >
        {/* 🟨🟨🟨🟨🟨🟨 ROW 1 🟨🟨🟨🟨🟨🟨 */}
        <Box
          gridColumn={isMobile ? "span 12" : "span 3"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalOrders !== null ? totalOrders.toString() : 0}
            subtitle="Emails Sent"
            progress="0.50"
            increase="+21%"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn={isMobile ? "span 12" : "span 3"}
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
          gridColumn={isMobile ? "span 12" : "span 3"}
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
          gridColumn={isMobile ? "span 12" : "span 3"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalProducts !== null ? totalProducts.toString() : 0}
            subtitle="Total Products"
            progress="0.30"
            increase="+10%"
            icon={
              <StoreIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* 🟨🟨🟨🟨🟨🟨 ROW 2 🟨🟨🟨🟨🟨🟨 */}
        <Box
        gridColumn={isMobile ? "span 12" : "span 8"}
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
          <Box height="270px" m="-20px 0 0 0" paddingBottom="20px" width="109%">
            <Linechart isDashboard={true} />
          </Box>
        </Box>
        
        <Box
gridColumn={isMobile ? "span 12" : "span 4"}
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
            gridColumn={isMobile ? "span 12" : "span 4"}
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
          <Box height="260px" mt="-5px">
            <Piechart isDashboard={true} />
          </Box>
        </Box>
        <Box
gridColumn={isMobile ? "span 12" : "span 4"}
gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
          marginTop="22px"
          height="320px"

        >
          <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
          {formattedProfit}
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h4"
              fontWeight="600"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              ₹{Math.abs(profit)}
            </Typography>
            <Typography>Excluding Shipping Costs</Typography>
          </Box>
        </Box>
        <Box
            gridColumn={isMobile ? "span 12" : "span 4"}
            gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          height="320px"
          marginTop="22px"
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
              Recent Purchases
            </Typography>
          </Box>
          {recentPurchases.map((purchase, i) => (
            <Box
              key={`${purchase.txId}-${i}`}
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
                  {purchase.txId}
                </Typography>
                <Typography color={colors.grey[100]} >
                  {purchase.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]} >{purchase.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
                color={colors.grey[100]}
              >
                {purchase.cost}
              </Box>
            </Box>
          ))}
        </Box>



      </Box>
    </Box>
    </>
  );
};

export default Dashboard;