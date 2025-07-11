import ResourceModel from "../models/resourceSchema.js";

// Create resource
const createResource = async (req, res) => {
  try {
    const { title, description, visibility, url, audience } = req.body;
    const authorId = req.user._id.toString();

    if (!title || !description || !url) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }

    const newResource = new ResourceModel({
      title,
      description,
      visibility: visibility || "public",
      url,
      audience: audience || ["students"],
      authorId,
    });

    const savedResource = await newResource.save();
    if (savedResource) {
      return res
        .status(201)
        .json({
          status: true,
          message: "Resource created successfully",
          resource: savedResource,
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

// Get all resources
const getAllResources = async (req, res) => {
  try {
    const resources = await ResourceModel.find({ visibility: "public" })
      .populate("authorId", "fullName email role")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({
        status: true,
        message: "Resources fetched successfully",
        resources,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Get resource by ID
const getResourceById = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const resource = await ResourceModel.findById(resourceId).populate(
      "authorId",
      "fullName email role"
    );

    if (!resource) {
      return res
        .status(404)
        .json({ status: false, message: "Resource not found" });
    }

    res
      .status(200)
      .json({
        status: true,
        message: "Resource fetched successfully",
        resource,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Download resource
const downloadResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const resource = await ResourceModel.findById(resourceId);

    if (!resource) {
      return res
        .status(404)
        .json({ status: false, message: "Resource not found" });
    }

    // Increment download count
    resource.downloads += 1;
    await resource.save();

    res
      .status(200)
      .json({
        status: true,
        message: "Download recorded successfully",
        resource,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Update resource
const updateResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { title, description, visibility, url, audience } = req.body;
    const authorId = req.user._id.toString();

    const resource = await ResourceModel.findById(resourceId);
    if (!resource) {
      return res
        .status(404)
        .json({ status: false, message: "Resource not found" });
    }

    if (resource.authorId.toString() !== authorId) {
      return res
        .status(403)
        .json({
          status: false,
          message: "You can only update your own resources",
        });
    }

    const updatedResource = await ResourceModel.findByIdAndUpdate(
      resourceId,
      {
        title,
        description,
        visibility,
        url,
        audience,
        updatedAt: new Date(),
      },
      { new: true }
    );

    res
      .status(200)
      .json({
        status: true,
        message: "Resource updated successfully",
        resource: updatedResource,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Delete resource
const deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const authorId = req.user._id.toString();

    const resource = await ResourceModel.findById(resourceId);
    if (!resource) {
      return res
        .status(404)
        .json({ status: false, message: "Resource not found" });
    }

    if (resource.authorId.toString() !== authorId) {
      return res
        .status(403)
        .json({
          status: false,
          message: "You can only delete your own resources",
        });
    }

    await ResourceModel.findByIdAndDelete(resourceId);
    res
      .status(200)
      .json({ status: true, message: "Resource deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

export {
  createResource,
  getAllResources,
  getResourceById,
  downloadResource,
  updateResource,
  deleteResource,
};
