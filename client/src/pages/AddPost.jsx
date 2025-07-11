import {
  Box,
  TextField,
  Button,
  InputBase,
  Chip,
  Typography,
  Card,
  CardContent,
  Container,
  Paper,
  Divider,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";

import SimpleMdeReact from "react-simplemde-editor";
import { marked } from "marked";
import DOMPurify from "dompurify";
import "easymde/dist/easymde.min.css";
import useThinkify from "../hooks/useThinkify";
import axios from "axios";
import Cookies from "js-cookie";
import AddIcon from "@mui/icons-material/Add";
import TitleIcon from "@mui/icons-material/Title";
import TagIcon from "@mui/icons-material/Tag";
import DescriptionIcon from "@mui/icons-material/Description";

const AddPost = () => {
  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useThinkify();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm();
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && tag.trim() !== "") {
      event.preventDefault();
      if (!tags.includes(tag.trim())) {
        setTags([...tags, tag.trim()]);
      }
      setTag("");
    }
  };

  const renderMarkdown = () => {
    const html = marked(description);
    return { __html: DOMPurify.sanitize(html) };
  };

  const handleRemoveTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
  };

  const onSubmit = async (data) => {
    const trimmedDescription = description.trim();
    if (trimmedDescription.length === 0) {
      setError("description", {
        type: "manual",
        message: "Description is required",
      });
      return;
    }

    try {
      setLoadingStatus(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/posts`,
        {
          title: data.title,
          tags,
          description: trimmedDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(
              import.meta.env.VITE_TOKEN_KEY
            )}`,
          },
        }
      );

      if (response.data.status) {
        reset();
        setTags([]);
        setDescription("");
      }
      setLoadingStatus(false);
      setAlertBoxOpenStatus(true);
      setAlertSeverity(response.data.status ? "success" : "error");
      setAlertMessage(response.data.message);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoadingStatus(false);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage("Something Went Wrong");
      error.response.data.message
        ? setAlertMessage(error.response.data.message)
        : setAlertMessage(error.message);
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography
          variant="h4"
          sx={{ mb: 3, fontWeight: 600, color: "#1b2e35" }}
        >
          Create New Post
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: { xs: "column", lg: "row" },
            }}
          >
            {/* Left Column */}
            <Box sx={{ flex: 1 }}>
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <TitleIcon sx={{ color: "#59e3a7" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Post Title
                    </Typography>
                  </Box>
                  <TextField
                    placeholder="Enter a compelling title for your post..."
                    fullWidth
                    {...register("title", { required: "Title is required" })}
                    error={!!errors.title}
                    helperText={errors.title ? errors.title.message : ""}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <TagIcon sx={{ color: "#59e3a7" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Tags (Optional)
                    </Typography>
                  </Box>
                  <Paper
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      p: 2,
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      flexWrap: "wrap",
                      minHeight: 60,
                      backgroundColor: "#fafafa",
                    }}
                  >
                    {tags.map((item, index) => (
                      <Chip
                        key={index}
                        label={item}
                        variant="outlined"
                        size="small"
                        sx={{
                          backgroundColor: "#59e3a7",
                          color: "white",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: 500,
                          "& .MuiChip-deleteIcon": {
                            color: "white",
                          },
                          "&:hover": {
                            backgroundColor: "#4bc895",
                          },
                        }}
                        onDelete={() => handleRemoveTag(index)}
                      />
                    ))}

                    <InputBase
                      sx={{
                        flex: 1,
                        minWidth: 120,
                        "& input": {
                          padding: "8px 12px",
                          fontSize: "14px",
                        },
                        "& input::placeholder": {
                          color: "#999",
                          opacity: 1,
                        },
                      }}
                      placeholder="Type a tag and press Enter..."
                      value={tag}
                      onChange={(event) => setTag(event.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </Paper>
                  <Typography
                    variant="caption"
                    sx={{ color: "#666", mt: 1, display: "block" }}
                  >
                    Press Enter to add tags. Tags help others discover your
                    post.
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Right Column */}
            <Box sx={{ flex: 1 }}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <DescriptionIcon sx={{ color: "#59e3a7" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Post Content
                    </Typography>
                  </Box>
                  <SimpleMdeReact
                    id="description"
                    value={description}
                    onChange={setDescription}
                    options={{
                      spellChecker: false,
                      placeholder: "Write your post content here...",
                      toolbar: [
                        "bold",
                        "italic",
                        "heading",
                        "|",
                        "quote",
                        "unordered-list",
                        "ordered-list",
                        "|",
                        "link",
                        "image",
                        "|",
                        "preview",
                        "side-by-side",
                        "fullscreen",
                        "|",
                        "guide",
                      ],
                    }}
                  />
                  {errors.description && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                      {errors.description.message}
                    </Typography>
                  )}
                </CardContent>
              </Card>

              {/* Preview Section */}
              {description && (
                <Card sx={{ mt: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Preview
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: "#fafafa",
                        borderRadius: 2,
                        border: "1px solid #e0e0e0",
                      }}
                      dangerouslySetInnerHTML={renderMarkdown()}
                    />
                  </CardContent>
                </Card>
              )}
            </Box>
          </Box>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(89, 227, 167, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(89, 227, 167, 0.4)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Publish Post
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default AddPost;
