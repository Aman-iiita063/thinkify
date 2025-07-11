import mongoose from "mongoose";
import PostModel from "../models/postSchema.js";

const addPost = async (req, res) => {
  try {
    const { title, tags, description } = req.body;
    const authorId = req.user._id.toString();

    if (!title || !description) {
      return res
        .status(400)
        .json({ status: false, message: "Title and description are required" });
    }

    const newPost = await PostModel({
      title,
      tags: tags || [],
      description,
      authorId,
      createdAt: new Date(),
    });
    const savedPost = await newPost.save();
    if (savedPost) {
      return res
        .status(201)
        .json({ status: true, message: "Post created successfully" });
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

const removePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const authorId = req.user._id.toString();

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    if (post.authorId.toString() !== authorId) {
      return res
        .status(403)
        .json({ status: false, message: "You can only delete your own posts" });
    }

    const deletedPost = await PostModel.findByIdAndDelete(postId);
    if (deletedPost) {
      return res
        .status(200)
        .json({ status: true, message: "Post deleted successfully" });
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

const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, tags, description } = req.body;
    const authorId = req.user._id.toString();

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    if (post.authorId.toString() !== authorId) {
      return res
        .status(403)
        .json({ status: false, message: "You can only edit your own posts" });
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        title,
        tags,
        description,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (updatedPost) {
      return res
        .status(200)
        .json({ status: true, message: "Post updated successfully" });
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

// Get user's own posts
const getAllPost = async (req, res) => {
  try {
    const { limit, sort } = req.query;
    const authorId = req.user._id.toString();

    let postsQuery = PostModel.find({ authorId });

    if (sort === "createdAt") {
      postsQuery = postsQuery.sort({ createdAt: -1 });
    }

    if (limit) {
      postsQuery = postsQuery.limit(parseInt(limit));
    }

    const posts = await postsQuery;
    res
      .status(200)
      .json({ status: true, message: "Data Fetched Successfully", posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Get all public posts from all users
const getAllPublicPosts = async (req, res) => {
  try {
    const { limit, sort, search } = req.query;

    let postsQuery = PostModel.find({ visibility: "public" })
      .populate("authorId", "fullName email role image")
      .sort({ createdAt: -1 });

    if (sort === "createdAt") {
      postsQuery = postsQuery.sort({ createdAt: -1 });
    }

    if (search) {
      postsQuery = postsQuery.find({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ],
      });
    }

    if (limit) {
      postsQuery = postsQuery.limit(parseInt(limit));
    }

    const posts = await postsQuery;
    res.status(200).json({
      status: true,
      message: "Public posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const getSinglePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await PostModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(postId),
          visibility: "public",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $lookup: {
          from: "users",
          localField: "reactions.userId",
          foreignField: "_id",
          as: "reactors",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "comments.userId",
          foreignField: "_id",
          as: "commenters",
        },
      },
      {
        $addFields: {
          reactors: {
            $map: {
              input: "$reactors",
              as: "reactor",
              in: {
                _id: "$$reactor._id",
                fullName: "$$reactor.fullName",
                email: "$$reactor.email",
                role: "$$reactor.role",
              },
            },
          },
          commenters: {
            $map: {
              input: "$commenters",
              as: "commenter",
              in: {
                _id: "$$commenter._id",
                fullName: "$$commenter.fullName",
                email: "$$commenter.email",
                role: "$$commenter.role",
              },
            },
          },
        },
      },
    ]);

    if (post.length === 0) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    res.status(200).json({
      status: true,
      message: "Post fetched successfully",
      post: post[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id.toString();

    if (!comment) {
      return res
        .status(400)
        .json({ status: false, message: "Comment is required" });
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    post.comments.push({
      userId,
      comment,
      createdAt: new Date(),
    });

    const updatedPost = await post.save();
    res.status(200).json({
      status: true,
      message: "Comment added successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const addReaction = async (req, res) => {
  try {
    const { postId } = req.params;
    const { reaction } = req.body;
    const userId = req.user._id.toString();

    if (!reaction) {
      return res
        .status(400)
        .json({ status: false, message: "Reaction is required" });
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ status: false, message: "Post not found" });
    }

    // Check if user already reacted
    const existingReaction = post.reactions.find(
      (r) => r.userId.toString() === userId
    );
    if (existingReaction) {
      // Update existing reaction
      existingReaction.reaction = reaction;
      existingReaction.createdAt = new Date();
    } else {
      // Add new reaction
      post.reactions.push({
        userId,
        reaction,
        createdAt: new Date(),
      });
    }

    const updatedPost = await post.save();
    res.status(200).json({
      status: true,
      message: "Reaction added successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const handleVisibility = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await PostModel.findById(postId);
    const updatedPost = await PostModel.findByIdAndUpdate(postId, {
      visibility: post.visibility === "public" ? "private" : "public",
    });
    if (updatedPost) {
      res
        .status(200)
        .json({ status: true, message: "Visibility Updated Successfully" });
    } else {
      res.status(500).json({ status: false, message: "Something Went Wrong" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

export {
  addPost,
  removePost,
  editPost,
  getAllPost,
  getAllPublicPosts,
  getSinglePost,
  addComment,
  addReaction,
  handleVisibility,
};
