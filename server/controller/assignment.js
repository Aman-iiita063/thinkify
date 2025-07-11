import AssignmentModel from "../models/assignmentSchema.js";
import UserModel from "../models/userSchema.js";

// Create assignment
const createAssignment = async (req, res) => {
  try {
    const { title, description, subject, deadline, totalMarks, audience } =
      req.body;
    const authorId = req.user._id.toString();
    const userRole = req.user.role;

    // Check if user has permission to create assignments
    if (!["teacher", "institution", "admin"].includes(userRole)) {
      return res.status(403).json({
        status: false,
        message:
          "Only teachers, institutions, and admins can create assignments",
      });
    }

    if (!title || !description || !subject || !deadline || !totalMarks) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }

    const newAssignment = new AssignmentModel({
      title,
      description,
      subject,
      deadline: new Date(deadline),
      totalMarks: parseInt(totalMarks),
      audience: audience || ["students"],
      authorId,
    });

    const savedAssignment = await newAssignment.save();
    if (savedAssignment) {
      return res.status(201).json({
        status: true,
        message: "Assignment created successfully",
        assignment: savedAssignment,
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

// Get all assignments
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await AssignmentModel.find({
      status: { $ne: "expired" },
    })
      .populate("authorId", "fullName email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Assignments fetched successfully",
      assignments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Get assignment by ID
const getAssignmentById = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await AssignmentModel.findById(assignmentId)
      .populate("authorId", "fullName email role")
      .populate("submissions.studentId", "fullName email");

    if (!assignment) {
      return res
        .status(404)
        .json({ status: false, message: "Assignment not found" });
    }

    res.status(200).json({
      status: true,
      message: "Assignment fetched successfully",
      assignment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Submit assignment
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { submission } = req.body;
    const studentId = req.user._id.toString();

    if (!submission) {
      return res
        .status(400)
        .json({ status: false, message: "Submission is required" });
    }

    const assignment = await AssignmentModel.findById(assignmentId);
    if (!assignment) {
      return res
        .status(404)
        .json({ status: false, message: "Assignment not found" });
    }

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      (sub) => sub.studentId.toString() === studentId
    );
    if (existingSubmission) {
      return res.status(400).json({
        status: false,
        message: "You have already submitted this assignment",
      });
    }

    assignment.submissions.push({
      studentId,
      submission,
    });

    const updatedAssignment = await assignment.save();
    res.status(200).json({
      status: true,
      message: "Assignment submitted successfully",
      assignment: updatedAssignment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Grade assignment
const gradeAssignment = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;
    const { marks, feedback } = req.body;
    const userRole = req.user.role;

    // Check if user has permission to grade assignments
    if (!["teacher", "institution", "admin"].includes(userRole)) {
      return res.status(403).json({
        status: false,
        message:
          "Only teachers, institutions, and admins can grade assignments",
      });
    }

    if (!marks) {
      return res
        .status(400)
        .json({ status: false, message: "Marks are required" });
    }

    const assignment = await AssignmentModel.findById(assignmentId);
    if (!assignment) {
      return res
        .status(404)
        .json({ status: false, message: "Assignment not found" });
    }

    const submission = assignment.submissions.find(
      (sub) => sub.studentId.toString() === studentId
    );
    if (!submission) {
      return res
        .status(404)
        .json({ status: false, message: "Submission not found" });
    }

    submission.marks = parseInt(marks);
    submission.feedback = feedback;

    const updatedAssignment = await assignment.save();
    res.status(200).json({
      status: true,
      message: "Assignment graded successfully",
      assignment: updatedAssignment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Update assignment
const updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const {
      title,
      description,
      subject,
      deadline,
      totalMarks,
      status,
      audience,
    } = req.body;
    const authorId = req.user._id.toString();

    const assignment = await AssignmentModel.findById(assignmentId);
    if (!assignment) {
      return res
        .status(404)
        .json({ status: false, message: "Assignment not found" });
    }

    if (assignment.authorId.toString() !== authorId) {
      return res.status(403).json({
        status: false,
        message: "You can only update your own assignments",
      });
    }

    const updatedAssignment = await AssignmentModel.findByIdAndUpdate(
      assignmentId,
      {
        title,
        description,
        subject,
        deadline: deadline ? new Date(deadline) : assignment.deadline,
        totalMarks: totalMarks ? parseInt(totalMarks) : assignment.totalMarks,
        status,
        audience,
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.status(200).json({
      status: true,
      message: "Assignment updated successfully",
      assignment: updatedAssignment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Delete assignment
const deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const authorId = req.user._id.toString();

    const assignment = await AssignmentModel.findById(assignmentId);
    if (!assignment) {
      return res
        .status(404)
        .json({ status: false, message: "Assignment not found" });
    }

    if (assignment.authorId.toString() !== authorId) {
      return res.status(403).json({
        status: false,
        message: "You can only delete your own assignments",
      });
    }

    await AssignmentModel.findByIdAndDelete(assignmentId);
    res
      .status(200)
      .json({ status: true, message: "Assignment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

export {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  submitAssignment,
  gradeAssignment,
  updateAssignment,
  deleteAssignment,
};
