import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Stack,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Paper,
} from "@mui/material";
import { Timer, Quiz, Save, ExitToApp } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import useThinkify from "../hooks/useThinkify";

const TakeTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
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

  useEffect(() => {
    if (test && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [test, timeLeft]);

  const fetchTest = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tests/${testId}`
      );
      if (response.data.status) {
        const testData = response.data.test;
        setTest(testData);
        setTimeLeft(testData.duration * 60); // Convert minutes to seconds
        setAnswers(new Array(testData.questions.length).fill({ answer: "" }));
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

  const handleAnswerChange = (questionIndex, answer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = { answer };
    setAnswers(newAnswers);
  };

  const handleMultipleChoiceAnswer = (questionIndex, selectedOption) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = { answer: selectedOption };
    setAnswers(newAnswers);
  };

  const handleMultipleAnswerChange = (questionIndex, option, checked) => {
    const newAnswers = [...answers];
    const currentAnswer = newAnswers[questionIndex]?.answer || "";
    let selectedOptions = currentAnswer ? currentAnswer.split(",") : [];

    if (checked) {
      if (!selectedOptions.includes(option)) {
        selectedOptions.push(option);
      }
    } else {
      selectedOptions = selectedOptions.filter((opt) => opt !== option);
    }

    newAnswers[questionIndex] = { answer: selectedOptions.join(",") };
    setAnswers(newAnswers);
  };

  const handleSubmitTest = async () => {
    try {
      setSubmitting(true);
      const timeTaken = test.duration * 60 - timeLeft; // Time taken in seconds

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tests/${testId}/submit`,
        {
          answers: answers.map((answer, index) => ({
            questionIndex: index,
            answer: answer.answer || "",
          })),
          timeTaken: Math.floor(timeTaken / 60), // Convert to minutes
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
        setAlertMessage("Test submitted successfully!");
        setTimeout(() => navigate("/tests"), 1500);
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    if (!test) return 0;
    return ((currentQuestion + 1) / test.questions.length) * 100;
  };

  if (loading) {
    return <LoadingSpinner message="Loading test..." />;
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

  const currentQuestionData = test.questions[currentQuestion];

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h4" component="h1">
              {test.title}
            </Typography>
            <Chip
              icon={<Timer />}
              label={formatTime(timeLeft)}
              color={timeLeft < 300 ? "error" : "primary"}
              variant="outlined"
            />
          </Box>

          <Typography variant="body1" color="text.secondary" paragraph>
            {test.description}
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip label={`Subject: ${test.subject}`} size="small" />
            <Chip label={`Total Marks: ${test.totalMarks}`} size="small" />
            <Chip label={`Questions: ${test.questions.length}`} size="small" />
            <Chip
              label={`Question ${currentQuestion + 1} of ${
                test.questions.length
              }`}
              size="small"
              color="primary"
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Progress
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(getProgressPercentage())}%
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={getProgressPercentage()} />
      </Box>

      {/* Question */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Question {currentQuestion + 1}</Typography>
            <Chip
              label={`${currentQuestionData.marks} marks`}
              size="small"
              color="primary"
            />
          </Box>

          <Typography variant="body1" paragraph>
            {currentQuestionData.question}
          </Typography>

          {/* Question Type Specific UI */}
          {currentQuestionData.type === "multiple-choice" && (
            <RadioGroup
              value={answers[currentQuestion]?.answer || ""}
              onChange={(e) =>
                handleMultipleChoiceAnswer(currentQuestion, e.target.value)
              }
            >
              {currentQuestionData.options.map((option, optionIndex) => (
                <FormControlLabel
                  key={optionIndex}
                  value={option.text}
                  control={<Radio />}
                  label={option.text}
                  sx={{ mb: 1 }}
                />
              ))}
            </RadioGroup>
          )}

          {currentQuestionData.type === "true-false" && (
            <RadioGroup
              value={answers[currentQuestion]?.answer || ""}
              onChange={(e) =>
                handleAnswerChange(currentQuestion, e.target.value)
              }
            >
              <FormControlLabel value="true" control={<Radio />} label="True" />
              <FormControlLabel
                value="false"
                control={<Radio />}
                label="False"
              />
            </RadioGroup>
          )}

          {currentQuestionData.type === "short-answer" && (
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Enter your answer here..."
              value={answers[currentQuestion]?.answer || ""}
              onChange={(e) =>
                handleAnswerChange(currentQuestion, e.target.value)
              }
              variant="outlined"
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>

        <Box sx={{ display: "flex", gap: 1 }}>
          {currentQuestion < test.questions.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              startIcon={<Save />}
              onClick={() => setShowConfirmDialog(true)}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Test"}
            </Button>
          )}
        </Box>
      </Box>

      {/* Question Navigation */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Question Navigation
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {test.questions.map((_, index) => (
            <Button
              key={index}
              variant={index === currentQuestion ? "contained" : "outlined"}
              size="small"
              onClick={() => setCurrentQuestion(index)}
              sx={{ minWidth: 40 }}
            >
              {index + 1}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Time Warning */}
      {timeLeft < 300 && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            ⚠️ Less than 5 minutes remaining! Please submit your test soon.
          </Typography>
        </Alert>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
      >
        <DialogTitle>Submit Test</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit this test? You cannot change your
            answers after submission.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Time taken: {formatTime(test.duration * 60 - timeLeft)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Questions answered:{" "}
              {answers.filter((a) => a.answer && a.answer.trim() !== "").length}{" "}
              / {test.questions.length}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setShowConfirmDialog(false);
              handleSubmitTest();
            }}
            variant="contained"
            color="success"
          >
            Submit Test
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TakeTest;
