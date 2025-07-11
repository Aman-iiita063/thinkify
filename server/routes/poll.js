import express from "express";
import userAuthentication from "../middleware/userAuthentication.js";
import {
  createPoll,
  getAllPolls,
  getPollById,
  voteInPoll,
  updatePoll,
  deletePoll,
} from "../controller/poll.js";

const poll = express.Router();

// Create poll (teachers and institutions only)
poll.post("/", userAuthentication, createPoll);

// Get all polls
poll.get("/", getAllPolls);

// Get poll by ID
poll.get("/:pollId", getPollById);

// Vote in poll
poll.post("/:pollId/vote", userAuthentication, voteInPoll);

// Update poll (author only)
poll.put("/:pollId", userAuthentication, updatePoll);

// Delete poll (author only)
poll.delete("/:pollId", userAuthentication, deletePoll);

export default poll;
