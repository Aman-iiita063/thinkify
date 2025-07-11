import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search,
  ThumbUp,
  ThumbUpOutlined,
  Comment,
  Share,
  Send,
  Favorite,
  FavoriteBorder,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { marked } from "marked";
import DOMPurify from "dompurify";
import dayjs from "dayjs";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import useThinkify from "../hooks/useThinkify";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentDialog, setCommentDialog] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [shareDialog, setShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useThinkify();

  useEffect(() => {
    fetchPosts();
    const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole({
        userId: payload.userId,
        role: Cookies.get(import.meta.env.VITE_USER_ROLE),
      });
    }
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/posts/public`
      );
      if (response.data.status) {
        setPosts(response.data.posts);
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (postId, reactionType) => {
    try {
      const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
      if (!token) {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage("Please login to react to posts");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/posts/${postId}/reaction`,
        { reaction: reactionType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        // Update the post in the list
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? response.data.post : post
          )
        );
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || error.message);
    }
  };

  const handleComment = async () => {
    try {
      if (!commentText.trim()) {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage("Comment cannot be empty");
        return;
      }

      const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
      if (!token) {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage("Please login to comment");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/posts/${
          selectedPost._id
        }/comment`,
        { comment: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        // Update the post in the list
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === selectedPost._id ? response.data.post : post
          )
        );
        setCommentText("");
        setCommentDialog(false);
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Comment added successfully");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || error.message);
    }
  };

  const handleShare = (post) => {
    const url = `${window.location.origin}/posts/${post._id}`;
    setShareUrl(url);
    setShareDialog(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("success");
      setAlertMessage("Link copied to clipboard!");
      setShareDialog(false);
    } catch (error) {
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage("Failed to copy link");
    }
  };

  const renderMarkdown = (description) => {
    const html = marked(description);
    return { __html: DOMPurify.sanitize(html) };
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  if (loading) {
    return <LoadingSpinner message="Loading posts..." />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Community Posts
        </Typography>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search posts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {filteredPosts.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No posts found
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredPosts.map((post) => (
            <Card key={post._id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ mr: 2 }}>
                    {post.authorId?.fullName?.charAt(0) || "U"}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {post.authorId?.fullName || "Unknown User"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dayjs(post.createdAt).format("MMM DD, YYYY")}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="h6" gutterBottom>
                  {post.title}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  {post.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>

                <Box
                  dangerouslySetInnerHTML={renderMarkdown(post.description)}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip
                    label={`${post.reactions?.length || 0} reactions`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`${post.comments?.length || 0} comments`}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  startIcon={
                    post.reactions?.some(
                      (r) => r.userId === userRole?.userId
                    ) ? (
                      <ThumbUp />
                    ) : (
                      <ThumbUpOutlined />
                    )
                  }
                  onClick={() => handleReaction(post._id, "like")}
                >
                  Like ({post.reactions?.length || 0})
                </Button>

                <Button
                  size="small"
                  startIcon={<Comment />}
                  onClick={() => {
                    setSelectedPost(post);
                    setCommentDialog(true);
                  }}
                >
                  Comment ({post.comments?.length || 0})
                </Button>

                <Button
                  size="small"
                  startIcon={<Share />}
                  onClick={() => handleShare(post)}
                >
                  Share
                </Button>

                <Button
                  size="small"
                  onClick={() => (window.location.href = `/posts/${post._id}`)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      {/* Comment Dialog */}
      <Dialog
        open={commentDialog}
        onClose={() => setCommentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comment"
            fullWidth
            multiline
            rows={4}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentDialog(false)}>Cancel</Button>
          <Button onClick={handleComment} variant="contained">
            Post Comment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Dialog */}
      <Dialog
        open={shareDialog}
        onClose={() => setShareDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Share Post</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Share URL"
            fullWidth
            value={shareUrl}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog(false)}>Cancel</Button>
          <Button onClick={copyToClipboard} variant="contained">
            Copy Link
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Posts;
