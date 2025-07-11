import express from "express";
import adminAuthentication from "../middleware/adminAuthentication.js";
import { getRoleBasedUserCount } from "../controller/admin.js";
import { getAnalytics } from "../controller/analytics.js";

const admin = express.Router();

admin.get("/users/role-count", adminAuthentication, getRoleBasedUserCount);
admin.get("/analytics", adminAuthentication, getAnalytics);

export default admin;
