import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );
      const { access_token, user } = response.data;
      
      localStorage.setItem("token", access_token);
      localStorage.setItem("currentUser", JSON.stringify(user));
      
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(
        "Login failed: " +
          (error.response?.data?.detail || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login-page">
      {/* Floating Particles Background */}
      <div className="animated-bg">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>

      <Paper className="login-form" elevation={6}>
        <Typography variant="h5" component="h1" gutterBottom className="login-title">
          🚀 Welcome Back
        </Typography>
        <Typography variant="body2" gutterBottom className="login-subtitle">
          Sign in to your account!
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            className="login-btn"
          >
            {loading ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Box>
        <Typography variant="body2" gutterBottom className="login-subtitle-bottom">
          Reach out to me at deepanshu16144@iiitd.ac.in if you face any issues.
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
