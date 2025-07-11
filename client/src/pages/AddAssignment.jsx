import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const statusOptions = ["active", "inactive", "expired"];
const audienceOptions = ["all", "students", "teachers", "institutions"];

const AddAssignment = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    deadline: "",
    totalMarks: "",
    status: "active",
    audience: ["students"],
  });
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  // Check user role on component mount
  useEffect(() => {
    const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole({
        userId: payload.userId,
        role: Cookies.get(import.meta.env.VITE_USER_ROLE),
      });
    }
  }, []);

  // Check if user can create assignments
  const canCreateAssignments = ["teacher", "institution", "admin"].includes(
    userRole?.role
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAudienceChange = (e) => {
    const { value } = e.target;
    setForm((prev) => ({
      ...prev,
      audience: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/assignments`,
        {
          ...form,
          totalMarks: Number(form.totalMarks),
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );
      if (response.data.status) {
        setSnackbar({
          open: true,
          message: "Assignment created successfully!",
          severity: "success",
        });
        setTimeout(() => navigate("/assignments"), 1200);
      } else {
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        p: 3,
        boxShadow: 2,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      {!canCreateAssignments ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Only teachers, institutions, and admins can create assignments.
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Create Assignment
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Deadline"
              name="deadline"
              type="datetime-local"
              value={form.deadline}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Total Marks"
              name="totalMarks"
              type="number"
              value={form.totalMarks}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={form.status}
                label="Status"
                onChange={handleChange}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Audience</InputLabel>
              <Select
                name="audience"
                multiple
                value={form.audience}
                label="Audience"
                onChange={handleAudienceChange}
              >
                {audienceOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Assignment"}
            </Button>
          </form>
        </>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddAssignment;
