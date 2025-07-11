import {
  Box,
  Grid,
  TextField,
  Typography,
  Stack,
  Chip,
  Button,
  Container,
  useTheme,
} from "@mui/material";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

const Banner = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(89, 227, 167, 0.1) 0%, rgba(27, 46, 53, 0.1) 100%)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(89, 227, 167, 0.1) 0%, rgba(27, 46, 53, 0.1) 100%)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Grid
          container
          spacing={4}
          alignItems="center"
          sx={{ minHeight: "80vh" }}
        >
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                animation: "fadeInUp 1s ease-out",
                "@keyframes fadeInUp": {
                  "0%": {
                    opacity: 0,
                    transform: "translateY(30px)",
                  },
                  "100%": {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "#666",
                  mb: 2,
                }}
              >
                <ConnectWithoutContactIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Connecting Ideas, Inspiring Perspectives
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontFamily: "Platypi",
                  color: "#1b2e35",
                  fontWeight: 700,
                  fontSize: { xs: "3rem", md: "4rem" },
                  lineHeight: 1.1,
                  mb: 3,
                  background:
                    "linear-gradient(135deg, #1b2e35 0%, #59e3a7 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                variant="h1"
                component="h1"
              >
                Thinkify
              </Typography>

              <Typography
                sx={{
                  color: "#666",
                  fontSize: "1.1rem",
                  lineHeight: 1.7,
                  mb: 4,
                  maxWidth: 500,
                }}
                variant="body1"
              >
                At Thinkify, our mission is to provide a dynamic and intuitive
                platform that empowers individuals to transform their ideas into
                actionable tasks.
              </Typography>

              <Box sx={{ mb: 4 }}>
                <TextField
                  placeholder="Search for posts, products, and more..."
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(10px)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      py: 2,
                      px: 3,
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon sx={{ color: "#59e3a7" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {[
                  "vr-gaming",
                  "blockchain",
                  "crypto-currency",
                  "machine-learning",
                  "cyber-security",
                ].map((tag, index) => (
                  <Chip
                    key={tag}
                    label={tag}
                    sx={{
                      backgroundColor: "rgba(27, 46, 53, 0.1)",
                      color: "#1b2e35",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "rgba(89, 227, 167, 0.2)",
                        transform: "translateY(-1px)",
                      },
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                animation: "slideInRight 1s ease-out",
                "@keyframes slideInRight": {
                  "0%": {
                    opacity: 0,
                    transform: "translateX(30px)",
                  },
                  "100%": {
                    opacity: 1,
                    transform: "translateX(0)",
                  },
                },
              }}
            >
              <img
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "20px",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                }}
                src="/images/banner.jpg"
                alt="Thinkify"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Banner;
