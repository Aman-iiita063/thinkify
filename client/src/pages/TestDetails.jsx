import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { ExpandMore, Quiz, Timer, Person, Grade } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import useThinkify from "../hooks/useThinkify";

const TestDetails = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userSubmission, setUserSubmission] = useState(null);

  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useThinkify();

  useEffect(() => {
    fetchTest();
    const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole({
        userId: payload.userId,
        role: Cookies.get(import.meta.env.VITE_USER_ROLE),
      });
    }
  }, [testId]);

  const fetchTest = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tests/${testId}`
      );
      if (response.data.status) {
        const testData = response.data.test;
        setTest(testData);

        // Find user's submission if exists
        const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const userSubmission = testData.submissions.find(
            (sub) => sub.studentId._id === payload.userId
          );
          setUserSubmission(userSubmission);
        }
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching test:", error);
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

  const isAuthor = test?.authorId._id === userRole?.userId;
  const isStudent = userRole?.role === "user";
  const isTeacher = ["teacher", "institution", "admin"].includes(
    userRole?.role
  );

  if (loading) {
    return <LoadingSpinner message="Loading test details..." />;
  }

  if (!test) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Test not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Typography variant="h4" component="h1">
              {test.title}
            </Typography>
            <Chip
              label={test.status}
              color={getStatusColor(test.status)}
              size="small"
            />
          </Box>

          <Typography variant="body1" color="text.secondary" paragraph>
            {test.description}
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip label={`Subject: ${test.subject}`} size="small" />
            <Chip label={`Duration: ${test.duration} minutes`} size="small" />
            <Chip label={`Total Marks: ${test.totalMarks}`} size="small" />
            <Chip label={`Questions: ${test.questions.length}`} size="small" />
            <Chip
              label={`Submissions: ${test.submissions.length}`}
              size="small"
            />
            <Chip label={`By: ${test.authorId.fullName}`} size="small" />
          </Stack>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Start Date: {dayjs(test.startDate).format("MMM DD, YYYY HH:mm")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              End Date: {dayjs(test.endDate).format("MMM DD, YYYY HH:mm")}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        {test.status === "active" && !userSubmission && (
          <Button
            variant="contained"
            startIcon={<Quiz />}
            onClick={() => navigate(`/tests/${testId}/take`)}
          >
            Take Test
          </Button>
        )}

        {userSubmission && (
          <Button
            variant="outlined"
            startIcon={<Grade />}
            onClick={() => navigate(`/tests/${testId}/result`)}
          >
            View My Result
          </Button>
        )}

        {isAuthor && (
          <>
            <Button
              variant="outlined"
              onClick={() => navigate(`/tests/${testId}/edit`)}
            >
              Edit Test
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate(`/tests/${testId}/submissions`)}
            >
              View Submissions ({test.submissions.length})
            </Button>
          </>
        )}
      </Box>

      {/* User Submission Summary */}
      {userSubmission && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Submission
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Chip
                label={`Score: ${userSubmission.score}/${test.totalMarks}`}
                color="primary"
              />
              <Chip label={`Time Taken: ${userSubmission.timeTaken} minutes`} />
              <Chip
                label={`Submitted: ${dayjs(userSubmission.submittedAt).format(
                  "MMM DD, YYYY HH:mm"
                )}`}
              />
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Questions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Questions ({test.questions.length})
          </Typography>

          {test.questions.map((question, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography variant="subtitle1">
                    Question {index + 1}
                  </Typography>
                  <Chip label={`${question.marks} marks`} size="small" />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" paragraph>
                  {question.question}
                </Typography>

                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Type: {question.type}
                </Typography>

                {question.type === "multiple-choice" && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Options:
                    </Typography>
                    <List dense>
                      {question.options.map((option, optionIndex) => (
                        <ListItem key={optionIndex} sx={{ py: 0 }}>
                          <ListItemText
                            primary={option.text}
                            secondary={
                              option.isCorrect ? "✓ Correct Answer" : ""
                            }
                            sx={{
                              "& .MuiListItemText-secondary": {
                                color: option.isCorrect
                                  ? "success.main"
                                  : "inherit",
                              },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {question.type === "true-false" && (
                  <Typography variant="body2" color="text.secondary">
                    Correct Answer: {question.correctAnswer}
                  </Typography>
                )}

                {question.type === "short-answer" && question.correctAnswer && (
                  <Typography variant="body2" color="text.secondary">
                    Expected Answer: {question.correctAnswer}
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>

      {/* Submissions Table (for teachers) */}
      {isTeacher && test.submissions.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Submissions ({test.submissions.length})
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Time Taken</TableCell>
                    <TableCell>Submitted</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {test.submissions.map((submission, index) => (
                    <TableRow key={index}>
                      <TableCell>{submission.studentId.fullName}</TableCell>
                      <TableCell>
                        {submission.score}/{test.totalMarks}
                      </TableCell>
                      <TableCell>{submission.timeTaken} minutes</TableCell>
                      <TableCell>
                        {dayjs(submission.submittedAt).format(
                          "MMM DD, YYYY HH:mm"
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() =>
                            navigate(
                              `/tests/${testId}/submissions/${submission.studentId._id}`
                            )
                          }
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Test Statistics */}
      {test.submissions.length > 0 && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Test Statistics
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Chip
                label={`Average Score: ${Math.round(
                  test.submissions.reduce((sum, sub) => sum + sub.score, 0) /
                    test.submissions.length
                )}/${test.totalMarks}`}
              />
              <Chip
                label={`Highest Score: ${Math.max(
                  ...test.submissions.map((sub) => sub.score)
                )}/${test.totalMarks}`}
                color="success"
              />
              <Chip
                label={`Lowest Score: ${Math.min(
                  ...test.submissions.map((sub) => sub.score)
                )}/${test.totalMarks}`}
                color="error"
              />
              <Chip
                label={`Completion Rate: ${Math.round(
                  (test.submissions.length /
                    (test.audience?.includes("all")
                      ? 1
                      : test.audience?.length || 1)) *
                    100
                )}%`}
              />
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default TestDetails;
