import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Fab,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";

import AssignmentCard from "../../components/assignment/AssignmentCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useThinkify from "../hooks/useThinkify";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
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
    fetchAssignments();
    // Get user role from cookies
    const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
    if (token) {
      // Decode token to get user info
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole({
        userId: payload.userId,
        role: Cookies.get(import.meta.env.VITE_USER_ROLE),
      });
    }
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/assignments`
      );
      if (response.data.status) {
        setAssignments(response.data.assignments);
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (assignmentId) => {
    // Navigate to assignment details page
    window.location.href = `/assignments/${assignmentId}`;
  };

  const handleEdit = (assignmentId) => {
    // Navigate to edit assignment page
    window.location.href = `/assignments/${assignmentId}/edit`;
  };

  const handleDelete = async (assignmentId) => {
    try {
      setLoadingStatus(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/assignments/${assignmentId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );

      if (response.data.status) {
        setAssignments(assignments.filter((a) => a._id !== assignmentId));
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Assignment deleted successfully");
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || error.message);
    } finally {
      setLoadingStatus(false);
    }
  };

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.authorId.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Show assignments only to students (users)
  const shouldShowAssignments = userRole?.role === "user";

  if (loading) {
    return <LoadingSpinner message="Loading assignments..." />;
  }

  // Redirect non-students away from assignments
  if (!shouldShowAssignments) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Assignments are only available to students.
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
          Assignments
        </Typography>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search assignments..."
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

      {filteredAssignments.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No assignments found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredAssignments.map((assignment) => (
            <Grid item xs={12} md={6} lg={4} key={assignment._id}>
              <AssignmentCard
                assignment={assignment}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                userRole={userRole}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Assignments;
