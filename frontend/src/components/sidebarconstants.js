import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";

export const sidebarconstants = [
    {
        title: 'Dashboard',
        icon: HomeOutlinedIcon,
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
        title: 'Your Products',
        icon: StorefrontOutlinedIcon,
        path: '/admin/productlist',
    },
    {
        title: 'Your Orders',
        icon: ShoppingCartOutlinedIcon,
        path: '/admin/orderlist'
    },
    {
        title: 'Invoices Balances',
        icon: ReceiptOutlinedIcon,
        path: 'https://dashboard.razorpay.com/signin?screen=sign_in&utm_medium=website&utm_source=direct',
    },
    
    {
        title: 'Chart',
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
        title: 'Inputs',
        tag: 'divider'
    },
    {
        title: 'Profile',
        icon: PersonOutlinedIcon,
        path: '/profile',
    },
]