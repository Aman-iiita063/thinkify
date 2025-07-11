import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardActions,
  Chip,
  Fab,
} from "@mui/material";
import { Add, Search, Quiz, Timer } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import dayjs from "dayjs";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import useThinkify from "../hooks/useThinkify";

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState(null);

  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useThinkify();

  useEffect(() => {
    fetchTests();
    const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole({
        userId: payload.userId,
        role: Cookies.get(import.meta.env.VITE_USER_ROLE),
      });
    }
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tests`
      );
      if (response.data.status) {
        setTests(response.data.tests);
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "draft":
        return "warning";
      case "inactive":
        return "error";
      case "expired":
        return "error";
      default:
        return "default";
    }
  };

  const filteredTests = tests.filter(
    (test) =>
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.authorId.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter tests based on user role
  const getVisibleTests = () => {
    if (userRole?.role === "user") {
      // Students see only active tests
      return filteredTests.filter((test) => test.status === "active");
    } else {
      // Teachers see all tests
      return filteredTests;
    }
  };

  const visibleTests = getVisibleTests();

  if (loading) {
    return <LoadingSpinner message="Loading tests..." />;
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
          Tests
        </Typography>

        {["teacher", "institution", "admin"].includes(userRole?.role) && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => (window.location.href = "/add-test")}
          >
            Create Test
          </Button>
        )}
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search tests..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {visibleTests.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            {userRole?.role === "user"
              ? "No active tests available"
              : "No tests found"}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {visibleTests.map((test) => (
            <Grid item xs={12} md={6} lg={4} key={test._id}>
              <Card sx={{ mb: 2, boxShadow: 2 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" component="h2" gutterBottom>
                      {test.title}
                    </Typography>
                    <Chip
                      label={test.status}
                      color={getStatusColor(test.status)}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {test.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Subject: {test.subject}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Duration: {test.duration} minutes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Marks: {test.totalMarks}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Questions: {test.questions?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      By: {test.authorId.fullName}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}
                  >
                    <Chip
                      label={`${dayjs(test.startDate).format(
                        "MMM DD"
                      )} - ${dayjs(test.endDate).format("MMM DD")}`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`${test.submissions?.length || 0} submissions`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {test.audience?.map((audience, index) => (
                      <Chip
                        key={index}
                        label={audience}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    onClick={() =>
                      (window.location.href = `/tests/${test._id}`)
                    }
                  >
                    View Details
                  </Button>

                  {test.status === "active" && userRole?.role === "user" && (
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<Quiz />}
                      onClick={() =>
                        (window.location.href = `/tests/${test._id}/take`)
                      }
                    >
                      Take Test
                    </Button>
                  )}

                  {["teacher", "institution", "admin"].includes(
                    userRole?.role
                  ) &&
                    test.status === "active" && (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          (window.location.href = `/tests/${test._id}/submissions`)
                        }
                      >
                        View Submissions
                      </Button>
                    )}

                  {["teacher", "institution", "admin"].includes(
                    userRole?.role
                  ) && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        (window.location.href = `/tests/${test._id}/edit`)
                      }
                    >
                      Edit Test
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {["teacher", "institution", "admin"].includes(userRole?.role) && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={() => (window.location.href = "/add-test")}
        >
          <Add />
        </Fab>
      )}
    </Box>
  );
};

export default Tests;
