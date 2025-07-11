import express from "express";
import userAuthentication from "../middleware/userAuthentication.js";
import {
  createResource,
  getAllResources,
  getResourceById,
  downloadResource,
  updateResource,
  deleteResource,
} from "../controller/resource.js";

const resource = express.Router();

// Create resource
resource.post("/", userAuthentication, createResource);

// Get all resources
resource.get("/", getAllResources);

// Get resource by ID
resource.get("/:resourceId", getResourceById);

// Download resource
resource.post("/:resourceId/download", downloadResource);

// Update resource (author only)
resource.put("/:resourceId", userAuthentication, updateResource);

// Delete resource (author only)
resource.delete("/:resourceId", userAuthentication, deleteResource);

export default resource;
