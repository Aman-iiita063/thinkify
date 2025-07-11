import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
  Avatar,
  useTheme,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PollIcon from "@mui/icons-material/Poll";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import QuizIcon from "@mui/icons-material/Quiz";

import NavBar from "./NavBar";
import Footer from "./Footer";
import Cookies from "js-cookie";
import useThinkify from "../hooks/useThinkify";
import AlertBox from "../../components/common/AlertBox";
import { useEffect, useState } from "react";
import SellIcon from "@mui/icons-material/Sell";

const UserSideBar = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);
  const theme = useTheme();
  const { setAlertBoxOpenStatus, setAlertMessage, setAlertSeverity } =
    useThinkify();

  const baseListData = [
    {
      label: "My Profile",
      url: "/profile",
      icon: <DashboardIcon />,
    },
    {
      label: "My Post",
      url: "/my-post",
      icon: <ListAltIcon />,
    },
    {
      label: "Add Post",
      url: "/add-post",
      icon: <AddBoxIcon />,
    },
    {
      label: "Add Product",
      url: "/add-product",
      icon: <AddShoppingCartIcon />,
    },
    {
      label: "My Product",
      url: "/my-product",
      icon: <SellIcon />,
    },
    {
      label: "Task Manager",
      url: "/task-management",
      icon: <PlaylistAddCheckIcon />,
    },
    {
      label: "Setting",
      url: "/setting",
      icon: <SettingsIcon />,
    },
  ];

  const studentListData = [
    {
      label: "Assignments",
      url: "/assignments",
      icon: <AssignmentIcon />,
    },
  ];

  const commonFeaturesData = [
    {
      label: "Posts",
      url: "/posts",
      icon: <ListAltIcon />,
    },
    {
      label: "Polls",
      url: "/polls",
      icon: <PollIcon />,
    },
    {
      label: "Tests",
      url: "/tests",
      icon: <QuizIcon />,
    },
  ];

  const teacherListData = [
    {
      label: "Resources",
      url: "/resources",
      icon: <LibraryBooksIcon />,
    },
  ];

  const getListData = () => {
    let listData = [...baseListData];

    // Show assignments only to students (users)
    if (userRole === "user") {
      listData = [...listData, ...studentListData];
    }

    // Show polls and tests to all users
    listData = [...listData, ...commonFeaturesData];

    // Show teacher features to teachers, institutions, and admins
    if (["teacher", "institution", "admin"].includes(userRole)) {
      listData = [...listData, ...teacherListData];
    }

    return listData;
  };

  const handleLogOut = async () => {
    setAlertBoxOpenStatus(true);
    setAlertSeverity("success");
    setAlertMessage("Logged Out Successfully");
    Cookies.remove(import.meta.env.VITE_TOKEN_KEY, { path: "" });
    Cookies.remove(import.meta.env.VITE_USER_ROLE, { path: "" });
    navigate("/login");
  };

  useEffect(() => {
    const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
    const role = Cookies.get(import.meta.env.VITE_USER_ROLE);
    if (!token || !role) {
      Cookies.remove(import.meta.env.VITE_TOKEN_KEY, { path: "" });
      Cookies.remove(import.meta.env.VITE_USER_ROLE, { path: "" });
      navigate("/login");
    } else {
      setUserRole(role);
    }
  }, []);

  const isActive = (url) => location.pathname === url;

  return (
    <div>
      <NavBar withSidebar={true} />
      <AlertBox />
      <Box sx={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
        <Drawer
          variant="permanent"
          sx={{
            width: 280,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 280,
              boxSizing: "border-box",
              backgroundColor: "#ffffff",
              borderRight: "1px solid rgba(0, 0, 0, 0.08)",
              boxShadow: "2px 0 8px rgba(0, 0, 0, 0.08)",
            },
          }}
        >
          <Box sx={{ p: 3, borderBottom: "1px solid rgba(0, 0, 0, 0.08)" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 48,
                  height: 48,
                  fontSize: "1.2rem",
                  fontWeight: 600,
                }}
              >
                {userRole?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1b2e35" }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#666", textTransform: "capitalize" }}
                >
                  {userRole || "User"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ overflow: "auto", flex: 1 }}>
            <List sx={{ p: 0 }}>
              {getListData().map(({ label, url, icon }, index) => (
                <ListItem
                  key={label + "_" + index}
                  sx={{
                    px: 3,
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: isActive(url)
                        ? "rgba(89, 227, 167, 0.1)"
                        : "rgba(0, 0, 0, 0.04)",
                    },
                    transition: "all 0.2s ease",
                  }}
                  component="div"
                >
                  <NavLink
                    to={url}
                    style={{
                      width: "100%",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      color: isActive(url)
                        ? theme.palette.primary.main
                        : "#666",
                      fontWeight: isActive(url) ? 600 : 400,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive(url)
                          ? theme.palette.primary.main
                          : "#666",
                        minWidth: 40,
                      }}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={label}
                      sx={{
                        "& .MuiListItemText-primary": {
                          fontSize: "0.95rem",
                          fontWeight: isActive(url) ? 600 : 400,
                        },
                      }}
                    />
                  </NavLink>
                </ListItem>
              ))}

              <Divider sx={{ my: 2, mx: 3 }} />

              <ListItem
                sx={{
                  px: 3,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                  },
                  transition: "all 0.2s ease",
                }}
                component="div"
              >
                <NavLink
                  onClick={handleLogOut}
                  style={{
                    width: "100%",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    color: "#f44336",
                    cursor: "pointer",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "#f44336",
                      minWidth: 40,
                    }}
                  >
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Logout"
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontSize: "0.95rem",
                        fontWeight: 500,
                      },
                    }}
                  />
                </NavLink>
              </ListItem>
            </List>
          </Box>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            backgroundColor: "#fafafa",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Box sx={{ p: 3 }}>{children}</Box>
        </Box>
      </Box>
    </div>
  );
};

UserSideBar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserSideBar;
