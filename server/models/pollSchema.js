import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["single", "multiple"],
    default: "single",
  },
  options: [
    {
      text: {
        type: String,
        required: true,
      },
      votes: {
        type: Number,
        default: 0,
      },
    },
  ],
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "expired"],
    default: "active",
  },
  anonymousMember: {
    type: Boolean,
    default: false,
  },
  audience: {
    type: [String],
    enum: ["all", "students", "teachers", "institutions"],
    default: ["students"],
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  votes: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      selectedOptions: [
        {
          type: Number,
          required: true,
        },
      ],
      votedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const PollModel = mongoose.model("Poll", pollSchema);

export default PollModel;
