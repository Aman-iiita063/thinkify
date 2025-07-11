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
  IconButton,
  Stack,
  Card,
  CardContent,
  Divider,
  Chip,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Add, Remove, Save, Quiz } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const questionTypes = [
  { value: "multiple-choice", label: "Multiple Choice" },
  { value: "true-false", label: "True/False" },
  { value: "short-answer", label: "Short Answer" },
];

const audienceOptions = ["all", "students", "teachers", "institutions"];

const AddTest = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    duration: "",
    totalMarks: "",
    startDate: "",
    endDate: "",
    audience: ["students"], // Default to include students
  });
  const [questions, setQuestions] = useState([
    {
      question: "",
      type: "multiple-choice",
      options: [
        { text: "Option 1", isCorrect: false },
        { text: "Option 2", isCorrect: false },
        { text: "Option 3", isCorrect: false },
        { text: "Option 4", isCorrect: false },
      ],
      correctAnswer: "",
      marks: 1,
    },
  ]);
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

  // Check if user can create tests
  const canCreateTests = ["teacher", "institution", "admin"].includes(
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

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[index] = { ...newQuestions[index], [field]: value };
      return newQuestions;
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[questionIndex].options[optionIndex] = {
        ...newQuestions[questionIndex].options[optionIndex],
        [field]: value,
      };
      return newQuestions;
    });
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        type: "multiple-choice",
        options: [
          { text: "Option 1", isCorrect: false },
          { text: "Option 2", isCorrect: false },
          { text: "Option 3", isCorrect: false },
          { text: "Option 4", isCorrect: false },
        ],
        correctAnswer: "",
        marks: 1,
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const addOption = (questionIndex) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[questionIndex].options.push({ text: "", isCorrect: false });
      return newQuestions;
    });
  };

  const removeOption = (questionIndex, optionIndex) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      if (newQuestions[questionIndex].options.length > 2) {
        newQuestions[questionIndex].options.splice(optionIndex, 1);
      }
      return newQuestions;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (
      !form.title ||
      !form.description ||
      !form.subject ||
      !form.duration ||
      !form.totalMarks ||
      !form.startDate ||
      !form.endDate
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    // Validate questions and filter out empty options
    const validQuestions = questions
      .filter((q) => q.question.trim() !== "")
      .map((question) => {
        if (question.type === "multiple-choice") {
          // Filter out empty options and ensure at least 2 options
          const validOptions = question.options.filter(
            (option) => option.text.trim() !== ""
          );
          if (validOptions.length < 2) {
            throw new Error(
              `Question "${question.question}" must have at least 2 options`
            );
          }
          return {
            ...question,
            options: validOptions,
          };
        }
        return question;
      });

    if (validQuestions.length === 0) {
      setSnackbar({
        open: true,
        message: "At least one question is required",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/tests`,
        {
          title: form.title,
          description: form.description,
          subject: form.subject,
          duration: parseInt(form.duration),
          totalMarks: parseInt(form.totalMarks),
          startDate: form.startDate,
          endDate: form.endDate,
          audience: form.audience,
          questions: validQuestions,
          // Status is not sent - backend will set it to "active"
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
          message: "Test created successfully!",
          severity: "success",
        });
        setTimeout(() => navigate("/tests"), 1200);
      } else {
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error creating test:", error);
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
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 3 }}>
      {!canCreateTests ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Only teachers, institutions, and admins can create tests.
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Create Test
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            All tests are created with "Active" status by default and will be
            visible to students.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Card sx={{ mb: 3, p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Test Information
              </Typography>

              <Stack spacing={2}>
                <TextField
                  label="Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  fullWidth
                  required
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
                />

                <TextField
                  label="Subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  fullWidth
                  required
                />

                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Duration (minutes)"
                    name="duration"
                    type="number"
                    value={form.duration}
                    onChange={handleChange}
                    fullWidth
                    required
                  />

                  <TextField
                    label="Total Marks"
                    name="totalMarks"
                    type="number"
                    value={form.totalMarks}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Stack>

                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Start Date"
                    name="startDate"
                    type="datetime-local"
                    value={form.startDate}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    label="End Date"
                    name="endDate"
                    type="datetime-local"
                    value={form.endDate}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>

                <FormControl fullWidth>
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
              </Stack>
            </Card>

            <Card sx={{ mb: 3, p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">
                  Questions ({questions.length})
                </Typography>
                <Button
                  startIcon={<Add />}
                  onClick={addQuestion}
                  variant="outlined"
                  size="small"
                >
                  Add Question
                </Button>
              </Box>

              {questions.map((question, questionIndex) => (
                <Card
                  key={questionIndex}
                  sx={{ mb: 2, p: 2, border: "1px solid #e0e0e0" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1">
                      Question {questionIndex + 1}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => removeQuestion(questionIndex)}
                        disabled={questions.length === 1}
                        color="error"
                      >
                        <Remove />
                      </IconButton>
                    </Box>
                  </Box>

                  <Stack spacing={2}>
                    <TextField
                      label="Question"
                      value={question.question}
                      onChange={(e) =>
                        handleQuestionChange(
                          questionIndex,
                          "question",
                          e.target.value
                        )
                      }
                      fullWidth
                      required
                      multiline
                      rows={2}
                    />

                    <Stack direction="row" spacing={2}>
                      <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Question Type</InputLabel>
                        <Select
                          value={question.type}
                          label="Question Type"
                          onChange={(e) =>
                            handleQuestionChange(
                              questionIndex,
                              "type",
                              e.target.value
                            )
                          }
                        >
                          {questionTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        label="Marks"
                        type="number"
                        value={question.marks}
                        onChange={(e) =>
                          handleQuestionChange(
                            questionIndex,
                            "marks",
                            parseInt(e.target.value)
                          )
                        }
                        sx={{ width: 100 }}
                        required
                      />
                    </Stack>

                    {question.type === "multiple-choice" && (
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle2">Options</Typography>
                          <Button
                            size="small"
                            onClick={() => addOption(questionIndex)}
                            startIcon={<Add />}
                          >
                            Add Option
                          </Button>
                        </Box>

                        <Stack spacing={1}>
                          {question.options.map((option, optionIndex) => (
                            <Box
                              key={optionIndex}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Radio
                                checked={option.isCorrect}
                                onChange={() => {
                                  // Set all options to false, then set this one to true
                                  question.options.forEach((opt, idx) => {
                                    handleOptionChange(
                                      questionIndex,
                                      idx,
                                      "isCorrect",
                                      idx === optionIndex
                                    );
                                  });
                                }}
                                size="small"
                              />
                              <TextField
                                label={`Option ${optionIndex + 1}`}
                                value={option.text}
                                onChange={(e) =>
                                  handleOptionChange(
                                    questionIndex,
                                    optionIndex,
                                    "text",
                                    e.target.value
                                  )
                                }
                                fullWidth
                                size="small"
                              />
                              <IconButton
                                size="small"
                                onClick={() =>
                                  removeOption(questionIndex, optionIndex)
                                }
                                disabled={question.options.length <= 2}
                                color="error"
                              >
                                <Remove />
                              </IconButton>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {question.type === "true-false" && (
                      <FormControl>
                        <Typography variant="subtitle2" gutterBottom>
                          Correct Answer
                        </Typography>
                        <RadioGroup
                          value={question.correctAnswer}
                          onChange={(e) =>
                            handleQuestionChange(
                              questionIndex,
                              "correctAnswer",
                              e.target.value
                            )
                          }
                        >
                          <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label="True"
                          />
                          <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label="False"
                          />
                        </RadioGroup>
                      </FormControl>
                    )}

                    {question.type === "short-answer" && (
                      <TextField
                        label="Expected Answer (Optional)"
                        value={question.correctAnswer}
                        onChange={(e) =>
                          handleQuestionChange(
                            questionIndex,
                            "correctAnswer",
                            e.target.value
                          )
                        }
                        fullWidth
                        helperText="This will be used for manual grading"
                      />
                    )}
                  </Stack>
                </Card>
              ))}
            </Card>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/tests")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Test"}
              </Button>
            </Box>
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

export default AddTest;
