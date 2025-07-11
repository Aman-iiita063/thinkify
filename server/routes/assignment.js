import express from "express";
import userAuthentication from "../middleware/userAuthentication.js";
import {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  submitAssignment,
  gradeAssignment,
  updateAssignment,
  deleteAssignment,
} from "../controller/assignment.js";

const assignment = express.Router();

// Create assignment (teachers and institutions only)
assignment.post("/", userAuthentication, createAssignment);

// Get all assignments
assignment.get("/", getAllAssignments);

// Get assignment by ID
assignment.get("/:assignmentId", getAssignmentById);

// Submit assignment (students only)
assignment.post("/:assignmentId/submit", userAuthentication, submitAssignment);

// Grade assignment (teachers and institutions only)
assignment.post(
  "/:assignmentId/grade/:studentId",
  userAuthentication,
  gradeAssignment
);

// Update assignment (author only)
assignment.put("/:assignmentId", userAuthentication, updateAssignment);

// Delete assignment (author only)
assignment.delete("/:assignmentId", userAuthentication, deleteAssignment);

export default assignment;
