import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },
  url: {
    type: String,
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
  downloads: {
    type: Number,
    default: 0,
  },
  fileType: {
    type: String,
    default: null,
  },
  fileSize: {
    type: Number,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ResourceModel = mongoose.model("Resource", resourceSchema);

export default ResourceModel;
