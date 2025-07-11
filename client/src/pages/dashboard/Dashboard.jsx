import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Container,
  Paper,
  Divider,
  useTheme,
} from "@mui/material";
import {
  TrendingUp,
  People,
  Assignment,
  PostAdd,
  ShoppingCart,
  Quiz,
  Poll,
  LibraryBooks,
} from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import useThinkify from "../../hooks/useThinkify";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalProducts: 0,
    totalTasks: 0,
    totalTests: 0,
    totalPolls: 0,
    totalResources: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const theme = useTheme();
  const { setAlertBoxOpenStatus, setAlertMessage, setAlertSeverity } =
    useThinkify();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
        const role = Cookies.get(import.meta.env.VITE_USER_ROLE);
        setUserRole(role);

        // Fetch dashboard stats
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_ENDPOINT}/dashboard/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: <PostAdd />,
      color: "#59e3a7",
      bgColor: "rgba(89, 227, 167, 0.1)",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <ShoppingCart />,
      color: "#2196f3",
      bgColor: "rgba(33, 150, 243, 0.1)",
    },
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: <Assignment />,
      color: "#ff9800",
      bgColor: "rgba(255, 152, 0, 0.1)",
    },
    {
      title: "Total Tests",
      value: stats.totalTests,
      icon: <Quiz />,
      color: "#9c27b0",
      bgColor: "rgba(156, 39, 176, 0.1)",
    },
    {
      title: "Total Polls",
      value: stats.totalPolls,
      icon: <Poll />,
      color: "#f44336",
      bgColor: "rgba(244, 67, 54, 0.1)",
    },
    {
      title: "Total Resources",
      value: stats.totalResources,
      icon: <LibraryBooks />,
      color: "#4caf50",
      bgColor: "rgba(76, 175, 80, 0.1)",
    },
  ];

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "#1b2e35", mb: 1 }}
          >
            Welcome back!
          </Typography>
          <Typography variant="body1" sx={{ color: "#666" }}>
            Here's what's happening in your Thinkify workspace
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <Card
                sx={{
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        backgroundColor: card.bgColor,
                        color: card.color,
                        width: 56,
                        height: 56,
                      }}
                    >
                      {card.icon}
                    </Avatar>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {card.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  {[
                    {
                      label: "Create Post",
                      icon: <PostAdd />,
                      color: "#59e3a7",
                    },
                    {
                      label: "Add Product",
                      icon: <ShoppingCart />,
                      color: "#2196f3",
                    },
                    {
                      label: "New Task",
                      icon: <Assignment />,
                      color: "#ff9800",
                    },
                    { label: "Create Test", icon: <Quiz />, color: "#9c27b0" },
                  ].map((action, index) => (
                    <Grid item xs={6} key={index}>
                      <Button
                        variant="outlined"
                        startIcon={action.icon}
                        fullWidth
                        sx={{
                          py: 2,
                          borderColor: action.color,
                          color: action.color,
                          "&:hover": {
                            backgroundColor: `${action.color}15`,
                            borderColor: action.color,
                          },
                        }}
                      >
                        {action.label}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Recent Activity
                </Typography>
                <Box sx={{ space: 2 }}>
                  {[
                    {
                      text: "New post published",
                      time: "2 hours ago",
                      type: "post",
                    },
                    {
                      text: "Product added to marketplace",
                      time: "4 hours ago",
                      type: "product",
                    },
                    {
                      text: "Task completed",
                      time: "6 hours ago",
                      type: "task",
                    },
                    {
                      text: "Test results submitted",
                      time: "1 day ago",
                      type: "test",
                    },
                  ].map((activity, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#333" }}>
                          {activity.text}
                        </Typography>
                        <Chip
                          label={activity.time}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(0, 0, 0, 0.05)",
                            fontSize: "0.75rem",
                          }}
                        />
                      </Box>
                      {index < 3 && <Divider sx={{ mt: 1 }} />}
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* User Role Info */}
        <Paper
          sx={{
            mt: 4,
            p: 3,
            background: "linear-gradient(135deg, #59e3a7 0%, #4bc895 100%)",
            color: "#1b2e35",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                backgroundColor: "rgba(27, 46, 53, 0.2)",
                color: "#1b2e35",
                width: 48,
                height: 48,
              }}
            >
              <People />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Your Role:{" "}
                {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
              </Typography>
              <Typography variant="body2">
                You have access to all features available for your role.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
