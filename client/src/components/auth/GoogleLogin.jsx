import { useEffect } from "react";
import { Button, Box, Typography } from "@mui/material";
import { Google } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import useThinkify from "../../hooks/useThinkify";

const GoogleLogin = () => {
  const navigate = useNavigate();
  const { setAlertBoxOpenStatus, setAlertMessage, setAlertSeverity } =
    useThinkify();

  useEffect(() => {
    // Load Google OAuth script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-login-button"),
          {
            theme: "outline",
            size: "large",
            type: "standard",
            text: "signin_with",
            shape: "rectangular",
            logo_alignment: "left",
          }
        );
      }
    };

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_SERVER_ENDPOINT}/google/login`,
        {
          token: response.credential,
        }
      );

      if (result.data.status) {
        // Set cookies
        Cookies.set(import.meta.env.VITE_TOKEN_KEY, result.data.token, {
          expires: Number(import.meta.env.VITE_COOKIE_EXPIRES),
          path: "",
        });
        Cookies.set(import.meta.env.VITE_USER_ROLE, result.data.user.role, {
          expires: Number(import.meta.env.VITE_COOKIE_EXPIRES),
          path: "",
        });

        // Navigate based on role
        if (result.data.user.role === "user") {
          navigate("/profile");
        } else if (result.data.user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/profile");
        }

        setAlertBoxOpenStatus(true);
        setAlertSeverity("success");
        setAlertMessage("Google login successful!");
      } else {
        setAlertBoxOpenStatus(true);
        setAlertSeverity("error");
        setAlertMessage(result.data.message);
      }
    } catch (error) {
      console.error("Google login error:", error);
      setAlertBoxOpenStatus(true);
      setAlertSeverity("error");
      setAlertMessage("Google login failed. Please try again.");
    }
  };

  return (
    <Box sx={{ textAlign: "center", mt: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Or continue with
      </Typography>
      <Box id="google-login-button"></Box>
    </Box>
  );
};

export default GoogleLogin;
