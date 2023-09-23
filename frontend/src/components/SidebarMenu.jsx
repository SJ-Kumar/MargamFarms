import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { sidebarconstants } from "./sidebarconstants";
import { useLocation } from "react-router-dom";
import { tokens } from "../assets/styles/theme";
import React,{ useState } from "react";
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { resetCart } from '../slices/cartSlice';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SidebarMenuItem from "./SidebarMenuItem";
import "react-pro-sidebar/dist/css/styles.css";
import defaultImage from './default.jpg';
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import { useNavigate } from 'react-router-dom';


const SidebarMenu = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();
  const location = useLocation();
  const urlPathName = location.pathname;
  const { userInfo } = useSelector((state) => state.auth);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState(urlPathName);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      //handleSnackbarOpen('Logged Out Successfully');
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        width: "10px", // Set the width of the sidebar
        position: "fixed", // Fixed position to keep it on the left
        top: 0,
        left: 0,
        height: "100%", // Make it full height
        zIndex: 1000, // Ensure it's above other elements
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>

        <Menu iconShape="square">

          {/* LOGO AND MENU ICON */}
          {/* 🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧 */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {
              !isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >

                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )
            }
          </MenuItem>

          {/* 🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧 */}
          {
            !isCollapsed && (
              <Box mb="25px">

                <Box display="flex" justifyContent="center" alignItems="center">
                <Link to="/profile"> 
    <img
      alt="profile-user"
      width="170px"
      height="170px"
      src={userInfo?.image || defaultImage}
      style={{ cursor: "pointer", borderRadius: "50%" }}
    />
    </Link>
                </Box>

                <Box textAlign="center">
  {userInfo && userInfo.name ? (
    <>
      <Typography
        variant="h4"
        fontWeight="bold"
        color={colors.grey[100]}
        sx={{ m: "10px 0 0 0" }}
      >
        {userInfo.name}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[500]}>
        {userInfo.isAdmin ? "Admin" : "User"}
      </Typography>
    </>
  ) : (
    <Typography
      variant="h4"
      fontWeight="bold"
      color={colors.grey[100]}
      sx={{ m: "10px 0 0 0", cursor: "pointer" }}
      //onClick={() => navigate('/login')}
      style={{ color: colors.primary[100] }}
    >
      Sign In
    </Typography>
  )}
</Box>

              </Box>
            )
          }

          {/* 🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧 */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {
              sidebarconstants.map(menu =>
                menu.tag === 'divider'
                  ?
                  <Typography
                    variant="h6"
                    key={menu.title}
                    color={colors.grey[300]}
                    sx={{ m: "15px 0 5px 20px" }}
                  >
                    {menu.title}
                  </Typography>
                  :
                  <SidebarMenuItem
                    key={menu.title}
                    menu={menu}
                    selected={selected}
                    setSelected={setSelected}
                  />
              )
            }
{userInfo && userInfo.name ? (
  <MenuItem
    icon={<ExitToAppOutlinedIcon />}
    onClick={logoutHandler}
    style={{ color: colors.primary[100] }}
  >
    <Typography>Logout</Typography>
  </MenuItem>
) : null}

          </Box>

        </Menu>

      </ProSidebar>
    </Box>
  );
};

export default SidebarMenu;
