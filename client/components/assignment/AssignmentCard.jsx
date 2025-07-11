import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Avatar,
} from "@mui/material";
import { CalendarToday, Person, School } from "@mui/icons-material";
import dayjs from "dayjs";

const AssignmentCard = ({ assignment, onView, onEdit, onDelete, userRole }) => {
  const isAuthor = assignment.authorId._id === userRole?.userId;
  const isStudent = userRole?.role === "user";
  const isTeacher = ["teacher", "institution", "admin"].includes(
    userRole?.role
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "warning";
      case "expired":
        return "error";
      default:
        return "default";
    }
  };

  return (
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
            {assignment.title}
          </Typography>
          <Chip
            label={assignment.status}
            color={getStatusColor(assignment.status)}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" paragraph>
          {assignment.description}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <School fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {assignment.subject}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarToday fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Due: {dayjs(assignment.deadline).format("MMM DD, YYYY")}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Person fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {assignment.authorId.fullName}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            label={`${assignment.totalMarks} marks`}
            size="small"
            variant="outlined"
          />
          <Chip
            label={`${assignment.submissions?.length || 0} submissions`}
            size="small"
            variant="outlined"
          />
        </Box>
      </CardContent>

      <CardActions>
        <Button size="small" onClick={() => onView(assignment._id)}>
          View Details
        </Button>

        {isAuthor && (
          <>
            <Button size="small" onClick={() => onEdit(assignment._id)}>
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => onDelete(assignment._id)}
            >
              Delete
            </Button>
          </>
        )}

        {isStudent && assignment.status === "active" && (
          <Button
            size="small"
            variant="contained"
            onClick={() => onView(assignment._id)}
          >
            Submit Assignment
          </Button>
        )}

        {isTeacher && assignment.status === "active" && (
          <Button
            size="small"
            variant="contained"
            onClick={() => onView(assignment._id)}
          >
            Grade Submissions
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default AssignmentCard;
