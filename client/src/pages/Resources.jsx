import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardActions,
  Chip,
  Fab,
  Link,
} from "@mui/material";
import { Add, Search, Download, Visibility } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import useThinkify from "../hooks/useThinkify";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState(null);

  const {
    setLoadingStatus,
    setAlertBoxOpenStatus,
    setAlertMessage,
    setAlertSeverity,
  } = useThinkify();

  useEffect(() => {
    fetchResources();
    const token = Cookies.get(import.meta.env.VITE_TOKEN_KEY);
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole({
        userId: payload.userId,
        role: Cookies.get(import.meta.env.VITE_USER_ROLE),
      });
    }
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/resources`
      );
      if (response.data.status) {
        setResources(response.data.resources);
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resourceId) => {
    try {
      setLoadingStatus(true);
      const response = await axios.post(
        `${
          import.meta.env.VITE_SERVER_ENDPOINT
        }/resources/${resourceId}/download`
      );

      if (response.data.status) {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Download recorded successfully");
        fetchResources(); // Refresh to update download count
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error downloading resource:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage(error.response?.data?.message || error.message);
    } finally {
      setLoadingStatus(false);
    }
  };

  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.authorId.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner message="Loading resources..." />;
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
          Resources
        </Typography>

        {["teacher", "institution", "admin"].includes(userRole?.role) && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => (window.location.href = "/add-resource")}
          >
            Add Resource
          </Button>
        )}
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search resources..."
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

      {filteredResources.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No resources found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredResources.map((resource) => (
            <Grid item xs={12} md={6} lg={4} key={resource._id}>
              <Card sx={{ mb: 2, boxShadow: 2 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" component="h2" gutterBottom>
                      {resource.title}
                    </Typography>
                    <Chip
                      label={resource.visibility}
                      color={
                        resource.visibility === "public" ? "success" : "warning"
                      }
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {resource.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      By: {resource.authorId.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Downloads: {resource.downloads || 0}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {resource.audience?.map((audience, index) => (
                      <Chip
                        key={index}
                        label={audience}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    onClick={() =>
                      (window.location.href = `/resources/${resource._id}`)
                    }
                  >
                    View Details
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<Download />}
                    onClick={() => handleDownload(resource._id)}
                  >
                    Download
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {["teacher", "institution", "admin"].includes(userRole?.role) && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          onClick={() => (window.location.href = "/add-resource")}
        >
          <Add />
        </Fab>
      )}
    </Box>
  );
};

export default Resources;
