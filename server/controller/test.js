import TestModel from "../models/testSchema.js";

// Create test
const createTest = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      duration,
      totalMarks,
      questions,
      startDate,
      endDate,
      audience,
    } = req.body;
    const authorId = req.user._id.toString();
    const userRole = req.user.role;

    // Check if user has permission to create tests
    if (!["teacher", "institution", "admin"].includes(userRole)) {
      return res.status(403).json({
        status: false,
        message: "Only teachers, institutions, and admins can create tests",
      });
    }

    if (
      !title ||
      !description ||
      !subject ||
      !duration ||
      !totalMarks ||
      !questions ||
      !startDate ||
      !endDate
    ) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }

    if (questions.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "At least one question is required" });
    }

    const newTest = new TestModel({
      title,
      description,
      subject,
      duration: parseInt(duration),
      totalMarks: parseInt(totalMarks),
      questions,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      audience: audience || ["students"],
      authorId,
      status: "active", // Always set to active regardless of frontend value
    });

    const savedTest = await newTest.save();
    if (savedTest) {
      return res.status(201).json({
        status: true,
        message: "Test created successfully",
        test: savedTest,
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

// Get all tests
const getAllTests = async (req, res) => {
  try {
    const tests = await TestModel.find({ status: { $ne: "expired" } })
      .populate("authorId", "fullName email role")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ status: true, message: "Tests fetched successfully", tests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Get test by ID
const getTestById = async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await TestModel.findById(testId)
      .populate("authorId", "fullName email role")
      .populate("submissions.studentId", "fullName email");

    if (!test) {
      return res.status(404).json({ status: false, message: "Test not found" });
    }

    res
      .status(200)
      .json({ status: true, message: "Test fetched successfully", test });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Submit test
const submitTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const { answers, timeTaken } = req.body;
    const studentId = req.user._id.toString();

    if (!answers || !Array.isArray(answers)) {
      return res
        .status(400)
        .json({ status: false, message: "Answers are required" });
    }

    const test = await TestModel.findById(testId);
    if (!test) {
      return res.status(404).json({ status: false, message: "Test not found" });
    }

    // Check if already submitted
    const existingSubmission = test.submissions.find(
      (sub) => sub.studentId.toString() === studentId
    );
    if (existingSubmission) {
      return res.status(400).json({
        status: false,
        message: "You have already submitted this test",
      });
    }

    // Calculate score
    let score = 0;
    answers.forEach((answer, index) => {
      const question = test.questions[index];
      if (question && answer.answer) {
        if (question.type === "multiple-choice") {
          const correctOption = question.options.find((opt) => opt.isCorrect);
          if (correctOption && answer.answer === correctOption.text) {
            score += question.marks;
          }
        } else if (question.type === "true-false") {
          if (answer.answer === question.correctAnswer) {
            score += question.marks;
          }
        } else if (question.type === "short-answer") {
          // For short answer, you might want to implement manual grading
          // For now, we'll just store the answer
          score += 0;
        }
      }
    });

    test.submissions.push({
      studentId,
      answers,
      score,
      timeTaken: timeTaken || 0,
    });

    const updatedTest = await test.save();
    res.status(200).json({
      status: true,
      message: "Test submitted successfully",
      test: updatedTest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Update test
const updateTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const {
      title,
      description,
      subject,
      duration,
      totalMarks,
      questions,
      startDate,
      endDate,
      status,
      audience,
    } = req.body;
    const authorId = req.user._id.toString();

    const test = await TestModel.findById(testId);
    if (!test) {
      return res.status(404).json({ status: false, message: "Test not found" });
    }

    if (test.authorId.toString() !== authorId) {
      return res
        .status(403)
        .json({ status: false, message: "You can only update your own tests" });
    }

    const updatedTest = await TestModel.findByIdAndUpdate(
      testId,
      {
        title,
        description,
        subject,
        duration: duration ? parseInt(duration) : test.duration,
        totalMarks: totalMarks ? parseInt(totalMarks) : test.totalMarks,
        questions,
        startDate: startDate ? new Date(startDate) : test.startDate,
        endDate: endDate ? new Date(endDate) : test.endDate,
        status,
        audience,
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.status(200).json({
      status: true,
      message: "Test updated successfully",
      test: updatedTest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Delete test
const deleteTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const authorId = req.user._id.toString();

    const test = await TestModel.findById(testId);
    if (!test) {
      return res.status(404).json({ status: false, message: "Test not found" });
    }

    if (test.authorId.toString() !== authorId) {
      return res
        .status(403)
        .json({ status: false, message: "You can only delete your own tests" });
    }

    await TestModel.findByIdAndDelete(testId);
    res
      .status(200)
      .json({ status: true, message: "Test deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

export {
  createTest,
  getAllTests,
  getTestById,
  submitTest,
  updateTest,
  deleteTest,
};
