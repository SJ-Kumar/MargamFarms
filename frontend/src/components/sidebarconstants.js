import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import DashboardIcon from '@mui/icons-material/Dashboard';
import CakeIcon from '@mui/icons-material/Cake';
import RestoreIcon from '@mui/icons-material/Restore';

export const sidebarconstants = [
    {
        title: 'Home',
        icon: HomeOutlinedIcon,
        path: '/',
    },
    {
        title: 'Dashboard',
        icon: DashboardIcon,
        path: '/admin/dashboard',
    },
    {
        title: 'Info',
        tag: 'divider'
    },
    {
        title: 'Manage Users',
        icon: PeopleOutlinedIcon,
        path: '/admin/userlist',
    },
    {
        title: 'Manage Products',
        icon: StorefrontOutlinedIcon,
        path: '/admin/productlist',
    },
    {
        title: 'Manage Orders',
        icon: ShoppingCartOutlinedIcon,
        path: '/admin/currentorderlist'
    },
    {
        title: 'Manage Purchases',
        icon: PaymentOutlinedIcon,
        path: '/admin/purchaseslist'
    },
    {
        title: 'Manage OilCakes',
        icon: CakeIcon,
        path: '/admin/oilcakelist'
    },
    {
        title: 'Invoices Balances',
        icon: ReceiptOutlinedIcon,
        path: 'https://dashboard.razorpay.com/signin?screen=sign_in&utm_medium=website&utm_source=direct',
    },
    
    {
        title: 'Charts',
        tag: 'divider'
    },
    {
        title: 'Pie Chart',
        icon: PieChartOutlineOutlinedIcon,
        path: '/admin/pie',
    },
    {
        title: 'Line Chart',
        icon: TimelineOutlinedIcon,
        path: '/admin/line',
    },
        
    {
        title: 'History',
        tag: 'divider'
    },
    {
        title: 'Orders History',
        icon: RestoreIcon,
        path: '/admin/orderlist',
    },
    {
        title: 'Inputs',
        tag: 'divider'
    },
    {
        title: 'Profile',
        icon: PersonOutlinedIcon,
        path: '/profile',
    },
]