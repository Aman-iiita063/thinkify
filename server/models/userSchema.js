import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin", "teacher", "institution"],
  },
  image: {
    type: String,
    default: null,
  },
  institution: {
    type: String,
    default: null,
  },
  subject: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
