import PollModel from "../models/pollSchema.js";

// Create poll
const createPoll = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      options,
      deadline,
      anonymousMember,
      audience,
    } = req.body;
    const authorId = req.user._id.toString();

    if (!title || !description || !options || !deadline) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }

    if (options.length < 2) {
      return res
        .status(400)
        .json({ status: false, message: "At least 2 options are required" });
    }

    const newPoll = new PollModel({
      title,
      description,
      type: type || "single",
      options: options.map((option) => ({ text: option, votes: 0 })),
      deadline: new Date(deadline),
      anonymousMember: anonymousMember || false,
      audience: audience || ["students"],
      authorId,
    });

    const savedPoll = await newPoll.save();
    if (savedPoll) {
      return res
        .status(201)
        .json({
          status: true,
          message: "Poll created successfully",
          poll: savedPoll,
        });
    } else {
      return res
        .status(500)
        .json({ status: false, message: "Something Went Wrong" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Get all polls
const getAllPolls = async (req, res) => {
  try {
    const polls = await PollModel.find({ status: { $ne: "expired" } })
      .populate("authorId", "fullName email role")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ status: true, message: "Polls fetched successfully", polls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Get poll by ID
const getPollById = async (req, res) => {
  try {
    const { pollId } = req.params;
    const poll = await PollModel.findById(pollId).populate(
      "authorId",
      "fullName email role"
    );

    if (!poll) {
      return res.status(404).json({ status: false, message: "Poll not found" });
    }

    res
      .status(200)
      .json({ status: true, message: "Poll fetched successfully", poll });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Vote in poll
const voteInPoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { selectedOptions } = req.body;
    const userId = req.user._id.toString();

    if (!selectedOptions || !Array.isArray(selectedOptions)) {
      return res
        .status(400)
        .json({ status: false, message: "Selected options are required" });
    }

    const poll = await PollModel.findById(pollId);
    if (!poll) {
      return res.status(404).json({ status: false, message: "Poll not found" });
    }

    // Check if already voted
    const existingVote = poll.votes.find(
      (vote) => vote.userId.toString() === userId
    );
    if (existingVote) {
      return res
        .status(400)
        .json({
          status: false,
          message: "You have already voted in this poll",
        });
    }

    // Validate selected options
    if (poll.type === "single" && selectedOptions.length > 1) {
      return res
        .status(400)
        .json({
          status: false,
          message: "Single choice poll allows only one option",
        });
    }

    // Update option votes
    selectedOptions.forEach((optionIndex) => {
      if (poll.options[optionIndex]) {
        poll.options[optionIndex].votes += 1;
      }
    });

    // Add vote record
    poll.votes.push({
      userId,
      selectedOptions,
    });

    const updatedPoll = await poll.save();
    res
      .status(200)
      .json({
        status: true,
        message: "Vote recorded successfully",
        poll: updatedPoll,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Update poll
const updatePoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    const {
      title,
      description,
      type,
      options,
      deadline,
      status,
      anonymousMember,
      audience,
    } = req.body;
    const authorId = req.user._id.toString();

    const poll = await PollModel.findById(pollId);
    if (!poll) {
      return res.status(404).json({ status: false, message: "Poll not found" });
    }

    if (poll.authorId.toString() !== authorId) {
      return res
        .status(403)
        .json({ status: false, message: "You can only update your own polls" });
    }

    const updatedPoll = await PollModel.findByIdAndUpdate(
      pollId,
      {
        title,
        description,
        type,
        options: options
          ? options.map((option) => ({ text: option, votes: 0 }))
          : poll.options,
        deadline: deadline ? new Date(deadline) : poll.deadline,
        status,
        anonymousMember,
        audience,
        updatedAt: new Date(),
      },
      { new: true }
    );

    res
      .status(200)
      .json({
        status: true,
        message: "Poll updated successfully",
        poll: updatedPoll,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Delete poll
const deletePoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    const authorId = req.user._id.toString();

    const poll = await PollModel.findById(pollId);
    if (!poll) {
      return res.status(404).json({ status: false, message: "Poll not found" });
    }

    if (poll.authorId.toString() !== authorId) {
      return res
        .status(403)
        .json({ status: false, message: "You can only delete your own polls" });
    }

    await PollModel.findByIdAndDelete(pollId);
    res
      .status(200)
      .json({ status: true, message: "Poll deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

export {
  createPoll,
  getAllPolls,
  getPollById,
  voteInPoll,
  updatePoll,
  deletePoll,
};
