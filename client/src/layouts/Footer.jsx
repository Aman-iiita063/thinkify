import {
  Grid,
  Typography,
  Box,
  Divider,
  Button,
  ListItemButton,
  ListItemText,
  List,
  Container,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1b2e35",
        color: "white",
        pt: 6,
        pb: 3,
        mt: "auto",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
              <img
                src="./images/favicon.ico"
                width="45"
                alt="Thinkify"
                style={{ borderRadius: "8px" }}
              />
              <Typography
                sx={{
                  fontFamily: "Platypi",
                  color: "#59e3a7",
                  fontWeight: 700,
                  fontSize: "1.8rem",
                }}
                variant="h3"
                component="h3"
              >
                Thinkify
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ color: "#ccc", mb: 3, lineHeight: 1.6 }}
            >
              Connecting Ideas, Inspiring Perspectives. Join our community of
              thinkers, creators, and innovators.
            </Typography>

            {/* Social Media Icons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {[
                { icon: <FacebookIcon />, color: "#1877f2" },
                { icon: <LinkedInIcon />, color: "#0077b5" },
                { icon: <YouTubeIcon />, color: "#ff0000" },
                { icon: <TwitterIcon />, color: "#1da1f2" },
                { icon: <InstagramIcon />, color: "#e4405f" },
              ].map((social, index) => (
                <IconButton
                  key={index}
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    "&:hover": {
                      backgroundColor: social.color,
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={2}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2, color: "#59e3a7" }}
            >
              Solutions
            </Typography>
            <List sx={{ p: 0 }}>
              {["Facebook", "LinkedIn", "YouTube"].map((item, index) => (
                <ListItemButton
                  key={index}
                  sx={{
                    p: 0,
                    mb: 1,
                    "&:hover": { backgroundColor: "transparent" },
                    "& .MuiListItemText-primary": {
                      color: "#ccc",
                      fontSize: "0.9rem",
                      "&:hover": { color: "#59e3a7" },
                    },
                  }}
                  component={Link}
                  to="#"
                >
                  <ListItemText primary={item} />
                </ListItemButton>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2, color: "#59e3a7" }}
            >
              Products
            </Typography>
            <List sx={{ p: 0 }}>
              {["Community", "Forums", "Marketplace"].map((item, index) => (
                <ListItemButton
                  key={index}
                  sx={{
                    p: 0,
                    mb: 1,
                    "&:hover": { backgroundColor: "transparent" },
                    "& .MuiListItemText-primary": {
                      color: "#ccc",
                      fontSize: "0.9rem",
                      "&:hover": { color: "#59e3a7" },
                    },
                  }}
                  component={Link}
                  to="#"
                >
                  <ListItemText primary={item} />
                </ListItemButton>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2, color: "#59e3a7" }}
            >
              Resources
            </Typography>
            <List sx={{ p: 0 }}>
              {["Case Studies", "Blogs", "Documentation"].map((item, index) => (
                <ListItemButton
                  key={index}
                  sx={{
                    p: 0,
                    mb: 1,
                    "&:hover": { backgroundColor: "transparent" },
                    "& .MuiListItemText-primary": {
                      color: "#ccc",
                      fontSize: "0.9rem",
                      "&:hover": { color: "#59e3a7" },
                    },
                  }}
                  component={Link}
                  to="#"
                >
                  <ListItemText primary={item} />
                </ListItemButton>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2, color: "#59e3a7" }}
            >
              Company
            </Typography>
            <List sx={{ p: 0 }}>
              {["About Us", "Careers", "Contact Us"].map((item, index) => (
                <ListItemButton
                  key={index}
                  sx={{
                    p: 0,
                    mb: 1,
                    "&:hover": { backgroundColor: "transparent" },
                    "& .MuiListItemText-primary": {
                      color: "#ccc",
                      fontSize: "0.9rem",
                      "&:hover": { color: "#59e3a7" },
                    },
                  }}
                  component={Link}
                  to="#"
                >
                  <ListItemText primary={item} />
                </ListItemButton>
              ))}
            </List>
          </Grid>
        </Grid>

        {/* Contact Info */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #59e3a7 0%, #4bc895 100%)",
            borderRadius: 3,
            p: 3,
            mt: 4,
            textAlign: "center",
            color: "#1b2e35",
            boxShadow: "0 8px 25px rgba(89, 227, 167, 0.3)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Get in Touch
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            1-800-600-0464
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            support@thinkify.com
          </Typography>
          <Typography variant="body2">
            900-140 10th Avenue SE, Calgary, AB TG 0R1
          </Typography>
        </Box>

        <Divider sx={{ my: 3, borderColor: "rgba(255, 255, 255, 0.1)" }} />

        {/* Copyright and Legal */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "#ccc" }}>
            © {new Date().getFullYear()} Thinkify. All rights reserved
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              sx={{
                color: "#59e3a7",
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(89, 227, 167, 0.1)" },
              }}
            >
              Privacy Policy
            </Button>
            <Button
              sx={{
                color: "#59e3a7",
                textTransform: "none",
                "&:hover": { backgroundColor: "rgba(89, 227, 167, 0.1)" },
              }}
            >
              Terms of Service
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
