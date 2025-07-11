import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import { ExpandMore, Grade, Visibility, Timer } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import useThinkify from "../hooks/useThinkify";

const ViewSubmissions = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeDialog, setGradeDialog] = useState(false);
  const [gradeForm, setGradeForm] = useState({ marks: "", feedback: "" });
  const [userRole, setUserRole] = useState(null);

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

        // Check if user is the author
        const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (testData.authorId._id !== payload.userId) {
            setAlertBoxOpenStatus(true);
            setAlertSeverity("error");
            setAlertMessage("You can only view submissions for your own tests");
            setTimeout(() => navigate("/tests"), 2000);
            return;
          }
        }

        setTest(testData);
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

  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGradeForm({
      marks: submission.marks?.toString() || "",
      feedback: submission.feedback || "",
    });
    setGradeDialog(true);
  };

  const handleGradeSubmit = async () => {
    try {
      setGrading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tests/${testId}/grade/${
          selectedSubmission.studentId._id
        }`,
        {
          marks: parseInt(gradeForm.marks),
          feedback: gradeForm.feedback,
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
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Grade submitted successfully!");
        setGradeDialog(false);
        fetchTest(); // Refresh data
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error grading submission:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || error.message);
    } finally {
      setGrading(false);
    }
  };

  const getScorePercentage = (score, totalMarks) => {
    return Math.round((score / totalMarks) * 100);
  };

  const getScoreColor = (score, totalMarks) => {
    const percentage = getScorePercentage(score, totalMarks);
    if (percentage >= 80) return "success";
    if (percentage >= 60) return "warning";
    return "error";
  };

  if (loading) {
    return <LoadingSpinner message="Loading submissions..." />;
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

  const isAuthor = test.authorId._id === userRole?.userId;
  const isTeacher = ["teacher", "institution", "admin"].includes(
    userRole?.role
  );

  if (!isTeacher || !isAuthor) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You can only view submissions for your own tests.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
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
              Test Submissions: {test.title}
            </Typography>
            <Chip
              label={`${test.submissions.length} submissions`}
              color="primary"
            />
          </Box>

          <Typography variant="body1" color="text.secondary" paragraph>
            {test.description}
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip label={`Subject: ${test.subject}`} size="small" />
            <Chip label={`Total Marks: ${test.totalMarks}`} size="small" />
            <Chip label={`Questions: ${test.questions.length}`} size="small" />
            <Chip label={`By: ${test.authorId.fullName}`} size="small" />
          </Stack>
        </CardContent>
      </Card>

      {/* Statistics */}
      {test.submissions.length > 0 && (
        <Card sx={{ mb: 3 }}>
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
                color="primary"
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
                color="info"
              />
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Submissions Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Student Submissions ({test.submissions.length})
          </Typography>

          {test.submissions.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No submissions yet
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Percentage</TableCell>
                    <TableCell>Time Taken</TableCell>
                    <TableCell>Submitted</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {test.submissions.map((submission, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {submission.studentId.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {submission.studentId.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${submission.score}/${test.totalMarks}`}
                          color={getScoreColor(
                            submission.score,
                            test.totalMarks
                          )}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {getScorePercentage(
                            submission.score,
                            test.totalMarks
                          )}
                          %
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Timer fontSize="small" />
                          <Typography variant="body2">
                            {submission.timeTaken} min
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {dayjs(submission.submittedAt).format(
                            "MMM DD, YYYY HH:mm"
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            submission.marks !== undefined
                              ? "Graded"
                              : "Not Graded"
                          }
                          color={
                            submission.marks !== undefined
                              ? "success"
                              : "warning"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setGradeDialog(true);
                            }}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            startIcon={<Grade />}
                            variant="outlined"
                            onClick={() => handleGradeSubmission(submission)}
                          >
                            Grade
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Submission Details Dialog */}
      <Dialog
        open={gradeDialog}
        onClose={() => setGradeDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedSubmission
            ? `Submission by ${selectedSubmission.studentId.fullName}`
            : "Submission Details"}
        </DialogTitle>
        <DialogContent>
          {selectedSubmission && (
            <Box sx={{ mt: 2 }}>
              {/* Submission Summary */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Submission Summary
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Chip
                      label={`Score: ${selectedSubmission.score}/${test.totalMarks}`}
                      color={getScoreColor(
                        selectedSubmission.score,
                        test.totalMarks
                      )}
                    />
                    <Chip
                      label={`Time: ${selectedSubmission.timeTaken} minutes`}
                    />
                    <Chip
                      label={`Submitted: ${dayjs(
                        selectedSubmission.submittedAt
                      ).format("MMM DD, YYYY HH:mm")}`}
                    />
                  </Stack>
                </CardContent>
              </Card>

              {/* Questions and Answers */}
              <Typography variant="h6" gutterBottom>
                Questions and Answers
              </Typography>
              {test.questions.map((question, questionIndex) => {
                const answer = selectedSubmission.answers.find(
                  (a) => a.questionIndex === questionIndex
                );
                return (
                  <Accordion key={questionIndex} sx={{ mb: 1 }}>
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
                          Question {questionIndex + 1}
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
                          {question.options.map((option, optionIndex) => (
                            <Box
                              key={optionIndex}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 1,
                              }}
                            >
                              <Chip
                                label={option.text}
                                color={option.isCorrect ? "success" : "default"}
                                size="small"
                              />
                              {option.isCorrect && (
                                <Chip
                                  label="✓ Correct"
                                  color="success"
                                  size="small"
                                />
                              )}
                            </Box>
                          ))}
                        </Box>
                      )}

                      {question.type === "true-false" && (
                        <Typography variant="body2" color="text.secondary">
                          Correct Answer: {question.correctAnswer}
                        </Typography>
                      )}

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="subtitle2" gutterBottom>
                        Student's Answer:
                      </Typography>
                      <Alert
                        severity={
                          answer?.answer ===
                          (question.type === "multiple-choice"
                            ? question.options.find((opt) => opt.isCorrect)
                                ?.text
                            : question.correctAnswer)
                            ? "success"
                            : "error"
                        }
                      >
                        {answer?.answer || "No answer provided"}
                      </Alert>
                    </AccordionDetails>
                  </Accordion>
                );
              })}

              {/* Grading Form */}
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Grade Submission
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      label="Marks"
                      type="number"
                      value={gradeForm.marks}
                      onChange={(e) =>
                        setGradeForm((prev) => ({
                          ...prev,
                          marks: e.target.value,
                        }))
                      }
                      fullWidth
                      helperText={`Maximum marks: ${test.totalMarks}`}
                    />
                    <TextField
                      label="Feedback (Optional)"
                      multiline
                      rows={3}
                      value={gradeForm.feedback}
                      onChange={(e) =>
                        setGradeForm((prev) => ({
                          ...prev,
                          feedback: e.target.value,
                        }))
                      }
                      fullWidth
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGradeDialog(false)}>Close</Button>
          <Button
            onClick={handleGradeSubmit}
            variant="contained"
            disabled={grading || !gradeForm.marks}
          >
            {grading ? "Submitting..." : "Submit Grade"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewSubmissions;
