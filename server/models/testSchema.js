import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["multiple-choice", "true-false", "short-answer"],
    default: "multiple-choice",
  },
  options: [
    {
      text: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        default: false,
      },
    },
  ],
  correctAnswer: {
    type: String,
    default: null,
  },
  marks: {
    type: Number,
    default: 1,
  },
});

const testSchema = new mongoose.Schema({
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
  duration: {
    type: Number, // in minutes
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  questions: [questionSchema],
  status: {
    type: String,
    enum: ["draft", "active", "inactive", "expired"],
    default: "draft",
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
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
      answers: [
        {
          questionIndex: {
            type: Number,
            required: true,
          },
          answer: {
            type: String,
            required: true,
          },
        },
      ],
      score: {
        type: Number,
        default: 0,
      },
      submittedAt: {
        type: Date,
        default: Date.now,
      },
      timeTaken: {
        type: Number, // in minutes
        default: 0,
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

const TestModel = mongoose.model("Test", testSchema);

export default TestModel;
