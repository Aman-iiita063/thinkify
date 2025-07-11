import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  ButtonGroup,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import AlertBox from "../../components/common/AlertBox";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";

export default function NavBar({ withSidebar = false }) {
  const cookie = Cookies.get(import.meta.env.VITE_COOKIE_KEY);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(89, 227, 167, 0.2)",
          padding: "8px 0",
          transition: "all 0.3s ease",
          zIndex: theme.zIndex.drawer + 1,
          ...(withSidebar && isDesktop
            ? { ml: "280px", width: "calc(100% - 280px)" }
            : {}),
        }}
        elevation={0}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ padding: "0 !important" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <img
                    src="./images/favicon.ico"
                    width="45"
                    alt="Thinkify"
                    style={{ borderRadius: "8px" }}
                  />
                  <Typography
                    sx={{
                      fontFamily: "Platypi",
                      color: "#1b2e35",
                      fontWeight: 700,
                      fontSize: { xs: "1.5rem", md: "2rem" },
                    }}
                    variant="h3"
                    component="h3"
                  >
                    Thinkify
                  </Typography>
                </Box>
              </Link>

              <Box>
                {!cookie ? (
                  <ButtonGroup
                    variant="contained"
                    sx={{
                      boxShadow: "0 4px 12px rgba(27, 46, 53, 0.15)",
                      "& .MuiButtonGroup-grouped": {
                        border: "none",
                        "&:not(:last-of-type)": {
                          borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                        },
                      },
                    }}
                  >
                    <Link to="/registration" style={{ textDecoration: "none" }}>
                      <Button
                        sx={{
                          backgroundColor: "#1b2e35",
                          color: "white",
                          px: 3,
                          "&:hover": {
                            backgroundColor: "#2a3f47",
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        Join
                      </Button>
                    </Link>
                    <Link to="/login" style={{ textDecoration: "none" }}>
                      <Button
                        sx={{
                          backgroundColor: "#59e3a7",
                          color: "#1b2e35",
                          px: 3,
                          fontWeight: 600,
                          "&:hover": {
                            backgroundColor: "#4bc895",
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        Login
                      </Button>
                    </Link>
                  </ButtonGroup>
                ) : (
                  <IconButton
                    sx={{
                      color: "#1b2e35",
                      "&:hover": {
                        backgroundColor: "rgba(89, 227, 167, 0.1)",
                      },
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <AlertBox />
    </Box>
  );
}
