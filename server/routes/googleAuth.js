import express from "express";
import { googleLogin } from "../controller/googleAuth.js";

const googleAuth = express.Router();

googleAuth.post("/login", googleLogin);

export default googleAuth;
