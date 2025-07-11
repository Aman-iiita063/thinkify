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
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Stack,
  Paper,
} from "@mui/material";
import { Add, Search, Poll } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import dayjs from "dayjs";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import useThinkify from "../hooks/useThinkify";

const Polls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [votedPolls, setVotedPolls] = useState([]);

  // Load votedPolls from localStorage for the current user and role
  useEffect(() => {
    if (userRole?.userId && userRole?.role) {
      const stored = localStorage.getItem(
        `votedPolls_${userRole.userId}_${userRole.role}`
      );
      setVotedPolls(stored ? JSON.parse(stored) : []);
      setSelectedOptions({});
    }
  }, [userRole?.userId, userRole?.role]);

  // Save votedPolls to localStorage when it changes
  useEffect(() => {
    if (userRole?.userId && userRole?.role) {
      localStorage.setItem(
        `votedPolls_${userRole.userId}_${userRole.role}`,
        JSON.stringify(votedPolls)
      );
    }
  }, [votedPolls, userRole?.userId, userRole?.role]);

  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useThinkify();

  useEffect(() => {
    fetchPolls();
    const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole({
        userId: payload.userId,
        role: Cookies.get(import.meta.env.VITE_USER_ROLE),
      });
    }
  }, []);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/polls`
      );
      if (response.data.status) {
        setPolls(response.data.polls);
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching polls:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId, selectedOptionsArr) => {
    try {
      setLoadingStatus(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/polls/${pollId}/vote`,
        { selectedOptions: selectedOptionsArr },
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
        setAlertMessage("Vote recorded successfully");
        setVotedPolls((prev) => [...prev, pollId]);
        fetchPolls();
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error voting:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || error.message);
    } finally {
      setLoadingStatus(false);
    }
  };

  const filteredPolls = polls.filter(
    (poll) =>
      (poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poll.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        poll.authorId.fullName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) &&
      !votedPolls.includes(poll._id)
  );

  if (loading) {
    return <LoadingSpinner message="Loading polls..." />;
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
          Polls
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => (window.location.href = "/add-poll")}
        >
          Create Poll
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search polls..."
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

      {filteredPolls.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No polls found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredPolls.map((poll) => (
            <Grid item xs={12} md={6} lg={4} key={poll._id}>
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
                      {poll.title}
                    </Typography>
                    <Chip label={poll.type} color="primary" size="small" />
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {poll.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Deadline: {dayjs(poll.deadline).format("MMM DD, YYYY")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      By: {poll.authorId.fullName}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {poll.options.map((option, index) => (
                      <Chip
                        key={index}
                        label={`${option.text} (${option.votes} votes)`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Options:</Typography>
                    {poll.type === "single" ? (
                      <RadioGroup
                        value={selectedOptions[poll._id] ?? ""}
                        onChange={(e) =>
                          setSelectedOptions((prev) => ({
                            ...prev,
                            [poll._id]: Number(e.target.value),
                          }))
                        }
                      >
                        {poll.options.map((option, idx) => (
                          <FormControlLabel
                            key={idx}
                            value={idx}
                            control={<Radio color="primary" />}
                            label={
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                              >
                                <Typography>{option.text}</Typography>
                                <Chip
                                  label={`Votes: ${option.votes}`}
                                  size="small"
                                />
                              </Stack>
                            }
                            sx={{
                              bgcolor:
                                selectedOptions[poll._id] === idx
                                  ? "#e3f2fd"
                                  : "inherit",
                              borderRadius: 1,
                              px: 1,
                            }}
                          />
                        ))}
                      </RadioGroup>
                    ) : (
                      <Stack spacing={1}>
                        {poll.options.map((option, idx) => (
                          <Paper
                            key={idx}
                            variant={
                              Array.isArray(selectedOptions[poll._id]) &&
                              selectedOptions[poll._id].includes(idx)
                                ? "outlined"
                                : "elevation"
                            }
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 1,
                              bgcolor:
                                Array.isArray(selectedOptions[poll._id]) &&
                                selectedOptions[poll._id].includes(idx)
                                  ? "#e3f2fd"
                                  : "inherit",
                            }}
                          >
                            <Checkbox
                              checked={
                                Array.isArray(selectedOptions[poll._id]) &&
                                selectedOptions[poll._id].includes(idx)
                              }
                              onChange={() => {
                                setSelectedOptions((prev) => {
                                  const prevArr = Array.isArray(prev[poll._id])
                                    ? prev[poll._id]
                                    : [];
                                  if (prevArr.includes(idx)) {
                                    return {
                                      ...prev,
                                      [poll._id]: prevArr.filter(
                                        (i) => i !== idx
                                      ),
                                    };
                                  } else {
                                    return {
                                      ...prev,
                                      [poll._id]: [...prevArr, idx],
                                    };
                                  }
                                });
                              }}
                              color="primary"
                            />
                            <Typography sx={{ ml: 1 }}>
                              {option.text}
                            </Typography>
                            <Chip
                              label={`Votes: ${option.votes}`}
                              size="small"
                              sx={{ ml: 2 }}
                            />
                          </Paper>
                        ))}
                      </Stack>
                    )}
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() =>
                      handleVote(
                        poll._id,
                        poll.type === "single"
                          ? [selectedOptions[poll._id]]
                          : selectedOptions[poll._id] || []
                      )
                    }
                    disabled={
                      poll.type === "single"
                        ? selectedOptions[poll._id] === undefined
                        : !Array.isArray(selectedOptions[poll._id]) ||
                          selectedOptions[poll._id].length === 0
                    }
                    sx={{ mt: 2 }}
                  >
                    Vote
                  </Button>
                </CardContent>
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
          onClick={() => (window.location.href = "/add-poll")}
        >
          <Add />
        </Fab>
      )}
    </Box>
  );
};

export default Polls;
