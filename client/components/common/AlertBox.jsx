import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Snackbar, Box } from "@mui/material";

import useThinkify from "../../src/hooks/useThinkify";

const AlertBox = () => {
  const {
    alertSeverity,
    alertBoxOpenStatus,
    setAlertBoxOpenStatus,
    alertMessage,
  } = useThinkify();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertBoxOpenStatus(false);
  };

  return (
    <Snackbar
      open={alertBoxOpenStatus}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      onClose={handleClose}
      sx={{
        "& .MuiSnackbar-root": {
          top: 80,
        },
      }}
    >
      <Box
        sx={{
          animation: "slideInRight 0.3s ease-out",
          "@keyframes slideInRight": {
            "0%": {
              opacity: 0,
              transform: "translateX(100%)",
            },
            "100%": {
              opacity: 1,
              transform: "translateX(0)",
            },
          },
        }}
      >
        <Alert
          severity={alertSeverity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlertBoxOpenStatus(false);
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{
            mb: 2,
            borderRadius: 2,
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
            minWidth: 300,
            "& .MuiAlert-icon": {
              fontSize: "1.5rem",
            },
            "& .MuiAlert-message": {
              fontSize: "0.95rem",
              fontWeight: 500,
            },
          }}
        >
          {alertMessage}
        </Alert>
      </Box>
    </Snackbar>
  );
};

export default AlertBox;
