import { useState } from "react";
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
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const typeOptions = ["single", "multiple"];
const statusOptions = ["active", "inactive", "expired"];
const audienceOptions = ["all", "students", "teachers", "institutions"];

const AddPoll = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "single",
    options: [""],
    deadline: "",
    status: "active",
    anonymousMember: false,
    audience: ["all"],
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAudienceChange = (e) => {
    const { value } = e.target;
    setForm((prev) => ({
      ...prev,
      audience: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleOptionChange = (idx, value) => {
    setForm((prev) => {
      const newOptions = [...prev.options];
      newOptions[idx] = value;
      return { ...prev, options: newOptions };
    });
  };

  const addOption = () => {
    setForm((prev) => ({ ...prev, options: [...prev.options, ""] }));
  };

  const removeOption = (idx) => {
    setForm((prev) => {
      const newOptions = prev.options.filter((_, i) => i !== idx);
      return { ...prev, options: newOptions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/polls`,
        {
          ...form,
          options: form.options.filter((opt) => opt.trim() !== ""),
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(import.meta.env.VITE_TOKEN_KEY)}`,
          },
        }
      );
      if (response.data.status) {
        setSnackbar({ open: true, message: "Poll created successfully!", severity: "success" });
        setTimeout(() => navigate("/polls"), 1200);
      } else {
        setSnackbar({ open: true, message: response.data.message, severity: "error" });
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || error.message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3, boxShadow: 2, borderRadius: 2, bgcolor: "background.paper" }}>
      <Typography variant="h4" gutterBottom>
        Create Poll
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
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Type</InputLabel>
          <Select
            name="type"
            value={form.type}
            label="Type"
            onChange={handleChange}
          >
            {typeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Options</Typography>
          {form.options.map((option, idx) => (
            <Stack direction="row" spacing={1} alignItems="center" key={idx} sx={{ mb: 1 }}>
              <TextField
                value={option}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`}
                required
                sx={{ flex: 1 }}
              />
              {form.options.length > 1 && (
                <IconButton onClick={() => removeOption(idx)} color="error">
                  <Remove />
                </IconButton>
              )}
              {idx === form.options.length - 1 && (
                <IconButton onClick={addOption} color="primary">
                  <Add />
                </IconButton>
              )}
            </Stack>
          ))}
        </Box>
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
        <FormControlLabel
          control={
            <Checkbox
              checked={form.anonymousMember}
              onChange={handleChange}
              name="anonymousMember"
            />
          }
          label="Anonymous Voting"
          sx={{ mb: 2 }}
        />
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
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
          {loading ? "Creating..." : "Create Poll"}
        </Button>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddPoll; 