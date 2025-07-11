import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px",
        gap: 2,
      }}
    >
      <CircularProgress
        size={60}
        thickness={4}
        sx={{
          color: "#59e3a7",
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }}
      />
      <Typography
        variant="body1"
        sx={{
          color: "#666",
          fontWeight: 500,
          animation: "pulse 2s ease-in-out infinite",
          "@keyframes pulse": {
            "0%, 100%": {
              opacity: 1,
            },
            "50%": {
              opacity: 0.6,
            },
          },
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
