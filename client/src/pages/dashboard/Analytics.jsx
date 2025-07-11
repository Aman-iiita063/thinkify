import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Tabs,
  Tab,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  People,
  Assignment,
  Poll,
  LibraryBooks,
  Quiz,
  Schedule,
  CheckCircle,
  Warning,
  Error,
} from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import LoadingSpinner from "../../../components/common/LoadingSpinner";
import useThinkify from "../../hooks/useThinkify";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState("week");

  const { setAlertBoxOpenStatus, setAlertMessage, setAlertSeverity } =
    useThinkify();

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_ENDPOINT
        }/admin/analytics?timeRange=${timeRange}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );

      if (response.data.status) {
        setAnalytics(response.data.analytics);
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return <LoadingSpinner message="Loading analytics..." />;
  }

  if (!analytics) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No analytics data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {["week", "month", "year"].map((range) => (
            <Chip
              key={range}
              label={range.charAt(0).toUpperCase() + range.slice(1)}
              onClick={() => setTimeRange(range)}
              color={timeRange === range ? "primary" : "default"}
              variant={timeRange === range ? "filled" : "outlined"}
            />
          ))}
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {analytics.totalUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="success.main">
                +{analytics.newUsers} new this {timeRange}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
                  <Assignment />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {analytics.totalAssignments}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Assignments
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="success.main">
                {analytics.assignmentCompletionRate}% completion rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "info.main", mr: 2 }}>
                  <Poll />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {analytics.totalPolls}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Polls
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="success.main">
                {analytics.totalVotes} total votes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                  <Quiz />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {analytics.totalTests}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tests Created
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="success.main">
                {analytics.averageTestScore}% avg score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="User Activity" />
          <Tab label="Content Performance" />
          <Tab label="Engagement Metrics" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  User Registration Trend
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.userRegistrationTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  User Role Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.userRoleDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.userRoleDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Content Creation by Type
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.contentCreation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Assignment Completion Rate
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.assignmentCompletion}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="rate"
                      stroke="#8884d8"
                      fill="#8884d8"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          )}

          {activeTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Daily Active Users
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.dailyActiveUsers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#82ca9d"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Engagement by Feature
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.featureEngagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="feature" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="engagement" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>

      {/* Recent Activity */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <List>
            {analytics.recentActivity?.map((activity, index) => (
              <Box key={index}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: activity.color }}>
                      {activity.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={activity.title}
                    secondary={`${activity.user} - ${dayjs(
                      activity.timestamp
                    ).fromNow()}`}
                  />
                  <Chip label={activity.type} size="small" color="primary" />
                </ListItem>
                {index < analytics.recentActivity.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Analytics;
