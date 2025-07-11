import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "expired"],
    default: "active",
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
  submissions: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      submission: {
        type: String,
        required: true,
      },
      submittedAt: {
        type: Date,
        default: Date.now,
      },
      marks: {
        type: Number,
        default: null,
      },
      feedback: {
        type: String,
        default: null,
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

const AssignmentModel = mongoose.model("Assignment", assignmentSchema);

export default AssignmentModel;
