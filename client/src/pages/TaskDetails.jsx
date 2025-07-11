import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TextareaAutosize,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  LinearProgress,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Edit,
  Delete,
  CheckCircle,
  Schedule,
  PriorityHigh,
  Person,
  CalendarToday,
  Description,
  AttachFile,
  Comment,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import useThinkify from "../hooks/useThinkify";

dayjs.extend(relativeTime);

const TaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [editForm, setEditForm] = useState({});

  const { setAlertBoxOpenStatus, setAlertMessage, setAlertSeverity } =
    useThinkify();

  useEffect(() => {
    fetchTaskDetails();
  }, [taskId]);

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );

      if (response.data.status) {
        setTask(response.data.task);
        setEditForm({
          title: response.data.task.title,
          description: response.data.task.description,
          priority: response.data.task.priority,
          dueDate: response.data.task.dueDate?.split("T")[0] || "",
        });
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tasks/${taskId}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );

      if (response.data.status) {
        setTask(response.data.task);
        setEditDialogOpen(false);
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Task updated successfully!");
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || error.message);
    }
  };

  const handleDeleteTask = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );

      if (response.data.status) {
        setDeleteDialogOpen(false);
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Task deleted successfully!");
        navigate("/task-management");
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || error.message);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tasks/${taskId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );

      if (response.data.status) {
        setTask(response.data.task);
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage(`Task status updated to ${newStatus}!`);
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || error.message);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "warning";
      case "pending":
        return "info";
      default:
        return "default";
    }
  };

  const getProgressValue = () => {
    switch (task?.status) {
      case "pending":
        return 0;
      case "in-progress":
        return 50;
      case "completed":
        return 100;
      default:
        return 0;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading task details..." />;
  }

  if (!task) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Task not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Task Details
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => setEditDialogOpen(true)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Task Info */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  {task.title}
                </Typography>
                <Chip
                  label={task.status}
                  color={getStatusColor(task.status)}
                  variant="outlined"
                />
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {task.description}
              </Typography>

              {/* Progress */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">Progress</Typography>
                  <Typography variant="body2">{getProgressValue()}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={getProgressValue()}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              {/* Quick Actions */}
              <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                {task.status !== "completed" && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={() => handleStatusChange("completed")}
                  >
                    Mark Complete
                  </Button>
                )}
                {task.status === "pending" && (
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<Schedule />}
                    onClick={() => handleStatusChange("in-progress")}
                  >
                    Start Task
                  </Button>
                )}
              </Box>

              {/* Task Statistics */}
              <Paper sx={{ p: 2, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Task Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h4" color="primary">
                        {task.comments?.length || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Comments
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h4" color="warning.main">
                        {task.attachments?.length || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Attachments
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h4" color="info.main">
                        {dayjs(task.createdAt).format("MMM DD")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Created
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h4" color="success.main">
                        {task.updatedAt
                          ? dayjs(task.updatedAt).format("MMM DD")
                          : "N/A"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Updated
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Information
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <PriorityHigh sx={{ mr: 1, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    Priority
                  </Typography>
                </Box>
                <Chip
                  label={task.priority}
                  color={getPriorityColor(task.priority)}
                  size="small"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CalendarToday sx={{ mr: 1, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    Due Date
                  </Typography>
                </Box>
                <Typography variant="body1">
                  {task.dueDate
                    ? dayjs(task.dueDate).format("MMM DD, YYYY")
                    : "No due date"}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Person sx={{ mr: 1, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    Assigned To
                  </Typography>
                </Box>
                <Typography variant="body1">
                  {task.assignedTo?.fullName || "Unassigned"}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Person sx={{ mr: 1, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    Created By
                  </Typography>
                </Box>
                <Typography variant="body1">
                  {task.createdBy?.fullName || "Unknown"}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Timeline
              </Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Task Created"
                    secondary={dayjs(task.createdAt).fromNow()}
                  />
                </ListItem>
                {task.status !== "pending" && (
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "warning.main" }}>
                        <Schedule />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Task Started"
                      secondary={dayjs(task.updatedAt).fromNow()}
                    />
                  </ListItem>
                )}
                {task.status === "completed" && (
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "success.main" }}>
                        <CheckCircle />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Task Completed"
                      secondary={dayjs(task.updatedAt).fromNow()}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={editForm.title}
            onChange={(e) =>
              setEditForm({ ...editForm, title: e.target.value })
            }
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={editForm.description}
            onChange={(e) =>
              setEditForm({ ...editForm, description: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Priority"
            select
            value={editForm.priority}
            onChange={(e) =>
              setEditForm({ ...editForm, priority: e.target.value })
            }
            sx={{ mb: 2 }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </TextField>
          <TextField
            fullWidth
            label="Due Date"
            type="date"
            value={editForm.dueDate}
            onChange={(e) =>
              setEditForm({ ...editForm, dueDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditTask} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteTask} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskDetails;
