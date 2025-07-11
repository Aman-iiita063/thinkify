import express from "express";
import userAuthentication from "../middleware/userAuthentication.js";
import {
  createTest,
  getAllTests,
  getTestById,
  submitTest,
  updateTest,
  deleteTest,
} from "../controller/test.js";

const test = express.Router();

// Create test (teachers and institutions only)
test.post("/", userAuthentication, createTest);

// Get all tests
test.get("/", getAllTests);

// Get test by ID
test.get("/:testId", getTestById);

// Submit test (students only)
test.post("/:testId/submit", userAuthentication, submitTest);

// Update test (author only)
test.put("/:testId", userAuthentication, updateTest);

// Delete test (author only)
test.delete("/:testId", userAuthentication, deleteTest);

export default test;
