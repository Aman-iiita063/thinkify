import UserModel from "../models/userSchema.js";
import PostModel from "../models/postSchema.js";
import TaskModel from "../models/taskSchema.js";
import AssignmentModel from "../models/assignmentSchema.js";
import PollModel from "../models/pollSchema.js";
import ResourceModel from "../models/resourceSchema.js";
import TestModel from "../models/testSchema.js";

const getAnalytics = async (req, res) => {
  try {
    const { timeRange = "week" } = req.query;
    const adminId = req.admin._id.toString();

    // Calculate date range
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get basic counts
    const totalUsers = await UserModel.countDocuments();
    const newUsers = await UserModel.countDocuments({
      createdAt: { $gte: startDate },
    });

    const totalAssignments = await AssignmentModel.countDocuments();
    const totalPolls = await PollModel.countDocuments();
    const totalTests = await TestModel.countDocuments();
    const totalResources = await ResourceModel.countDocuments();

    // Get user role distribution
    const userRoleDistribution = await UserModel.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: "$_id",
          value: "$count",
        },
      },
    ]);

    // Get assignment completion rate
    const completedAssignments = await AssignmentModel.countDocuments({
      "submissions.marks": { $exists: true, $ne: null },
    });
    const assignmentCompletionRate =
      totalAssignments > 0
        ? Math.round((completedAssignments / totalAssignments) * 100)
        : 0;

    // Get total votes
    const totalVotes = await PollModel.aggregate([
      {
        $project: {
          totalVotes: { $size: "$votes" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalVotes" },
        },
      },
    ]);

    // Get average test score
    const testScores = await TestModel.aggregate([
      {
        $unwind: "$submissions",
      },
      {
        $group: {
          _id: null,
          avgScore: { $avg: "$submissions.score" },
          totalTests: { $sum: 1 },
        },
      },
    ]);

    const averageTestScore =
      testScores.length > 0 ? Math.round(testScores[0].avgScore || 0) : 0;

    // Generate mock data for charts (in real app, this would be actual data)
    const userRegistrationTrend = generateMockTrendData(7, "users");
    const contentCreation = [
      { type: "Posts", count: await PostModel.countDocuments() },
      { type: "Assignments", count: totalAssignments },
      { type: "Polls", count: totalPolls },
      { type: "Tests", count: totalTests },
      { type: "Resources", count: totalResources },
    ];

    const assignmentCompletion = generateMockTrendData(6, "rate");
    const dailyActiveUsers = generateMockTrendData(7, "users");
    const featureEngagement = [
      { feature: "Posts", engagement: 85 },
      { feature: "Assignments", engagement: 72 },
      { feature: "Polls", engagement: 68 },
      { feature: "Tests", engagement: 45 },
      { feature: "Resources", engagement: 58 },
    ];

    // Recent activity
    const recentActivity = await generateRecentActivity();

    const analytics = {
      totalUsers,
      newUsers,
      totalAssignments,
      assignmentCompletionRate,
      totalPolls,
      totalVotes: totalVotes.length > 0 ? totalVotes[0].total : 0,
      totalTests,
      averageTestScore,
      userRoleDistribution,
      userRegistrationTrend,
      contentCreation,
      assignmentCompletion,
      dailyActiveUsers,
      featureEngagement,
      recentActivity,
    };

    res
      .status(200)
      .json({
        status: true,
        message: "Analytics fetched successfully",
        analytics,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

const generateMockTrendData = (days, type) => {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    if (type === "users") {
      data.push({
        date: date.toLocaleDateString(),
        users: Math.floor(Math.random() * 50) + 10,
      });
    } else if (type === "rate") {
      data.push({
        month: date.toLocaleDateString("en-US", { month: "short" }),
        rate: Math.floor(Math.random() * 30) + 60,
      });
    }
  }
  return data;
};

const generateRecentActivity = async () => {
  const activities = [];

  // Get recent posts
  const recentPosts = await PostModel.find().sort({ createdAt: -1 }).limit(3);
  recentPosts.forEach((post) => {
    activities.push({
      title: `New post: ${post.title}`,
      user: post.authorId?.fullName || "Unknown",
      timestamp: post.createdAt,
      type: "Post",
      color: "primary.main",
      icon: "📝",
    });
  });

  // Get recent assignments
  const recentAssignments = await AssignmentModel.find()
    .sort({ createdAt: -1 })
    .limit(3);
  recentAssignments.forEach((assignment) => {
    activities.push({
      title: `New assignment: ${assignment.title}`,
      user: assignment.authorId?.fullName || "Unknown",
      timestamp: assignment.createdAt,
      type: "Assignment",
      color: "warning.main",
      icon: "📚",
    });
  });

  // Get recent polls
  const recentPolls = await PollModel.find().sort({ createdAt: -1 }).limit(3);
  recentPolls.forEach((poll) => {
    activities.push({
      title: `New poll: ${poll.title}`,
      user: poll.authorId?.fullName || "Unknown",
      timestamp: poll.createdAt,
      type: "Poll",
      color: "info.main",
      icon: "📊",
    });
  });

  return activities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);
};

export { getAnalytics };
